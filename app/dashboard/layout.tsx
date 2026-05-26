"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Award,
  Sparkles,
  UserPlus,
  Target,
  MessageSquare,
  TrendingUp,
  Workflow
} from "lucide-react"
import { currentUser, notifications } from "@/lib/mock-data"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Formacoes", href: "/dashboard/trainings", icon: GraduationCap },
  { name: "Calendario", href: "/dashboard/calendar", icon: Calendar },
  { name: "Colaboradores", href: "/dashboard/employees", icon: Users },
  { name: "Onboarding", href: "/dashboard/onboarding", icon: UserPlus },
  { name: "PDI", href: "/dashboard/pdi", icon: Target },
  { name: "Avaliacoes 360", href: "/dashboard/evaluations", icon: MessageSquare },
  { name: "Analytics RH", href: "/dashboard/hr-analytics", icon: TrendingUp },
  { name: "Talent Flow", href: "/dashboard/talent-flow", icon: Workflow },
]

const bottomNav = [
  { name: "Definicoes", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const unreadNotifications = notifications.filter(n => !n.read).length

  const router = usePathname && typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  const handleLogout = () => {
    // Aqui você pode adicionar lógica de limpeza de sessão/localStorage se necessário
    if (router) router.push('/');
  };

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

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
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
          </nav>

          {/* AI Feature Banner */}
          <div className="px-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-accent/15 via-accent/10 to-primary/10 border border-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                </div>
                <span className="text-xs font-semibold text-sidebar-foreground">IA Ativa</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                3 recomendacoes personalizadas disponiveis.
              </p>
              <Button size="sm" className="w-full text-xs h-7 bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver Sugestoes
              </Button>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="px-3 pb-4 border-t border-sidebar-border pt-4">
            {bottomNav.map((item) => {
              const isActive = pathname === item.href
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
                    <span className="sr-only">Notificacoes</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notificacoes
                    <Badge variant="secondary">{unreadNotifications} novas</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary">
                    Ver todas as notificacoes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{currentUser.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {currentUser.role.replace('_', ' ')}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Definicoes
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
          {children}
        </main>
      </div>
    </div>
  )
}
