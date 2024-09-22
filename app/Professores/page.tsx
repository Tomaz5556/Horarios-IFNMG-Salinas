'use client';

import { useState, useEffect } from 'react';
import { fetchProfessorData } from '../api';

export default function Professores() {
  const [rows, setRows] = useState<any[]>([]);
  const [horas, setHoras] = useState('');
  const [professores, setProfessores] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');

  // Função para buscar dados da API
  const fetchData = async () => {
    try {
      const data = await fetchProfessorData(selectedProfessor);
      setRows(data.rows);
      setHoras(data.horas);
      setProfessores(data.professores);
    } catch (error) {
      console.error("Erro ao buscar dados dos professores:", error);
    }
  };

  useEffect(() => {
    // Busca a lista de professores na montagem inicial da página
    const fetchProfessores = async () => {
      try {
        const data = await fetchProfessorData('');
        setProfessores(data.professores);
      } catch (error) {
        console.error("Erro ao buscar lista de professores:", error);
      }
    };

    fetchProfessores();
  }, []);

  const handleProfessorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfessor(e.target.value);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold mb-4">Horários - Professor</h1>

      <div className="flex flex-col items-center mb-4">
        <select
          value={selectedProfessor}
          onChange={handleProfessorChange}
          className="p-2 border border-gray-300 mb-2"
        >
          <option value="">Selecione um professor</option>
          {professores.length > 0 ? (
            professores.map((professor, index) => (
              <option key={index} value={professor}>
                {professor}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Carregando professores...
            </option>
          )}
        </select>
        <button onClick={fetchData} className="bg-blue-500 text-white py-2 px-4 rounded">
          Buscar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Horários</th>
              <th className="border border-gray-300 p-2">SEGUNDA</th>
              <th className="border border-gray-300 p-2">TERÇA</th>
              <th className="border border-gray-300 p-2">QUARTA</th>
              <th className="border border-gray-300 p-2">QUINTA</th>
              <th className="border border-gray-300 p-2">SEXTA</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.slice(0, rows.length - 1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border border-gray-300 p-2 text-center font-bold">
                    {row[0]}
                  </td> {/* Horários */}
                  <td className="border border-gray-300 p-2 text-center">{row[1]}</td> {/* Segunda */}
                  <td className="border border-gray-300 p-2 text-center">{row[3]}</td> {/* Terça */}
                  <td className="border border-gray-300 p-2 text-center">{row[5]}</td> {/* Quarta */}
                  <td className="border border-gray-300 p-2 text-center">{row[7]}</td> {/* Quinta */}
                  <td className="border border-gray-300 p-2 text-center">{row[9]}</td> {/* Sexta */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border border-gray-300 p-2 text-center">
                  Nenhum dado disponível
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="font-bold float-right mt-4 bg-gray-500 text-white p-2 rounded-md inline-block">
        CH - Total: {horas}
      </p>

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