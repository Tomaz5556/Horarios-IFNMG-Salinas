interface DownloadButtonProps {
    onClick: () => void;
  }
  
  export default function DownloadButton({ onClick }: DownloadButtonProps) {
    return (
      <button onClick={onClick} className="bg-blue-700 dark:bg-neutral-500 text-white 
      font-bold py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-neutral-600 
      active:bg-blue-800 dark:active:bg-neutral-800">
        Baixar
      </button>
    );
  }