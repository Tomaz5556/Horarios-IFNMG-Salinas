package com.ifnmg.horarios;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.*;

@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
public class SheetsController {

    private final HorariosService horariosService;

    public SheetsController(HorariosService horariosService) {
        this.horariosService = horariosService;
    }

    // Mostrar os horários dos cursos técnicos
    @GetMapping("/ensinoMedio")
    public ResponseEntity<Map<String, Object>> getSheetValuesRangeEM(@RequestParam(value = "cursoSelecionado", required = false, defaultValue = "todos") String cursoSelecionado) throws IOException {
        return horariosService.getSheetValuesRangeEM(cursoSelecionado);
    }

    // Mostrar os horários dos cursos superiores
    @GetMapping("/ensinoSuperior")
    public ResponseEntity<Map<String, Object>> getSheetValuesRangeES(@RequestParam(value = "cursoSelecionado", required = false, defaultValue = "todos") String cursoSelecionado) throws IOException {
        return horariosService.getSheetValuesRangeES(cursoSelecionado);
    }

    // Mostrar os horários dos professores
    @GetMapping("/Professores")
    public ResponseEntity<Map<String, Object>> getSheetValuesRangeHP(@RequestParam(value = "professorSelecionado", required = false) String professorSelecionado) throws IOException {
        return horariosService.getSheetValuesRangeHP(professorSelecionado);
    }

    // Mostrar os horários de ocupação das salas
    @GetMapping("/Salas")
    public ResponseEntity<Map<String, Object>> getSheetValuesRangeHS(@RequestParam(value = "salaSelecionada", required = false) String salaSelecionada) throws IOException {
        return horariosService.getSheetValuesRangeHS(salaSelecionada);
    }
}