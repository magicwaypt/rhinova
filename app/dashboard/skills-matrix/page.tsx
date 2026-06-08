"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

// Exemplo de competências e colaboradores
const skills = ["Liderança", "Comunicação", "Excel", "Gestão de Projetos", "Inglês"] as const;
type SkillName = (typeof skills)[number]
const employees = [
  { name: "Ana Silva", skills: { "Liderança": 5, "Comunicação": 4, "Excel": 3, "Gestão de Projetos": 4, "Inglês": 2 } },
  { name: "Carlos Souza", skills: { "Liderança": 3, "Comunicação": 5, "Excel": 4, "Gestão de Projetos": 2, "Inglês": 4 } },
  { name: "João Pereira", skills: { "Liderança": 2, "Comunicação": 3, "Excel": 5, "Gestão de Projetos": 3, "Inglês": 5 } },
  { name: "Marina Lopes", skills: { "Liderança": 4, "Comunicação": 2, "Excel": 2, "Gestão de Projetos": 5, "Inglês": 3 } },
  { name: "Rita Costa", skills: { "Liderança": 3, "Comunicação": 4, "Excel": 3, "Gestão de Projetos": 3, "Inglês": 4 } },
];

export default function SkillsMatrixPage() {
  const [selectedSkill, setSelectedSkill] = useState<SkillName>(skills[0]);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Competências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm font-medium">Competência:</span>
            {skills.map((skill) => (
              <button
                key={skill}
                className={`px-3 py-1 rounded border text-sm transition-colors ${selectedSkill === skill ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:bg-accent/30"}`}
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2 bg-muted text-sm font-semibold text-left">Colaborador</th>
                  <th className="border px-4 py-2 bg-muted text-sm font-semibold text-center">Nível ({selectedSkill})</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.name}>
                    <td className="border px-4 py-2">{emp.name}</td>
                    <td className="border px-4 py-2 text-center">
                      <span className="inline-block font-mono text-lg font-bold">
                        {emp.skills[selectedSkill]}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">/ 5</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="font-semibold">Dica:</span> Clique em uma competência para visualizar o nível de cada colaborador.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
