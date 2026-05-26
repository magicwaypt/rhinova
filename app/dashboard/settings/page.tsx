"use client"

import { useState } from "react"
import {
  Building2,
  Users,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Zap,
  Mail,
  Webhook,
  Database,
  Save,
  Upload,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Notificações e lembretes via Slack",
    connected: true,
    icon: "/integrations/slack.svg",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Integração com Teams para comunicação",
    connected: false,
    icon: "/integrations/teams.svg",
  },
  {
    id: "google",
    name: "Google Calendar",
    description: "Sincronização de eventos de formação",
    connected: true,
    icon: "/integrations/google.svg",
  },
  {
    id: "sap",
    name: "SAP SuccessFactors",
    description: "Sincronização de dados de RH",
    connected: false,
    icon: "/integrations/sap.svg",
  },
]

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("TechCorp Solutions")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [autoReminders, setAutoReminders] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Definições</h1>
        <p className="mt-1 text-muted-foreground">
          Configure a plataforma de acordo com as necessidades da sua organização
        </p>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organização
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Zap className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Faturação
          </TabsTrigger>
        </TabsList>

        {/* Organization Settings */}
        <TabsContent value="organization" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Informações da Organização</CardTitle>
              <CardDescription>
                Configure os dados principais da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/company-logo.png" />
                  <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                    TC
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Carregar Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG ou SVG. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Setor</Label>
                  <Select defaultValue="tech">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Tecnologia</SelectItem>
                      <SelectItem value="finance">Finanças</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="retail">Retalho</SelectItem>
                      <SelectItem value="manufacturing">Indústria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Número de Colaboradores</Label>
                  <Select defaultValue="201-500">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="201-500">201-500</SelectItem>
                      <SelectItem value="501-1000">501-1000</SelectItem>
                      <SelectItem value="1000+">1000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue="europe-lisbon">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-lisbon">
                        Europe/Lisbon (WET/WEST)
                      </SelectItem>
                      <SelectItem value="europe-london">
                        Europe/London (GMT/BST)
                      </SelectItem>
                      <SelectItem value="europe-paris">
                        Europe/Paris (CET/CEST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Morada</Label>
                <Textarea
                  id="address"
                  placeholder="Morada completa da empresa"
                  defaultValue="Avenida da Liberdade, 110&#10;1250-146 Lisboa&#10;Portugal"
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Personalização</CardTitle>
              <CardDescription>
                Personalize a aparência da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar tema escuro para toda a plataforma
                  </p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Cor Principal</Label>
                <div className="flex gap-3">
                  {["#0066FF", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"].map(
                    (color) => (
                      <button
                        key={color}
                        className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                          color === "#0066FF"
                            ? "border-white ring-2 ring-primary"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select defaultValue="pt">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Notificações por Email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações importantes por email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificações Push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações no browser em tempo real
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes Automáticos</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes antes das formações
                  </p>
                </div>
                <Switch
                  checked={autoReminders}
                  onCheckedChange={setAutoReminders}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Frequência de Relatórios</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="never">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Integrações Disponíveis</CardTitle>
              <CardDescription>
                Conecte a RHINOVA com as ferramentas que já usa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Globe className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">
                          {integration.name}
                        </h4>
                        {integration.connected && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-500"
                          >
                            Conectado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={integration.connected ? "outline" : "default"}
                  >
                    {integration.connected ? "Configurar" : "Conectar"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                API & Webhooks
              </CardTitle>
              <CardDescription>
                Configure integrações personalizadas via API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value="rhino_sk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline">Copiar</Button>
                  <Button variant="outline">Regenerar</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  placeholder="https://your-server.com/webhook"
                  type="url"
                />
              </div>

              <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Ver Documentação API
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Configure opções de segurança e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança
                  </p>
                </div>
                <Button variant="outline">Ativar 2FA</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Single Sign-On (SSO)</Label>
                  <p className="text-sm text-muted-foreground">
                    Configure SSO com o seu provedor de identidade
                  </p>
                </div>
                <Badge variant="secondary">Enterprise</Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Política de Passwords</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm">
                      Mínimo de 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm">
                      Requer letras maiúsculas e minúsculas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm">Requer números</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch />
                    <span className="text-sm">
                      Requer caracteres especiais
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Sessões Ativas</Label>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Chrome em Windows
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Lisboa, Portugal - Sessão atual
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500">
                      Ativa
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="text-red-500">
                  Terminar Todas as Outras Sessões
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>
                Gerencie a sua subscrição e faturação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                <div>
                  <Badge className="mb-2 bg-primary text-primary-foreground">
                    Business
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    249 EUR<span className="text-lg font-normal text-muted-foreground">/mês</span>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Até 500 colaboradores - Renovação a 1 Mai 2026
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Alterar Plano</Button>
                  <Button>Upgrade para Enterprise</Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">247</p>
                  <p className="text-sm text-muted-foreground">
                    de 500 colaboradores
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">45</p>
                  <p className="text-sm text-muted-foreground">
                    formações ativas
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">12 GB</p>
                  <p className="text-sm text-muted-foreground">
                    de 50 GB utilizados
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">
                  Histórico de Faturação
                </h4>
                <div className="space-y-2">
                  {[
                    { date: "1 Abr 2026", amount: "249,00 EUR", status: "Pago" },
                    { date: "1 Mar 2026", amount: "249,00 EUR", status: "Pago" },
                    { date: "1 Fev 2026", amount: "249,00 EUR", status: "Pago" },
                  ].map((invoice, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            Fatura {invoice.date}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Plano Business
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-foreground">
                          {invoice.amount}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-500"
                        >
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
