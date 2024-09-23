'use client';

import { useState, useEffect } from 'react';
import { fetchProfessorData } from '../../api/routes';
import ListaSuspensa from '../../components/DropdownList';
import BotaoBuscar from '../../components/SearchButton';
import BotaoVoltar from '../../components/BackButton';

export default function Professores() {
  const [rows, setRows] = useState<any[]>([]);
  const [horas, setHoras] = useState('');
  const [professores, setProfessores] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');

  const fetchData = async () => {
    try {
      const data = await fetchProfessorData(selectedProfessor);
      setRows(data.rows);
      setHoras(data.horas);
    } catch (error) {
      console.error("Erro ao buscar dados dos professores:", error);
    }
  };

  useEffect(() => {
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
        <ListaSuspensa
          value={selectedProfessor}
          onChange={handleProfessorChange}
          options={professores}
          label="Selecione um professor"
        />
        <BotaoBuscar onClick={fetchData} />
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
                  </td>
                  <td className="border border-gray-300 p-2 text-center">{row[1]}</td>
                  <td className="border border-gray-300 p-2 text-center">{row[3]}</td>
                  <td className="border border-gray-300 p-2 text-center">{row[5]}</td>
                  <td className="border border-gray-300 p-2 text-center">{row[7]}</td>
                  <td className="border border-gray-300 p-2 text-center">{row[9]}</td>
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
        <BotaoVoltar />
      </div>
    </div>
  );
}