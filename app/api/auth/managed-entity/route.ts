import { NextResponse } from "next/server"
import { requirePlatformAdminSession } from "@/lib/platform-admin-session"
import { deleteManagedEntity, upsertManagedEntity } from "@/lib/provisioned-users"

interface ManagedEntityRequestBody {
  id?: string
  name?: string
  legalName?: string
  nif?: string
  industry?: string
  employeeCount?: number
  status?: "active" | "setup" | "paused"
  headquarters?: string
  createdAt?: string
}

export async function POST(request: Request) {
  const auth = await requirePlatformAdminSession()

  if (!auth.ok) {
    return NextResponse.json(
      { error: "Sem permissão para criar entidades." },
      { status: auth.status },
    )
  }

  try {
    const body = (await request.json()) as ManagedEntityRequestBody

    if (
      !body.name ||
      !body.legalName ||
      !body.nif ||
      !body.industry ||
      typeof body.employeeCount !== "number" ||
      !body.status ||
      !body.headquarters
    ) {
      return NextResponse.json(
        { error: "Dados obrigatórios em falta para guardar a entidade." },
        { status: 400 },
      )
    }

    const entity = await upsertManagedEntity({
      id: body.id,
      name: body.name,
      legalName: body.legalName,
      nif: body.nif,
      industry: body.industry,
      employeeCount: body.employeeCount,
      status: body.status,
      headquarters: body.headquarters,
      createdAt: body.createdAt,
    })

    return NextResponse.json({ ok: true, entity })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível guardar a entidade."

    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const auth = await requirePlatformAdminSession()

  if (!auth.ok) {
    return NextResponse.json(
      { error: "Sem permissão para remover entidades." },
      { status: auth.status },
    )
  }

  const body = (await request.json()) as { entityId?: string }

  if (!body.entityId) {
    return NextResponse.json(
      { error: "É necessário indicar a entidade a remover." },
      { status: 400 },
    )
  }

  await deleteManagedEntity(body.entityId)

  return NextResponse.json({ ok: true })
}
