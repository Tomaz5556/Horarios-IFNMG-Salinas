import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchValidacaoData } from '../../api/routes';
import ValidateButton from '../common/buttons/ValidateButton';
import TabelaValidacao from '../tables/TabelaValidacao';

export default function ValidacaoDados() {
  const router = useRouter();

  useEffect(() => {
    const handleBackButton = () => {
      window.location.replace('/');
    };
  
    const autenticado = localStorage.getItem('autenticado') === 'true';
    if (!autenticado) {
      router.replace('/pages/Login');
      return;
    }
  
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);
  
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [router]);
  
  const [rows, setRows] = useState<(string | null)[][]>([]);
  const [validacoes, setValidacoes] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState('');

  const fetchData = async () => {
    try {
      const data = await fetchValidacaoData();
      setRows(data.rows || []);
      setValidacoes(data.validacoes || []);
      if ((data.rows || []).length === 0 && data.validacoes?.[6] === "SIM") {
        setMensagem("✅ Todas as validações foram concluídas com sucesso, a planilha está em ótimo estado!");
        return;
      }
      setMensagem("⚠️ Foram encontradas inconsistências na planilha!");
    } catch (error) {
      console.error("Erro ao realizar a validação da planilha:", error);
      setMensagem("❌ Erro ao realizar a validação da planilha!");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="min-h-screen container mx-auto px-2 py-6">
        <h1 className="font-sans font-semibold text-center text-3xl mb-4 text-black dark:text-white">Validação de Dados</h1>
        <div className="flex flex-col items-center mb-4 text-black dark:text-white">
          <ValidateButton onClick={fetchData} />
        </div>

        <div className="overflow-x-auto">
          <TabelaValidacao rows={rows} validacoes={validacoes} />
        </div>
        <div className="flex flex-col items-center mt-4">
          {mensagem && (
            <p className="text-center font-sans font-bold bg-neutral-500 dark:bg-white p-3 rounded-md inline-block text-white dark:text-black">
              {mensagem}
            </p>
          )}
          <div className="mt-4">
            <button onClick={() => { localStorage.removeItem('autenticado'); router.replace('/pages/Login'); }} className="font-sans font-bold bg-red-700 dark:bg-black text-white px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-neutral-800 transition dark:border border-bg-neutral-500 active:bg-red-800 dark:active:bg-neutral-600">
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}