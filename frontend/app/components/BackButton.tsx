'use client';

export default function BackButton() {
  return (
    <button
      onClick={() => window.location.href = '/'}
      className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
    >
      Voltar
    </button>
  );
}