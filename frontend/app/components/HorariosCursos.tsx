import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCourseData } from '../api/routes';
import ListaSuspensa from '../components/DropdownList';
import BotaoBuscar from '../components/SearchButton';
import BotaoVoltar from '../components/BackButton';
import TabelaCursos from '../components/TabelaCursos';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadButton from './DownloadButton';

export default function HorariosCursos() {
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [maxColumns, setMaxColumns] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [hasSearched, setHasSearched] = useState(false);
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
      // Caso não tenha dados gerar PDF com mensagem "Nenhum dado disponível"
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Nenhum dado disponível', 105, 80, { align: 'center' });
      pdf.save('tabela-cursos-nenhum-dado.pdf');
    } else if (tableElement) {
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
        pdf.save('tabela-cursos-com-dados.pdf');
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
      </div>
    </div>
  );
}