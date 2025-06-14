package com.ifnmg.horarios.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifnmg.horarios.model.Horarios;
import com.ifnmg.horarios.service.HorariosService;

@RestController
public class SheetsController {

    private final HorariosService horariosService;

    public SheetsController(HorariosService horariosService) {
        this.horariosService = horariosService;
    }

    // Mostrar os horários dos cursos técnicos
    @GetMapping("/ensinoMedio")
    public ResponseEntity<Horarios> getSheetsMedio(@RequestParam(required = false, defaultValue = "todos") String cursoSelecionado) throws IOException {
        return horariosService.getSheetsValuesMedio(cursoSelecionado);
    }

    // Mostrar os horários dos cursos superiores
    @GetMapping("/ensinoSuperior")
    public ResponseEntity<Horarios> getSheetsSuperior(@RequestParam(required = false, defaultValue = "todos") String cursoSelecionado) throws IOException {
        return horariosService.getSheetsValuesSuperior(cursoSelecionado);
    }

    // Mostrar os horários dos professores
    @GetMapping("/professores")
    public ResponseEntity<Horarios> getSheetsProfessores(@RequestParam(required = false) String professorSelecionado) throws IOException {
        return horariosService.getSheetsValuesProfessores(professorSelecionado);
    }

    // Mostrar os horários de ocupação das salas
    @GetMapping("/salas")
    public ResponseEntity<Horarios> getSheetsSalas(@RequestParam(required = false) String salaSelecionada) throws IOException {
        return horariosService.getSheetsValuesSalas(salaSelecionada);
    }

    // Permissões para ver validação da planilha
    @GetMapping("/login")
    public ResponseEntity<String> getSheetsLogin(@RequestParam String usuario, @RequestParam String senha) throws IOException {
        boolean autenticado = horariosService.getSheetsValuesLogin(usuario, senha);
        if (!autenticado) {
            return ResponseEntity.status(401).body("Usuário ou senha inválidos");
        }
        return ResponseEntity.ok("Autenticado com sucesso");
    }

    // Validar dados da planilha
    @GetMapping("/validacao")
    public ResponseEntity<Horarios> getSheetsValidation() throws IOException {
        return horariosService.getSheetsValuesValidation();
    }
}