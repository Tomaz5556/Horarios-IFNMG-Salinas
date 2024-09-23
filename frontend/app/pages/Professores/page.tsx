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
      <h1 className="text-center text-2xl font-bold mb-4">Selecione o Professor</h1>

      <div className="flex flex-col items-center mb-4">
        <ListaSuspensa
          value={selectedProfessor}
          onChange={handleProfessorChange}
          options={professores}
          label=""
        />
        <BotaoBuscar onClick={fetchData} />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-neutral-500">
          <thead>
            <tr>
              <th className="border border-neutral-500 p-3 text-center">Horários</th>
              <th className="border border-neutral-500 p-3 text-center">SEGUNDA</th>
              <th className="border border-neutral-500 p-3 text-center">TERÇA</th>
              <th className="border border-neutral-500 p-3 text-center">QUARTA</th>
              <th className="border border-neutral-500 p-3 text-center">QUINTA</th>
              <th className="border border-neutral-500 p-3 text-center">SEXTA</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.slice(0, rows.length - 1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className={`border border-neutral-500 p-3 text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis`} style={{ width: '150px', maxWidth: '150px' }}>
                    {row[0]}
                  </td>
                  <td className="border border-neutral-500 p-3 text-center">{row[1]}</td>
                  <td className="border border-neutral-500 p-3 text-center">{row[3]}</td>
                  <td className="border border-neutral-500 p-3 text-center">{row[5]}</td>
                  <td className="border border-neutral-500 p-3 text-center">{row[7]}</td>
                  <td className="border border-neutral-500 p-3 text-center">{row[9]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border border-neutral-500 p-3 text-center">
                  Nenhum dado disponível
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center mt-4">
        <p className="font-bold bg-gray-500 text-white p-3 rounded-md inline-block">
          Carga Horária - Total: {horas}
        </p>
        <div className="mt-4">
          <BotaoVoltar />
        </div>
      </div>
    </div>
  );
}