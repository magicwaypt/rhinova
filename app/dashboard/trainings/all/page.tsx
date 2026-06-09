"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, CalendarDays, ClipboardList, Copy, Eye, Filter, Plus, Search, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import {
  getRuLabel,
  trainingFormatLabels,
  trainingStatusLabels,
  useTrainingWorkspace,
} from "@/lib/training-platform"

type StatusFilter = "all" | "scheduled" | "in_progress" | "completed" | "cancelled"
type FormatFilter = "all" | "presencial" | "online" | "hibrido"

const quickStatusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "Criadas", value: "all" },
  { label: "Agendadas", value: "scheduled" },
  { label: "Em curso", value: "in_progress" },
  { label: "Concluidas", value: "completed" },
]

function formatDateRange(startDate: Date, endDate: Date) {
  const start = startDate.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })
  const end = endDate.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })
  return start === end ? start : `${start} - ${end}`
}

function summarizeSkills(skills: string[]) {
  if (skills.length === 0) return "Sem skills"
  if (skills.length <= 2) return skills.join(" · ")
  return `${skills.slice(0, 2).join(" · ")} +${skills.length - 2}`
}

export default function TrainingsAllPage() {
  const router = useRouter()
  const { state, isReady, duplicateTraining } = useTrainingWorkspace()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const handleDuplicate = (trainingId: string) => {
    const duplicatedTraining = duplicateTraining(trainingId)
    if (!duplicatedTraining) {
      toast.error("Nao foi possivel duplicar a formacao.")
      return
    }

    toast.success("Formacao duplicada com sucesso.")
    router.push(`/dashboard/trainings/${duplicatedTraining.id}/edit`)
  }

  const departmentOptions = useMemo(
    () =>
      Array.from(
        new Set(
          state.trainings.flatMap((training) =>
            training.targetDepartments?.length
              ? training.targetDepartments
              : training.department
                ? [training.department]
                : [],
          ),
        ),
      ).sort((left, right) => left.localeCompare(right, "pt")),
    [state.trainings],
  )

  const filteredTrainings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return [...state.trainings]
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .filter((training) => {
        const departmentLabel = training.targetDepartments?.length
          ? training.targetDepartments.join(", ")
          : training.department || ""
        const providerLabel = training.trainingProviderName || getRuLabel("T34", training.trainingEntityCode)

        const matchesSearch =
          !normalizedSearch ||
          [
            training.title,
            training.description,
            training.instructor,
            training.location,
            departmentLabel,
            providerLabel,
            ...training.skills,
          ]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(normalizedSearch))

        const matchesStatus = statusFilter === "all" || training.status === statusFilter
        const matchesFormat = formatFilter === "all" || training.format === formatFilter
        const matchesDepartment =
          departmentFilter === "all" ||
          training.department === departmentFilter ||
          training.targetDepartments?.includes(departmentFilter)

        return matchesSearch && matchesStatus && matchesFormat && matchesDepartment
      })
  }, [departmentFilter, formatFilter, search, state.trainings, statusFilter])

  const statusCounts = useMemo(
    () => ({
      all: state.trainings.length,
      scheduled: state.trainings.filter((training) => training.status === "scheduled").length,
      in_progress: state.trainings.filter((training) => training.status === "in_progress").length,
      completed: state.trainings.filter((training) => training.status === "completed").length,
    }),
    [state.trainings],
  )

  if (!isReady) {
    return <div className="h-[520px] animate-pulse rounded-3xl bg-muted" />
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none bg-mesh-brand text-white shadow-soft-lg">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="space-y-4">
            <Badge className="w-fit border border-white/25 bg-white/15 text-white hover:bg-white/20">Vista operacional</Badge>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Todas as formacoes numa tabela filtravel.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Veja rapidamente o que foi criado, o que esta agendado e o que ja ficou concluido sem sair do modulo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-white text-primary shadow-soft hover:bg-white/90">
                <Link href="/dashboard/trainings/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova formacao
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/dashboard/calendar">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Abrir calendario
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryMetric label="Criadas" value={String(statusCounts.all)} icon={ClipboardList} />
            <SummaryMetric label="Agendadas" value={String(statusCounts.scheduled)} icon={CalendarDays} />
            <SummaryMetric label="Em curso" value={String(statusCounts.in_progress)} icon={BookOpen} />
            <SummaryMetric label="Concluidas" value={String(statusCounts.completed)} icon={Users} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <CardTitle>Todas as formacoes</CardTitle>
              <CardDescription>
                Pesquise por titulo, formador, skill, entidade ou departamento e refine a grelha por estado.
              </CardDescription>
            </div>
            <div className="relative w-full xl:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar formacoes"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickStatusFilters.map((filter) => {
              const isActive = statusFilter === filter.value
              const count =
                filter.value === "all"
                  ? statusCounts.all
                  : filter.value === "scheduled"
                    ? statusCounts.scheduled
                    : filter.value === "in_progress"
                      ? statusCounts.in_progress
                      : statusCounts.completed

              return (
                <Button
                  key={filter.value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                  <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-[11px]">{count}</span>
                </Button>
              )
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" />
                Estado
              </div>
              <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="scheduled">Agendadas</SelectItem>
                  <SelectItem value="in_progress">Em curso</SelectItem>
                  <SelectItem value="completed">Concluidas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Formato</div>
              <Select value={formatFilter} onValueChange={(value: FormatFilter) => setFormatFilter(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hibrido">Hibrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Departamento</div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {departmentOptions.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {state.trainings.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ClipboardList />
                </EmptyMedia>
                <EmptyTitle>Ainda nao existem formacoes</EmptyTitle>
                <EmptyDescription>Crie a primeira acao para preencher esta vista em tabela.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild className="rounded-full">
                  <Link href="/dashboard/trainings/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar formacao
                  </Link>
                </Button>
              </EmptyContent>
            </Empty>
          ) : filteredTrainings.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhuma formacao corresponde aos filtros atuais.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-11 text-xs uppercase tracking-[0.16em] text-muted-foreground">Formacao</TableHead>
                    <TableHead className="h-11 text-xs uppercase tracking-[0.16em] text-muted-foreground">Estado</TableHead>
                    <TableHead className="h-11 text-xs uppercase tracking-[0.16em] text-muted-foreground">Formato</TableHead>
                    <TableHead className="h-11 text-xs uppercase tracking-[0.16em] text-muted-foreground">Datas</TableHead>
                    <TableHead className="h-11 text-xs uppercase tracking-[0.16em] text-muted-foreground">Formador</TableHead>
                    <TableHead className="h-11 text-xs uppercase tracking-[0.16em] text-muted-foreground">Entidade</TableHead>
                    <TableHead className="h-11 text-xs uppercase tracking-[0.16em] text-muted-foreground">Publico</TableHead>
                    <TableHead className="h-11 text-xs uppercase tracking-[0.16em] text-muted-foreground">Participantes</TableHead>
                    <TableHead className="h-11 text-right text-xs uppercase tracking-[0.16em] text-muted-foreground">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainings.map((training) => {
                    const departmentLabel = training.targetDepartments?.length
                      ? training.targetDepartments.join(", ")
                      : training.department || "Sem departamento"

                    return (
                      <TableRow key={training.id} className="hover:bg-muted/20">
                        <TableCell className="py-4 align-top">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium leading-none">{training.title}</p>
                              {training.mandatory && (
                                <Badge className="bg-accent/15 text-accent-foreground hover:bg-accent/15">Obrigatoria</Badge>
                              )}
                            </div>
                            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                              {training.description || "Sem descricao."}
                            </p>
                            <p className="text-xs text-muted-foreground">{summarizeSkills(training.skills)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          <Badge
                            variant="outline"
                            className={
                              training.status === "completed"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : training.status === "in_progress"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : "border-border bg-background text-foreground"
                            }
                          >
                            {trainingStatusLabels[training.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 align-top text-sm">{trainingFormatLabels[training.format]}</TableCell>
                        <TableCell className="py-4 align-top text-sm text-muted-foreground">
                          {formatDateRange(training.startDate, training.endDate)}
                        </TableCell>
                        <TableCell className="py-4 align-top text-sm">{training.instructor}</TableCell>
                        <TableCell className="py-4 align-top text-sm">
                          {training.trainingProviderName || getRuLabel("T34", training.trainingEntityCode)}
                        </TableCell>
                        <TableCell className="py-4 align-top text-sm text-muted-foreground">{departmentLabel}</TableCell>
                        <TableCell className="py-4 align-top text-sm">
                          <span className="font-medium text-foreground">{training.currentParticipants}</span>
                          <span className="text-muted-foreground">/{training.maxParticipants}</span>
                        </TableCell>
                        <TableCell className="py-4 align-top text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" className="h-9 rounded-full px-3 text-muted-foreground hover:text-foreground" onClick={() => handleDuplicate(training.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </Button>
                            <Button asChild size="sm" variant="outline" className="h-9 rounded-full px-3">
                              <Link href={`/dashboard/trainings/${training.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Abrir
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof ClipboardList
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/65">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  )
}
