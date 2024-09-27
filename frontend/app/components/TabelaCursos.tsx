interface TabelaCursosProps {
    rows: any[];
    maxColumns: number;
    courseName: string;
}

const TabelaCursos = ({ rows, maxColumns, courseName }: TabelaCursosProps) => {
    const emptyColumns: number[] = [];

    rows.forEach((row, rowIndex) => {
        const isFirstLineAfterDay = rowIndex > 0 && rows[rowIndex - 1].length === 1;

        if (isFirstLineAfterDay) {
            row.forEach((cell: any, colIndex: number) => {
                if (!cell && !emptyColumns.includes(colIndex)) {
                    emptyColumns.push(colIndex);
                }
            });
        }
    });

    return (
        <table className="bg-white table-auto w-full border-collapse border border-neutral-500 text-sm">
            <tbody>
                {rows.length > 0 ? (
                    rows.map((row, rowIndex) => {
                        const isFirstLineAfterDay = rowIndex > 0 && rows[rowIndex - 1].length === 1;

                        return (
                            <tr key={rowIndex}>
                                {row.length === 1 ? (
                                    <th colSpan={maxColumns} className="bg-neutral-200 border border-neutral-500 p-3">
                                        {row[0]}
                                    </th>
                                ) : (
                                    Array.from({ length: maxColumns }).map((_, colIndex) => (
                                        <td className={`border border-neutral-500 p-3 text-center ${isFirstLineAfterDay ? 'bg-neutral-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis' : colIndex === 0 ? 'bg-gray-300 font-bold whitespace-nowrap overflow-hidden text-ellipsis w-[150px] max-w-[150px]' : 'whitespace-normal min-w-[100px]'} ${emptyColumns.includes(colIndex) ? 'bg-neutral-400' : ''}`}>
                                            {courseName !== 'Todos os Cursos - Ensino Médio' && courseName !== 'Todos os Cursos - Ensino Superior' && colIndex < row.length ? row[colIndex] || '-------' : colIndex < row.length ? row[colIndex] : ''}
                                        </td>
                                    ))
                                )}
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={maxColumns} className="border border-neutral-500 p-2 text-center">
                            Nenhum dado disponível
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TabelaCursos;  