'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ExibicaoCursos() {
  const [rows, setRows] = useState<any[]>([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo');

  // Função para buscar dados
  async function fetchData() {
    let url = '';
    if (tipo === 'ensinoMedio') {
      url = `http://localhost:8080/ensinoMedio?cursoSelecionado=${selectedCourse}`;
    } else if (tipo === 'ensinoSuperior') {
      url = `http://localhost:8080/ensinoSuperior?cursoSelecionado=${selectedCourse}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    setRows(data.rows);
    setMaxColumns(data.maxColumns);
    setCourseName(data.courseName);
  }

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  const handleSearch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [tipo]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold mb-4">
        {courseName ? `Horários para ${courseName}` : 'Carregando...'}
      </h1>
      <div className="flex flex-col items-center mb-4">
        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          className="p-2 border border-gray-300 mb-2"
        >
          <option value="todos">Todos os Cursos</option>
          {tipo === 'ensinoMedio' && (
            <>
              <option value="agroindustria">Técnico em Agroindústria</option>
              <option value="agropecuaria">Técnico em Agropecuária</option>
              <option value="informatica">Técnico em Informática</option>
            </>
          )}
          {tipo === 'ensinoSuperior' && (
            <>
              <option value="engenharia_alimentos">Bacharelado em Engenharia de Alimentos</option>
              <option value="engenharia_florestal">Bacharelado em Engenharia Florestal</option>
              <option value="sistemas_informacao">Bacharelado em Sistemas de Informação</option>
              <option value="medicina_veterinaria">Bacharelado em Medicina Veterinária</option>
              <option value="biologia">Licenciatura em Ciências Biológicas</option>
              <option value="fisica">Licenciatura em Física</option>
              <option value="matematica">Licenciatura em Matemática</option>
              <option value="quimica">Licenciatura em Química</option>
              <option value="pedagogia">Licenciatura em Pedagogia</option>
            </>
          )}
        </select>
        <button onClick={handleSearch} className="bg-blue-500 text-white py-2 px-4 rounded">
          Buscar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.length === 1 ? (
                  <th colSpan={maxColumns} className="border border-gray-300 p-2">
                    {row[0]}
                  </th>
                ) : (
                  Array.from({ length: maxColumns }).map((_, colIndex) => (
                    <td key={colIndex} className={`border border-gray-300 p-2 text-center ${colIndex === 0 ? 'font-bold' : ''}`}>
                      {colIndex < row.length ? row[colIndex] : ''}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => window.history.back()}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}