"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Mail, 
  Sparkles, 
  Linkedin,
  Send,
  Copy,
  RefreshCw,
  Wand2,
  Users,
  Eye,
  Edit,
  Plus,
  Play,
  Pause,
  BarChart3,
  Clock,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  Calendar,
  ChevronRight,
  Settings,
  Target,
  Zap
} from "lucide-react"
import { candidateProfiles, outreachCampaigns, jobPositions } from "@/lib/recruitment-data"

const templateVariables = [
  { key: "{{firstName}}", description: "Nome do candidato" },
  { key: "{{currentCompany}}", description: "Empresa atual" },
  { key: "{{currentRole}}", description: "Cargo atual" },
  { key: "{{relevantExperience}}", description: "Experiência relevante" },
  { key: "{{senderName}}", description: "Nome do recruiter" },
  { key: "{{jobTitle}}", description: "Título da vaga" },
  { key: "{{companyName}}", description: "Nome da empresa" },
]

const previewCandidate = candidateProfiles[0]

export default function OutreachAssistantPage() {
  const [selectedCampaign, setSelectedCampaign] = useState(outreachCampaigns[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState(previewCandidate)
  const [messageContext, setMessageContext] = useState("")

  const handleGenerateMessage = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedMessage(`Olá ${selectedCandidate.name.split(' ')[0]},

Espero que esta mensagem o encontre bem. O meu nome é Maria Santos e estou a trabalhar num processo confidencial de Executive Search para uma posição muito interessante.

O seu perfil em ${selectedCandidate.currentCompany} e a sua experiência em ${selectedCandidate.aiAnalysis?.specializations[0] || 'liderança'} chamaram a nossa atenção. Estamos a identificar candidatos para uma posição de ${selectedCandidate.currentRole} numa das empresas tech portuguesas de maior crescimento.

${messageContext ? `Gostaria particularmente de explorar: ${messageContext}` : ''}

Teria disponibilidade para uma breve chamada de 15 minutos esta semana para partilhar mais detalhes?

Cumprimentos,
Maria Santos
Head of Talent Acquisition`)
      setIsGenerating(false)
    }, 1500)
  }

  const stats = selectedCampaign.stats

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail className="w-7 h-7 text-primary" />
            AI Outreach Assistant
          </h1>
          <p className="text-muted-foreground">Automação inteligente de comunicação com candidatos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Gerar Mensagem</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Generate Message Tab */}
        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Configurar Mensagem
                </CardTitle>
                <CardDescription>
                  A AI gera mensagens personalizadas com base no perfil do candidato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Candidate Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Candidato</label>
                  <Select 
                    value={selectedCandidate.id} 
                    onValueChange={(id) => {
                      const candidate = candidateProfiles.find(c => c.id === id)
                      if (candidate) setSelectedCandidate(candidate)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {candidateProfiles.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} - {c.currentRole}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Candidate Preview */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{selectedCandidate.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedCandidate.currentRole} @ {selectedCandidate.currentCompany}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-xs">AI Score: {selectedCandidate.aiScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedCandidate.aiAnalysis?.specializations.slice(0, 3).map((spec, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{spec}</Badge>
                    ))}
                  </div>
                </div>

                {/* Job Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vaga (Opcional)</label>
                  <Select defaultValue="job-003">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar vaga..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma (Mensagem genérica)</SelectItem>
                      {jobPositions.map(job => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Channel Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Canal</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Linkedin className="w-4 h-4" />
                      InMail
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                  </div>
                </div>

                {/* Additional Context */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contexto Adicional (Opcional)</label>
                  <Textarea
                    placeholder="Ex: Mencionar experiência em IPO, referir projeto específico..."
                    value={messageContext}
                    onChange={(e) => setMessageContext(e.target.value)}
                    className="min-h-20"
                  />
                </div>

                {/* Tone Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tom da Mensagem</label>
                  <Select defaultValue="professional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="friendly">Amigável</SelectItem>
                      <SelectItem value="executive">Executivo</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerateMessage} 
                  disabled={isGenerating} 
                  className="w-full gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      A Gerar Mensagem...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Mensagem Personalizada
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Message Preview */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Pré-visualização
                  </CardTitle>
                  {generatedMessage && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Copy className="w-4 h-4" />
                        Copiar
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <RefreshCw className="w-4 h-4" />
                        Regenerar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedMessage ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-line text-sm">
                      {generatedMessage}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2">
                        <Send className="w-4 h-4" />
                        Enviar Mensagem
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Agendar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Configure os parâmetros e clique em &quot;Gerar Mensagem&quot;</p>
                    <p className="text-sm mt-2">A AI criará uma mensagem personalizada para o candidato</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Variables Reference */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Variáveis Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {templateVariables.map((v, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                    title={v.description}
                  >
                    <code className="text-xs">{v.key}</code>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campaigns List */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Campanhas de Outreach</CardTitle>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Campanha
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {outreachCampaigns.map((campaign) => (
                  <Card 
                    key={campaign.id} 
                    className={`border-border/50 cursor-pointer transition-all ${
                      selectedCampaign.id === campaign.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{campaign.name}</h4>
                            <Badge className={
                              campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                              campaign.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                              campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }>
                              {campaign.status === 'active' ? 'Ativa' :
                               campaign.status === 'paused' ? 'Pausada' :
                               campaign.status === 'completed' ? 'Concluída' :
                               'Rascunho'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {campaign.type === 'cold' ? 'Cold Outreach' :
                               campaign.type === 'warm' ? 'Warm Outreach' :
                               campaign.type === 'referral' ? 'Referência' :
                               'Nurture'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {campaign.templates.length} templates • {campaign.recipients.length} destinatários
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            {campaign.status === 'active' ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-xl font-bold">{campaign.stats.totalSent}</p>
                          <p className="text-xs text-muted-foreground">Enviados</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">{campaign.stats.openRate.toFixed(0)}%</p>
                          <p className="text-xs text-muted-foreground">Open Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">{campaign.stats.replyRate.toFixed(0)}%</p>
                          <p className="text-xs text-muted-foreground">Reply Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-600">{campaign.stats.interested}</p>
                          <p className="text-xs text-muted-foreground">Interessados</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Campaign Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas da Campanha</CardTitle>
                <CardDescription>{selectedCampaign.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de Abertura</span>
                    <span className="font-medium">{stats.openRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.openRate} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de Resposta</span>
                    <span className="font-medium">{stats.replyRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.replyRate} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de Interesse</span>
                    <span className="font-medium text-green-600">{stats.interestRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.interestRate} className="h-2" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{stats.totalSent}</p>
                    <p className="text-xs text-muted-foreground">Total Enviados</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{stats.replied}</p>
                    <p className="text-xs text-muted-foreground">Respostas</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.interested}</p>
                    <p className="text-xs text-muted-foreground">Interessados</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{selectedCampaign.templates.length}</p>
                    <p className="text-xs text-muted-foreground">Templates</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Ver Relatório Completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Templates de Mensagem</h3>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCampaign.templates.map((template) => (
              <Card key={template.id} className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {template.channel === 'inmail' && <Linkedin className="w-4 h-4" />}
                        {template.channel === 'email' && <Mail className="w-4 h-4" />}
                        {template.channel} • Sequência {template.sequence}
                        {template.isAIGenerated && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {template.subject && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Assunto:</p>
                      <p className="text-sm font-medium">{template.subject}</p>
                    </div>
                  )}
                  <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground line-clamp-3">
                    {template.content.substring(0, 200)}...
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {template.variables.map((v, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {`{{${v}}}`}
                      </Badge>
                    ))}
                  </div>
                  {template.delayDays > 0 && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Enviado {template.delayDays} dias após mensagem anterior
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Abertura Média</p>
                    <p className="text-2xl font-bold text-foreground">68%</p>
                    <p className="text-xs text-green-600">+5% vs mês anterior</p>
                  </div>
                  <Mail className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Resposta Média</p>
                    <p className="text-2xl font-bold text-foreground">38%</p>
                    <p className="text-xs text-green-600">+8% vs mês anterior</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversão para Interesse</p>
                    <p className="text-2xl font-bold text-foreground">22%</p>
                    <p className="text-xs text-muted-foreground">vs benchmark 18%</p>
                  </div>
                  <Target className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Mensagens AI/Manuais</p>
                    <p className="text-2xl font-bold text-foreground">78%</p>
                    <p className="text-xs text-muted-foreground">geradas por AI</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Melhores Horários de Envio</CardTitle>
              <CardDescription>
                Baseado na performance histórica das suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { day: "Segunda", time: "10:00", score: 85 },
                  { day: "Terça", time: "10:00", score: 92 },
                  { day: "Quarta", time: "14:00", score: 88 },
                  { day: "Quinta", time: "10:00", score: 82 },
                  { day: "Sexta", time: "09:00", score: 75 },
                ].map((slot, i) => (
                  <div key={i} className={`p-3 rounded-lg text-center ${
                    slot.score >= 90 ? 'bg-green-50 border border-green-200' :
                    slot.score >= 80 ? 'bg-blue-50 border border-blue-200' :
                    'bg-muted/50'
                  }`}>
                    <p className="font-medium">{slot.day}</p>
                    <p className="text-sm text-muted-foreground">{slot.time}</p>
                    <p className="text-lg font-bold mt-1">{slot.score}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
