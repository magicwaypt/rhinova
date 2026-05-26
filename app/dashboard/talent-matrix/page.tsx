
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { exampleTalentMatrix } from "@/lib/talent-matrix-example";

const levels = ["Alto", "Médio", "Baixo"];

const cellDescriptions: Record<string, string> = {
  "Alto-Alto": "Potenciais líderes e sucessores. Prioridade máxima para retenção e desenvolvimento.",
  "Alto-Médio": "Desempenho consistente, potencial para crescimento.",
  "Alto-Baixo": "Especialistas de alta performance, mas potencial limitado.",
  "Médio-Alto": "Talentos promissores, investir em desenvolvimento.",
  "Médio-Médio": "Bons colaboradores, manter motivação e avaliar evolução.",
  "Médio-Baixo": "Performance estável, mas potencial limitado.",
  "Baixo-Alto": "Potencial a ser trabalhado, avaliar causas da baixa performance.",
  "Baixo-Médio": "Necessário acompanhamento e feedback.",
  "Baixo-Baixo": "Risco de baixo desempenho, plano de ação recomendado."
};


export default function TalentMatrixPage() {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const getCell = (performance: string, potential: string) =>
    exampleTalentMatrix.find(
      (cell) => cell.performance === performance && cell.potential === potential
    );

  return (
    <div className="max-w-5xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Talento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Visualize a matriz 9-box de talento: cruzamento entre potencial e performance dos colaboradores.
          </p>
          <div className="overflow-x-auto">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="border bg-background"></th>
                  {levels.map((potential) => (
                    <th key={potential} className="border px-4 py-2 bg-muted text-sm font-semibold">
                      Potencial {potential}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {levels.map((performance) => (
                  <tr key={performance}>
                    <td className="border px-4 py-2 bg-muted text-sm font-semibold">
                      Performance {performance}
                    </td>
                    {levels.map((potential) => {
                      const cell = getCell(performance, potential);
                      const cellKey = `${performance}-${potential}`;
                      const highlight = cellKey === "Alto-Alto";
                      const isSelected = selectedCell === cellKey;
                      return (
                        <td
                          key={potential}
                          className={`border px-4 py-2 align-top min-w-[180px] cursor-pointer ${highlight ? "bg-green-50 border-green-400" : ""} ${isSelected ? "ring-2 ring-primary" : ""}`}
                          onClick={() => setSelectedCell(cellKey === selectedCell ? null : cellKey)}
                          title="Clique para ver detalhes"
                        >
                          <div className="mb-1 text-xs text-muted-foreground italic">
                            {cellDescriptions[cellKey]}
                          </div>
                          {cell && cell.employees.length > 0 ? (
                            isSelected ? (
                              <ul className="list-disc ml-4">
                                {cell.employees.map((emp) => (
                                  <li key={emp}>{emp}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-primary">
                                  {cell.employees.length}
                                </span>
                                <span className="text-xs text-muted-foreground">colaboradores</span>
                              </div>
                            )
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="font-semibold">Dica:</span> Clique em um quadrante para ver os nomes dos colaboradores.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
