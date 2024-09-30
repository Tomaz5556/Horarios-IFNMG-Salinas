import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const fetchCourseData = async (cursoSelecionado: string, tipo: string) => {
  const url = tipo === 'ensinoMedio' ? `/ensinoMedio?cursoSelecionado=${cursoSelecionado}` : `/ensinoSuperior?cursoSelecionado=${cursoSelecionado}`;
  const response = await api.get(url);
  return response.data;
};

export const fetchProfessorData = async (professorSelecionado: string) => {
  const url = `/Professores?professorSelecionado=${professorSelecionado}`;
  const response = await api.get(url);
  return response.data;
};

export default api;