"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  ChevronDown,
  Award,
  Sparkles,
  UserPlus,
  Target,
  MessageSquare,
  TrendingUp,
  Workflow,
  Briefcase,
  UserSearch,
  GitBranch,
  Bot,
  ClipboardList,
  BookOpen,
  LineChart,
  FileBarChart,
  Building,
  Lock,
  type LucideIcon
} from "lucide-react"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { platformRoleLabels, roleLabels, useAccessManagement } from "@/components/providers/access-management-provider"

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

interface NavModule {
  name: string
  icon: LucideIcon
  items: NavItem[]
  defaultOpen?: boolean
  locked?: boolean
}

interface BottomNavItem extends NavItem {
  locked?: boolean
}

const ACTIVE_TESTING_MODULE = "Formacao"
const notifications: Array<{ id: string; title: string; message: string; read: boolean }> = []

const modules: NavModule[] = [
  {
    name: "Recrutamento",
    icon: Briefcase,
    defaultOpen: true,
    locked: true,
    items: [
      { name: "Vagas", href: "/dashboard/jobs", icon: ClipboardList },
      { name: "Candidatos", href: "/dashboard/candidates", icon: UserSearch },
      { name: "Pipeline", href: "/dashboard/pipeline", icon: GitBranch },
      { name: "AI Agents", href: "/dashboard/ai-agents", icon: Bot },
    ]
  },
  {
    name: "Onboarding",
    icon: UserPlus,
    locked: true,
    items: [
      { name: "Em Curso", href: "/dashboard/onboarding", icon: UserPlus },
      { name: "Templates", href: "/dashboard/onboarding/templates", icon: FileText },
    ]
  },
  {
    name: "Formacao",
    icon: GraduationCap,
    items: [
      { name: "Catalogo", href: "/dashboard/trainings", icon: BookOpen },
      { name: "Colaboradores", href: "/dashboard/trainings#colaboradores", icon: Users },
      { name: "Calendario", href: "/dashboard/calendar", icon: Calendar },
      { name: "Certificacoes", href: "/dashboard/certifications", icon: Award },
    ]
  },
  {
    name: "Avaliacao",
    icon: Target,
    locked: true,
    items: [
      { name: "Avaliacoes 360", href: "/dashboard/evaluations", icon: MessageSquare },
      { name: "PDI", href: "/dashboard/pdi", icon: Target },
    ]
  },
  {
    name: "Talento",
    icon: Users,
    locked: true,
    items: [
      { name: "Colaboradores", href: "/dashboard/employees", icon: Users },
      { name: "Talent Flow", href: "/dashboard/talent-flow", icon: Workflow },
      { name: "Matriz Talento", href: "/dashboard/talent-matrix", icon: Sparkles },
      { name: "Competencias", href: "/dashboard/skills-matrix", icon: BarChart3 },
    ]
  },
  {
    name: "Analytics",
    icon: LineChart,
    locked: true,
    items: [
      { name: "Dashboards", href: "/dashboard/hr-analytics", icon: TrendingUp },
      { name: "Relatorios", href: "/dashboard/reports", icon: FileBarChart },
    ]
  },
]

const bottomNav: BottomNavItem[] = [
  { name: "Definições", href: "/dashboard/settings", icon: Settings, locked: true },
]

function NavModuleSection({ module, pathname }: { module: NavModule; pathname: string }) {
  const [activeHash, setActiveHash] = useState("")
  const hasActiveItem = module.items.some((item) => {
    const [baseHref, hash = ""] = item.href.split("#")
    const matchesPath = pathname === baseHref || pathname.startsWith(baseHref + "/")
    if (!hash) return matchesPath
    return pathname === baseHref && activeHash === `#${hash}`
  })
  const isLocked = module.locked ?? module.name !== ACTIVE_TESTING_MODULE
  const [isOpen, setIsOpen] = useState((module.defaultOpen || hasActiveItem) && !isLocked)

  useEffect(() => {
    if (typeof window === "undefined") return

    const syncHash = () => setActiveHash(window.location.hash)
    syncHash()
    window.addEventListener("hashchange", syncHash)
    return () => window.removeEventListener("hashchange", syncHash)
  }, [])

  return (
    <div className="mb-1">
      <button
        onClick={() => {
          if (isLocked) return
          setIsOpen(!isOpen)
        }}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isLocked
            ? "cursor-not-allowed border border-dashed border-sidebar-border/80 bg-sidebar-accent/20 text-sidebar-foreground/45"
            : hasActiveItem 
              ? "text-sidebar-foreground bg-sidebar-accent/50" 
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
        aria-disabled={isLocked}
      >
        <div className="flex items-center gap-3">
          <module.icon className="w-4 h-4" />
          <span>{module.name}</span>
        </div>
        {isLocked ? (
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-sidebar-foreground/40">
            <span>Locked</span>
            <Lock className="w-3.5 h-3.5" />
          </div>
        ) : (
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen ? "rotate-0" : "-rotate-90"
          )} />
        )}
      </button>
      
      {isOpen && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
          {module.items.map((item) => {
            const [baseHref, hash = ""] = item.href.split("#")
            const isActive = hash
              ? pathname === baseHref && activeHash === `#${hash}`
              : pathname === baseHref || pathname.startsWith(baseHref + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const unreadNotifications = notifications.filter(n => !n.read).length
  const {
    activeEntity,
    currentUser,
    currentUserEntities,
    currentUserMemberships,
    isSuperAdmin,
    isReady,
    signOut,
    setActiveEntity,
  } = useAccessManagement()

  useEffect(() => {
    if (!isReady) return
    if (currentUser) return
    router.replace("/")
  }, [currentUser, isReady, router])

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  if (isReady && !currentUser) {
    return null
  }

  const lockedRouteMatch = modules.find((module) => {
    const isLocked = module.locked ?? module.name !== ACTIVE_TESTING_MODULE
    if (!isLocked) return false

    return module.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-sidebar-foreground">RHINOVA</span>
            </Link>
            <button 
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dashboard Link */}
          <div className="px-3 pt-4 pb-2">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === "/dashboard"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          </div>

          <div className="px-3 pb-2">
            <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-3">
              <div className="flex items-center gap-2 text-sidebar-foreground">
                <Building className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">Entidade ativa</span>
              </div>
              <p className="mt-2 text-sm font-medium text-sidebar-foreground">
                {isReady ? activeEntity?.name || "Sem entidade ativa" : "A carregar..."}
              </p>
              <p className="mt-1 text-xs text-sidebar-foreground/70">
                {isReady && activeEntity ? `${activeEntity.employeeCount} colaboradores · ${activeEntity.headquarters}` : "Contexto de gestão multi-entidade"}
              </p>
            </div>
          </div>

          {/* Module Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {modules.map((module) => (
              <NavModuleSection 
                key={module.name} 
                module={module} 
                pathname={pathname} 
              />
            ))}
          </nav>

          {/* Bottom navigation */}
          <div className="px-3 pb-4 border-t border-sidebar-border pt-4">
              {bottomNav.map((item) => {
                const isActive = pathname === item.href
                const isLocked = item.locked ? !isSuperAdmin : false

                if (isLocked) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-lg border border-dashed border-sidebar-border/80 bg-sidebar-accent/20 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/45"
                      aria-disabled="true"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </div>
                      <Lock className="w-4 h-4" />
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between h-full px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden text-foreground"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
                {pathname !== "/dashboard" && (
                  <>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground capitalize">
                      {pathname.split("/").pop()?.replace("-", " ")}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isReady && (
                <div className="hidden xl:flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                  <Building className="h-4 w-4 text-primary" />
                  <select
                    aria-label="Selecionar entidade ativa"
                    className="bg-transparent text-sm font-medium outline-none"
                    value={activeEntity?.id || ""}
                    onChange={(event) => setActiveEntity(event.target.value)}
                  >
                    {currentUserEntities.map((entity) => (
                      <option key={entity.id} value={entity.id}>
                        {entity.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Search */}
              <Button variant="outline" size="icon" className="hidden sm:flex">
                <Search className="w-4 h-4" />
                <span className="sr-only">Pesquisar</span>
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="w-4 h-4" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifications}
                      </span>
                    )}
                    <span className="sr-only">Notificações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notificações
                    <Badge variant="secondary">{unreadNotifications} novas</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 && (
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 text-muted-foreground">
                      Ainda não existem notificações neste ambiente.
                    </DropdownMenuItem>
                  )}
                  {notifications.slice(0, 4).map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2 w-full">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          notification.read ? "bg-muted" : "bg-primary"
                        )} />
                        <span className="font-medium text-sm">{notification.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 ml-4">
                        {notification.message}
                      </p>
                    </DropdownMenuItem>
                  ))}
                  {notifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="justify-center text-primary">
                        Ver todas as notificações
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {currentUser?.name.split(" ").map(n => n[0]).join("") || "RH"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{currentUser?.name || "Gestor"}</div>
                      <div className="text-xs text-muted-foreground">
                        {currentUser?.platformRole === "super_admin"
                          ? platformRoleLabels[currentUser.platformRole]
                          : currentUserMemberships[0]
                            ? roleLabels[currentUserMemberships[0].role]
                            : "Acesso RH"}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <div className="px-2 pb-2">
                    <div className="rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                      {currentUser?.platformRole === "super_admin"
                        ? "Super admin com acesso transversal a toda a plataforma multi-tenant."
                        : `Gere ${currentUserEntities.length} ${currentUserEntities.length === 1 ? "entidade" : "entidades"} com o mesmo user.`}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Definições
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <button
                      className="flex items-center text-destructive w-full bg-transparent border-0 p-0 m-0 cursor-pointer"
                      onClick={handleLogout}
                      style={{ background: 'none' }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {lockedRouteMatch ? (
            <div className="rounded-3xl border border-dashed p-8">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <lockedRouteMatch.icon className="h-6 w-6" />
                </div>
                <h1 className="mt-6 text-2xl font-bold">{lockedRouteMatch.name} em preparação</h1>
                <p className="mt-3 text-muted-foreground">
                  Este módulo ainda não foi ligado a dados reais neste ambiente. Preferimos escondê-lo a mostrar conteúdo demo para que a plataforma reflita apenas a configuração efetiva.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/dashboard/settings"
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Configurar plataforma
                  </Link>
                  <Link
                    href="/dashboard/trainings"
                    className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium"
                  >
                    Abrir formação
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}
