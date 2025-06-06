package com.ifnmg.horarios.service;

import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.ifnmg.horarios.model.Horarios;

@RequiredArgsConstructor
@Service
public class HorariosService {

    private final CursosMedioService cursosMedioService;
    private final CursosSuperiorService cursosSuperiorService;
    private final ProfessoresService professoresService;
    private final SalasService salasService;
    private final LoginService loginService;
    private final ValidacoesService validacoesService;

    // Retornar os horários dos cursos técnicos
    public ResponseEntity<Horarios> getSheetsValuesMedio(String cursoSelecionado) throws IOException {
        return cursosMedioService.getSheetsValues(cursoSelecionado);
    }

    // Retornar os horários dos cursos superiores
    public ResponseEntity<Horarios> getSheetsValuesSuperior(String cursoSelecionado) throws IOException {
        return cursosSuperiorService.getSheetsValues(cursoSelecionado);
    }

    // Retornar os horários dos professores
    public ResponseEntity<Horarios> getSheetsValuesProfessores(String professorSelecionado) throws IOException {
        return professoresService.getSheetsValues(professorSelecionado);
    }

    // Retornar os horários de ocupação das salas
    public ResponseEntity<Horarios> getSheetsValuesSalas(String salaSelecionada) throws IOException {
        return salasService.getSheetsValues(salaSelecionada);
    }

    // Retornar autorização para ver validação da planilha
    public boolean getSheetsValuesLogin(String usuario, String senha) throws IOException {
        return loginService.getSheetsValues(usuario, senha);
    }

    // Retornar os dados para validação da planilha
    public ResponseEntity<Horarios> getSheetsValuesValidation() throws IOException {
        return validacoesService.getSheetsValues();
    }
}