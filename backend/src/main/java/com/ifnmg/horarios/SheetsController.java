package com.ifnmg.horarios;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
public class SheetsController {

    private final SheetsService sheetsService;

    public SheetsController(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    @GetMapping("/ensinoMedio")
    @ResponseBody // Retorna o JSON diretamente
    public List<List<Object>> getSheetValuesRangeEnsinoMedio() throws IOException {
        String range = "Horário - Ensino Médio!A1:G21"; // Defina o range específico para o Ensino Médio
        return sheetsService.getSheetValues(range);
    }
}