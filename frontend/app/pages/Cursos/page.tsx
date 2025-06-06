'use client';

import { Suspense } from "react";
import HorariosCursos from "../../components/schedules/HorariosCursos";

export default function Cursos() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <HorariosCursos />
    </Suspense>
  );
}