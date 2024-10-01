interface TabelaCursosProps {
    rows: (string | null)[][];
    maxColumns: number;
    courseName: string;
    loading: boolean;
}

export default function TabelaCursos({ rows, maxColumns, courseName, loading }: TabelaCursosProps) {
    const emptyColumns: number[] = [];
    const daysOfWeek = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA'];
    let currentDayIndex = -1;
    const dayStarts: number[] = [];

    rows.forEach((row, rowIndex) => {
        if (row.length === 1) {
            dayStarts.push(rowIndex);
        }
    });

    rows.forEach((row, rowIndex) => {
        const isFirstLineAfterDay = rowIndex > 0 && rows[rowIndex - 1].length === 1;

        if (isFirstLineAfterDay) {
            row.forEach((cell, colIndex: number) => {
                if (!cell && !emptyColumns.includes(colIndex)) {
                    emptyColumns.push(colIndex);
                }
            });
        }
    });

    return (
        <table className="bg-white dark:bg-black table-auto w-full border-collapse border border-neutral-500 text-xs md:text-sm text-black">
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={maxColumns + 1} className="dark:text-white border border-neutral-500 p-2 text-center">
                            Nenhum dado disponível
                        </td>
                    </tr>
                ) : (
                    rows.map((row, rowIndex) => {
                        let rowSpanForDay = 1;

                        if (dayStarts.includes(rowIndex)) {
                            const nextDayStart = dayStarts[dayStarts.indexOf(rowIndex) + 1] || rows.length;
                            rowSpanForDay = nextDayStart - rowIndex;

                            currentDayIndex++;
                        }

                        const isFirstLineAfterDay = rowIndex > 0 && dayStarts.includes(rows[rowIndex - 1].length === 1 ? rowIndex - 1 : -1);

                        return (
                            <tr key={rowIndex}>
                                {dayStarts.includes(rowIndex) && (
                                    <td rowSpan={rowSpanForDay} className="bg-neutral-200 border border-neutral-500 p-3 font-bold text-center text-base sticky left-[-10px] z-10">
                                        <div className="transform rotate-[-90deg]">
                                            {daysOfWeek[currentDayIndex]}
                                        </div>
                                    </td>
                                )}
                                {row.length === 1 ? null : (
                                    Array.from({ length: maxColumns }).map((_, colIndex) => (
                                        <td key={colIndex} className={`border border-neutral-500 p-3 text-center ${isFirstLineAfterDay ? 'bg-neutral-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis' :
                                            colIndex === 0 ? 'bg-zinc-300 font-bold whitespace-nowrap overflow-hidden text-ellipsis w-[150px] max-w-[150px] sticky left-[93px] z-10' : 'dark:text-white whitespace-normal min-w-[100px]'} 
                                            ${emptyColumns.includes(colIndex) ? 'bg-neutral-400' : ''}`}>
                                                {courseName !== 'Todos os Cursos - Ensino Médio' && courseName !== 'Todos os Cursos - Ensino Superior' && colIndex < row.length ? row[colIndex] || '-------' : colIndex < row.length ? row[colIndex] : ''}
                                        </td>
                                    ))
                                )}
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}