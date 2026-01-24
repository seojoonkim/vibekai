"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  HelpCircle,
  Lightbulb,
  Rocket,
  Coffee,
  MessageCircle,
  Loader2,
  Link as LinkIcon,
  Github,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type PostType = "question" | "showcase" | "tip" | "free" | "feedback";

const categoryConfig: Record<PostType, { icon: typeof HelpCircle; label: string; color: string; description: string; placeholder: { title: string; content: string } }> = {
  question: {
    icon: HelpCircle,
    label: "질문",
    color: "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100",
    description: "학습 중 궁금한 점이나 막히는 부분을 질문해보세요.",
    placeholder: {
      title: "예: Cursor에서 .cursorrules 설정이 잘 안됩니다",
      content: "어떤 문제가 발생했는지 자세히 설명해주세요. 시도해본 방법이나 에러 메시지가 있다면 함께 적어주세요.",
    },
  },
  showcase: {
    icon: Rocket,
    label: "프로젝트 소개",
    color: "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100",
    description: "직접 만든 프로젝트를 자랑하고 피드백을 받아보세요.",
    placeholder: {
      title: "예: 바이브 코딩으로 만든 첫 번째 Todo 앱",
      content: "어떤 프로젝트인지, 어떤 기술을 사용했는지, 어려웠던 점이나 배운 점을 공유해주세요.",
    },
  },
  tip: {
    icon: Lightbulb,
    label: "팁",
    color: "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100",
    description: "바이브 코딩하면서 알게 된 유용한 팁을 공유해주세요.",
    placeholder: {
      title: "예: Cursor에서 자동완성을 더 잘 받는 방법",
      content: "어떤 상황에서 유용한 팁인지, 구체적인 방법이나 예시를 함께 설명해주세요.",
    },
  },
  free: {
    icon: Coffee,
    label: "잡담",
    color: "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100",
    description: "바이브 코딩, 개발, 일상 등 자유롭게 이야기해보세요.",
    placeholder: {
      title: "예: 오늘 바이브 코딩 3시간 완료!",
      content: "자유롭게 작성해주세요.",
    },
  },
  feedback: {
    icon: MessageCircle,
    label: "건의사항",
    color: "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100",
    description: "Vibe Dojo에 대한 의견, 개선 제안, 버그 리포트 등을 남겨주세요.",
    placeholder: {
      title: "예: 학습 진도 표시 기능 개선 제안",
      content: "어떤 부분이 불편한지, 어떻게 개선되면 좋겠는지 구체적으로 설명해주세요.",
    },
  },
};

export default function NewPostPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedType || !title.trim() || !content.trim()) {
      setError("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setIsSubmitting(false);
        return;
      }

      const postData: {
        author_id: string;
        type: PostType;
        title: string;
        content: string;
        project_url?: string;
        github_repo?: string;
      } = {
        author_id: user.id,
        type: selectedType,
        title: title.trim(),
        content: content.trim(),
      };

      if (selectedType === "showcase") {
        if (projectUrl.trim()) postData.project_url = projectUrl.trim();
        if (githubRepo.trim()) postData.github_repo = githubRepo.trim();
      }

      const { error: insertError } = await supabase
        .from("posts")
        .insert(postData);

      if (insertError) {
        throw insertError;
      }

      router.push("/community");
    } catch (err) {
      console.error("Error creating post:", err);
      setError("게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const config = selectedType ? categoryConfig[selectedType] : null;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Subtle ambient glow */}
      <div className="fixed top-20 left-10 w-[400px] h-[400px] bg-[#f0b429]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-[450px] h-[450px] bg-[#58a6ff]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-2xl py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/community">
            <Button variant="ghost" size="icon" className="rounded-lg text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#c9d1d9]">새 글 작성</h1>
            <p className="text-sm text-[#8b949e] font-mono">광장에 글을 올려보세요</p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-[#c9d1d9] mb-3 block">
            카테고리 선택
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.entries(categoryConfig) as [PostType, typeof categoryConfig[PostType]][]).map(([type, cfg]) => {
              const Icon = cfg.icon;
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-[#f0b429]/20 border-[#f0b429] text-[#f0b429]"
                      : "bg-[#1c2128] border-[#30363d] text-[#8b949e] hover:border-[#f0b429]/50 hover:text-[#c9d1d9]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{cfg.label}</span>
                </button>
              );
            })}
          </div>
          {config && (
            <p className="mt-3 text-xs text-[#8b949e] px-1">
              {config.description}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="space-y-5 bg-[#1c2128] rounded-lg p-6 border border-[#30363d] shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-[#c9d1d9] mb-2 block">
              제목
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={config?.placeholder.title || "제목을 입력해주세요"}
              className="h-11 rounded-lg bg-[#161b22] border-[#30363d] text-[#c9d1d9] placeholder:text-[#6e7681] focus:border-[#f0b429] focus:ring-[#f0b429]/20"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-medium text-[#c9d1d9] mb-2 block">
              내용
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={config?.placeholder.content || "내용을 입력해주세요"}
              rows={8}
              className="rounded-lg bg-[#161b22] border-[#30363d] text-[#c9d1d9] placeholder:text-[#6e7681] focus:border-[#f0b429] focus:ring-[#f0b429]/20 resize-none"
            />
          </div>

          {/* Project-specific fields */}
          {selectedType === "showcase" && (
            <>
              <div>
                <Label htmlFor="projectUrl" className="text-sm font-medium text-[#c9d1d9] mb-2 block">
                  <LinkIcon className="h-3.5 w-3.5 inline mr-1.5" />
                  프로젝트 URL (선택)
                </Label>
                <Input
                  id="projectUrl"
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://your-project.vercel.app"
                  className="h-11 rounded-lg bg-[#161b22] border-[#30363d] text-[#c9d1d9] placeholder:text-[#6e7681] focus:border-[#f0b429] focus:ring-[#f0b429]/20"
                />
              </div>
              <div>
                <Label htmlFor="githubRepo" className="text-sm font-medium text-[#c9d1d9] mb-2 block">
                  <Github className="h-3.5 w-3.5 inline mr-1.5" />
                  GitHub 저장소 (선택)
                </Label>
                <Input
                  id="githubRepo"
                  type="url"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="h-11 rounded-lg bg-[#161b22] border-[#30363d] text-[#c9d1d9] placeholder:text-[#6e7681] focus:border-[#f0b429] focus:ring-[#f0b429]/20"
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-[#f85149] bg-[#f85149]/10 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/community">
              <Button variant="outline" className="rounded-lg border-[#30363d] text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9] bg-transparent">
                취소
              </Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedType || !title.trim() || !content.trim()}
              className="rounded-lg bg-[#f0b429] hover:bg-[#f7c948] text-[#0d1117] font-semibold disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  작성 중...
                </>
              ) : (
                "게시하기"
              )}
            </Button>
          </div>
        </div>

        {/* Info */}
        <p className="mt-6 text-xs text-[#8b949e] text-center">
          학습 후기는 챕터 완료 시 자동으로 작성됩니다. 학습 중 질문은 컨텐츠 내에서 텍스트를 선택하여 남길 수 있습니다.
        </p>
      </div>
    </div>
  );
}
