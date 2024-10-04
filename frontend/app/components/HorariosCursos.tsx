import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCourseData } from '../api/routes';
import ListaSuspensa from './DropdownList';
import BotaoBuscar from './SearchButton';
import DownloadButton from './DownloadButton';
import BotaoVoltar from './BackButton';
import TabelaCursos from './TabelaCursos';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function HorariosCursos() {
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [hasSearched, setHasSearched] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      pdf.text('Nenhum dado disponível', 105, 80, { align: 'center' });
      pdf.save('Horário Curso.pdf');
    } else if (tableElement) {
      // Não permitir download do pdf quando o usuário selecionar todos de Ensino Superior
      // Pois dar problema na renderização do PDF (PDF Gigante)
      if (selectedCourse === "todos" && tipo === "ensinoSuperior") {
        setShowModal(true);
        return;
      }
      
      html2canvas(tableElement, { scale: 1.5 }).then((canvas) => {
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const pixelToMm = 0.264583;
        const pdfWidth = imgWidth * pixelToMm;
        const pdfHeight = imgHeight * pixelToMm;

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });

        const image = canvas.toDataURL('image/jpeg', 0.75);

        pdf.addImage(image, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Horário Curso - ${courseName}.pdf`);
      });
    } else {
      console.error('Tabela não encontrada.');
    }
  };

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
          <div className="flex items-center space-x-4">
            <BotaoBuscar onClick={fetchData} />
            <DownloadButton onClick={downloadTable} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <TabelaCursos rows={rows} maxColumns={maxColumns} courseName={courseName} loading={!hasSearched} />
        </div>
        <div className="flex justify-center mt-4">
          <BotaoVoltar />
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-center">
            <div className="bg-white border-t-4 border-red-600 rounded-lg p-6 max-w-sm mx-auto">
              <div className="flex flex-col items-center mb-4">
                <ExclamationCircleIcon className="h-36 w-36 text-red-500 mb-2" />
                <h2 className="text-xl font-bold text-red-600">ATENÇÃO</h2>
              </div>
              <p className="mb-4 font-bold">No momento, não é possível fazer o download do PDF dessa tabela pois é muito grande</p>
              <p className="mb-4">Por favor, selecione um curso superior específico para fazer o download</p>
              <button className="bg-blue-500 font-bold text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}