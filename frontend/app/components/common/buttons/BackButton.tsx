export default function BackButton() {
  return (
    <button onClick={() => window.location.href = '/'} className="cursor-pointer font-sans font-bold bg-red-700 dark:bg-black text-white px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-neutral-800 transition dark:border border-bg-neutral-500 active:bg-red-800 dark:active:bg-neutral-600">
      Voltar
    </button>
  );
}