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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Search, 
  Sparkles, 
  Target, 
  Building2,
  Copy,
  Wand2,
  Play,
  RefreshCw,
  ChevronRight,
  Linkedin,
  Globe,
  Users,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Briefcase,
  FileText,
  Code,
  ExternalLink
} from "lucide-react"
import { jobPositions, sourcingStrategies } from "@/lib/recruitment-data"

// Demo Boolean searches
const generatedSearches = [
  {
    id: 1,
    platform: "LinkedIn Recruiter",
    query: '(CFO OR "Chief Financial Officer" OR "VP Finance" OR "Vice President Finance") AND (IPO OR "public offering" OR "Series C" OR "Series D") AND (tech OR technology OR SaaS OR software) AND (Portugal OR Lisboa OR Lisbon)',
    explanation: "Pesquisa focada em executivos financeiros seniores com experiência em IPO no sector tech em Portugal",
    expectedResults: 150,
    confidence: 92,
  },
  {
    id: 2,
    platform: "LinkedIn Recruiter",
    query: '("Finance Director" OR CFO) AND (startup OR scale-up OR scaleup) AND (Portugal OR remote) AND ("venture capital" OR VC OR funding)',
    explanation: "Pesquisa alternativa focada em ambiente startup e funding",
    expectedResults: 85,
    confidence: 88,
  },
  {
    id: 3,
    platform: "LinkedIn Sales Navigator",
    query: 'title:(CFO OR "Head of Finance") AND company_size:(51-200 OR 201-500) AND industry:(Computer Software OR Information Technology)',
    explanation: "Para identificar CFOs em empresas de tamanho similar",
    expectedResults: 120,
    confidence: 85,
  },
]

const suggestedCompanies = [
  { name: "Farfetch", reason: "Tech unicorn português, provável pool de talento C-level", roles: ["CFO", "VP Finance", "Finance Director"], priority: "high" },
  { name: "OutSystems", reason: "Empresa tech portuguesa com experiência em funding rounds", roles: ["Finance Leadership"], priority: "high" },
  { name: "Talkdesk", reason: "Unicorn com HQ em Lisboa", roles: ["CFO", "VP Finance"], priority: "high" },
  { name: "Remote", reason: "Unicorn com presença em Portugal", roles: ["Finance team"], priority: "medium" },
  { name: "Feedzai", reason: "Unicorn português de AI/ML", roles: ["Finance Leadership"], priority: "medium" },
  { name: "Big Four Portugal", reason: "Pool de talento com skills técnicas", roles: ["Partner", "Director"], priority: "medium" },
]

const equivalentTitles = [
  "CFO",
  "Chief Financial Officer", 
  "VP Finance",
  "Vice President Finance",
  "Finance Director",
  "Head of Finance",
  "Group CFO",
  "Regional CFO",
  "Division CFO",
]

const aiRecommendations = [
  { type: "company", suggestion: "Considerar alumni de Revolut Portugal", reasoning: "Fintech de alto crescimento com talento financeiro qualificado", confidence: 85 },
  { type: "title", suggestion: 'Incluir "Head of FP&A" na pesquisa', reasoning: "Muitos CFOs atuais vieram de background em FP&A", confidence: 78 },
  { type: "strategy", suggestion: "Expandir pesquisa para CFOs de Series B startups", reasoning: "Podem estar prontos para próximo step em empresa maior", confidence: 82 },
  { type: "geography", suggestion: "Incluir Spain como mercado secundário", reasoning: "Mobilidade alta entre PT e ES no sector tech", confidence: 75 },
]

export default function AISourcingPage() {
  const [selectedJob, setSelectedJob] = useState<string>("job-003")
  const [isGenerating, setIsGenerating] = useState(false)
  const [briefingInput, setBriefingInput] = useState("")
  const [showResults, setShowResults] = useState(true)

  const selectedJobData = jobPositions.find(j => j.id === selectedJob)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowResults(true)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            AI Sourcing Copilot
          </h1>
          <p className="text-muted-foreground">Assistente inteligente para prospeção de talento</p>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Configurar Pesquisa
          </CardTitle>
          <CardDescription>
            Selecione uma vaga ou descreva o perfil que procura para gerar estratégias de sourcing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecionar Vaga Existente</label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolher vaga..." />
                </SelectTrigger>
                <SelectContent>
                  {jobPositions.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ou Descrever Perfil</label>
              <Textarea
                placeholder="Ex: Procuramos um CFO com experiência em IPO para uma startup tech em Lisboa..."
                value={briefingInput}
                onChange={(e) => setBriefingInput(e.target.value)}
                className="min-h-20"
              />
            </div>
          </div>

          {selectedJobData && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{selectedJobData.title}</h4>
                <Badge variant="outline">{selectedJobData.priority === "high" ? "Urgente" : "Normal"}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {selectedJobData.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedJobData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedJobData.candidates.length} candidatos
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedJobData.requirements.filter(r => r.mandatory).slice(0, 4).map((req, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {req.description}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  A Gerar Estratégia...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Gerar Estratégia de Sourcing
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {showResults && (
        <Tabs defaultValue="boolean" className="space-y-4">
          <TabsList>
            <TabsTrigger value="boolean">Boolean Searches</TabsTrigger>
            <TabsTrigger value="companies">Empresas-Alvo</TabsTrigger>
            <TabsTrigger value="titles">Títulos Equivalentes</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>

          {/* Boolean Searches */}
          <TabsContent value="boolean" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Boolean Searches Otimizadas
                </CardTitle>
                <CardDescription>
                  Pesquisas booleanas geradas automaticamente para LinkedIn Recruiter e outras plataformas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedSearches.map((search) => (
                  <Card key={search.id} className="border-border/50 bg-muted/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1">
                            <Linkedin className="w-3 h-3" />
                            {search.platform}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700">
                            {search.confidence}% confiança
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            ~{search.expectedResults} resultados esperados
                          </span>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Copy className="w-4 h-4" />
                            Copiar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-background rounded-md border font-mono text-sm overflow-x-auto">
                        {search.query}
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="w-4 h-4 mt-0.5 text-amber-500" />
                        <span>{search.explanation}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="w-4 h-4" />
                          Abrir no LinkedIn
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <RefreshCw className="w-4 h-4" />
                          Gerar Variação
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Target Companies */}
          <TabsContent value="companies" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Empresas-Alvo Recomendadas
                </CardTitle>
                <CardDescription>
                  Empresas identificadas como potenciais fontes de talento relevante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedCompanies.map((company, i) => (
                    <Card key={i} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {company.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{company.name}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    company.priority === "high" 
                                      ? "border-green-300 text-green-600" 
                                      : "border-amber-300 text-amber-600"
                                  }
                                >
                                  {company.priority === "high" ? "Alta Prioridade" : "Média Prioridade"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{company.reason}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {company.roles.map((role, j) => (
                                  <Badge key={j} variant="secondary" className="text-xs">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Linkedin className="w-4 h-4" />
                              Ver no LinkedIn
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Search className="w-4 h-4" />
                              Pesquisar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equivalent Titles */}
          <TabsContent value="titles" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Títulos Equivalentes
                </CardTitle>
                <CardDescription>
                  Variações de títulos para expandir a pesquisa e capturar mais candidatos relevantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {equivalentTitles.map((title, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="text-sm py-2 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {title}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Por Idioma</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Português</p>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="text-xs">Diretor Financeiro</Badge>
                          <Badge variant="secondary" className="text-xs">VP Finanças</Badge>
                          <Badge variant="secondary" className="text-xs">Responsável Financeiro</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Espanhol</p>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="text-xs">Director Financiero</Badge>
                          <Badge variant="secondary" className="text-xs">VP Finanzas</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Francês</p>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary" className="text-xs">Directeur Financier</Badge>
                          <Badge variant="secondary" className="text-xs">DAF</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Copy className="w-4 h-4" />
                      Copiar Todos
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Wand2 className="w-4 h-4" />
                      Gerar Mais Variações
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Recommendations */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Recomendações AI
                </CardTitle>
                <CardDescription>
                  Insights e sugestões inteligentes para otimizar a sua estratégia de sourcing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiRecommendations.map((rec, i) => (
                  <Card key={i} className="border-border/50 bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          rec.type === "company" ? "bg-blue-100 text-blue-600" :
                          rec.type === "title" ? "bg-purple-100 text-purple-600" :
                          rec.type === "strategy" ? "bg-green-100 text-green-600" :
                          "bg-amber-100 text-amber-600"
                        }`}>
                          {rec.type === "company" && <Building2 className="w-5 h-5" />}
                          {rec.type === "title" && <FileText className="w-5 h-5" />}
                          {rec.type === "strategy" && <Target className="w-5 h-5" />}
                          {rec.type === "geography" && <Globe className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{rec.suggestion}</h4>
                            <Badge variant="outline">{rec.confidence}% confiança</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{rec.reasoning}</p>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              Aplicar
                            </Button>
                            <Button variant="ghost" size="sm">
                              Ignorar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Sourcing Strategy Summary */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Resumo da Estratégia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">355</p>
                    <p className="text-sm text-muted-foreground">Candidatos Potenciais</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">6</p>
                    <p className="text-sm text-muted-foreground">Empresas-Alvo</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">9</p>
                    <p className="text-sm text-muted-foreground">Títulos Mapeados</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">3</p>
                    <p className="text-sm text-muted-foreground">Boolean Searches</p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button className="gap-2">
                    <Play className="w-4 h-4" />
                    Iniciar Sourcing Automático
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Exportar Estratégia
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
