"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title_ko: string;
  title_en: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

const FETCH_CACHE_MS = 10_000;

export function NotificationBell() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const lastFetchedAt = useRef(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");
      const data = await res.json();
      setUnreadCount(data.count ?? 0);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const fetchNotifications = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchedAt.current < FETCH_CACHE_MS && notifications.length > 0) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=10");
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      lastFetchedAt.current = Date.now();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [notifications.length]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        fetchNotifications();
      }
    },
    [fetchNotifications]
  );

  const handleClick = useCallback(
    async (notification: Notification) => {
      if (!notification.is_read) {
        fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [notification.id] }),
        }).catch(() => {});
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
      }
      const link = getNotificationLink(notification);
      if (link) router.push(link);
    },
    [router]
  );

  const handleMarkAllRead = useCallback(async () => {
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    }).catch(() => {});
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-md h-8 w-8 sm:h-9 sm:w-9 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128] border-0 transition-all"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 text-[10px] font-bold bg-[#f85149] text-white rounded-full flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">알림</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[400px] overflow-y-auto bg-[#1c2128] border-0 rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium text-[#c9d1d9]">알림</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[#79c0ff] hover:underline"
            >
              모두 읽음
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-[#30363d]/50" />

        {loading ? (
          <div className="py-6 text-center text-sm text-[#8b949e]">
            불러오는 중...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-[#8b949e]">
            알림이 없습니다
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onClick={() => handleClick(n)}
              className={cn(
                "px-3 py-2.5 cursor-pointer rounded-md focus:bg-[#21262d]",
                !n.is_read && "bg-[#161b22]"
              )}
            >
              <div className="flex items-start gap-2 w-full">
                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-[#79c0ff] mt-1.5 shrink-0" />
                )}
                <div className={cn("min-w-0", n.is_read && "ml-4")}>
                  <p
                    className={cn(
                      "text-sm leading-snug",
                      !n.is_read
                        ? "text-[#c9d1d9] font-medium"
                        : "text-[#8b949e]"
                    )}
                  >
                    {n.title_ko}
                  </p>
                  <p className="text-xs text-[#484f58] mt-0.5">
                    {formatTimeAgo(n.created_at)}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator className="bg-[#30363d]/50" />
        <DropdownMenuItem
          asChild
          className="px-3 py-2 cursor-pointer text-center rounded-md focus:bg-[#21262d]"
        >
          <a
            href="/notifications"
            className="text-sm text-[#79c0ff] w-full text-center block"
          >
            모든 알림 보기
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getNotificationLink(n: Notification): string | null {
  switch (n.type) {
    case "chapter_complete":
      return n.data.chapterId ? `/curriculum/${n.data.chapterId}` : "/curriculum";
    case "belt_upgrade":
    case "badge_earned":
    case "level_up":
      return "/dashboard";
    case "comment_reply":
      return n.data.postId ? `/community/${n.data.postId}` : "/community";
    default:
      return null;
  }
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.toLocaleDateString("ko-KR");
}
