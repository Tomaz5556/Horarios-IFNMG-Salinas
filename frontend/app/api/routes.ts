import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const fetchCourseData = async (cursoSelecionado: string, tipo: string) => {
  const url = tipo === 'ensinoMedio' ? `/ensinoMedio?cursoSelecionado=${cursoSelecionado}` : `/ensinoSuperior?cursoSelecionado=${cursoSelecionado}`;
  const response = await api.get(url);
  return response.data;
};

export const fetchProfessorData = async (professorSelecionado: string) => {
  const url = `/professores?professorSelecionado=${professorSelecionado}`;
  const response = await api.get(url);
  return response.data;
};

export const fetchSalaData = async (salaSelecionada: string) => {
  const url = `/salas?salaSelecionada=${salaSelecionada}`;
  const response = await api.get(url);
  return response.data;
};

export const fetchLoginData = async (usuario: string, senha: string) => {
  const response = await api.get(`/login`, {
    params: { usuario, senha },
  });
  return response.data;
};

export const fetchValidacaoData = async () => {
  const url = `/validacao`;
  const response = await api.get(url);
  return response.data;
};

export default api;