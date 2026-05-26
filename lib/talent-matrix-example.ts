export type TalentLevel = "Baixo" | "Médio" | "Alto";

export interface TalentMatrixCell {
  performance: TalentLevel;
  potential: TalentLevel;
  employees: string[];
}

export const exampleTalentMatrix: TalentMatrixCell[] = [
  { performance: "Alto", potential: "Alto", employees: ["Ana Silva", "Carlos Souza"] },
  { performance: "Alto", potential: "Médio", employees: ["João Pereira"] },
  { performance: "Alto", potential: "Baixo", employees: ["Marina Lopes"] },
  { performance: "Médio", potential: "Alto", employees: ["Pedro Ramos"] },
  { performance: "Médio", potential: "Médio", employees: ["Lucas Lima", "Rita Costa"] },
  { performance: "Médio", potential: "Baixo", employees: ["Fernanda Dias"] },
  { performance: "Baixo", potential: "Alto", employees: ["Bruno Alves"] },
  { performance: "Baixo", potential: "Médio", employees: ["Sofia Martins"] },
  { performance: "Baixo", potential: "Baixo", employees: ["Tiago Pinto"] },
];
