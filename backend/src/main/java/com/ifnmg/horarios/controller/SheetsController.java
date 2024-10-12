package com.ifnmg.horarios.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifnmg.horarios.model.Horarios;
import com.ifnmg.horarios.service.HorariosService;

@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
public class SheetsController {

    private final HorariosService horariosService;

    public SheetsController(HorariosService horariosService) {
        this.horariosService = horariosService;
    }

    // Mostrar os horários dos cursos técnicos
    @GetMapping("/ensinoMedio")
    public ResponseEntity<Horarios> getSheetValuesRangeEM(@RequestParam(value = "cursoSelecionado", required = false, defaultValue = "todos") String cursoSelecionado) throws IOException {
        return horariosService.getSheetValuesRangeEM(cursoSelecionado);
    }

    // Mostrar os horários dos cursos superiores
    @GetMapping("/ensinoSuperior")
    public ResponseEntity<Horarios> getSheetValuesRangeES(@RequestParam(value = "cursoSelecionado", required = false, defaultValue = "todos") String cursoSelecionado) throws IOException {
        return horariosService.getSheetValuesRangeES(cursoSelecionado);
    }

    // Mostrar os horários dos professores
    @GetMapping("/Professores")
    public ResponseEntity<Horarios> getSheetValuesRangeHP(@RequestParam(value = "professorSelecionado", required = false) String professorSelecionado) throws IOException {
        return horariosService.getSheetValuesRangeHP(professorSelecionado);
    }

    // Mostrar os horários de ocupação das salas
    @GetMapping("/Salas")
    public ResponseEntity<Horarios> getSheetValuesRangeHS(@RequestParam(value = "salaSelecionada", required = false) String salaSelecionada) throws IOException {
        return horariosService.getSheetValuesRangeHS(salaSelecionada);
    }
}