"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Search,
  Upload,
  FolderPlus,
  MoreHorizontal,
  FileText,
  FileSpreadsheet,
  FileImage,
  Film,
  File,
  Download,
  Eye,
  Trash2,
  Share2,
  FolderOpen,
  Clock,
  Grid3X3,
  List,
  Star,
  StarOff,
  Link2,
  Users,
  Lock,
  GraduationCap,
  Award,
  BookOpen,
  FileCheck
} from "lucide-react"

// Mock documents data
const documents = [
  {
    id: '1',
    name: 'Manual de Seguranca no Trabalho 2025.pdf',
    type: 'pdf',
    category: 'materiais',
    training: 'Seguranca no Trabalho',
    size: '2.4 MB',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date('2025-03-15'),
    shared: true,
    starred: true,
    downloads: 156
  },
  {
    id: '2',
    name: 'Apresentacao RGPD.pptx',
    type: 'presentation',
    category: 'materiais',
    training: 'RGPD e Protecao de Dados',
    size: '5.8 MB',
    uploadedBy: 'Ana Costa',
    uploadedAt: new Date('2025-03-10'),
    shared: true,
    starred: false,
    downloads: 89
  },
  {
    id: '3',
    name: 'Template Certificado Formacao.docx',
    type: 'document',
    category: 'templates',
    training: null,
    size: '156 KB',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date('2025-02-20'),
    shared: false,
    starred: true,
    downloads: 234
  },
  {
    id: '4',
    name: 'Video Introducao Lideranca.mp4',
    type: 'video',
    category: 'materiais',
    training: 'Lideranca e Gestao de Equipas',
    size: '128 MB',
    uploadedBy: 'Pedro Ferreira',
    uploadedAt: new Date('2025-03-05'),
    shared: true,
    starred: false,
    downloads: 67
  },
  {
    id: '5',
    name: 'Checklist Onboarding.xlsx',
    type: 'spreadsheet',
    category: 'templates',
    training: null,
    size: '45 KB',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date('2025-01-15'),
    shared: true,
    starred: false,
    downloads: 312
  },
  {
    id: '6',
    name: 'Politica de Formacao 2025.pdf',
    type: 'pdf',
    category: 'politicas',
    training: null,
    size: '890 KB',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date('2025-01-10'),
    shared: true,
    starred: true,
    downloads: 445
  },
  {
    id: '7',
    name: 'Exercicios Praticos Excel.xlsx',
    type: 'spreadsheet',
    category: 'materiais',
    training: 'Excel Avancado para Analise de Dados',
    size: '1.2 MB',
    uploadedBy: 'Teresa Dias',
    uploadedAt: new Date('2025-03-18'),
    shared: true,
    starred: false,
    downloads: 78
  },
  {
    id: '8',
    name: 'Infografico Ciberseguranca.png',
    type: 'image',
    category: 'materiais',
    training: 'Ciberseguranca Basica',
    size: '2.1 MB',
    uploadedBy: 'Bruno Lopes',
    uploadedAt: new Date('2025-03-20'),
    shared: true,
    starred: false,
    downloads: 123
  },
  {
    id: '9',
    name: 'Modelo Avaliacao Formacao.docx',
    type: 'document',
    category: 'templates',
    training: null,
    size: '78 KB',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date('2025-02-28'),
    shared: false,
    starred: false,
    downloads: 189
  },
  {
    id: '10',
    name: 'Regulamento Interno Formacao.pdf',
    type: 'pdf',
    category: 'politicas',
    training: null,
    size: '1.5 MB',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date('2025-01-05'),
    shared: true,
    starred: false,
    downloads: 267
  },
]

const folders = [
  { id: '1', name: 'Materiais de Formacao', icon: BookOpen, count: 12, color: 'primary' },
  { id: '2', name: 'Templates', icon: FileCheck, count: 8, color: 'accent' },
  { id: '3', name: 'Certificados', icon: Award, count: 156, color: 'success' },
  { id: '4', name: 'Politicas e Regulamentos', icon: Lock, count: 5, color: 'warning' },
]

const categories = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'materiais', label: 'Materiais de Formacao' },
  { value: 'templates', label: 'Templates' },
  { value: 'politicas', label: 'Politicas' },
  { value: 'certificados', label: 'Certificados' },
]

const fileTypes = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'pdf', label: 'PDF' },
  { value: 'document', label: 'Documentos' },
  { value: 'spreadsheet', label: 'Folhas de Calculo' },
  { value: 'presentation', label: 'Apresentacoes' },
  { value: 'image', label: 'Imagens' },
  { value: 'video', label: 'Videos' },
]

function getFileIcon(type: string) {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-destructive" />
    case 'document':
      return <FileText className="w-5 h-5 text-primary" />
    case 'spreadsheet':
      return <FileSpreadsheet className="w-5 h-5 text-accent" />
    case 'presentation':
      return <FileText className="w-5 h-5 text-warning" />
    case 'image':
      return <FileImage className="w-5 h-5 text-purple-500" />
    case 'video':
      return <Film className="w-5 h-5 text-pink-500" />
    default:
      return <File className="w-5 h-5 text-muted-foreground" />
  }
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [fileType, setFileType] = useState("all")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [starredDocs, setStarredDocs] = useState<string[]>(
    documents.filter(d => d.starred).map(d => d.id)
  )

  const toggleStar = (id: string) => {
    setStarredDocs(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
      (doc.training && doc.training.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = category === 'all' || doc.category === category
    const matchesType = fileType === 'all' || doc.type === fileType
    return matchesSearch && matchesCategory && matchesType
  })

  const stats = {
    total: documents.length,
    materiais: documents.filter(d => d.category === 'materiais').length,
    templates: documents.filter(d => d.category === 'templates').length,
    totalDownloads: documents.reduce((acc, d) => acc + d.downloads, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Documentos</h1>
          <p className="text-muted-foreground">
            Gerir materiais de formacao, templates e documentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FolderPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Pasta</span>
          </Button>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload de Documentos</DialogTitle>
                <DialogDescription>
                  Carregue materiais de formacao, templates ou outros documentos.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                {/* Drag & Drop Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">Arraste ficheiros ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground">
                    PDF, Word, Excel, PowerPoint, imagens e videos ate 100MB
                  </p>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select defaultValue="materiais">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="materiais">Materiais de Formacao</SelectItem>
                      <SelectItem value="templates">Templates</SelectItem>
                      <SelectItem value="politicas">Politicas e Regulamentos</SelectItem>
                      <SelectItem value="certificados">Certificados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Training Association */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Associar a Formacao (opcional)</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar formacao..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seg">Seguranca no Trabalho</SelectItem>
                      <SelectItem value="rgpd">RGPD e Protecao de Dados</SelectItem>
                      <SelectItem value="lid">Lideranca e Gestao de Equipas</SelectItem>
                      <SelectItem value="excel">Excel Avancado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sharing Options */}
                <div className="p-3 rounded-lg bg-muted/50 border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Partilhar com todos</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Documentos partilhados ficam visiveis para todos os colaboradores no portal.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="gap-2" disabled>
                  <Upload className="w-4 h-4" />
                  Carregar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total de Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.materiais}</p>
                <p className="text-xs text-muted-foreground">Materiais de Formacao</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.templates}</p>
                <p className="text-xs text-muted-foreground">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalDownloads.toLocaleString('pt-PT')}</p>
                <p className="text-xs text-muted-foreground">Downloads Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Folders */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Acesso Rapido</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <Card 
              key={folder.id} 
              className="cursor-pointer hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${folder.color}/10 flex items-center justify-center`}>
                    <folder.icon className={`w-5 h-5 text-${folder.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">{folder.count} ficheiros</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="starred">Favoritos</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
            <TabsTrigger value="shared">Partilhados</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar documentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fileTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="mt-0">
          {viewMode === 'list' ? (
            <Card>
              <div className="divide-y divide-border">
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{doc.name}</p>
                        {starredDocs.includes(doc.id) && (
                          <Star className="w-4 h-4 text-warning fill-warning shrink-0" />
                        )}
                        {doc.shared && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            Partilhado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {doc.training && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {doc.training}
                          </span>
                        )}
                        <span>{doc.size}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {doc.uploadedAt.toLocaleDateString('pt-PT')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {doc.downloads}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleStar(doc.id)}
                      >
                        {starredDocs.includes(doc.id) ? (
                          <Star className="w-4 h-4 text-warning fill-warning" />
                        ) : (
                          <StarOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Partilhar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link2 className="w-4 h-4 mr-2" />
                            Copiar Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {filteredDocs.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum documento encontrado.</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        {getFileIcon(doc.type)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-1 -mr-1"
                        onClick={() => toggleStar(doc.id)}
                      >
                        {starredDocs.includes(doc.id) ? (
                          <Star className="w-4 h-4 text-warning fill-warning" />
                        ) : (
                          <StarOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <h3 className="font-medium text-sm truncate mb-1">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{doc.size}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {doc.uploadedAt.toLocaleDateString('pt-PT')}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="starred" className="mt-0">
          <Card>
            <div className="divide-y divide-border">
              {filteredDocs.filter(d => starredDocs.includes(d.id)).map((doc) => (
                <div 
                  key={doc.id}
                  className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{doc.name}</p>
                      <Star className="w-4 h-4 text-warning fill-warning shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.size} - {doc.uploadedAt.toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {filteredDocs.filter(d => starredDocs.includes(d.id)).length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum documento favorito.</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <Card>
            <div className="divide-y divide-border">
              {filteredDocs
                .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
                .slice(0, 10)
                .map((doc) => (
                <div 
                  key={doc.id}
                  className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Carregado por {doc.uploadedBy} - {doc.uploadedAt.toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="mt-0">
          <Card>
            <div className="divide-y divide-border">
              {filteredDocs.filter(d => d.shared).map((doc) => (
                <div 
                  key={doc.id}
                  className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{doc.name}</p>
                      <Badge variant="secondary" className="text-xs">Partilhado</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.downloads} downloads - {doc.uploadedAt.toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Link2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
