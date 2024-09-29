'use client';

import { useState, useEffect } from 'react';
import { fetchProfessorData } from '../../api/routes';
import ListaSuspensa from '../../components/DropdownList';
import BotaoBuscar from '../../components/SearchButton';
import BotaoVoltar from '../../components/BackButton';
import TabelaProfessores from '../../components/TabelaProfessores';

export default function Professores() {
  const [rows, setRows] = useState<(string | null)[][]>([]);
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="min-h-screen container mx-auto px-2 py-6">
        <h1 className="text-center text-2xl font-bold mb-4 text-black dark:text-white">Selecione o Professor</h1>
        <div className="flex flex-col items-center mb-4 text-black dark:text-white">
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
          <p className="bg-neutral-500 dark:bg-white font-bold p-3 rounded-md inline-block text-white dark:text-black">
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