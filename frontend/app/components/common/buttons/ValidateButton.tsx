interface ValidateButtonProps {
  onClick: () => void;
}

export default function ValidateButton({ onClick }: ValidateButtonProps) {
  return (
    <button onClick={onClick} className="cursor-pointer font-sans font-bold bg-cyan-600 dark:bg-white text-white dark:text-black py-2 px-4 rounded hover:bg-cyan-500 dark:hover:bg-neutral-200 active:bg-cyan-700 dark:active:bg-neutral-500">
      Iniciar
    </button>
  );
}