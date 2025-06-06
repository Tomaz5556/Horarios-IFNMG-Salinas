import { useState } from 'react';
import { fetchSalaData } from '../../api/routes';
import ListaSuspensa from '../common/dropdowns/DropdownList';
import BotaoBuscar from '../common/buttons/SearchButton';
import DownloadButton from '../common/buttons/DownloadButton';
import BotaoVoltar from '../common/buttons/BackButton';
import TabelaSalas from '../tables/TabelaSalas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function HorariosSalas() {
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [selectedSala, setselectedSala] = useState('');

  const fetchData = async () => {
    try {
      const data = await fetchSalaData(selectedSala);
      setRows(data.rows);
    } catch (error) {
      console.error("Erro ao buscar dados dos salas:", error);
    }
  };

  const OptionsSalas = [
    "(1/3)", "(1/4)", "(1/5)", "(1/6)", "(1/7)", "(1/8)", "(1/9)", "(1/10)",
    "(1/11)", "(1/12)", "(1/13)", "(1/14)", "(1/15)", "(1/16)", "(1/17)",
    "(2/1)", "(2/2)", "(2/3)", "(2/4)", "(2/5)", "(2/6)", "(3/7)", "(3/8)",
    "(3/9)", "(3/10)", "(3/11)", "(Agricult. I)", "(Agricult. II)", 
    "(Agricult. III)", "(Agroin. 1)", "(Agroin. 2)", "(Anexo Lab. Solos)", 
    "(CELIN 1)", "(CELIN 2)", "(HV 1)", "(HV 2)", "(HV 3)", "(HV 4)", 
    "(Lab. 1 - Info)", "(Lab. 2 - Info)", "(Lab. 3 - Info)", "(Lab. 4 - Info)",
    "(Lab. Bromatologia)", "(Lab. Fenôm. de Transportes)", "(Lab. Física)",
    "(Lab. Invertebrados)", "(Lab. Microscopia)", "(Lab. Química I)", 
    "(Lab. Química II)", "(Lab. Redes)", "(LEM)", "(Mini 1)", "(Mini 2)", 
    "(Sala de Topografia)", "(Sala Suinocultura)", "(Sl. Análise Sensorial)", 
    "(Zoo I)", "(Zoo II)", "(Zoo III)"
  ];

  const handleSalaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedSala(e.target.value);
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
      pdf.save('Horário Sala.pdf');
      return;
    } 
    
    if (!tableElement) {
      console.error('Tabela não encontrada.');
      return;
    }
    
    html2canvas(tableElement, { scale: 2 }).then((canvas) => {
      const pixelToMm = 0.264583;
      const imgWidth = canvas.width * pixelToMm;
      const imgHeight = canvas.height * pixelToMm;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [imgWidth, imgHeight]
      });

      const image = canvas.toDataURL('image/png', 1.0);

      pdf.addImage(image, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`Horário Sala - ${selectedSala}.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="min-h-screen container mx-auto px-2 py-6">
        <h1 className="font-sans font-semibold text-center text-3xl mb-4 text-black dark:text-white">Selecione a Sala</h1>
        <div className="flex flex-col items-center mb-4 text-black dark:text-white">
          <ListaSuspensa
            value={selectedSala}
            onChange={handleSalaChange}
            options={OptionsSalas}
            label="Turmas (Salas)"
          />
          <div className="flex items-center space-x-4">
            <BotaoBuscar onClick={fetchData} />
            <DownloadButton onClick={downloadTable} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <TabelaSalas rows={rows} />
        </div>
        <div className="flex justify-center mt-4">
          <BotaoVoltar />
        </div>
      </div>
    </div>
  );
}