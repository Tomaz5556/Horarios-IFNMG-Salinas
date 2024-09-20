'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Função para buscar os dados da API
async function fetchEnsinoMedioData() {
  const response = await fetch('http://localhost:8080/ensinoMedio');
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados');
  }
  return response.json();
}

export default function EnsinoMedioPage() {
  const [data, setData] = useState<Array<Array<string>>>([]);
  const [loading, setLoading] = useState(true);

  // Defina o número fixo de colunas que espera para a tabela (ajuste conforme necessário)
  const NUM_COLUNAS = 21;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchEnsinoMedioData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="border-t-4 border-green-700 mb-8"></div>

      <h1 className="text-2xl font-bold text-center mb-8">Horários do Ensino Médio</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-4/5 mx-auto border-collapse">
            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {Array.from({ length: NUM_COLUNAS }).map((_, cellIndex) => (
                      <td key={cellIndex} className="border px-4 py-2 text-left text-sm">
                        {row[cellIndex] || '' /* Garante que a célula tenha pelo menos um valor vazio */}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={NUM_COLUNAS} className="border px-4 py-2 text-center">
                    Nenhum dado encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/ensinoSuperior" className="block w-80 mx-auto mt-8 bg-red-500 text-white text-center py-2 rounded-lg text-lg">
        Voltar para Ensino Superior
      </Link>
    </div>
  );
}