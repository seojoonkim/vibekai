"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
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

interface NotificationsListProps {
  initialNotifications: Notification[];
  initialTotal: number;
}

export function NotificationsList({
  initialNotifications,
  initialTotal,
}: NotificationsListProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 20;

  const hasUnread = notifications.some((n) => !n.is_read);

  const handleMarkAllRead = useCallback(async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    router.refresh();
  }, [router]);

  const handleClick = useCallback(
    async (notification: Notification) => {
      if (!notification.is_read) {
        fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [notification.id] }),
        }).catch(() => {});
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

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await fetch(
        `/api/notifications?page=${nextPage}&limit=${limit}`
      );
      const data = await res.json();
      setNotifications((prev) => [...prev, ...(data.notifications ?? [])]);
      setTotal(data.total ?? total);
      setPage(nextPage);
    } catch {
      // silently fail
    } finally {
      setLoadingMore(false);
    }
  }, [page, total]);

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16">
        <Bell className="h-12 w-12 text-[#484f58] mx-auto mb-4" />
        <p className="text-[#8b949e]">아직 알림이 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      {hasUnread && (
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-[#79c0ff] hover:text-[#79c0ff] hover:bg-[#79c0ff]/10"
          >
            <CheckCheck className="h-4 w-4 mr-1.5" />
            모두 읽음
          </Button>
        </div>
      )}

      <div className="space-y-1">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-md transition-colors",
              !n.is_read
                ? "bg-[#161b22] hover:bg-[#1c2128]"
                : "hover:bg-[#161b22]"
            )}
          >
            <div className="flex items-start gap-3">
              {!n.is_read && (
                <div className="w-2 h-2 rounded-full bg-[#79c0ff] mt-2 shrink-0" />
              )}
              <div className={cn("min-w-0 flex-1", n.is_read && "ml-5")}>
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
                <p className="text-xs text-[#484f58] mt-1">
                  {formatTimeAgo(n.created_at)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {notifications.length < total && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-[#c9d1d9] border-[#30363d] hover:bg-[#1c2128]"
          >
            {loadingMore ? "불러오는 중..." : "더 보기"}
          </Button>
        </div>
      )}
    </div>
  );
}

function getNotificationLink(n: Notification): string | null {
  switch (n.type) {
    case "chapter_complete":
      return n.data.chapterId
        ? `/curriculum/${n.data.chapterId}`
        : "/curriculum";
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
