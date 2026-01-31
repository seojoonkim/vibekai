"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Discord integration state
  const [discordUsername, setDiscordUsername] = useState<string | null>(null);
  const [discordLinkCode, setDiscordLinkCode] = useState<string | null>(null);
  const [discordCodeExpiry, setDiscordCodeExpiry] = useState<string | null>(null);
  const [discordLoading, setDiscordLoading] = useState(false);

  // Username change form
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");

  // Display name change form
  const [currentDisplayName, setCurrentDisplayName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");

  // Email change form
  const [newEmail, setNewEmail] = useState("");

  // Password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load current username on mount
  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, display_name, discord_username")
          .eq("id", user.id)
          .single();
        if (profile) {
          setCurrentUsername(profile.username || "");
          setNewUsername(profile.username || "");
          setCurrentDisplayName(profile.display_name || "");
          setNewDisplayName(profile.display_name || "");
          setDiscordUsername(profile.discord_username || null);
        }
      }
    }
    loadProfile();
  }, []);

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate username
    if (!newUsername || newUsername.length < 3) {
      setMessage({ type: "error", text: "아이디는 최소 3자 이상이어야 합니다." });
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
      setMessage({ type: "error", text: "아이디는 영문, 숫자, 밑줄(_), 하이픈(-)만 사용할 수 있습니다." });
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage({ type: "error", text: "로그인이 필요합니다." });
        setIsLoading(false);
        return;
      }

      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", newUsername)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        setMessage({ type: "error", text: "이미 사용 중인 아이디입니다." });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", user.id);

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "아이디가 성공적으로 변경되었습니다." });
        setCurrentUsername(newUsername);
      }
    } catch {
      setMessage({ type: "error", text: "아이디 변경 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisplayNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate display name
    if (!newDisplayName || newDisplayName.length < 2) {
      setMessage({ type: "error", text: "표시 이름은 최소 2자 이상이어야 합니다." });
      setIsLoading(false);
      return;
    }

    if (newDisplayName.length > 30) {
      setMessage({ type: "error", text: "표시 이름은 30자를 초과할 수 없습니다." });
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage({ type: "error", text: "로그인이 필요합니다." });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ display_name: newDisplayName })
        .eq("id", user.id);

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "표시 이름이 성공적으로 변경되었습니다." });
        setCurrentDisplayName(newDisplayName);
      }
    } catch {
      setMessage({ type: "error", text: "표시 이름 변경 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email: newEmail });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "확인 이메일이 발송되었습니다. 이메일을 확인해주세요." });
        setNewEmail("");
      }
    } catch {
      setMessage({ type: "error", text: "이메일 변경 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "새 비밀번호가 일치하지 않습니다." });
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "비밀번호는 최소 6자 이상이어야 합니다." });
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "비밀번호가 성공적으로 변경되었습니다." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "비밀번호 변경 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordConnect = async () => {
    setDiscordLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/discord/generate-link-code", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "코드 생성에 실패했습니다." });
      } else {
        setDiscordLinkCode(data.code);
        setDiscordCodeExpiry(data.expires_at);
      }
    } catch {
      setMessage({ type: "error", text: "Discord 연동 코드 생성 중 오류가 발생했습니다." });
    } finally {
      setDiscordLoading(false);
    }
  };

  const handleDiscordDisconnect = async () => {
    setDiscordLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ discord_id: null, discord_username: null })
        .eq("id", user.id);

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setDiscordUsername(null);
        setDiscordLinkCode(null);
        setMessage({ type: "success", text: "Discord 연결이 해제되었습니다." });
      }
    } catch {
      setMessage({ type: "error", text: "Discord 연결 해제 중 오류가 발생했습니다." });
    } finally {
      setDiscordLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="container py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-md text-[#8b949e] hover:text-[#c9d1d9] bg-[#1c2128] hover:bg-[#262c36] border-0 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          >
            <Link href="/dashboard">
              <Icons.chevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-[#c9d1d9]">설정</h1>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-md text-sm shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${
              message.type === "success"
                ? "bg-[#56d364]/10 text-[#56d364]"
                : "bg-[#f85149]/10 text-[#f85149]"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Username Change */}
          <Card className="bg-[#1c2128] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-base text-[#c9d1d9]">아이디 변경</CardTitle>
              <CardDescription className="text-[#8b949e]">
                현재 아이디: <span className="text-[#f0b429] font-mono">{currentUsername || "없음"}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUsernameChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newUsername" className="text-[#c9d1d9]">새 아이디</Label>
                  <Input
                    id="newUsername"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="my_username"
                    required
                    className="bg-[#161b22] border-0 text-[#c9d1d9] placeholder:text-[#6e7681] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#f0b429]/30"
                  />
                  <p className="text-xs text-[#8b949e]">
                    영문, 숫자, 밑줄(_), 하이픈(-)만 사용 가능 (최소 3자)
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !newUsername || newUsername === currentUsername}
                  className="bg-[#f0b429] hover:bg-[#f7c948] text-[#0d1117] border-0"
                >
                  {isLoading ? "변경 중..." : "아이디 변경"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Display Name Change */}
          <Card className="bg-[#1c2128] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-base text-[#c9d1d9]">표시 이름 변경</CardTitle>
              <CardDescription className="text-[#8b949e]">
                현재 표시 이름: <span className="text-[#f0b429]">{currentDisplayName || "없음"}</span>
                <br />
                <span className="text-xs">커뮤니티, 리더보드 등에서 보여지는 이름입니다.</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDisplayNameChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newDisplayName" className="text-[#c9d1d9]">새 표시 이름</Label>
                  <Input
                    id="newDisplayName"
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="수련생"
                    required
                    className="bg-[#161b22] border-0 text-[#c9d1d9] placeholder:text-[#6e7681] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#f0b429]/30"
                  />
                  <p className="text-xs text-[#8b949e]">
                    한글, 영문, 숫자 사용 가능 (2~30자)
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !newDisplayName || newDisplayName === currentDisplayName}
                  className="bg-[#f0b429] hover:bg-[#f7c948] text-[#0d1117] border-0"
                >
                  {isLoading ? "변경 중..." : "표시 이름 변경"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Email Change */}
          <Card className="bg-[#1c2128] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-base text-[#c9d1d9]">이메일 변경</CardTitle>
              <CardDescription className="text-[#8b949e]">
                새 이메일 주소로 확인 메일이 발송됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newEmail" className="text-[#c9d1d9]">새 이메일</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new@example.com"
                    required
                    className="bg-[#161b22] border-0 text-[#c9d1d9] placeholder:text-[#6e7681] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#f0b429]/30"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !newEmail}
                  className="bg-[#f0b429] hover:bg-[#f7c948] text-[#0d1117] border-0"
                >
                  {isLoading ? "변경 중..." : "이메일 변경"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-[#1c2128] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-base text-[#c9d1d9]">비밀번호 변경</CardTitle>
              <CardDescription className="text-[#8b949e]">
                새 비밀번호는 최소 6자 이상이어야 합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-[#c9d1d9]">새 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-[#161b22] border-0 text-[#c9d1d9] placeholder:text-[#6e7681] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#f0b429]/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#c9d1d9]">새 비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-[#161b22] border-0 text-[#c9d1d9] placeholder:text-[#6e7681] shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)] focus:ring-2 focus:ring-[#f0b429]/30"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="bg-[#f0b429] hover:bg-[#f7c948] text-[#0d1117] border-0"
                >
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Discord Integration */}
          <Card className="bg-[#1c2128] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-base text-[#c9d1d9]">Discord 연결</CardTitle>
              <CardDescription className="text-[#8b949e]">
                {discordUsername ? (
                  <>연결됨: <span className="text-[#7289da] font-mono">{discordUsername}</span></>
                ) : (
                  "Discord 계정을 연결하면 챕터 완료 시 XP와 역할이 자동 부여됩니다."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {discordUsername ? (
                <Button
                  onClick={handleDiscordDisconnect}
                  disabled={discordLoading}
                  variant="outline"
                  className="border-[#f85149]/40 text-[#f85149] hover:bg-[#f85149]/10 hover:text-[#f85149] hover:border-[#f85149]/60 bg-transparent"
                >
                  {discordLoading ? "해제 중..." : "연결 해제"}
                </Button>
              ) : discordLinkCode ? (
                <div className="space-y-3">
                  <div className="bg-[#161b22] rounded-md p-4 text-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]">
                    <p className="text-xs text-[#8b949e] mb-2">Discord에서 아래 명령어를 입력하세요</p>
                    <code className="text-2xl font-mono font-bold tracking-widest text-[#7289da]">
                      /link code:{discordLinkCode}
                    </code>
                    {discordCodeExpiry && (
                      <p className="text-xs text-[#8b949e] mt-2">
                        만료: {new Date(discordCodeExpiry).toLocaleTimeString("ko-KR")}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleDiscordConnect}
                    disabled={discordLoading}
                    variant="outline"
                    className="border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#484f58] bg-transparent"
                  >
                    새 코드 발급
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleDiscordConnect}
                  disabled={discordLoading}
                  className="bg-[#5865F2] hover:bg-[#4752c4] text-white border-0"
                >
                  {discordLoading ? "연결 중..." : "Discord 연결하기"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="bg-[#1c2128] border-0 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-base text-[#c9d1d9]">로그아웃</CardTitle>
              <CardDescription className="text-[#8b949e]">
                현재 기기에서 로그아웃합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleLogout}
                disabled={isLoading}
                variant="outline"
                className="border-[#f85149]/40 text-[#f85149] hover:bg-[#f85149]/10 hover:text-[#f85149] hover:border-[#f85149]/60 bg-transparent"
              >
                <Icons.logOut className="mr-2 h-4 w-4" />
                {isLoading ? "로그아웃 중..." : "로그아웃"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
