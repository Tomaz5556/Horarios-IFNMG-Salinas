interface TabelaProfessoresProps {
    rows: any[];
}

export default function TabelaProfessores({ rows }: TabelaProfessoresProps) {
    const renderCellContent = (content: string) => {
        const isMultipleClasses = content.includes('+');

        return (
            <span className={isMultipleClasses ? 'font-bold' : ''}>
                {content}
            </span>
        );
    };

    return (
        <table className="bg-white table-auto w-full border-collapse border border-neutral-500">
            <thead>
                <tr>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center">HORÁRIO</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center">SEGUNDA</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center">TERÇA</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center">QUARTA</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center">QUINTA</th>
                    <th className="bg-neutral-400 border border-neutral-500 p-3 text-center">SEXTA</th>
                </tr>
            </thead>
            <tbody>
                {rows.length > 0 ? (
                    rows.slice(0, rows.length - 1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="bg-gray-300 border border-neutral-500 p-3 text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis w-[150px] max-w-[150px]">
                                {row[0]}
                            </td>
                            <td className="border border-neutral-500 p-3 text-center">{renderCellContent(row[1])}</td>
                            <td className="border border-neutral-500 p-3 text-center">{renderCellContent(row[3])}</td>
                            <td className="border border-neutral-500 p-3 text-center">{renderCellContent(row[5])}</td>
                            <td className="border border-neutral-500 p-3 text-center">{renderCellContent(row[7])}</td>
                            <td className="border border-neutral-500 p-3 text-center">{renderCellContent(row[9])}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="border border-neutral-500 p-3 text-center">
                            Nenhum dado disponível
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};