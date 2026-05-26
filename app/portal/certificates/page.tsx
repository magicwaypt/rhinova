"use client"

import { useState } from "react"
import {
  Award,
  Download,
  Share2,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const certificates = [
  {
    id: 1,
    title: "Segurança no Trabalho - Básico",
    issueDate: "20 Mar 2026",
    expiryDate: "20 Mar 2027",
    status: "valid",
    credentialId: "RHINO-SST-2026-00142",
    hours: 6,
    instructor: "Dr. Manuel Costa",
    organization: "RHINOVA Academy",
  },
  {
    id: 2,
    title: "RGPD e Proteção de Dados",
    issueDate: "15 Fev 2026",
    expiryDate: "15 Fev 2028",
    status: "valid",
    credentialId: "RHINO-RGPD-2026-00089",
    hours: 4,
    instructor: "Dr. Pedro Almeida",
    organization: "RHINOVA Academy",
  },
  {
    id: 3,
    title: "Excel Intermédio",
    issueDate: "10 Jan 2026",
    expiryDate: "10 Jan 2029",
    status: "valid",
    credentialId: "RHINO-EXC-2026-00201",
    hours: 12,
    instructor: "Eng. Ana Rodrigues",
    organization: "RHINOVA Academy",
  },
  {
    id: 4,
    title: "Higiene Alimentar",
    issueDate: "05 Jun 2025",
    expiryDate: "05 Jun 2026",
    status: "expiring",
    credentialId: "RHINO-HIG-2025-00056",
    hours: 8,
    instructor: "Dra. Maria Fernandes",
    organization: "RHINOVA Academy",
  },
  {
    id: 5,
    title: "Prevenção de Incêndios",
    issueDate: "15 Jan 2024",
    expiryDate: "15 Jan 2025",
    status: "expired",
    credentialId: "RHINO-INC-2024-00033",
    hours: 4,
    instructor: "Eng. Carlos Silva",
    organization: "RHINOVA Academy",
  },
]

const pendingCertificates = [
  {
    id: 101,
    title: "Segurança no Trabalho - Módulo Avançado",
    progress: 75,
    estimatedCompletion: "15 Abr 2026",
  },
  {
    id: 102,
    title: "Excel Avançado para Análise de Dados",
    progress: 45,
    estimatedCompletion: "30 Abr 2026",
  },
]

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const validCertificates = certificates.filter((c) => c.status === "valid")
  const expiringCertificates = certificates.filter((c) => c.status === "expiring")
  const expiredCertificates = certificates.filter((c) => c.status === "expired")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Válido
          </Badge>
        )
      case "expiring":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
            <AlertCircle className="mr-1 h-3 w-3" />
            A Expirar
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Expirado
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meus Certificados</h1>
        <p className="mt-1 text-muted-foreground">
          Consulta e descarrega os teus certificados de formação
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {certificates.length}
                </p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {validCertificates.length}
                </p>
                <p className="text-sm text-muted-foreground">Válidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2.5">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {expiringCertificates.length}
                </p>
                <p className="text-sm text-muted-foreground">A Expirar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-500/10 p-2.5">
                <Clock className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {pendingCertificates.length}
                </p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar certificados..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({certificates.length})
          </TabsTrigger>
          <TabsTrigger value="valid">
            Válidos ({validCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="expiring">
            A Expirar ({expiringCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes ({pendingCertificates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              className={`border-border/50 bg-card/50 transition-all hover:border-primary/30 ${
                cert.status === "expired" ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl p-3 ${
                      cert.status === "valid"
                        ? "bg-amber-500/10"
                        : cert.status === "expiring"
                        ? "bg-amber-500/10"
                        : "bg-muted"
                    }`}>
                      <Award className={`h-8 w-8 ${
                        cert.status === "valid"
                          ? "text-amber-500"
                          : cert.status === "expiring"
                          ? "text-amber-500"
                          : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {cert.title}
                        </h3>
                        {getStatusBadge(cert.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Credencial: {cert.credentialId}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Emitido: {cert.issueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Expira: {cert.expiryDate}
                        </span>
                        <span>{cert.hours}h de formação</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Verificar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Partilhar
                    </Button>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="valid" className="space-y-4">
          {validCertificates.map((cert) => (
            <Card
              key={cert.id}
              className="border-border/50 bg-card/50 transition-all hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-amber-500/10 p-3">
                      <Award className="h-8 w-8 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {cert.title}
                        </h3>
                        {getStatusBadge(cert.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Credencial: {cert.credentialId}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>Válido até {cert.expiryDate}</span>
                        <span>{cert.hours}h de formação</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Partilhar
                    </Button>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          {expiringCertificates.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <h3 className="mt-4 font-semibold text-foreground">
                  Tudo em ordem!
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Não tens certificados a expirar brevemente.
                </p>
              </CardContent>
            </Card>
          ) : (
            expiringCertificates.map((cert) => (
              <Card
                key={cert.id}
                className="border-amber-500/30 bg-card/50 transition-all hover:border-amber-500/50"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-amber-500/10 p-3">
                        <AlertCircle className="h-8 w-8 text-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {cert.title}
                          </h3>
                          {getStatusBadge(cert.status)}
                        </div>
                        <p className="text-sm text-amber-500">
                          Este certificado expira em breve. Renova a tua formação.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expira: {cert.expiryDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button>Renovar Formação</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingCertificates.map((cert) => (
            <Card
              key={cert.id}
              className="border-border/50 bg-card/50 transition-all hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Conclusão estimada: {cert.estimatedCompletion}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${cert.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {cert.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button>Continuar Formação</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
