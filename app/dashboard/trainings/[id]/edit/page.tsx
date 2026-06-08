"use client"

import { use } from "react"
import { TrainingFormPage } from "@/components/trainings/training-form-page"

export default function EditTrainingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)

  return <TrainingFormPage mode="edit" trainingId={resolvedParams.id} />
}
