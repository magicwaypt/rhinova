"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Shield, 
  Calendar, 
  BarChart3, 
  Users, 
  Bell, 
  FileText, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Play,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  CalendarDays,
  Code2
} from "lucide-react"

const features = [
  {
    icon: GraduationCap,
    title: "Gestão de Formações",
    description: "Crie, atribua e monitorize todas as formações da sua organização num único local."
  },
  {
    icon: Shield,
    title: "Compliance Automático",
    description: "Alertas inteligentes para certificações a expirar e horas obrigatórias em falta."
  },
  {
    icon: Calendar,
    title: "Calendário Integrado",
    description: "Visualize todas as sessoes, prazos e renovacoes numa timeline interativa."
  },
  {
    icon: BarChart3,
    title: "Analytics Avancados",
    description: "Dashboards em tempo real com metricas de performance por departamento."
  },
  {
    icon: Users,
    title: "Portal do Colaborador",
    description: "Cada funcionario acede ao seu historico, certificados e proximas formacoes."
  },
  {
    icon: Bell,
    title: "Notificacoes Smart",
    description: "Convites automaticos, lembretes escalonados e alertas de incumprimento."
  }
]

const stats = [
  { value: "98%", label: "Taxa de Compliance", description: "dos nossos clientes" },
  { value: "12h", label: "Poupadas/mes", description: "em trabalho manual" },
  { value: "500+", label: "Empresas", description: "confiam em nos" },
  { value: "4.9", label: "Avaliacao", description: "na App Store" }
]

const plans = [
  {
    name: "Starter",
    price: "Gratis",
    description: "Para equipas pequenas ate 25 colaboradores",
    features: [
      "Ate 25 colaboradores",
      "Gestao de formacoes basica",
      "Exportacao Excel oficial",
      "Dashboard essencial",
      "Suporte por email"
    ],
    cta: "Comecar Gratis",
    highlighted: false
  },
  {
    name: "Pro",
    price: "12",
    period: "/colaborador/mes",
    description: "Para empresas em crescimento",
    features: [
      "Colaboradores ilimitados",
      "Calendario e notificacoes",
      "Portal do colaborador",
      "Gestao documental",
      "Assinaturas digitais",
      "Analytics avancados",
      "Suporte prioritario"
    ],
    cta: "Iniciar Trial Gratis",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    description: "Para grandes organizacoes",
    features: [
      "Tudo do Pro",
      "White-label",
      "API RESTful",
      "Integracoes HRIS",
      "SSO/SAML",
      "SLA dedicado",
      "Account manager"
    ],
    cta: "Contactar Vendas",
    highlighted: false
  }
]

const testimonials = [
  {
    quote: "O RHINOVA transformou completamente a nossa gestao de formacao. Passamos de folhas de calculo caóticas para um sistema totalmente automatizado.",
    author: "Ana Rodrigues",
    role: "Diretora de RH",
    company: "TechCorp Portugal"
  },
  {
    quote: "A taxa de compliance da nossa equipa subiu de 67% para 98% em apenas 3 meses. Os alertas automaticos sao um game-changer.",
    author: "Miguel Santos",
    role: "HR Manager",
    company: "Grupo Industrial Luso"
  },
  {
    quote: "Finalmente uma plataforma que entende as necessidades reais de RH. Os relatorios para auditoria sao perfeitos.",
    author: "Carla Ferreira",
    role: "Compliance Officer",
    company: "BankServ"
  }
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-foreground">RHINOVA</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Precos
              </Link>
              <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Testemunhos
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Button asChild>
                <Link href="/dashboard">
                  Comecar Gratis
                </Link>
              </Button>
            </div>

            <button 
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-border">
            <div className="px-4 py-4 space-y-3">
              <Link href="#features" className="block text-muted-foreground hover:text-foreground">
                Funcionalidades
              </Link>
              <Link href="#pricing" className="block text-muted-foreground hover:text-foreground">
                Precos
              </Link>
              <Link href="#testimonials" className="block text-muted-foreground hover:text-foreground">
                Testemunhos
              </Link>
              <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Button className="w-full" asChild>
                <Link href="/dashboard">Comecar Gratis</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-pulse-glow" style={{animationDelay: '1s'}} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 gap-2 bg-accent/15 text-accent border-accent/30 hover:bg-accent/20">
              <Sparkles className="w-3 h-3" />
              Novidade: Integração com IA para recomendações de formação
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">Gestão de Formação</span>
              <br />
              <span className="text-gradient">Inteligente.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Automatize compliance, centralize certificações e desenvolva a sua equipa com a plataforma SaaS que transforma a gestão de RH.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 text-lg px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25" asChild>
                <Link href="/dashboard">
                  Começar Grátis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 border-primary/30 hover:bg-primary/5">
                <Play className="w-5 h-5 text-primary" />
                Ver Demo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Sem cartão de crédito. Configuração em 2 minutos.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-border overflow-hidden shadow-2xl shadow-primary/10">
              <div className="bg-card p-1">
                <div className="flex gap-1.5 mb-3 px-2 pt-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-accent/50" />
                </div>
                <div className="bg-secondary rounded-lg p-6">
                  <DashboardPreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-foreground font-medium">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Funcionalidades</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
              Tudo o que precisa para gerir formacao
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Uma plataforma completa que substitui folhas de calculo, emails perdidos e follow-ups manuais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Feature highlight */}
          <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Compliance Automatico</Badge>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Nunca mais perca um prazo de certificacao
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                O RHINOVA monitoriza automaticamente todas as certificacoes e envia alertas escalonados antes de expirarem. Receba notificacoes 30, 14 e 7 dias antes, com escalamento automatico para chefias quando ha incumprimento.
              </p>
              <ul className="space-y-3">
                {[
                  "Alertas automaticos de expiracao",
                  "Escalamento para chefias",
                  "Relatorios de compliance em tempo real",
                  "Exportacao para auditoria"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <CompliancePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Integracoes</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
              Integra com os sistemas que ja usa
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Sincronize colaboradores, importe dados e automatize processos com as suas ferramentas favoritas.
            </p>
          </div>

          {/* Integration categories */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* HR Systems */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sistemas de RH</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sincronize colaboradores automaticamente com o seu sistema de gestao de RH.
              </p>
              <div className="flex flex-wrap gap-2">
                {['SAP SuccessFactors', 'Workday', 'ADP', 'Primavera', 'PHC', 'Sage'].map((system) => (
                  <Badge key={system} variant="secondary" className="text-xs">
                    {system}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Communication */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Comunicacao</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Notificacoes e lembretes diretamente nas ferramentas de comunicacao da equipa.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Slack', 'Microsoft Teams', 'Email', 'Outlook'].map((system) => (
                  <Badge key={system} variant="secondary" className="text-xs">
                    {system}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Calendar & Productivity */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Calendario e Produtividade</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sincronize formacoes com calendarios e ferramentas de produtividade.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Google Calendar', 'Outlook Calendar', 'Notion', 'Asana'].map((system) => (
                  <Badge key={system} variant="secondary" className="text-xs">
                    {system}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* API & Webhooks callout */}
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">API e Webhooks</h3>
                  <p className="text-sm text-muted-foreground">
                    Construa integracoes personalizadas com a nossa API REST completa e webhooks em tempo real. 
                    Documentacao completa e SDKs para Python, Node.js e .NET.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="shrink-0 gap-2">
                Ver Documentacao
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Logo cloud */}
          <div className="mt-16">
            <p className="text-center text-sm text-muted-foreground mb-8">
              Usado por equipas de RH em empresas de todas as dimensoes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
              {['Sonae', 'EDP', 'Galp', 'NOS', 'CTT', 'TAP', 'Jerónimo Martins', 'Mota-Engil'].map((company) => (
                <span key={company} className="text-lg font-semibold text-muted-foreground">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testemunhos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Amado por equipas de RH
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Descubra como outras organizacoes transformaram a sua gestao de formacao.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-background">
                <p className="text-muted-foreground mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Precos</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Planos para cada fase de crescimento
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comece gratis e escale conforme a sua organizacao cresce.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-xl border ${
                  plan.highlighted 
                    ? 'border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent relative shadow-lg shadow-accent/10' 
                    : 'border-border bg-card'
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                    Mais Popular
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {plan.price === "Gratis" || plan.price === "Personalizado" 
                        ? plan.price 
                        : `€${plan.price}`}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.highlighted ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="/dashboard">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-primary/10 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/15 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Pronto para transformar a gestao de formacao?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Junte-se a mais de 500 empresas que ja automatizaram o seu compliance e desenvolvimento de equipas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25" asChild>
                  <Link href="/dashboard">
                    Comecar Gratis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5">
                  Agendar Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">R</span>
                </div>
                <span className="font-bold text-xl">RHINOVA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma de gestao de formacao para equipas de RH modernas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Funcionalidades</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Precos</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Integracoes</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentacao</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Centro de Ajuda</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Sobre Nos</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Carreiras</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 RHINOVA. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Dashboard preview component
function DashboardPreview() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Stats cards */}
      <div className="col-span-1 space-y-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="text-sm text-muted-foreground mb-1">Taxa Compliance</div>
          <div className="text-2xl font-bold text-accent">93.2%</div>
          <div className="text-xs text-muted-foreground">+2.1% vs mes anterior</div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="text-sm text-muted-foreground mb-1">Formacoes Ativas</div>
          <div className="text-2xl font-bold text-primary">8</div>
          <div className="text-xs text-muted-foreground">3 esta semana</div>
        </div>
      </div>
      
      {/* Chart area */}
      <div className="col-span-2 bg-card rounded-lg p-4 border border-border">
        <div className="text-sm font-medium mb-3">Formacoes por Mes</div>
        <div className="flex items-end gap-2 h-24">
          {[40, 65, 55, 80, 70, 90].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-primary/20 rounded-t"
              style={{ height: `${h}%` }}
            >
              <div 
                className="w-full bg-primary rounded-t transition-all"
                style={{ height: `${h * 0.7}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
        </div>
      </div>

      {/* Recent activity */}
      <div className="col-span-1 bg-card rounded-lg p-4 border border-border">
        <div className="text-sm font-medium mb-3">Proximas</div>
        <div className="space-y-3">
          {[
            { title: "Seguranca", date: "15 Abr", status: "scheduled" },
            { title: "RGPD", date: "10 Abr", status: "in_progress" },
            { title: "Lideranca", date: "20 Abr", status: "scheduled" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                item.status === 'in_progress' ? 'bg-accent' : 'bg-primary'
              }`} />
              <div className="flex-1 truncate text-xs">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Compliance preview component
function CompliancePreview() {
  const alerts = [
    { user: "Ana Costa", cert: "RGPD", days: 14, type: "warning" },
    { user: "Pedro Silva", cert: "Seguranca", days: 7, type: "danger" },
    { user: "Sofia Reis", cert: "1os Socorros", days: 30, type: "info" }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Alertas de Certificacao</h4>
        <Badge variant="secondary">3 pendentes</Badge>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-lg border ${
              alert.type === 'danger' 
                ? 'border-destructive/50 bg-destructive/10' 
                : alert.type === 'warning'
                ? 'border-warning/50 bg-warning/10'
                : 'border-border bg-secondary'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{alert.user}</span>
              <Badge 
                variant={alert.type === 'danger' ? 'destructive' : alert.type === 'warning' ? 'outline' : 'secondary'}
                className="text-xs"
              >
                {alert.days} dias
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Certificacao: {alert.cert}
            </div>
          </div>
        ))}
      </div>
      <Button size="sm" className="w-full gap-2">
        <Bell className="w-4 h-4" />
        Enviar Lembretes
      </Button>
    </div>
  )
}
