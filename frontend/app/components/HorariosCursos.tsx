import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCourseData } from '../api/routes';
import ListaSuspensa from './DropdownList';
import BotaoBuscar from './SearchButton';
import DownloadButton from './DownloadButton';
import BotaoVoltar from './BackButton';
import TabelaCursos from './TabelaCursos';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function HorariosCursos() {
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [hasSearched, setHasSearched] = useState(false);
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo');
  const dialogRef = useRef<HTMLDialogElement>(null);

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
        if (dialogRef.current) {
          dialogRef.current.showModal();
        }
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

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
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
        <dialog ref={dialogRef} className="bg-white border-t-4 border-red-500 rounded-lg max-w-sm w-full p-6 shadow-lg backdrop:bg-black/50">
          <div className="flex flex-col items-center mb-4">
            <XCircleIcon className="h-28 w-28 text-red-500 mb-2" />
            <h2 className="text-center text-3xl font-bold text-black">Ops!</h2>
          </div>
          <p className=" text-center text-lg text-black mb-4">Não é possível fazer o download do PDF. Pois, a tabela é muito grande!</p>
          <div className="flex justify-center">
            <button className="bg-red-700 text-white font-bold px-4 py-2 rounded-md hover:bg-red-600 transition active:bg-red-800" onClick={handleCloseDialog}>Fechar</button>
          </div>
        </dialog>
      </div>
    </div>
  );
}