interface SearchButtonProps {
  onClick: () => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button onClick={onClick} className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600">
      Buscar
    </button>
  );
}