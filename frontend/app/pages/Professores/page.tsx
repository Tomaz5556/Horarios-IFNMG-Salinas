'use client';

import { useState, useEffect } from 'react';
import { fetchProfessorData } from '../../api/routes';
import ListaSuspensa from '../../components/DropdownList';
import BotaoBuscar from '../../components/SearchButton';
import BotaoVoltar from '../../components/BackButton';
import TabelaProfessores from '../../components/TabelaProfessores';

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

  const renderCellContent = (content: string) => {
    const isMultipleClasses = content.includes('+');

    return (
      <span className={isMultipleClasses ? 'font-bold' : ''}>
        {content}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="min-h-screen container mx-auto px-0 py-6">
        <h1 className="text-center text-2xl font-bold mb-4">Selecione o Professor</h1>
        <div className="flex flex-col items-center mb-4">
          <ListaSuspensa
            value={selectedProfessor}
            onChange={handleProfessorChange}
            options={professores}
            label="Disciplina (Professor)"
          />
          <BotaoBuscar onClick={fetchData} />
        </div>

        <div className="overflow-x-auto">
          <TabelaProfessores rows={rows} />
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
    </div>
  );
}