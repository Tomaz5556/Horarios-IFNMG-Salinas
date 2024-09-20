import Link from 'next/link';

export default function EnsinoSuperiorPage() {
  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white border-t-4 border-green-700 p-8 rounded-lg shadow-lg text-center w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">Selecione o curso</h1>
        <form className="mb-8">
          <select className="block w-80 mx-auto p-3 border rounded-lg">
            <option value="todos">Todos os Cursos - Ensino Superior</option>
            <option value="engenharia_alimentos">Bacharelado em Engenharia de Alimentos</option>
            <option value="engenharia_florestal">Bacharelado em Engenharia Florestal</option>
            <option value="sistemas_informacao">Bacharelado em Sistemas de Informação</option>
            <option value="medicina_veterinaria">Bacharelado em Medicina Veterinária</option>
            <option value="biologia">Licenciatura em Ciências Biológicas</option>
            <option value="fisica">Licenciatura em Física</option>
            <option value="matematica">Licenciatura em Matemática</option>
            <option value="quimica">Licenciatura em Química</option>
            <option value="pedagogia">Licenciatura em Pedagogia</option>
          </select>
          <button type="submit" className="submit-button mt-4 w-80 mx-auto p-3 bg-green-700 text-white rounded-lg">Buscar</button>
        </form>
        <table className="table-auto w-4/5 mx-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Horários</th>
              <th className="border px-4 py-2">Segunda</th>
              <th className="border px-4 py-2">Terça</th>
              <th className="border px-4 py-2">Quarta</th>
              <th className="border px-4 py-2">Quinta</th>
              <th className="border px-4 py-2">Sexta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">08:00 - 09:00</td>
              <td className="border px-4 py-2">Aula 1</td>
              <td className="border px-4 py-2">Aula 2</td>
              <td className="border px-4 py-2">Aula 3</td>
              <td className="border px-4 py-2">Aula 4</td>
              <td className="border px-4 py-2">Aula 5</td>
            </tr>
          </tbody>
        </table>
        <Link href="/" className="block w-80 mx-auto mt-8 bg-red-500 text-white text-center py-2 rounded-lg">Voltar</Link>
      </div>
    </div>
  );
}