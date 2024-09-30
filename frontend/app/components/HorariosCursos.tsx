import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCourseData } from '../api/routes';
import ListaSuspensa from '../components/DropdownList';
import BotaoBuscar from '../components/SearchButton';
import BotaoVoltar from '../components/BackButton';
import TabelaCursos from '../components/TabelaCursos';

export default function HorariosCursos() {
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [hasSearched, setHasSearched] = useState(false);
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo');

  const fetchData = async () => {
    try {
      const data = await fetchCourseData(selectedCourse, tipo ?? '');
      setRows(data.rows);
      setMaxColumns(data.maxColumns);
      setCourseName(data.courseName);
      setHasSearched(true);
    } catch (error) {
      console.error("Erro ao buscar dados dos cursos:", error);
    }
  };

  useEffect(() => {
    setHasSearched(false);
  }, [tipo]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  const OptionsEnsinoMedio = {
    agroindustria: "Técnico em Agroindústria",
    agropecuaria: "Técnico em Agropecuária",
    informatica: "Técnico em Informática"
  };

  const OptionsEnsinoSuperior = {
    engenharia_alimentos: "Bacharelado em Engenharia de Alimentos",
    engenharia_florestal: "Bacharelado em Engenharia Florestal",
    sistemas_informacao: "Bacharelado em Sistemas de Informação",
    medicina_veterinaria: "Bacharelado em Medicina Veterinária",
    biologia: "Licenciatura em Ciências Biológicas",
    fisica: "Licenciatura em Física",
    matematica: "Licenciatura em Matemática",
    quimica: "Licenciatura em Química",
    pedagogia: "Licenciatura em Pedagogia"
  };

  const courseOptions = tipo === 'ensinoMedio' ? OptionsEnsinoMedio : OptionsEnsinoSuperior;

  const emptyColumns: number[] = [];

  rows.forEach((row, rowIndex) => {
    const isFirstLineAfterDay = rowIndex > 0 && rows[rowIndex - 1].length === 1;

    if (isFirstLineAfterDay) {
      row.forEach((cell, colIndex: number) => {
        if (!cell && !emptyColumns.includes(colIndex)) {
          emptyColumns.push(colIndex);
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="min-h-screen container mx-auto px-2 py-6">
        <h1 className="text-center text-3xl font-bold mb-4 text-black dark:text-white">Selecione o curso</h1>
        <div className="flex flex-col items-center mb-4 text-black dark:text-white">
          <ListaSuspensa
            value={selectedCourse}
            onChange={handleCourseChange}
            options={[]}
            label="Todos (Cursos)"
            staticOptions={courseOptions}
          />
          <BotaoBuscar onClick={fetchData} />
        </div>

        <div className="overflow-x-auto">
          <TabelaCursos 
            rows={rows} 
            maxColumns={maxColumns} 
            courseName={courseName} 
            loading={!hasSearched}
          />
        </div>
        <div className="flex justify-center mt-4">
          <BotaoVoltar />
        </div>
      </div>
    </div>
  );
}