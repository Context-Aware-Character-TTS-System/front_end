"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const response = await api<{ access_token: string }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      // 쿠키 기반 인증이면: credentials: "include"
    });

    console.log("login response:", response); // <- 디버깅용

    // 안전 검사(옵셔널 체이닝 사용)
    const token = response?.access_token;
    if (!token) {
      throw new Error("로그인 실패: access_token이 없습니다.");
    }

    try {
      localStorage.setItem("accessToken", token);
    } catch (e) {
      console.warn("localStorage 저장 실패:", e);
      // 필요 시 다른 저장소로 처리
    }

    await router.push("/dashboard");
  } catch (err) {
    console.error("handleLogin error:", err);
    setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
  } finally {
    setIsLoading(false);
  }
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
          <CardDescription className="text-center">Alone에 오신 것을 환영합니다</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-center text-red-500">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/register" className="text-sm text-blue-600 hover:underline">
              회원가입이 필요하신가요?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
