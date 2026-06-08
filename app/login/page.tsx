"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccessManagement } from "@/components/providers/access-management-provider"

export default function LoginPage() {
  const router = useRouter()
  const { currentUser, isReady, signInAsManagedUser } = useAccessManagement()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [rememberSession, setRememberSession] = useState(false)

  useEffect(() => {
    if (!isReady) return
    if (!currentUser) return
    router.replace("/dashboard")
  }, [currentUser, isReady, router])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setLoginError("")

    await new Promise((resolve) => setTimeout(resolve, 700))

    const user = await signInAsManagedUser(email, password, rememberSession)
    if (!user || !password.trim()) {
      setLoginError("Credenciais inválidas. Verifique os dados introduzidos.")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
    setIsLoading(false)
  }

  if (isReady && currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(37,99,235,0.08),transparent_35%),linear-gradient(135deg,#f8fbff_0%,#ffffff_55%,#f5f7fb_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="hidden lg:block">
            <Link href="/" className="inline-flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                R
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-foreground">RHINOVA</p>
                <p className="text-sm text-muted-foreground">Plataforma de gestão de formação</p>
              </div>
            </Link>

            <div className="mt-16 max-w-xl">
              <h1 className="text-5xl font-bold leading-tight text-foreground">
                Gestão de formação,
                <br />
                simples e centralizada.
              </h1>
              <p className="mt-6 max-w-lg text-xl leading-9 text-muted-foreground">
                Entre na plataforma para gerir formação, equipas e entidades num único espaço de trabalho.
              </p>
            </div>
          </section>

          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                  R
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-foreground">RHINOVA</p>
                  <p className="text-sm text-muted-foreground">Gestão de formação</p>
                </div>
              </Link>
            </div>

            <Card className="border-border/70 bg-card/95 shadow-xl shadow-slate-200/60 backdrop-blur">
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-3xl">Entrar</CardTitle>
                <CardDescription className="text-base">
                  Use as suas credenciais para aceder à plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="nome@empresa.pt"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-12 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Esqueceu-se?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Introduza a sua password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="h-12 pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Ocultar password" : "Mostrar password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-session"
                      checked={rememberSession}
                      onCheckedChange={(checked) => setRememberSession(Boolean(checked))}
                    />
                    <label htmlFor="remember-session" className="text-sm text-muted-foreground">
                      Manter sessão iniciada
                    </label>
                  </div>

                  <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
                    {isLoading ? (
                      "A entrar..."
                    ) : (
                      <>
                        Entrar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {loginError && (
                    <p className="text-sm text-destructive">{loginError}</p>
                  )}
                </form>

                <div className="mt-6 rounded-2xl border bg-secondary/20 p-4 text-sm text-muted-foreground">
                  O acesso é atribuído pela administração da plataforma. Se ainda não tem conta, peça ativação ao seu responsável.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
