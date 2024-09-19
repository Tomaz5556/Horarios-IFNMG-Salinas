import Link from 'next/link';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-lime-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-center mb-8">Escolha uma opção</h1>
      <div className="grid grid-cols-2 gap-8">
        <Link href="/ensinoMedio" className="block w-72 px-8 py-6 bg-green-700 text-white text-center text-2xl rounded-md border-4 border-slate-50 hover:bg-green-600 transition flex flex-col items-center">
          <AcademicCapIcon className="h-10 w-10 mb-2" />
          Ensino Médio
        </Link>
        <Link href="/ensinoSuperior" className="block w-72 px-8 py-6 bg-green-700 text-white text-center text-2xl rounded-md border-4 border-slate-50 hover:bg-green-600 transition flex flex-col items-center">
          <AcademicCapIcon className="h-10 w-10 mb-2" />
          Ensino Superior
        </Link>
        <Link href="/HorariosProfessores" className="block w-72 px-8 py-6 bg-green-700 text-white text-center text-2xl rounded-md border-4 border-slate-50 hover:bg-green-600 transition flex flex-col items-center">
          <AcademicCapIcon className="h-10 w-10 mb-2" />
          Horários Professores
        </Link>
        <Link href="#" className="block w-72 px-8 py-6 bg-green-700 text-white text-center text-2xl rounded-md border-4 border-slate-50 hover:bg-green-600 transition flex flex-col items-center">
          <AcademicCapIcon className="h-10 w-10 mb-2" />
          Salas Professores
        </Link>
      </div>
    </div>
  );
}