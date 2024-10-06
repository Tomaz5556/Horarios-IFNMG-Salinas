import { useState, useEffect } from 'react';
import { fetchProfessorData } from '../api/routes';
import ListaSuspensa from './DropdownList';
import BotaoBuscar from './SearchButton';
import DownloadButton from './DownloadButton';
import BotaoVoltar from './BackButton';
import TabelaProfessores from './TabelaProfessores';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function HorariosProfessores() {
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

  const downloadTable = () => {
    const tableElement = document.querySelector('table');

    if (!rows.length) {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Nenhum resultado foi encontrado.', 105, 80, { align: 'center' });
      pdf.save('Horário Professor.pdf');
    } else if (tableElement) {
      html2canvas(tableElement, { scale: 2 }).then((canvas) => {
        const pixelToMm = 0.264583;
        const imgWidth = canvas.width * pixelToMm;
        const imgHeight = canvas.height * pixelToMm;

        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [imgWidth, imgHeight]
        });

        const image = canvas.toDataURL('image/jpeg', 1.0);

        pdf.addImage(image, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Horário Professor - ${selectedProfessor}.pdf`);
      });
    } else {
      console.error('Tabela não encontrada.');
    }
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
          <div className="flex items-center space-x-4">
            <BotaoBuscar onClick={fetchData} />
            <DownloadButton onClick={downloadTable} />
          </div>
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