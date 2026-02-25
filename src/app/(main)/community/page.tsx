"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Heart,
  HelpCircle,
  Lightbulb,
  Rocket,
  Star,
  GraduationCap,
  Coffee,
  Loader2,
  ExternalLink,
  Github,
  MoreHorizontal,
  Send,
  Pencil,
  Trash2,
  Bookmark,
  Terminal,
  Code2,
  Zap,
  Award,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BeltBadge } from "@/components/gamification/belt-badge";
import { XP_REWARDS } from "@/lib/gamification";

// Helper function to award XP and log it
async function awardXp(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  amount: number,
  action: string,
  referenceId?: string
) {
  // Increment XP
  await supabase.rpc("increment_xp", { user_id: userId, amount: amount });
  // Log XP
  await supabase.from("xp_logs").insert({
    user_id: userId,
    action,
    amount,
    reference_id: referenceId || null,
  });
}

interface UserProfile {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
}

type PostType = "discussion" | "review" | "question" | "showcase" | "suggestion";
type WritablePostType = "discussion" | "question" | "showcase" | "suggestion";

interface Post {
  id: string;
  title: string;
  content: string;
  type: PostType;
  created_at: string;
  likes_count: number;
  comments_count: number;
  author_id: string;
  chapter_id: string | null;
  project_url: string | null;
  github_repo: string | null;
  difficulty_rating: number | null;
  satisfaction_rating: number | null;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  chapters?: {
    title_ko: string;
  } | null;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  is_accepted: boolean;
  likes_count: number;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface ChapterQuestion {
  id: string;
  chapter_id: string;
  user_id: string;
  selected_text: string;
  question: string;
  is_resolved: boolean;
  created_at: string;
  likes_count: number;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  chapters: {
    title_ko: string;
  };
  replies: {
    id: string;
    user_id: string;
    content: string;
    is_accepted: boolean;
    created_at: string;
    profiles: {
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    };
  }[];
}

// GitHub Dark Mode Color System - 각 태그별 고유 색상
const categoryConfig: Record<PostType, { icon: typeof MessageSquare; label: string; color: string; bgColor: string; borderColor: string }> = {
  discussion: { icon: Coffee, label: "잡담하기", color: "text-[#f97583]", bgColor: "bg-[#f97583]/10", borderColor: "border-[#f97583]/30" },
  review: { icon: GraduationCap, label: "학습 후기", color: "text-[#a371f7]", bgColor: "bg-[#a371f7]/10", borderColor: "border-[#a371f7]/30" },
  question: { icon: MessageSquare, label: "일반 질문", color: "text-[#57ab5a]", bgColor: "bg-[#57ab5a]/10", borderColor: "border-[#57ab5a]/30" },
  showcase: { icon: Rocket, label: "프로젝트 소개", color: "text-[#79c0ff]", bgColor: "bg-[#79c0ff]/10", borderColor: "border-[#79c0ff]/30" },
  suggestion: { icon: Lightbulb, label: "건의사항", color: "text-[#f0b429]", bgColor: "bg-[#f0b429]/10", borderColor: "border-[#f0b429]/30" },
};

const writableCategoryConfig: Record<WritablePostType, { icon: typeof HelpCircle; label: string; color: string; activeColor: string; placeholder: { title: string; content: string } }> = {
  discussion: {
    icon: Coffee,
    label: "잡담하기",
    color: "border-[#30363d] text-[#f97583] bg-[#f97583]/5 hover:bg-[#f97583]/10",
    activeColor: "border-[#f97583] bg-[#f97583]/20 text-[#f97583]",
    placeholder: { title: "제목", content: "자유롭게 작성해주세요" },
  },
  question: {
    icon: MessageSquare,
    label: "일반 질문",
    color: "border-[#30363d] text-[#57ab5a] bg-[#57ab5a]/5 hover:bg-[#57ab5a]/10",
    activeColor: "border-[#57ab5a] bg-[#57ab5a]/20 text-[#57ab5a]",
    placeholder: { title: "질문 제목", content: "궁금한 점을 자세히 설명해주세요" },
  },
  showcase: {
    icon: Rocket,
    label: "프로젝트 소개",
    color: "border-[#30363d] text-[#79c0ff] bg-[#79c0ff]/5 hover:bg-[#79c0ff]/10",
    activeColor: "border-[#79c0ff] bg-[#79c0ff]/20 text-[#79c0ff]",
    placeholder: { title: "프로젝트 이름", content: "어떤 프로젝트인지 소개해주세요" },
  },
  suggestion: {
    icon: Lightbulb,
    label: "건의사항",
    color: "border-[#30363d] text-[#f0b429] bg-[#f0b429]/5 hover:bg-[#f0b429]/10",
    activeColor: "border-[#f0b429] bg-[#f0b429]/20 text-[#f0b429]",
    placeholder: { title: "건의사항 제목", content: "개선 아이디어나 피드백을 공유해주세요" },
  },
};

function formatTimeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "방금 전";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;
  return new Date(date).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

function PostCard({
  post,
  currentUserId,
  currentUserAvatar,
  currentUserProfile,
  onEdit,
  onDelete,
  onBookmark,
  isBookmarked,
}: {
  post: Post;
  currentUserId: string | null;
  currentUserAvatar?: string | null;
  currentUserProfile?: UserProfile | null;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onBookmark: (postId: string) => void;
  isBookmarked: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(isBookmarked);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  const config = categoryConfig[post.type];
  const Icon = config.icon;
  const isOwner = currentUserId === post.author_id;

  useEffect(() => {
    if (post.comments_count > 0) {
      fetchComments();
    }
    // Check if user has liked this post
    if (currentUserId) {
      const checkLikeStatus = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("likes")
          .select("user_id")
          .eq("post_id", post.id)
          .eq("user_id", currentUserId)
          .single();
        setLiked(!!data);
      };
      checkLikeStatus();
    }
  }, [post.id, post.comments_count, currentUserId]);

  const fetchComments = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("comments")
      .select(`*, profiles:author_id(username, display_name, avatar_url)`)
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });
    if (data) {
      setComments(data as Comment[]);
    }
  };

  const handleCommentClick = () => {
    commentInputRef.current?.focus();
  };

  const handleSubmitComment = async (parentId: string | null = null) => {
    const content = parentId ? replyContent : newComment;
    if (!currentUserId) {
      if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
        window.location.href = "/login";
      }
      return;
    }
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("comments").insert({
        post_id: post.id,
        author_id: currentUserId,
        content: content.trim(),
        parent_id: parentId,
      }).select("*").single();
      if (!error && data) {
        // Award XP for writing comment
        await awardXp(supabase, currentUserId, XP_REWARDS.COMMENT_WRITTEN, "comment_created", data.id);

        const newCommentData: Comment = {
          ...data,
          profiles: {
            username: currentUserProfile?.username || "User",
            display_name: currentUserProfile?.display_name || null,
            avatar_url: currentUserProfile?.avatar_url || null,
          },
        };
        setComments([...comments, newCommentData]);
        if (parentId) {
          setReplyContent("");
          setReplyingTo(null);
        } else {
          setNewComment("");
        }
        supabase.from("posts").update({ comments_count: comments.length + 1 }).eq("id", post.id);
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const supabase = createClient();
    await supabase.from("comments").delete().eq("id", commentId);
    setComments(comments.filter(c => c.id !== commentId && c.parent_id !== commentId));
  };

  const handleLike = async () => {
    if (!currentUserId) {
      if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
        window.location.href = "/login";
      }
      return;
    }
    const supabase = createClient();

    if (liked) {
      // Unlike
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", currentUserId);
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
      await supabase
        .from("posts")
        .update({ likes_count: Math.max(0, likesCount - 1) })
        .eq("id", post.id);
    } else {
      // Like
      await supabase.from("likes").insert({
        post_id: post.id,
        user_id: currentUserId,
      });
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      await supabase
        .from("posts")
        .update({ likes_count: likesCount + 1 })
        .eq("id", post.id);

      // Award XP to post author for receiving a like (only if not self-like)
      if (post.author_id !== currentUserId) {
        await awardXp(supabase, post.author_id, XP_REWARDS.RECEIVED_LIKE, "like_received", post.id);
      }
    }
  };

  const handleBookmark = () => {
    setSaved(!saved);
    onBookmark(post.id);
  };

  // 부모 댓글과 대댓글 분리
  const parentComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

  const hasComments = comments.length > 0 || currentUserId;

  return (
    <article className="bg-[#151a21] rounded-md  shadow-[0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden  transition-all duration-200 group">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-[#1c2128]">
          <AvatarImage src={post.profiles.avatar_url || undefined} />
          <AvatarFallback className="bg-[#1c2128] text-[#c9d1d9] text-sm font-mono font-medium">
            {post.profiles.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[#e6edf3] text-sm hover:text-[#79c0ff] cursor-pointer transition-colors">
              {post.profiles.display_name || post.profiles.username}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.color} ${config.bgColor} ${config.borderColor}`}>
              <Icon className="h-2.5 w-2.5" />
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8b949e] mt-1">
            <span>{formatTimeAgo(post.created_at)}</span>
            {post.chapters && (
              <>
                <span className="text-[#30363d]">·</span>
                <span className="text-[#f0b429]/80">{post.chapters.title_ko}</span>
              </>
            )}
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-[#1c2128] rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4 text-[#8b949e]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-[#1c2128] border-0 shadow-xl">
              <DropdownMenuItem onClick={() => onEdit(post)} className="text-[#c9d1d9] focus:bg-[#21262d] focus:text-[#c9d1d9] cursor-pointer">
                <Pencil className="h-4 w-4 mr-2" />
                수정하기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-[#f85149] focus:bg-[#f85149]/10 focus:text-[#f85149] cursor-pointer">
                <Trash2 className="h-4 w-4 mr-2" />
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        {post.title && (
          <h3 className="font-semibold text-[#e6edf3] text-[15px] leading-snug mb-2">
            {post.title}
          </h3>
        )}
        <p className="text-[#9198a1] text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Review ratings */}
        {post.type === "review" && (post.difficulty_rating || post.satisfaction_rating) && (
          <div className="flex items-center gap-6 mt-4 py-3 px-4 bg-[#0a0c10]/60 rounded-md border border-[#21262d]/50">
            {post.satisfaction_rating && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8b949e]">만족도</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= post.satisfaction_rating! ? "fill-[#f0b429] text-[#f0b429]" : "text-[#30363d]"}`} />
                  ))}
                </div>
              </div>
            )}
            {post.difficulty_rating && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8b949e]">난이도</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= post.difficulty_rating! ? "fill-[#bc8cff] text-[#bc8cff]" : "text-[#30363d]"}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Showcase links */}
        {post.type === "showcase" && (post.project_url || post.github_repo) && (
          <div className="flex items-center gap-2 mt-4">
            {post.project_url && (
              <a href={post.project_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#238636] text-white rounded-md text-xs font-medium hover:bg-[#2ea043] transition-colors">
                <ExternalLink className="h-3.5 w-3.5" />데모 보기
              </a>
            )}
            {post.github_repo && (
              <a href={post.github_repo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1c2128] text-[#c9d1d9] rounded-md text-xs font-medium hover:bg-[#242b33] border border-0 transition-colors">
                <Github className="h-3.5 w-3.5" />GitHub
              </a>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-2.5 flex items-center border-t border-[#1c2128]">
        <div className="flex gap-1">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:bg-[#1c2128] ${
              liked ? "text-[#f85149]" : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-[#f85149]" : ""}`} />
            <span>좋아요</span>
            {likesCount > 0 && <span className="text-[11px] opacity-80">{likesCount}</span>}
          </button>
          <button
            onClick={handleCommentClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128] transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>댓글</span>
            {comments.length > 0 && <span className="text-[11px] opacity-80">{comments.length}</span>}
          </button>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:bg-[#1c2128] ${
              saved ? "text-[#f0b429]" : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-[#f0b429]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Comments Section - Unified with card */}
      {hasComments && (
        <div className="bg-[#0a0c10]/40">
          {parentComments.length > 0 && (
            <div className="px-5 py-4 space-y-4">
              {parentComments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Parent comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0 ring-1 ring-[#1c2128]">
                      <AvatarImage src={comment.profiles.avatar_url || undefined} />
                      <AvatarFallback className="bg-[#1c2128] text-[#8b949e] text-[10px] font-mono">
                        {comment.profiles.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="inline-block bg-[#1c2128]/80 rounded-2xl rounded-tl-sm px-4 py-2.5">
                        <span className="font-medium text-[#e6edf3] text-xs">
                          {comment.profiles.display_name || comment.profiles.username}
                        </span>
                        <p className="text-[#9198a1] text-sm leading-relaxed mt-0.5">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 pl-2 text-[11px] text-[#8b949e]">
                        <span>{formatTimeAgo(comment.created_at)}</span>
                        <button className="hover:text-[#f85149] transition-colors font-medium">좋아요</button>
                        <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="hover:text-[#79c0ff] transition-colors font-medium">답글</button>
                        {currentUserId === comment.author_id && (
                          <button onClick={() => handleDeleteComment(comment.id)} className="hover:text-[#f85149] transition-colors">삭제</button>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Replies */}
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="flex gap-3 ml-11">
                      <Avatar className="h-7 w-7 shrink-0 ring-1 ring-[#1c2128]">
                        <AvatarImage src={reply.profiles.avatar_url || undefined} />
                        <AvatarFallback className="bg-[#1c2128] text-[#8b949e] text-[9px] font-mono">
                          {reply.profiles.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="inline-block bg-[#1c2128]/60 rounded-2xl rounded-tl-sm px-3.5 py-2">
                          <span className="font-medium text-[#e6edf3] text-[11px]">
                            {reply.profiles.display_name || reply.profiles.username}
                          </span>
                          <p className="text-[#9198a1] text-xs leading-relaxed mt-0.5">{reply.content}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-1 pl-2 text-[10px] text-[#8b949e]">
                          <span>{formatTimeAgo(reply.created_at)}</span>
                          <button className="hover:text-[#f85149] transition-colors font-medium">좋아요</button>
                          {currentUserId === reply.author_id && (
                            <button onClick={() => handleDeleteComment(reply.id)} className="hover:text-[#f85149] transition-colors">삭제</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Reply input */}
                  {replyingTo === comment.id && currentUserId && (
                    <div className="flex gap-2.5 ml-11">
                      <Avatar className="h-7 w-7 shrink-0 ring-2 ring-[#f0b429]/20">
                        <AvatarImage src={currentUserAvatar || undefined} />
                        <AvatarFallback className="bg-[#f0b429]/10 text-[#f0b429] text-[9px] font-bold">U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitComment(comment.id); } }}
                          placeholder="답글 달기..."
                          autoFocus
                          className="w-full bg-[#1c2128] rounded-full px-4 py-2 pr-10 text-xs text-[#e6edf3] placeholder:text-[#6e7681] outline-none border border-[#30363d]/50 focus:border-[#79c0ff]/40 transition-all"
                        />
                        {replyContent.trim() && (
                          <button
                            onClick={() => handleSubmitComment(comment.id)}
                            disabled={isSubmitting}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#238636] hover:text-[#2ea043] disabled:opacity-50 transition-colors"
                          >
                            {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          {currentUserId && (
            <div className="px-5 py-4 flex gap-3 border-t border-[#1c2128]">
              <Avatar className="h-8 w-8 shrink-0 ring-2 ring-[#f0b429]/20">
                <AvatarImage src={currentUserAvatar || undefined} />
                <AvatarFallback className="bg-[#f0b429]/10 text-[#f0b429] text-xs font-bold">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitComment(null); } }}
                  placeholder="댓글 달기..."
                  className="w-full bg-[#1c2128] rounded-full px-4 py-2.5 pr-12 text-sm text-[#e6edf3] placeholder:text-[#6e7681] outline-none border border-[#30363d]/50 focus:border-[#79c0ff]/40 transition-all"
                />
                {newComment.trim() && (
                  <button
                    onClick={() => handleSubmitComment(null)}
                    disabled={isSubmitting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#238636] hover:text-[#2ea043] disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function QuestionCard({
  question,
  currentUserId,
  currentUserAvatar,
  currentUserProfile,
  onDelete,
}: {
  question: ChapterQuestion;
  currentUserId: string | null;
  currentUserAvatar?: string | null;
  currentUserProfile?: UserProfile | null;
  onDelete: (questionId: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(question.likes_count || 0);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [localReplies, setLocalReplies] = useState(question.replies);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const isOwner = currentUserId === question.user_id;

  // Check if user has liked this question
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!currentUserId) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("chapter_question_likes")
        .select("*")
        .eq("question_id", question.id)
        .eq("user_id", currentUserId)
        .single();
      if (data) setLiked(true);
    };
    checkLikeStatus();
  }, [currentUserId, question.id]);

  const handleLike = async () => {
    if (!currentUserId) {
      if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
        window.location.href = "/login";
      }
      return;
    }
    const supabase = createClient();

    if (liked) {
      // Unlike
      await supabase
        .from("chapter_question_likes")
        .delete()
        .eq("question_id", question.id)
        .eq("user_id", currentUserId);
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
      // Update likes_count in chapter_questions
      await supabase
        .from("chapter_questions")
        .update({ likes_count: Math.max(0, likesCount - 1) })
        .eq("id", question.id);
    } else {
      // Like
      await supabase.from("chapter_question_likes").insert({
        question_id: question.id,
        user_id: currentUserId,
      });
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      // Update likes_count in chapter_questions
      await supabase
        .from("chapter_questions")
        .update({ likes_count: likesCount + 1 })
        .eq("id", question.id);

      // Award XP to question author for receiving a like (only if not self-like)
      if (question.user_id !== currentUserId) {
        await awardXp(supabase, question.user_id, XP_REWARDS.RECEIVED_LIKE, "like_received", question.id);
      }
    }
  };

  const handleReplyClick = () => {
    replyInputRef.current?.focus();
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !currentUserId || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("chapter_question_replies").insert({
        question_id: question.id,
        user_id: currentUserId,
        content: replyContent.trim(),
      }).select("id, user_id, content, is_accepted, created_at").single();

      if (!error && data) {
        // Award XP for writing reply/answer
        await awardXp(supabase, currentUserId, XP_REWARDS.COMMENT_WRITTEN, "comment_created", data.id);

        const newReply = {
          ...data,
          profiles: {
            username: currentUserProfile?.username || "User",
            display_name: currentUserProfile?.display_name || null,
            avatar_url: currentUserProfile?.avatar_url || null,
          },
        };
        setLocalReplies([...localReplies, newReply]);
        setReplyContent("");
      } else {
        console.error("답변 등록 실패:", error);
      }
    } catch (err) {
      console.error("답변 등록 중 오류:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    const supabase = createClient();
    await supabase.from("chapter_question_replies").delete().eq("id", replyId);
    setLocalReplies(localReplies.filter(r => r.id !== replyId));
  };

  // 답변 채택/채택 취소
  const handleAcceptReply = async (replyId: string, replyUserId: string, isCurrentlyAccepted: boolean) => {
    const supabase = createClient();

    // 채택 상태 토글
    const { error } = await supabase
      .from("chapter_question_replies")
      .update({ is_accepted: !isCurrentlyAccepted })
      .eq("id", replyId);

    if (error) {
      console.error("답변 채택 실패:", error);
      return;
    }

    if (!isCurrentlyAccepted) {
      // 새로 채택하는 경우: 답변 작성자에게 10 XP 부여
      await supabase.from("xp_logs").insert({
        user_id: replyUserId,
        amount: 10,
        action: "answer_accepted",
        reference_id: replyId,
      });

      await supabase.rpc("increment_xp", {
        user_id: replyUserId,
        amount: 10,
      });
    } else {
      // 채택 취소하는 경우: 답변 작성자의 XP 차감
      await supabase.from("xp_logs").delete()
        .eq("action", "answer_accepted")
        .eq("reference_id", replyId);

      await supabase.rpc("increment_xp", {
        user_id: replyUserId,
        amount: -10,
      });
    }

    // 로컬 상태 업데이트
    setLocalReplies(localReplies.map(r =>
      r.id === replyId ? { ...r, is_accepted: !isCurrentlyAccepted } : r
    ));
  };

  const displayedReplies = showAllReplies ? localReplies : localReplies.slice(0, 2);
  const hasReplies = localReplies.length > 0 || currentUserId;

  return (
    <article className="bg-[#151a21] rounded-md  shadow-[0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden  transition-all duration-200 group">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-[#f0b429]/20">
          <AvatarImage src={question.profiles.avatar_url || undefined} />
          <AvatarFallback className="bg-[#f0b429]/10 text-[#f0b429] text-sm font-mono">
            {question.profiles.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[#e6edf3] text-sm hover:text-[#79c0ff] cursor-pointer transition-colors">
              {question.profiles.display_name || question.profiles.username}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[#f0b429] bg-[#f0b429]/10 border border-[#f0b429]/30">
              <Code2 className="h-2.5 w-2.5" />
              학습 질문
            </span>
            {question.is_resolved && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#56d364] bg-[#56d364]/10 border border-[#56d364]/30">
                ✓ 해결됨
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8b949e] mt-1">
            <span>{formatTimeAgo(question.created_at)}</span>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-[#1c2128] rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4 text-[#8b949e]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-[#1c2128] border-0 shadow-xl">
              <DropdownMenuItem onClick={() => onDelete(question.id)} className="text-[#f85149] focus:bg-[#f85149]/10 focus:text-[#f85149] cursor-pointer">
                <Trash2 className="h-4 w-4 mr-2" />
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Chapter Info with Link */}
      <div className="px-5 pb-3">
        <Link
          href={`/curriculum/${question.chapter_id}`}
          className="inline-flex items-center gap-2 px-3 py-2 bg-[#0a0c10]/60 border border-[#21262d]/50 rounded-md hover:border-[#f0b429]/40 hover:bg-[#f0b429]/5 transition-colors group/link"
        >
          <Code2 className="h-3.5 w-3.5 text-[#f0b429]" />
          <span className="text-xs text-[#f0b429]">Chapter {question.chapter_id}</span>
          <span className="text-xs text-[#8b949e] group-hover/link:text-[#c9d1d9] transition-colors">{question.chapters.title_ko}</span>
          <ExternalLink className="h-3 w-3 text-[#6e7681] group-hover/link:text-[#f0b429] transition-colors" />
        </Link>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        {question.selected_text && (
          <div className="mb-3 px-4 py-2.5 bg-[#0a0c10]/50 border-l-2 border-[#f0b429] rounded-r-lg">
            <p className="text-xs text-[#8b949e] italic">&ldquo;{question.selected_text}&rdquo;</p>
          </div>
        )}
        <p className="text-[#e6edf3] text-sm leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Actions */}
      <div className="px-5 py-2.5 flex items-center border-t border-[#1c2128]">
        <div className="flex gap-1">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:bg-[#1c2128] ${
              liked ? "text-[#f85149]" : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-[#f85149]" : ""}`} />
            <span>좋아요</span>
            {likesCount > 0 && <span className="text-[11px] opacity-80">{likesCount}</span>}
          </button>
          <button
            onClick={handleReplyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128] transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>댓글</span>
            {localReplies.length > 0 && <span className="text-[11px] opacity-80">{localReplies.length}</span>}
          </button>
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128] transition-all">
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Comments Section - Unified with card */}
      {hasReplies && (
        <div className="bg-[#0a0c10]/40">
          {localReplies.length > 0 && (
            <div className="px-5 py-4 space-y-4">
              {displayedReplies.map((reply) => (
                <div
                  key={reply.id}
                  className={`flex gap-3 ${reply.is_accepted ? "bg-emerald-500/5 -mx-5 px-5 py-3 border-l-2 border-l-emerald-500" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0 ring-1 ring-[#1c2128]">
                    <AvatarImage src={reply.profiles.avatar_url || undefined} />
                    <AvatarFallback className="bg-[#1c2128] text-[#8b949e] text-[10px] font-mono">
                      {reply.profiles.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    {reply.is_accepted && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Award className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-[11px] font-medium text-emerald-400">채택된 답변</span>
                      </div>
                    )}
                    <div className={`inline-block rounded-2xl rounded-tl-sm px-4 py-2.5 ${reply.is_accepted ? "bg-emerald-500/10" : "bg-[#1c2128]/80"}`}>
                      <span className="font-medium text-[#e6edf3] text-xs">
                        {reply.profiles.display_name || reply.profiles.username}
                      </span>
                      <p className="text-[#9198a1] text-sm leading-relaxed mt-0.5">{reply.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 pl-2 text-[11px] text-[#8b949e]">
                      <span>{formatTimeAgo(reply.created_at)}</span>
                      <button className="hover:text-[#f85149] transition-colors font-medium">좋아요</button>
                      {currentUserId === reply.user_id && (
                        <button onClick={() => handleDeleteReply(reply.id)} className="hover:text-[#f85149] transition-colors">삭제</button>
                      )}
                      {isOwner && (
                        <button
                          onClick={() => handleAcceptReply(reply.id, reply.user_id, reply.is_accepted)}
                          className={`flex items-center gap-1 transition-colors font-medium ${
                            reply.is_accepted
                              ? "text-emerald-400 hover:text-emerald-300"
                              : "hover:text-emerald-400"
                          }`}
                        >
                          <Award className="h-3 w-3" />
                          {reply.is_accepted ? "채택 취소" : "채택"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {localReplies.length > 2 && !showAllReplies && (
                <button
                  onClick={() => setShowAllReplies(true)}
                  className="text-xs text-[#79c0ff] font-medium hover:underline pl-11"
                >
                  댓글 {localReplies.length - 2}개 더 보기
                </button>
              )}
              {showAllReplies && localReplies.length > 2 && (
                <button
                  onClick={() => setShowAllReplies(false)}
                  className="text-xs text-[#79c0ff] font-medium hover:underline pl-11"
                >
                  접기
                </button>
              )}
            </div>
          )}

          {/* Comment Input */}
          {currentUserId && (
            <div className="px-5 py-4 flex gap-3 border-t border-[#1c2128]">
              <Avatar className="h-8 w-8 shrink-0 ring-2 ring-[#f0b429]/20">
                <AvatarImage src={currentUserAvatar || undefined} />
                <AvatarFallback className="bg-[#f0b429]/10 text-[#f0b429] text-xs font-bold">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <input
                  ref={replyInputRef}
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitReply(); } }}
                  placeholder="댓글 달기..."
                  className="w-full bg-[#1c2128] rounded-full px-4 py-2.5 pr-12 text-sm text-[#e6edf3] placeholder:text-[#6e7681] outline-none border border-[#30363d]/50 focus:border-[#79c0ff]/40 transition-all"
                />
                {replyContent.trim() && (
                  <button
                    onClick={handleSubmitReply}
                    disabled={isSubmittingReply}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#238636] hover:text-[#2ea043] disabled:opacity-50 transition-colors"
                  >
                    {isSubmittingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function EditPostModal({
  post,
  open,
  onOpenChange,
  onPostUpdated
}: {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setProjectUrl(post.project_url || "");
      setGithubRepo(post.github_repo || "");
    }
  }, [post]);

  const handleClose = () => { setError(null); onOpenChange(false); };

  const handleSubmit = async () => {
    if (!post || !content.trim()) { setError("내용을 입력해주세요"); return; }
    setIsSubmitting(true); setError(null);
    try {
      const supabase = createClient();
      const updateData: Record<string, unknown> = { title: title.trim() || null, content: content.trim() };
      if (post.type === "showcase") {
        updateData.project_url = projectUrl.trim() || null;
        updateData.github_repo = githubRepo.trim() || null;
      }
      const { error: updateError } = await supabase.from("posts").update(updateData).eq("id", post.id);
      if (updateError) throw updateError;
      onOpenChange(false); onPostUpdated();
    } catch { setError("오류가 발생했습니다"); } finally { setIsSubmitting(false); }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 bg-[#1c2128] border-0 rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
        <DialogHeader className="px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
          <DialogTitle className="text-base font-semibold text-[#c9d1d9]">게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요 (선택사항)"
            className="h-10 text-sm bg-[#161b22] border-0 text-[#c9d1d9] rounded-md shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#79c0ff]/30 placeholder:text-[#6e7681]" />
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요" rows={4}
            className="text-sm bg-[#161b22] border-0 text-[#c9d1d9] rounded-md resize-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#79c0ff]/30 placeholder:text-[#6e7681]" />
          {post.type === "showcase" && (
            <div className="space-y-2 p-3 bg-[#0d1117] rounded-md shadow-[inset_0_1px_4px_rgba(0,0,0,0.25)]">
              <Input type="url" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="프로젝트 데모 URL (선택)"
                className="h-9 text-xs bg-[#161b22] border-0 text-[#c9d1d9] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.2)]" />
              <Input type="url" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="GitHub 저장소 URL (선택)"
                className="h-9 text-xs bg-[#161b22] border-0 text-[#c9d1d9] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.2)]" />
            </div>
          )}
          {error && <p className="text-xs text-[#f85149] bg-[#f85149]/10 px-3 py-2 rounded-md shadow-[0_0_0_1px_rgba(248,81,73,0.3)]">{error}</p>}
        </div>
        <div className="px-4 py-3 shadow-[0_-1px_0_rgba(255,255,255,0.05)] bg-[#0d1117] flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} className="h-9 px-4 text-[#c9d1d9] hover:bg-[#21262d]">취소</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}
            className="h-9 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-sm disabled:opacity-50">
            {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />수정 중...</> : "수정하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InlinePostComposer({ onPostCreated, userAvatar, userInitials, userProfile, currentUserId }: { onPostCreated: (newPost: Post) => void; userAvatar?: string | null; userInitials?: string; userProfile?: UserProfile | null; currentUserId: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState<WritablePostType>("discussion");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetForm = () => {
    setSelectedType("discussion");
    setTitle("");
    setContent("");
    setProjectUrl("");
    setGithubRepo("");
    setError(null);
    setIsExpanded(false);
  };

  const handleExpand = (type?: WritablePostType) => {
    if (!currentUserId) {
      setShowLoginModal(true);
      return;
    }
    setIsExpanded(true);
    if (type) setSelectedType(type);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("내용을 입력해주세요");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("로그인이 필요합니다");
        setIsSubmitting(false);
        return;
      }
      const postData: Record<string, unknown> = {
        author_id: user.id,
        type: selectedType,
        title: title.trim() || null,
        content: content.trim(),
      };
      if (selectedType === "showcase") {
        if (projectUrl.trim()) postData.project_url = projectUrl.trim();
        if (githubRepo.trim()) postData.github_repo = githubRepo.trim();
      }
      const { data, error: insertError } = await supabase.from("posts").insert(postData).select("*").single();
      if (insertError) throw insertError;
      if (data) {
        // Award XP for creating post
        const xpReward = selectedType === "showcase" ? XP_REWARDS.SHOWCASE_POSTED : XP_REWARDS.POST_CREATED;
        const action = selectedType === "showcase" ? "showcase_created" : "post_created";
        await awardXp(supabase, user.id, xpReward, action, data.id);

        const newPost: Post = {
          ...data,
          profiles: {
            username: userProfile?.username || "User",
            display_name: userProfile?.display_name || null,
            avatar_url: userProfile?.avatar_url || null,
          },
          chapters: null,
        };
        onPostCreated(newPost);
      }
      resetForm();
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const config = writableCategoryConfig[selectedType];

  return (
    <div className="bg-[#151a21] rounded-md  shadow-[0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-200">
      {/* Collapsed State */}
      {!isExpanded && (
        <div className="p-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-[#f0b429]/20">
              <AvatarImage src={userAvatar || undefined} />
              <AvatarFallback className="bg-[#f0b429]/10 text-[#f0b429] text-sm font-bold">{userInitials || "U"}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => handleExpand()}
              className="flex-1 h-11 px-4 bg-[#1c2128] hover:bg-[#242b33] border border-[#30363d]/50 rounded-full text-left text-[#8b949e] text-sm transition-all hover:text-[#c9d1d9]"
            >
              무슨 생각을 하고 계신가요?
            </button>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div>
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#1c2128] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-[#f0b429]/20">
                <AvatarImage src={userAvatar || undefined} />
                <AvatarFallback className="bg-[#f0b429]/10 text-[#f0b429] text-xs font-bold">{userInitials || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-[#e6edf3]">새 글 작성</p>
                <p className="text-xs text-[#8b949e]">커뮤니티에 공유하세요</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-[#1c2128] rounded-md transition-colors text-[#8b949e] hover:text-[#c9d1d9]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category Selector */}
          <div className="px-5 py-3 bg-[#0a0c10]/40 border-b border-[#1c2128]">
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(writableCategoryConfig) as [WritablePostType, typeof writableCategoryConfig[WritablePostType]][]).map(([type, cfg]) => {
                const Icon = cfg.icon;
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      isActive ? cfg.activeColor : cfg.color
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-5 space-y-4">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={config.placeholder.content}
              rows={4}
              className="text-sm bg-[#1c2128] border border-[#30363d]/50 text-[#e6edf3] rounded-md resize-none focus:border-[#79c0ff]/40 placeholder:text-[#6e7681]"
            />

            {/* Showcase URLs */}
            {selectedType === "showcase" && (
              <div className="space-y-2 p-4 bg-[#0a0c10]/50 rounded-md border border-[#21262d]/50">
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="h-4 w-4 text-[#79c0ff]" />
                  <span className="text-xs font-medium text-[#79c0ff]">프로젝트 링크 (선택)</span>
                </div>
                <Input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://your-project.com"
                  className="h-10 text-sm bg-[#1c2128] border border-[#30363d]/50 text-[#e6edf3] rounded-md placeholder:text-[#6e7681]"
                />
                <Input
                  type="url"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="h-10 text-sm bg-[#1c2128] border border-[#30363d]/50 text-[#e6edf3] rounded-md placeholder:text-[#6e7681]"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-[#f85149] bg-[#f85149]/10 px-4 py-2.5 rounded-md border border-[#f85149]/20 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Submit Area */}
          <div className="px-5 py-4 border-t border-[#1c2128] bg-[#0a0c10]/30 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm font-medium text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128] rounded-md transition-colors"
            >
              취소
            </button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="h-9 px-5 bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-sm rounded-md disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  게시 중...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  게시하기
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md bg-[#1c2128] border-0 rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#c9d1d9] text-center">
              도장 입문이 필요합니다
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f0b429]/10 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-[#f0b429]" />
            </div>
            <p className="text-[#8b949e] text-sm">
              커뮤니티에 글을 작성하려면 VibeKai에<br />
              로그인하거나 입문해주세요
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-md h-10 text-sm border-0 text-[#c9d1d9] hover:text-[#e6edf3] bg-[#21262d] hover:bg-[#262c36]"
            >
              <Link href="/login?redirect=/community">
                로그인
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1 rounded-md h-10 text-sm font-semibold bg-[#f0b429] hover:bg-[#f7c948] text-[#0d1117] border-0"
            >
              <Link href="/signup?redirect=/community">
                입문하기
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type FeedItem = { type: "post"; data: Post; created_at: string } | { type: "question"; data: ChapterQuestion; created_at: string };
type FilterType = PostType | "all" | "saved" | "learning_question";

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [chapterQuestions, setChapterQuestions] = useState<ChapterQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());

  const fetchData = async (useCache = true) => {
    const supabase = createClient();

    // Try to load from cache first
    if (useCache && typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("community_data");
        if (cached) {
          const { posts: cachedPosts, questions: cachedQuestions, timestamp } = JSON.parse(cached);
          // Use cache if it's less than 2 minutes old
          if (Date.now() - timestamp < 120000) {
            setPosts(cachedPosts);
            setChapterQuestions(cachedQuestions);
            setLoading(false);
            // Still fetch fresh data in background
            fetchData(false);
            return;
          }
        }
      } catch (e) {
        // Ignore cache errors
      }
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    // Fetch current user's profile
    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url, total_xp")
        .eq("id", user.id)
        .single();
      if (profileData) setCurrentUserProfile(profileData as UserProfile);
    } else {
      setCurrentUserProfile(null);
    }

    const { data: postsData } = await supabase.from("posts").select(`*, profiles:author_id(username, display_name, avatar_url), chapters:chapter_id(title_ko)`).order("created_at", { ascending: false }).limit(50);
    if (postsData) {
      setPosts(postsData as Post[]);
    }
    const { data: questionsData } = await supabase.from("chapter_questions").select(`*, profiles:user_id(username, display_name, avatar_url), chapters:chapter_id(title_ko), replies:chapter_question_replies(id, user_id, content, is_accepted, created_at, profiles:user_id(username, display_name, avatar_url))`).order("created_at", { ascending: false }).limit(50);
    if (questionsData) {
      setChapterQuestions(questionsData as ChapterQuestion[]);
    }

    // Save to cache
    if (useCache === false && typeof window !== "undefined" && postsData && questionsData) {
      try {
        sessionStorage.setItem("community_data", JSON.stringify({
          posts: postsData,
          questions: questionsData,
          timestamp: Date.now()
        }));
      } catch (e) {
        // Ignore cache errors (quota exceeded, etc.)
      }
    }

    setLoading(false);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", postId);
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("chapter_questions").delete().eq("id", questionId);
    setChapterQuestions(chapterQuestions.filter(q => q.id !== questionId));
  };

  useEffect(() => { fetchData(); }, []);

  const feedItems: FeedItem[] = [
    ...posts.map((post) => ({ type: "post" as const, data: post, created_at: post.created_at })),
    ...chapterQuestions.map((q) => ({ type: "question" as const, data: q, created_at: q.created_at })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleBookmark = (postId: string) => {
    setSavedPostIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const filteredItems = feedItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "saved") return item.type === "post" && savedPostIds.has(item.data.id);
    if (activeFilter === "learning_question") return item.type === "question";
    if (activeFilter === "question") return item.type === "post" && item.data.type === "question";
    return item.type === "post" && item.data.type === activeFilter;
  });

  const categories: { key: FilterType; icon: typeof MessageSquare; label: string }[] = [
    { key: "all", icon: MessageSquare, label: "전체" },
    { key: "review", icon: GraduationCap, label: "학습 후기" },
    { key: "learning_question", icon: Code2, label: "학습 질문" },
    { key: "question", icon: HelpCircle, label: "일반 질문" },
    { key: "showcase", icon: Rocket, label: "프로젝트 소개" },
    { key: "discussion", icon: Coffee, label: "잡담하기" },
    { key: "suggestion", icon: Lightbulb, label: "건의사항" },
    { key: "saved", icon: Bookmark, label: "저장됨" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      {/* Header */}
      <div className="container pt-5">
        <div className="flex items-center gap-3 mb-3 pb-3 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
          <div className="p-2.5 bg-[#daa520]/10 rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <Terminal className="h-5 w-5 text-[#daa520]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#c9d1d9]">
              커뮤니티
            </h1>
            <p className="text-sm text-[#8b949e] font-mono">바이브 코더들의 이야기</p>
          </div>
        </div>
      </div>

      <div className="container py-3">

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Profile Card */}
              <div className="bg-[#151a21] rounded-md  overflow-hidden">
                <div className="h-14 bg-gradient-to-r from-[#f0b429]/10 via-[#f0b429]/5 to-transparent relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23d4a55a%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
                </div>
                <div className="px-4 pb-4 -mt-5">
                  <Avatar className="h-12 w-12 ring-4 ring-[#151a21]">
                    <AvatarImage src={currentUserProfile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-[#f0b429]/10 text-[#f0b429] text-lg font-bold">
                      {currentUserProfile?.username?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-[#e6edf3] text-sm mt-2">
                    {currentUserProfile?.display_name || currentUserProfile?.username || "수련생"}
                  </p>
                  <div className="mt-1">
                    <BeltBadge xp={currentUserProfile?.total_xp ?? 0} size="sm" />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-[#151a21] rounded-md  p-2">
                <nav className="space-y-0.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeFilter === cat.key;
                    const count = cat.key === "all" ? feedItems.length
                      : cat.key === "saved" ? savedPostIds.size
                      : cat.key === "learning_question" ? feedItems.filter(i => i.type === "question").length
                      : cat.key === "question" ? feedItems.filter(i => i.type === "post" && i.data.type === "question").length
                      : feedItems.filter(i => i.type === "post" && i.data.type === cat.key).length;
                    return (
                      <button key={cat.key} onClick={() => setActiveFilter(cat.key)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all ${
                          isActive ? "bg-[#1c2128] text-[#e6edf3] border border-[#30363d]/50" : "text-[#8b949e] hover:bg-[#1c2128]/50 hover:text-[#c9d1d9] border border-transparent"
                        }`}>
                        <Icon className={`h-4 w-4 ${isActive ? "text-[#f0b429]" : ""}`} />
                        <span className="flex-1 text-xs font-medium">{cat.label}</span>
                        <span className={`text-[10px] min-w-[20px] text-center py-0.5 px-1.5 rounded-md ${
                          isActive ? "bg-[#f0b429]/15 text-[#f0b429] border border-[#f0b429]/20" : "bg-[#0a0c10] text-[#8b949e] border border-[#21262d]/50"
                        }`}>{count}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 min-w-0 space-y-4">
            {/* Mobile Filter */}
            <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeFilter === cat.key;
                  return (
                    <button key={cat.key} onClick={() => setActiveFilter(cat.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                        isActive ? "bg-[#1c2128] text-[#c9d1d9] border-[#f0b429]/30" : "bg-[#151a21] text-[#8b949e] border-[#21262d]/50"
                      }`}>
                      <Icon className="h-3.5 w-3.5" />{cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <InlinePostComposer onPostCreated={(newPost) => setPosts([newPost, ...posts])} userAvatar={currentUserProfile?.avatar_url} userInitials={currentUserProfile?.username?.slice(0, 2).toUpperCase()} userProfile={currentUserProfile} currentUserId={currentUserId} />

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-[#f0b429]" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-[#161b22] rounded-md border border-0 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#21262d] rounded-md flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-[#484f58]" />
                </div>
                <p className="text-[#e6edf3] text-sm font-medium mb-1">아직 게시글이 없어요</p>
                <p className="text-[#8b949e] text-xs">위의 입력창에서 첫 번째 이야기를 시작해보세요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) =>
                  item.type === "post" ? (
                    <PostCard
                      key={`p-${item.data.id}`}
                      post={item.data}
                      currentUserId={currentUserId}
                      currentUserAvatar={currentUserProfile?.avatar_url}
                      currentUserProfile={currentUserProfile}
                      onEdit={(post) => setEditingPost(post)}
                      onDelete={handleDeletePost}
                      onBookmark={handleBookmark}
                      isBookmarked={savedPostIds.has(item.data.id)}
                    />
                  ) : (
                    <QuestionCard
                      key={`q-${item.data.id}`}
                      question={item.data}
                      currentUserId={currentUserId}
                      currentUserAvatar={currentUserProfile?.avatar_url}
                      currentUserProfile={currentUserProfile}
                      onDelete={handleDeleteQuestion}
                    />
                  )
                )}
              </div>
            )}
          </main>

        </div>
      </div>

      <EditPostModal post={editingPost} open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)} onPostUpdated={fetchData} />
    </div>
  );
}
