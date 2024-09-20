'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchEnsinoMedioData } from '../api';

export default function EnsinoMedioPage() {
  const [data, setData] = useState<Array<Array<string>>>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white border-t-4 border-green-700 p-8 rounded-lg shadow-lg text-center w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">Horários do Ensino Médio</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table-auto w-4/5 mx-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Horários</th>
                <th className="border px-4 py-2">Segunda</th>
                <th className="border px-4 py-2">Terça</th>
                <th className="border px-4 py-2">Quarta</th>
                <th className="border px-4 py-2">Quinta</th>
                <th className="border px-4 py-2">Sexta</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <Link href="/" className="block w-80 mx-auto mt-8 bg-red-500 text-white text-center py-2 rounded-lg">
          Voltar
        </Link>
      </div>
    </div>
  );
}