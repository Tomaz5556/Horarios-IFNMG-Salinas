'use client';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition"
    >
      Voltar
    </button>
  );
}