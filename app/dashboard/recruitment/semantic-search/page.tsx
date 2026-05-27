"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Sparkles, 
  Target, 
  Building2,
  MapPin,
  Briefcase,
  ArrowRight,
  History,
  Clock,
  Star,
  Filter,
  X,
  ChevronRight,
  Lightbulb,
  Users
} from "lucide-react"
import { candidateProfiles, semanticSearchExamples } from "@/lib/recruitment-data"

const exampleQueries = [
  "Executivos com experiência em expansão internacional SaaS",
  "Perfis semelhantes a CTO com background em microserviços",
  "Liderança comercial em fintech B2B",
  "CFOs que lideraram IPO nos últimos 5 anos",
  "Product Managers com experiência em growth",
  "Senior Engineers que trabalharam em unicorns portugueses",
  "Marketing Directors com foco em B2B enterprise",
  "Head of People com experiência em scale-ups",
]

const recentSearches = [
  { query: "CFO IPO experience tech Portugal", results: 12, date: "há 2h" },
  { query: "Senior React Engineer cloud-native", results: 45, date: "há 5h" },
  { query: "Sales Director B2B SaaS Iberia", results: 28, date: "ontem" },
]

const savedSearches = [
  { name: "C-Level Finance Pool", query: "CFO OR VP Finance tech startup Portugal", results: 35 },
  { name: "Senior Tech Talent", query: "Senior Engineer scale-up OR unicorn React Node", results: 89 },
]

export default function SemanticSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof semanticSearchExamples[0] | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    
    setTimeout(() => {
      // Find matching example or use first one
      const matchingExample = semanticSearchExamples.find(s => 
        searchQuery.toLowerCase().includes("executivo") || 
        searchQuery.toLowerCase().includes("cto") ||
        searchQuery.toLowerCase().includes("cfo")
      ) || semanticSearchExamples[0]
      
      setSearchResults({
        ...matchingExample,
        query: searchQuery,
      })
      setIsSearching(false)
    }, 1500)
  }

  const handleExampleClick = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    
    setTimeout(() => {
      const matchingExample = semanticSearchExamples[0]
      setSearchResults({
        ...matchingExample,
        query: query,
      })
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Search className="w-7 h-7 text-primary" />
            Semantic Talent Search
          </h1>
          <p className="text-muted-foreground">Pesquisa avançada baseada em contexto e significado</p>
        </div>
      </div>

      {/* Search Box */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Descreva o perfil que procura em linguagem natural..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch()
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <Button onClick={handleSearch} disabled={isSearching} className="h-12 px-6 gap-2">
                {isSearching ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    A Pesquisar...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Pesquisar com AI
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* AI Hint */}
            <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Dica AI:</span> A pesquisa semântica compreende o significado da sua query. 
                Experimente pesquisas como {'"'}executivos com experiência em expansão internacional{'"'} ou {'"'}perfis semelhantes a este CTO{'"'}.
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <h4 className="font-medium text-sm">Filtros Adicionais</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Localização</label>
                    <Input placeholder="Ex: Portugal, Remoto" className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Experiência Min.</label>
                    <Input placeholder="Ex: 5 anos" className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Indústria</label>
                    <Input placeholder="Ex: Tech, Fintech" className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Fonte</label>
                    <Input placeholder="Ex: LinkedIn, Talent Pool" className="h-9" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* No Results Yet - Show Examples */}
      {!searchResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Example Queries */}
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Exemplos de Pesquisa Semântica
              </CardTitle>
              <CardDescription>
                Clique num exemplo para ver como funciona a pesquisa por contexto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exampleQueries.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(query)}
                    className="text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{query}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent & Saved Searches */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Pesquisas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(search.query)}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate flex-1">{search.query}</span>
                        <span className="text-xs text-muted-foreground ml-2">{search.date}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{search.results} resultados</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Pesquisas Guardadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(search.query)}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="font-medium text-sm">{search.name}</div>
                      <div className="text-xs text-muted-foreground">{search.results} candidatos</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Query Interpretation */}
          <Card className="border-border/50 border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Interpretação AI</h4>
                  <p className="text-sm text-muted-foreground mt-1">{searchResults.interpretation}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {searchResults.extractedEntities.map((entity, i) => (
                      <Badge 
                        key={i} 
                        variant="outline"
                        className="bg-background"
                      >
                        <span className="text-muted-foreground text-xs mr-1">{entity.type}:</span>
                        {entity.value}
                        <span className="text-xs text-muted-foreground ml-1">({entity.confidence}%)</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                {searchResults.totalResults} Candidatos Encontrados
              </h3>
              <Badge variant="outline">Ordenado por Relevância</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-1" />
                Guardar Pesquisa
              </Button>
              <Button variant="outline" size="sm">
                Exportar
              </Button>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {searchResults.results.map((result, i) => {
              const candidate = candidateProfiles.find(c => c.id === result.candidateId)
              
              return (
                <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                          {result.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              {result.candidateName}
                              {candidate?.starred && (
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              )}
                            </h4>
                            <p className="text-muted-foreground">
                              {result.currentRole} @ {result.currentCompany}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Target className="w-5 h-5 text-primary" />
                              <span className="text-2xl font-bold text-primary">{result.matchScore}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Match Score</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                          {candidate && (
                            <>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {candidate.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {candidate.yearsExperience} anos experiência
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {candidate.experience[0]?.companyType}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Match Reasons */}
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-2">Motivos do Match:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.matchReasons.map((reason, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Highlights */}
                        {result.highlights.length > 0 && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Destaque:</p>
                            {result.highlights.map((highlight, j) => (
                              <p key={j} className="text-sm">
                                <span className="font-medium">{highlight.field}:</span>{' '}
                                <span dangerouslySetInnerHTML={{
                                  __html: highlight.content.replace(
                                    new RegExp(`(${highlight.matchedTerms.join('|')})`, 'gi'),
                                    '<mark class="bg-primary/20 px-0.5 rounded">$1</mark>'
                                  )
                                }} />
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="gap-1">
                            Ver Perfil Completo
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Adicionar a Vaga
                          </Button>
                          <Button variant="ghost" size="sm">
                            Contactar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Similar Profiles Suggestion */}
          <Card className="border-border/50 border-dashed">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <h4 className="font-medium mb-2">Encontrar Perfis Semelhantes</h4>
              <p className="text-sm text-muted-foreground mb-4">
                A AI pode encontrar candidatos com perfis semelhantes aos resultados apresentados
              </p>
              <Button variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Expandir Pesquisa com AI
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
