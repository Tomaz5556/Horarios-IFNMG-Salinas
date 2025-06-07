interface SearchButtonProps {
  onClick: () => void;
}

export default function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button onClick={onClick} className="cursor-pointer font-sans font-bold bg-green-700 dark:bg-white text-white dark:text-black py-2 px-4 rounded hover:bg-green-600 dark:hover:bg-neutral-200 active:bg-green-800 dark:active:bg-neutral-500">
      Buscar
    </button>
  );
}