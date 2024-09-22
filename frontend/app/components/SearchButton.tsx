'use client';

interface SearchButtonProps {
  onClick: () => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button onClick={onClick} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500">
      Buscar
    </button>
  );
}