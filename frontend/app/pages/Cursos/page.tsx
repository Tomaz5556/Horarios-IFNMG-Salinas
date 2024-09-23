'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCourseData } from '../../api/routes';
import ListaSuspensa from '../../components/DropdownList';
import BotaoBuscar from '../../components/SearchButton';
import BotaoVoltar from '../../components/BackButton';

export default function Cursos() {
  const [rows, setRows] = useState<any[]>([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo');

  const fetchData = async () => {
    try {
      const data = await fetchCourseData(selectedCourse, tipo ?? '');
      setRows(data.rows);
      setMaxColumns(data.maxColumns);
      setCourseName(data.courseName);
    } catch (error) {
      console.error("Erro ao buscar dados dos cursos:", error);
    }
  };

  useEffect(() => {
    if (tipo) fetchData();
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-3xl font-bold mb-4">Selecione o curso</h1>
      <div className="flex flex-col items-center mb-4">
        <ListaSuspensa
          value={selectedCourse}
          onChange={handleCourseChange}
          options={[]}
          label="Todos os Cursos"
          staticOptions={courseOptions}
        />
        <BotaoBuscar onClick={fetchData} />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-neutral-500">
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.length === 1 ? (
                    <th colSpan={maxColumns} className="border border-neutral-500 p-3">
                      {row[0]}
                    </th>
                  ) : (
                    Array.from({ length: maxColumns }).map((_, colIndex) => (
                      <td key={colIndex} className={`border border-neutral-500 p-3 text-center ${colIndex === 0 ? 'font-bold whitespace-nowrap overflow-hidden text-ellipsis' : 'whitespace-normal'}`} style={colIndex === 0 ? { width: '150px', maxWidth: '150px' } : { minWidth: '100px' }}>
                        {colIndex < row.length ? row[colIndex] : '----'}
                      </td>
                    ))
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={maxColumns} className="border border-neutral-500 p-2 text-center">
                  Nenhum dado disponível
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <BotaoVoltar />
      </div>
    </div>
  );
}