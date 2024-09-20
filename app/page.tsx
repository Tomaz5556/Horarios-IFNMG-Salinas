import Link from 'next/link';
import Image from 'next/image';
import { BookOpenIcon, AcademicCapIcon, UserIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white border-t-4 border-green-700 p-8 rounded-lg shadow-lg text-center w-full max-w-4xl">
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/salinas_horizontal_tif.png"
            alt="Logo do Campus Salinas"
            width={512}
            height={275}
            className="object-contain w-full max-w-xs md:max-w-md" // Ajusta a imagem para ser responsiva
          />
        </div>
        <h1 className="font-poppins text-3xl md:text-4xl font-bold mb-8 text-black">Horários - Campus Salinas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <Link href="/ensinoMedio" className="block w-full h-28 md:h-32 bg-green-700 text-white text-center text-xl md:text-2xl rounded-md hover:bg-green-600 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 active:shadow-inner">
            <BookOpenIcon className="h-8 w-8 md:h-10 md:w-10 mb-2 transform transition-transform duration-300" />
            Ensino Médio
          </Link>
          <Link href="/ensinoSuperior" className="block w-full h-28 md:h-32 bg-green-700 text-white text-center text-xl md:text-2xl rounded-md hover:bg-green-600 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 active:shadow-inner">
            <AcademicCapIcon className="h-8 w-8 md:h-10 md:w-10 mb-2 transform transition-transform duration-300" />
            Ensino Superior
          </Link>
          <Link href="/HorariosProfessores" className="block w-full h-28 md:h-32 bg-green-700 text-white text-center text-xl md:text-2xl rounded-md hover:bg-green-600 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 active:shadow-inner">
            <UserIcon className="h-8 w-8 md:h-10 md:w-10 mb-2 transform transition-transform duration-300" />
            Professores
          </Link>
          <Link href="#" className="block w-full h-28 md:h-32 bg-green-700 text-white text-center text-xl md:text-2xl rounded-md hover:bg-green-600 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 active:shadow-inner">
            <BuildingStorefrontIcon className="h-8 w-8 md:h-10 md:w-10 mb-2 transform transition-transform duration-300" />
            Salas
          </Link>
        </div>
      </div>
      <footer className="text-center text-black py-4 mt-10">
        © 2024 IFNMG - Todos os direitos reservados.
      </footer>
    </div>
  );
}