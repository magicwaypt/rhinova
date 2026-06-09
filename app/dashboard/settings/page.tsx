"use client"

import { useMemo, useState } from "react"
import {
  BadgeCheck,
  Bell,
  Building2,
  ChevronRight,
  KeyRound,
  Link2,
  Mail,
  Pencil,
  Plus,
  Save,
  Shield,
  Trash2,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { toast } from "sonner"
import {
  platformRoleLabels,
  roleLabels,
  useAccessManagement,
  type EntityRole,
  type ManagedUserStatus,
  type PlatformRole,
} from "@/components/providers/access-management-provider"

export default function SettingsPage() {
  const {
    activeEntity,
    createEntity,
    createManagedUser,
    currentUserEntities,
    currentUser,
    deleteEntity,
    deleteManagedUser,
    getEntitiesForUser,
    getMembershipsForUser,
    isSuperAdmin,
    isReady,
    provisionManagedUserAccess,
    setActiveEntity,
    setDefaultEntityForUser,
    state,
    updateEntity,
    updateManagedUser,
    updateMembershipRole,
  } = useAccessManagement()

  const [entityDialogOpen, setEntityDialogOpen] = useState(false)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordTargetUserId, setPasswordTargetUserId] = useState<string | null>(null)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [entityForm, setEntityForm] = useState({
    name: "",
    legalName: "",
    nif: "",
    industry: "",
    employeeCount: "50",
    headquarters: "Lisboa",
  })
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    title: "",
    phone: "",
    password: "",
    confirmPassword: "",
    platformRole: "user" as PlatformRole,
    status: "active" as ManagedUserStatus,
    assignments: {} as Record<string, { checked: boolean; role: EntityRole }>,
  })
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  })

  const superAdmins = state.users.filter((user) => user.platformRole === "super_admin").length
  const multiEntityManagers = useMemo(
    () => state.users.filter((user) => user.platformRole !== "super_admin" && getEntitiesForUser(user.id).length > 1).length,
    [getEntitiesForUser, state.users],
  )

  const invitedUsers = state.users.filter((user) => user.status === "invited").length

  const ensureAssignmentState = (): Record<string, { checked: boolean; role: EntityRole }> => {
    if (Object.keys(userForm.assignments).length > 0) return userForm.assignments
    return Object.fromEntries(
      state.entities.map((entity, index) => [
        entity.id,
        {
          checked: index === 0,
          role: (index === 0 ? "manager" : "viewer") as EntityRole,
        },
      ]),
    ) as Record<string, { checked: boolean; role: EntityRole }>
  }

  const openEntityDialog = (entityId?: string) => {
    if (!entityId) {
      setEditingEntityId(null)
      setEntityForm({
        name: "",
        legalName: "",
        nif: "",
        industry: "",
        employeeCount: "50",
        headquarters: "Lisboa",
      })
      setEntityDialogOpen(true)
      return
    }

    const entity = state.entities.find((item) => item.id === entityId)
    if (!entity) return

    setEditingEntityId(entity.id)
    setEntityForm({
      name: entity.name,
      legalName: entity.legalName,
      nif: entity.nif,
      industry: entity.industry,
      employeeCount: String(entity.employeeCount),
      headquarters: entity.headquarters,
    })
    setEntityDialogOpen(true)
  }

  const openUserDialog = (userId?: string) => {
    if (!userId) {
      setEditingUserId(null)
      setUserForm({
        name: "",
        email: "",
        title: "",
        phone: "",
        password: "",
        confirmPassword: "",
        platformRole: "user",
        status: "active",
        assignments: Object.fromEntries(
          state.entities.map((entity, index) => [
            entity.id,
            {
              checked: index === 0,
              role: (index === 0 ? "manager" : "viewer") as EntityRole,
            },
          ]),
        ) as Record<string, { checked: boolean; role: EntityRole }>,
      })
      setUserDialogOpen(true)
      return
    }

    const user = state.users.find((item) => item.id === userId)
    if (!user) return

    const assignments = Object.fromEntries(
      state.entities.map((entity) => {
        const membership = state.memberships.find(
          (item) => item.userId === userId && item.entityId === entity.id,
        )

        return [
          entity.id,
          {
            checked: Boolean(membership),
            role: membership?.role || ("viewer" as EntityRole),
          },
        ]
      }),
    ) as Record<string, { checked: boolean; role: EntityRole }>

    setEditingUserId(user.id)
    setUserForm({
      name: user.name,
      email: user.email,
      title: user.title,
      phone: user.phone || "",
      password: "",
      confirmPassword: "",
      platformRole: user.platformRole,
      status: user.status,
      assignments,
    })
    setUserDialogOpen(true)
  }

  const handleSaveEntity = async () => {
    if (!entityForm.name || !entityForm.legalName || !entityForm.nif) {
      toast.error("Preencha nome, razão social e NIF da entidade.")
      return
    }

    const payload = {
      name: entityForm.name,
      legalName: entityForm.legalName,
      nif: entityForm.nif,
      industry: entityForm.industry || "Serviços",
      employeeCount: Number(entityForm.employeeCount),
      headquarters: entityForm.headquarters,
    }

    try {
      const entity = editingEntityId
        ? await updateEntity(editingEntityId, {
            ...payload,
            status: state.entities.find((item) => item.id === editingEntityId)?.status || "setup",
          })
        : await createEntity(payload)

      setEntityDialogOpen(false)
      setEditingEntityId(null)
      setEntityForm({
        name: "",
        legalName: "",
        nif: "",
        industry: "",
        employeeCount: "50",
        headquarters: "Lisboa",
      })
      if (entity) {
        setActiveEntity(entity.id)
      }
      toast.success(editingEntityId ? "Entidade atualizada." : "Entidade criada e pronta a ser associada a gestores.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível guardar a entidade.")
    }
  }

  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.title) {
      toast.error("Preencha nome, email e função do user.")
      return
    }

    if (
      state.users.some(
        (user) =>
          user.email.toLowerCase() === userForm.email.trim().toLowerCase() &&
          user.id !== editingUserId,
      )
    ) {
      toast.error("Já existe um user com este email.")
      return
    }

    if (!editingUserId && userForm.password.length < 8) {
      toast.error("Defina uma password com pelo menos 8 caracteres.")
      return
    }

    if (!editingUserId && userForm.password !== userForm.confirmPassword) {
      toast.error("A confirmação da password não coincide.")
      return
    }

    const assignments = Object.entries(userForm.assignments)
      .filter(([, assignment]) => assignment.checked)
      .map(([entityId, assignment], index) => ({
        entityId,
        role: assignment.role,
        isDefault: index === 0,
      }))

    if (userForm.platformRole !== "super_admin" && assignments.length === 0) {
      toast.error("Associe o user a pelo menos uma entidade.")
      return
    }

    try {
      if (editingUserId) {
        await updateManagedUser(editingUserId, {
          name: userForm.name,
          email: userForm.email,
          title: userForm.title,
          platformRole: userForm.platformRole,
          phone: userForm.phone,
          status: userForm.status,
          memberships: userForm.platformRole === "super_admin" ? [] : assignments,
        })
      } else {
        await createManagedUser({
          name: userForm.name,
          email: userForm.email,
          title: userForm.title,
          platformRole: userForm.platformRole,
          phone: userForm.phone,
          status: userForm.status,
          password: userForm.password,
          memberships: userForm.platformRole === "super_admin" ? [] : assignments,
        })
      }

      setUserDialogOpen(false)
      setEditingUserId(null)
      toast.success(editingUserId ? "User atualizado." : "User criado com password definida e acesso multi-entidade configurado.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar o user.")
    }
  }

  const handleDeleteEntity = async (entityId: string) => {
    const entity = state.entities.find((item) => item.id === entityId)
    if (!entity) return

    const confirmed = window.confirm(`Eliminar a entidade "${entity.name}" e todas as memberships associadas?`)
    if (!confirmed) return

    try {
      await deleteEntity(entityId)
      toast.success("Entidade removida.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível remover a entidade.")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const user = state.users.find((item) => item.id === userId)
    if (!user) return
    if (currentUser?.id === userId) {
      toast.error("Não pode apagar o utilizador com a sessão atual.")
      return
    }

    const confirmed = window.confirm(`Eliminar o user "${user.email}"?`)
    if (!confirmed) return

    try {
      await deleteManagedUser(userId)
      toast.success("User removido.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível remover o user.")
    }
  }

  const openPasswordDialog = (userId: string) => {
    setPasswordTargetUserId(userId)
    setPasswordForm({
      password: "",
      confirmPassword: "",
    })
    setPasswordDialogOpen(true)
  }

  const handleProvisionPassword = async () => {
    if (!passwordTargetUserId) {
      return
    }

    if (passwordForm.password.length < 8) {
      toast.error("Defina uma password com pelo menos 8 caracteres.")
      return
    }

    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error("A confirmação da password não coincide.")
      return
    }

    try {
      await provisionManagedUserAccess(passwordTargetUserId, passwordForm.password)
      setPasswordDialogOpen(false)
      toast.success("Password definida com sucesso para este user.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível definir a password.")
    }
  }

  if (!isReady) {
    return <div className="h-[720px] rounded-3xl bg-muted animate-pulse" />
  }

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Administração da plataforma</CardTitle>
          <CardDescription>Esta área está reservada ao super admin do ambiente multi-tenant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            O utilizador atual, {currentUser?.name || "sem sessão"}, não tem permissões para criar entidades, users ou acessos de plataforma.
          </div>
          <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
            Entre com um perfil `super admin`, como <span className="font-mono">admin@rhinova.pt</span>, para gerir tenants, memberships e perfis.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Administração da Plataforma</h1>
          <p className="mt-1 text-muted-foreground">
            Governe a plataforma multi-tenant: entidades, users, memberships e acessos por tenant.
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={entityDialogOpen} onOpenChange={setEntityDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => openEntityDialog()}>
                <Building2 className="mr-2 h-4 w-4" />
                Nova entidade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEntityId ? "Editar entidade" : "Criar entidade"}</DialogTitle>
                <DialogDescription>Adicione ou atualize uma empresa ou unidade jurídica da plataforma.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label>Nome comercial</Label>
                  <Input value={entityForm.name} onChange={(event) => setEntityForm((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Razão social</Label>
                  <Input value={entityForm.legalName} onChange={(event) => setEntityForm((current) => ({ ...current, legalName: event.target.value }))} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>NIF</Label>
                    <Input value={entityForm.nif} onChange={(event) => setEntityForm((current) => ({ ...current, nif: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Setor</Label>
                    <Input value={entityForm.industry} onChange={(event) => setEntityForm((current) => ({ ...current, industry: event.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Colaboradores</Label>
                    <Input type="number" value={entityForm.employeeCount} onChange={(event) => setEntityForm((current) => ({ ...current, employeeCount: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sede</Label>
                    <Input value={entityForm.headquarters} onChange={(event) => setEntityForm((current) => ({ ...current, headquarters: event.target.value }))} />
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveEntity}>
                {editingEntityId ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingEntityId ? "Guardar alterações" : "Criar entidade"}
              </Button>
            </DialogContent>
          </Dialog>

          <Button onClick={() => openUserDialog()}>
            <Users className="mr-2 h-4 w-4" />
            Novo user
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SettingsStat title="Entidades" value={String(state.entities.length)} subtitle="Carteira ativa" icon={Building2} />
        <SettingsStat title="Users" value={String(state.users.length)} subtitle="Acessos configurados" icon={Users} />
        <SettingsStat title="Super Admins" value={String(superAdmins)} subtitle="Acesso transversal" icon={Shield} />
        <SettingsStat title="Gestores multi-entidade" value={String(multiEntityManagers)} subtitle="Com mais de uma entidade" icon={Link2} />
      </div>

      <Tabs defaultValue="access" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="access" className="gap-2">
            <Users className="h-4 w-4" />
            Users & Entidades
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organização
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle>Tenants / Entidades</CardTitle>
                <CardDescription>Cada entidade representa um tenant separado dentro da plataforma.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {state.entities.length === 0 && (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Building2 />
                      </EmptyMedia>
                      <EmptyTitle>Ainda não existem entidades</EmptyTitle>
                      <EmptyDescription>
                        Comece por criar a primeira entidade. Cada entidade funciona como um tenant com utilizadores, contexto operacional e permissões próprias.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button onClick={() => openEntityDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar primeira entidade
                      </Button>
                    </EmptyContent>
                  </Empty>
                )}
                {state.entities.map((entity) => {
                  const usersInEntity = state.memberships.filter((membership) => membership.entityId === entity.id).length
                  const isActive = activeEntity?.id === entity.id
                  return (
                    <div
                      key={entity.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveEntity(entity.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          setActiveEntity(entity.id)
                        }
                      }}
                      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                        isActive ? "border-primary bg-primary/5" : "hover:border-primary/40 hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{entity.name}</p>
                            <Badge variant={entity.status === "active" ? "secondary" : entity.status === "setup" ? "outline" : "destructive"}>
                              {entity.status === "active" ? "Ativa" : entity.status === "setup" ? "Em setup" : "Pausada"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{entity.legalName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost" onClick={(event) => {
                            event.stopPropagation()
                            openEntityDialog(entity.id)
                          }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteEntity(entity.id)
                          }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          {isActive && (
                            <BadgeCheck className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                        <span>NIF {entity.nif}</span>
                        <span>{entity.employeeCount} colaboradores</span>
                        <span>{usersInEntity} users associados</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilizadores e acessos</CardTitle>
                <CardDescription>Associe cada user aos tenants que pode gerir e defina a entidade por defeito.</CardDescription>
              </CardHeader>
              <CardContent className={state.users.length === 0 ? "p-6" : "p-0"}>
                {state.users.length === 0 && (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users />
                      </EmptyMedia>
                      <EmptyTitle>Sem users configurados</EmptyTitle>
                      <EmptyDescription>
                        Crie utilizadores para dar acesso às entidades. Pode definir logo a password inicial, estado e memberships por tenant.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button onClick={() => openUserDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar primeiro user
                      </Button>
                    </EmptyContent>
                  </Empty>
                )}
                {state.users.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Entidades</TableHead>
                      <TableHead>Perfis</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.users.map((user) => {
                      const memberships = getMembershipsForUser(user.id)
                      const entities = getEntitiesForUser(user.id)
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">{user.title} · {platformRoleLabels[user.platformRole]}</p>
                              <button
                                type="button"
                                onClick={() => openPasswordDialog(user.id)}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                                Definir password
                              </button>
                              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                                <button
                                  type="button"
                                  onClick={() => openUserDialog(user.id)}
                                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Editar
                                </button>
                                {currentUser?.id !== user.id && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="inline-flex items-center gap-1 font-medium text-destructive hover:underline"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Apagar
                                  </button>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {user.platformRole === "super_admin" && (
                                <Badge variant="default">Acesso global</Badge>
                              )}
                              {entities.map((entity) => {
                                const membership = memberships.find((item) => item.entityId === entity.id)
                                return (
                                  <button
                                    key={entity.id}
                                    type="button"
                                    onClick={() => {
                                      void setDefaultEntityForUser(user.id, entity.id).catch((error) => {
                                        toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a entidade por defeito.")
                                      })
                                    }}
                                    className={`rounded-full border px-2.5 py-1 text-xs ${
                                      membership?.isDefault ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                                    }`}
                                  >
                                    {entity.name}
                                    {membership?.isDefault ? " · default" : ""}
                                  </button>
                                )
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              {user.platformRole === "super_admin" && memberships.length === 0 && (
                                <div className="text-xs text-muted-foreground">Sem memberships locais. Governa todos os tenants.</div>
                              )}
                              {memberships.map((membership) => {
                                const entity = state.entities.find((item) => item.id === membership.entityId)
                                return (
                                  <div key={membership.id} className="flex items-center gap-2">
                                    <span className="min-w-[92px] text-xs text-muted-foreground">{entity?.name}</span>
                                    <Select
                                      value={membership.role}
                                      onValueChange={(value: EntityRole) => {
                                        void updateMembershipRole(membership.id, value).catch((error) => {
                                          toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a role.")
                                        })
                                      }}
                                    >
                                      <SelectTrigger className="h-8 w-[160px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(roleLabels).map(([role, label]) => (
                                          <SelectItem key={role} value={role}>
                                            {label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "active" ? "secondary" : user.status === "invited" ? "outline" : "destructive"}>
                              {user.status === "active" ? "Ativo" : user.status === "invited" ? "Convidado" : "Inativo"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tenant ativo</CardTitle>
              <CardDescription>Contexto operacional usado pelos módulos do dashboard.</CardDescription>
            </CardHeader>
            <CardContent className={currentUserEntities.length === 0 ? "p-6" : "grid gap-6 md:grid-cols-[1fr_auto] md:items-end"}>
              {currentUserEntities.length === 0 && (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Building2 />
                    </EmptyMedia>
                    <EmptyTitle>Sem contexto operacional</EmptyTitle>
                    <EmptyDescription>
                      Ainda não existe nenhuma entidade ativa. Crie uma entidade para começar a operar os módulos da plataforma com um tenant selecionado.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button onClick={() => openEntityDialog()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar entidade
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
              {currentUserEntities.length > 0 && (
              <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Entidade atual</Label>
                  <Select value={activeEntity?.id || ""} onValueChange={setActiveEntity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentUserEntities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>NIF</Label>
                  <Input value={activeEntity?.nif || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Razão social</Label>
                  <Input value={activeEntity?.legalName || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Sede</Label>
                  <Input value={activeEntity?.headquarters || ""} readOnly />
                </div>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Guardar contexto
              </Button>
              </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Âmbito operacional do super admin</CardTitle>
              <CardDescription>Visão rápida dos tenants atualmente disponíveis neste ambiente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentUserEntities.length === 0 && (
                <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                  Quando houver entidades, esta área mostra rapidamente o âmbito operacional disponível para o super admin.
                </div>
              )}
              {currentUserEntities.map((entity) => (
                <div key={entity.id} className="flex items-center justify-between rounded-2xl border p-4">
                  <div>
                    <p className="font-medium">{entity.name}</p>
                    <p className="text-sm text-muted-foreground">{entity.industry} · {entity.employeeCount} colaboradores</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de notificação</CardTitle>
              <CardDescription>Defina como os gestores recebem alertas operacionais multi-entidade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por email</p>
                  <p className="text-sm text-muted-foreground">Receber convites, lembretes e alertas de exportação RU.</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="rounded-2xl border bg-secondary/20 p-4 text-sm text-muted-foreground">
                Recomendação: manter notificações multi-entidade ativas para evitar que pendências de uma entidade passem despercebidas quando o gestor estiver a operar noutra.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança e governação</CardTitle>
              <CardDescription>Boas práticas para uma operação multi-entidade segura.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl border p-4">
                Garantir que o perfil do gestor muda de entidade sem misturar permissões ou dados operacionais.
              </div>
              <div className="rounded-2xl border p-4">
                Registar a entidade por defeito e o âmbito de acesso por user para auditoria.
              </div>
              <div className="rounded-2xl border p-4">
                Nas próximas iterações, acrescentar auditoria de troca de entidade e convites com expiração.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingUserId ? "Editar user" : "Criar user multi-entidade"}</DialogTitle>
            <DialogDescription>Crie ou atualize utilizadores da plataforma e associe-os aos tenants com perfis diferentes em cada entidade.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-2 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={userForm.name} onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={userForm.email} onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Função</Label>
                  <Input value={userForm.title} onChange={(event) => setUserForm((current) => ({ ...current, title: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={userForm.phone} onChange={(event) => setUserForm((current) => ({ ...current, phone: event.target.value }))} />
                </div>
              </div>
              {!editingUserId ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Password inicial</Label>
                    <Input
                      type="password"
                      value={userForm.password}
                      onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar password</Label>
                    <Input
                      type="password"
                      value={userForm.confirmPassword}
                      onChange={(event) => setUserForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border bg-secondary/20 p-4 text-sm text-muted-foreground">
                  A password deste user é gerida pela ação <span className="font-medium text-foreground">Definir password</span> na lista de utilizadores.
                </div>
              )}
              <div className="space-y-2">
                <Label>Tipo de acesso</Label>
                <Select value={userForm.platformRole} onValueChange={(value: PlatformRole) => setUserForm((current) => ({ ...current, platformRole: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User por entidade</SelectItem>
                    <SelectItem value="super_admin">Super admin da plataforma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={userForm.status} onValueChange={(value: ManagedUserStatus) => setUserForm((current) => ({ ...current, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="invited">Convidado</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Entidades a gerir</p>
                <p className="text-sm text-muted-foreground">
                  {userForm.platformRole === "super_admin"
                    ? "O super admin herda acesso transversal e não precisa de memberships por entidade."
                    : "Selecione uma ou mais entidades para este user."}
                </p>
              </div>
              <div className={`space-y-3 ${userForm.platformRole === "super_admin" ? "opacity-50" : ""}`}>
                {state.entities.map((entity) => {
                  const assignments = ensureAssignmentState()
                  const assignment: { checked: boolean; role: EntityRole } =
                    assignments[entity.id] || { checked: false, role: "viewer" as EntityRole }
                  return (
                    <div key={entity.id} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={assignment.checked}
                            disabled={userForm.platformRole === "super_admin"}
                            onCheckedChange={(checked) => {
                              const nextAssignment: { checked: boolean; role: EntityRole } = {
                                checked: Boolean(checked),
                                role: assignment.role,
                              }
                              setUserForm((current) => ({
                                ...current,
                                assignments: {
                                  ...current.assignments,
                                  [entity.id]: nextAssignment,
                                },
                              }))
                            }}
                          />
                          <div>
                            <p className="font-medium">{entity.name}</p>
                            <p className="text-sm text-muted-foreground">{entity.legalName}</p>
                          </div>
                        </div>
                        <Select
                          value={assignment.role}
                          disabled={userForm.platformRole === "super_admin"}
                          onValueChange={(value: EntityRole) => {
                            const nextAssignment: { checked: boolean; role: EntityRole } = {
                              checked: assignment.checked,
                              role: value,
                            }
                            setUserForm((current) => ({
                              ...current,
                              assignments: {
                                ...current.assignments,
                                [entity.id]: nextAssignment,
                              },
                            }))
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(roleLabels).map(([role, label]) => (
                              <SelectItem key={role} value={role}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <Button onClick={handleSaveUser}>
            {editingUserId ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {editingUserId ? "Guardar user" : "Criar user"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Definir password do user</DialogTitle>
            <DialogDescription>
              Guarde uma password inicial ou redefina o acesso de um utilizador já criado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nova password</Label>
              <Input
                type="password"
                value={passwordForm.password}
                onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
              />
            </div>
          </div>
          <Button onClick={handleProvisionPassword}>
            <KeyRound className="mr-2 h-4 w-4" />
            Guardar password
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SettingsStat({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: typeof Building2
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}
