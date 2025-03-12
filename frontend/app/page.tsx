import Link from 'next/link';
import Image from 'next/image';
import { BookOpenIcon, AcademicCapIcon, UserIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen bg-slate-200 dark:bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-black border-t-4 border-green-700 dark:border-white p-8 rounded-lg shadow-lg text-center w-full max-w-4xl">
        <div className="w-full flex justify-center mb-8">
          <div className="block dark:hidden">
            <Image
              src="/salinas_horizontal_white.jpg"
              alt="Logo do Campus Salinas - White"
              width={512}
              height={275}
              className="object-contain w-full max-w-xs md:max-w-md rounded-md"
              priority={true}
            />
          </div>
          <div className="hidden dark:block">
            <Image
              src="/salinas_horizontal_dark.jpg"
              alt="Logo do Campus Salinas - Dark"
              width={512}
              height={275}
              className="object-contain w-full max-w-xs md:max-w-md rounded-md"
              priority={true}
            />
          </div>
        </div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl mb-8 text-black dark:text-white">Horários - Campus Salinas</h1>
        <div className="font-sans font-semibold grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          <Link href="pages/Cursos?tipo=ensinoMedio" className="block w-full h-28 md:h-32 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <BookOpenIcon className="h-8 w-8 md:h-10 md:w-10 mb-2 transform transition-transform duration-300" />
            Ensino Médio
          </Link>
          <Link href="pages/Cursos?tipo=ensinoSuperior" className="block w-full h-28 md:h-32 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <AcademicCapIcon className="h-8 w-8 md:h-10 md:w-10 mb-2 transform transition-transform duration-300" />
            Ensino Superior
          </Link>
          <Link href="pages/Professores" className="block w-full h-28 md:h-32 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <UserIcon className="h-8 w-8 md:h-10 md:w-10 mb-2 transform transition-transform duration-300" />
            Professores
          </Link>
          <Link href="pages/Salas" className="block w-full h-28 md:h-32 bg-green-700 dark:bg-white text-white dark:text-black text-center text-xl md:text-2xl rounded-md hover:bg-green-600 dark:hover:bg-neutral-300 transition-all duration-500 flex flex-col items-center justify-center shadow-lg hover:shadow-xl active:bg-green-800 dark:active:bg-neutral-500 active:shadow-inner">
            <BuildingStorefrontIcon className="h-8 w-8 md:h-10 md:w-10 mb-2 transform transition-transform duration-300" />
            Salas
          </Link>
        </div>
      </div>
      <footer className="text-center text-black dark:text-white p-4">
        © {currentYear} IFNMG - Todos os direitos reservados.
      </footer>
    </div>
  );
}