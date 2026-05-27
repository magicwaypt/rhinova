"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Brain, 
  Sparkles, 
  Target, 
  Building2,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Star,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Languages,
  Award,
  Users,
  Shield,
  Zap,
  ChevronRight,
  Eye,
  RefreshCw,
  Download,
  Share2,
  Clock,
  BarChart3
} from "lucide-react"
import { candidateProfiles, jobPositions } from "@/lib/recruitment-data"

export default function CandidateIntelligencePage() {
  const [selectedCandidate, setSelectedCandidate] = useState(candidateProfiles[0])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleReanalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 2000)
  }

  const analysis = selectedCandidate.aiAnalysis

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            AI Candidate Intelligence
          </h1>
          <p className="text-muted-foreground">Análise inteligente e contextual de candidatos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReanalyze} disabled={isAnalyzing} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'A Analisar...' : 'Re-analisar'}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Candidate List */}
        <Card className="border-border/50 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Candidatos</CardTitle>
            <Input placeholder="Pesquisar candidatos..." className="mt-2" />
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-1 p-2">
                {candidateProfiles.map((candidate) => (
                  <button
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCandidate.id === candidate.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`${
                          selectedCandidate.id === candidate.id 
                            ? 'bg-primary-foreground/20 text-primary-foreground' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{candidate.name}</p>
                        <p className={`text-xs truncate ${
                          selectedCandidate.id === candidate.id 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {candidate.currentRole}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 ${
                          selectedCandidate.id === candidate.id 
                            ? 'text-primary-foreground' 
                            : 'text-primary'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          <span className="text-sm font-medium">{candidate.aiScore}%</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Analysis */}
        <div className="lg:col-span-3 space-y-6">
          {/* Candidate Header */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {selectedCandidate.name}
                        {selectedCandidate.starred && <Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedCandidate.currentRole} @ {selectedCandidate.currentCompany}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-3xl font-bold text-primary">{selectedCandidate.aiScore}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">AI Match Score</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedCandidate.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {selectedCandidate.yearsExperience} anos experiência
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Atualizado {analysis?.generatedAt ? new Date(analysis.generatedAt).toLocaleDateString('pt-PT') : 'N/A'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedCandidate.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Resumo AI</TabsTrigger>
              <TabsTrigger value="strengths">Strengths & Gaps</TabsTrigger>
              <TabsTrigger value="experience">Experiência</TabsTrigger>
              <TabsTrigger value="cultural">Cultural Fit</TabsTrigger>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Resumo Executivo AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">{analysis?.summary}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Senioridade</p>
                      <p className="font-semibold capitalize">{analysis?.seniorityLevel}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Trajetória</p>
                      <div className="flex items-center justify-center gap-1">
                        {analysis?.careerTrajectory === 'ascending' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {analysis?.careerTrajectory === 'stable' && <BarChart3 className="w-4 h-4 text-blue-600" />}
                        {analysis?.careerTrajectory === 'declining' && <TrendingDown className="w-4 h-4 text-red-600" />}
                        <span className="font-semibold capitalize">{analysis?.careerTrajectory}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Valor Mercado</p>
                      <p className="font-semibold capitalize">{analysis?.marketValue}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Especializações</p>
                      <p className="font-semibold">{analysis?.specializations.length}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Especializações Identificadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis?.specializations.map((spec, i) => (
                        <Badge key={i} className="bg-primary/10 text-primary hover:bg-primary/20">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recomendações AI</h4>
                    <ul className="space-y-2">
                      {analysis?.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Match Scores */}
              {analysis?.matchScores && analysis.matchScores.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Match com Vagas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.matchScores.map((match, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{match.jobTitle}</h4>
                            <div className="flex items-center gap-2">
                              <Progress value={match.score} className="w-24 h-2" />
                              <span className="font-bold text-primary">{match.score}%</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {match.matchedCriteria.map((crit, j) => (
                              <Badge key={j} variant="outline" className="text-xs border-green-300 text-green-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {crit}
                              </Badge>
                            ))}
                            {match.missingCriteria.map((crit, j) => (
                              <Badge key={j} variant="outline" className="text-xs border-amber-300 text-amber-600">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {crit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Strengths & Gaps Tab */}
            <TabsContent value="strengths" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis?.strengths.map((strength, i) => (
                      <div key={i} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-green-800">{strength.category}</h4>
                          <Badge className="bg-green-100 text-green-700">{strength.confidence}% conf.</Badge>
                        </div>
                        <p className="text-sm text-green-700 mb-2">{strength.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {strength.evidence.map((ev, j) => (
                            <Badge key={j} variant="outline" className="text-xs border-green-300 text-green-600">
                              {ev}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Gaps */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="w-5 h-5" />
                      Áreas de Desenvolvimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis?.gaps && analysis.gaps.length > 0 ? (
                      analysis.gaps.map((gap, i) => (
                        <div key={i} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-amber-800">{gap.category}</h4>
                            <Badge className="bg-amber-100 text-amber-700">{gap.confidence}% conf.</Badge>
                          </div>
                          <p className="text-sm text-amber-700 mb-2">{gap.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {gap.evidence.map((ev, j) => (
                              <Badge key={j} variant="outline" className="text-xs border-amber-300 text-amber-600">
                                {ev}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-500" />
                        <p>Não foram identificadas gaps significativas</p>
                      </div>
                    )}

                    {/* Risk Signals */}
                    {analysis?.riskSignals && analysis.riskSignals.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2 text-red-600">
                          <Shield className="w-4 h-4" />
                          Sinais de Risco
                        </h4>
                        {analysis.riskSignals.map((risk, i) => (
                          <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-lg mb-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-700">{risk.description}</span>
                              <Badge className={`${
                                risk.severity === 'high' ? 'bg-red-100 text-red-700' :
                                risk.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {risk.severity}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Histórico Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedCandidate.experience.map((exp, i) => (
                      <div key={exp.id} className="relative pl-8 pb-6 last:pb-0">
                        {/* Timeline line */}
                        {i < selectedCandidate.experience.length - 1 && (
                          <div className="absolute left-3 top-3 w-0.5 h-full bg-border" />
                        )}
                        {/* Timeline dot */}
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          exp.isCurrent ? 'bg-primary' : 'bg-muted border-2 border-border'
                        }`}>
                          <Briefcase className={`w-3 h-3 ${exp.isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground">{exp.role}</h4>
                              <p className="text-sm text-muted-foreground">{exp.company}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={exp.isCurrent ? "default" : "outline"}>
                                {exp.isCurrent ? 'Atual' : `${new Date(exp.startDate).getFullYear()} - ${exp.endDate ? new Date(exp.endDate).getFullYear() : ''}`}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">{exp.location}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              <Building2 className="w-3 h-3 mr-1" />
                              {exp.companyType}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {exp.industry}
                            </Badge>
                            {exp.companySize && (
                              <Badge variant="secondary" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {exp.companySize}
                              </Badge>
                            )}
                          </div>
                          
                          {exp.achievements.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-2">Conquistas:</p>
                              <ul className="space-y-1">
                                {exp.achievements.map((ach, j) => (
                                  <li key={j} className="flex items-start gap-2 text-sm">
                                    <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                    <span>{ach}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Competências
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCandidate.skills.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{skill.name}</span>
                            {skill.verified && (
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">{skill.level}</Badge>
                            {skill.yearsExperience && (
                              <span className="text-xs text-muted-foreground">{skill.yearsExperience} anos</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Formação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCandidate.education.map((edu, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium">{edu.degree} em {edu.field}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Presente'}
                            {edu.grade && ` | ${edu.grade}`}
                          </p>
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Languages className="w-4 h-4" />
                          Idiomas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.languages.map((lang, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {lang.name} - {lang.level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Cultural Fit Tab */}
            <TabsContent value="cultural" className="space-y-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Indicadores de Fit Cultural
                  </CardTitle>
                  <CardDescription>
                    Análise de compatibilidade com a cultura organizacional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis?.culturalFitIndicators.map((indicator, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{indicator.dimension}</h4>
                          <span className={`text-lg font-bold ${
                            indicator.score >= 90 ? 'text-green-600' :
                            indicator.score >= 75 ? 'text-blue-600' :
                            indicator.score >= 60 ? 'text-amber-600' :
                            'text-red-600'
                          }`}>
                            {indicator.score}%
                          </span>
                        </div>
                        <Progress value={indicator.score} className="h-2 mb-3" />
                        <div className="flex flex-wrap gap-1.5">
                          {indicator.indicators.map((ind, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">{ind}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scorecard Tab */}
            <TabsContent value="scorecard" className="space-y-4">
              {selectedCandidate.scorecards.length > 0 ? (
                selectedCandidate.scorecards.map((scorecard) => (
                  <Card key={scorecard.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Scorecard de Avaliação
                          </CardTitle>
                          <CardDescription>
                            Por {scorecard.evaluatorName} em {new Date(scorecard.createdAt).toLocaleDateString('pt-PT')}
                          </CardDescription>
                        </div>
                        <Badge className={`${
                          scorecard.recommendation === 'strong_hire' ? 'bg-green-100 text-green-700' :
                          scorecard.recommendation === 'hire' ? 'bg-blue-100 text-blue-700' :
                          scorecard.recommendation === 'maybe' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {scorecard.recommendation === 'strong_hire' ? 'Forte Hire' :
                           scorecard.recommendation === 'hire' ? 'Hire' :
                           scorecard.recommendation === 'maybe' ? 'Talvez' :
                           'No Hire'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-primary">{scorecard.overallScore.toFixed(1)}</p>
                          <p className="text-sm text-muted-foreground">Score Global (1-5)</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {scorecard.criteria.map((crit, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <p className="font-medium">{crit.name}</p>
                              {crit.notes && <p className="text-sm text-muted-foreground">{crit.notes}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{crit.score}/5</p>
                              <p className="text-xs text-muted-foreground">{crit.weight}% peso</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {scorecard.notes && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-2">Notas Adicionais</p>
                          <p className="text-sm text-muted-foreground">{scorecard.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Sem Scorecards</h3>
                    <p className="text-muted-foreground mb-4">Este candidato ainda não tem avaliações formais</p>
                    <Button className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Gerar Scorecard AI
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
