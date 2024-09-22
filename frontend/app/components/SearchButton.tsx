'use client';

interface SearchButtonProps {
  onClick: () => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button onClick={onClick} className="bg-blue-500 text-white py-2 px-4 rounded">
      Buscar
    </button>
  );
}