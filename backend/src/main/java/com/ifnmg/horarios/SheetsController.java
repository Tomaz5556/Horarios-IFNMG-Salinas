package com.ifnmg.horarios;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.Collator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
public class SheetsController {

    private final SheetsService sheetsService;

    public SheetsController(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    // Mostrar os horários dos cursos técnicos
    @GetMapping("/ensinoMedio")
    public ResponseEntity<Map<String, Object>> getSheetValuesRangeEM(
            @RequestParam(value = "cursoSelecionado", required = false, defaultValue = "todos") String cursoSelecionado)
            throws IOException {

        String range2Start;
        String range2End;
        String courseName;

        switch (cursoSelecionado) {
            case "agroindustria":
                range2Start = "C2";
                range2End = "H71";
                courseName = "Técnico em Agroindústria";
                break;
            case "agropecuaria":
                range2Start = "J2";
                range2End = "O71";
                courseName = "Técnico em Agropecuária";
                break;
            case "informatica":
                range2Start = "Q2";
                range2End = "V71";
                courseName = "Técnico em Informática";
                break;
            default:
                range2Start = "C2";
                range2End = "V71";
                courseName = "Todos os Cursos - Ensino Médio";
                break;
        }

        String range1 = "Horário - Ensino Médio!B2:B71";
        String range2 = "Horário - Ensino Médio!" + range2Start + ":" + range2End;

        List<List<Object>> valuesRange1 = sheetsService.getSheetValues(range1);
        List<List<Object>> valuesRange2 = sheetsService.getSheetValues(range2);

        int columnsRange1 = 1;
        int columnsRange2 = valuesRange2.isEmpty() ? 0 : valuesRange2.get(0).size();

        List<List<Object>> combinedValues = IntStream.range(0, Math.max(valuesRange1.size(), valuesRange2.size()))
                .mapToObj(i -> {
                    List<Object> combinedRow = new ArrayList<>(Collections.nCopies(columnsRange1 + columnsRange2, ""));

                    if (i < valuesRange1.size()) {
                        for (int j = 0; j < valuesRange1.get(i).size(); j++) {
                            combinedRow.set(j, valuesRange1.get(i).get(j));
                        }
                    }

                    if (i < valuesRange2.size()) {
                        for (int j = 0; j < valuesRange2.get(i).size(); j++) {
                            combinedRow.set(columnsRange1 + j, valuesRange2.get(i).get(j));
                        }
                    }

                    return combinedRow;
                })
                .collect(Collectors.toList());

        List<List<Object>> updatedValues = new ArrayList<>();
        updatedValues.add(Collections.singletonList("SEGUNDA"));
        updatedValues.addAll(combinedValues.subList(0, 14));
        updatedValues.add(Collections.singletonList("TERÇA"));
        updatedValues.addAll(combinedValues.subList(14, 28));
        updatedValues.add(Collections.singletonList("QUARTA"));
        updatedValues.addAll(combinedValues.subList(28, 42));
        updatedValues.add(Collections.singletonList("QUINTA"));
        updatedValues.addAll(combinedValues.subList(42, 56));
        updatedValues.add(Collections.singletonList("SEXTA"));
        updatedValues.addAll(combinedValues.subList(56, combinedValues.size()));

        Map<String, Object> response = new HashMap<>();
        response.put("rows", updatedValues);
        response.put("maxColumns", columnsRange1 + columnsRange2);
        response.put("courseName", courseName);
        response.put("isMedio", true);

        return ResponseEntity.ok(response);
    }

    // Mostrar os horários dos cursos superiores
    @GetMapping("/ensinoSuperior")
    public ResponseEntity<Map<String, Object>> getSheetValuesRangeES(
            @RequestParam(value = "cursoSelecionado", required = false, defaultValue = "todos") String cursoSelecionado)
            throws IOException {

        String[] courseParams = getCourseParams(cursoSelecionado);
        String range2Start = courseParams[0];
        String range2End = courseParams[1];
        String courseName = courseParams[2];

        String range1 = "Horário - Graduação!B2:B101";
        String range2 = "Horário - Graduação!" + range2Start + ":" + range2End;

        List<List<Object>> valuesRange1 = sheetsService.getSheetValues(range1);
        List<List<Object>> valuesRange2 = sheetsService.getSheetValues(range2);

        List<List<Object>> updatedValues = processValuesForCourse(cursoSelecionado, valuesRange1, valuesRange2);

        Map<String, Object> response = new HashMap<>();
        response.put("rows", updatedValues);
        response.put("maxColumns", calculateMaxColumns(valuesRange1, valuesRange2));
        response.put("courseName", courseName);
        response.put("isMedio", false);

        return ResponseEntity.ok(response);
    }

    private String[] getCourseParams(String cursoSelecionado) {
        switch (cursoSelecionado) {
            case "engenharia_alimentos":
                return new String[] { "C2", "G101", "Bacharelado em Engenharia de Alimentos" };
            case "engenharia_florestal":
                return new String[] { "I2", "M101", "Bacharelado em Engenharia Florestal" };
            case "sistemas_informacao":
                return new String[] { "O2", "R101", "Bacharelado em Sistemas de Informação" };
            case "medicina_veterinaria":
                return new String[] { "T2", "X101", "Bacharelado em Medicina Veterinária" };
            case "biologia":
                return new String[] { "Z2", "AC101", "Licenciatura em Ciências Biológicas" };
            case "fisica":
                return new String[] { "AE2", "AH101", "Licenciatura em Física" };
            case "matematica":
                return new String[] { "AJ2", "AM101", "Licenciatura em Matemática" };
            case "quimica":
                return new String[] { "AO2", "AR101", "Licenciatura em Química" };
            case "pedagogia":
                return new String[] { "AT2", "AW101", "Licenciatura em Pedagogia" };
            default:
                return new String[] { "C2", "AW101", "Todos os Cursos - Ensino Superior" };
        }
    }

    private List<List<Object>> processValuesForCourse(String cursoSelecionado, List<List<Object>> valuesRange1,
            List<List<Object>> valuesRange2) {
        switch (cursoSelecionado) {
            case "engenharia_alimentos":
            case "engenharia_florestal":
            case "medicina_veterinaria":
                return processDayValues(valuesRange1, valuesRange2, 5);

            case "sistemas_informacao":
                return processFilteredValues(valuesRange1, valuesRange2, 6);

            case "biologia":
            case "fisica":
            case "matematica":
            case "quimica":
            case "pedagogia":
                return processFilteredValues(valuesRange1, valuesRange2, 13);

            default:
                return processDayValues(valuesRange1, valuesRange2, 0);
        }
    }

    private int calculateMaxColumns(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2) {
        int columnsRange1 = 1;
        int columnsRange2 = valuesRange2.isEmpty() ? 0 : valuesRange2.get(0).size();
        return columnsRange1 + columnsRange2;
    }

    private List<List<Object>> processDayValues(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2,
            int ignoreLastLines) {
        return processDayValuesWithCustomLogic((start, end) -> IntStream
                .range(start, end - ignoreLastLines)
                .mapToObj(i -> combineRow(valuesRange1, valuesRange2, i))
                .collect(Collectors.toList()));
    }

    private List<List<Object>> processFilteredValues(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2,
            int skipThreshold) {
        return processDayValuesWithCustomLogic((start, end) -> IntStream
                .range(start, end)
                .filter(i -> (i == start || i > start + skipThreshold))
                .mapToObj(i -> combineRow(valuesRange1, valuesRange2, i))
                .collect(Collectors.toList()));
    }

    private List<List<Object>> processDayValuesWithCustomLogic(
            BiFunction<Integer, Integer, List<List<Object>>> getDayValues) {
        List<List<Object>> updatedValues = new ArrayList<>();
        updatedValues.add(Collections.singletonList("SEGUNDA"));
        updatedValues.addAll(getDayValues.apply(0, 20));
        updatedValues.add(Collections.singletonList("TERÇA"));
        updatedValues.addAll(getDayValues.apply(20, 40));
        updatedValues.add(Collections.singletonList("QUARTA"));
        updatedValues.addAll(getDayValues.apply(40, 60));
        updatedValues.add(Collections.singletonList("QUINTA"));
        updatedValues.addAll(getDayValues.apply(60, 80));
        updatedValues.add(Collections.singletonList("SEXTA"));
        updatedValues.addAll(getDayValues.apply(80, 100));
        return updatedValues;
    }

    private List<Object> combineRow(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2, int rowIndex) {
        int columnsRange1 = 1;
        int columnsRange2 = valuesRange2.isEmpty() ? 0 : valuesRange2.get(0).size();
        List<Object> combinedRow = new ArrayList<>(Collections.nCopies(columnsRange1 + columnsRange2, ""));
        fillRow(valuesRange1, combinedRow, rowIndex, 0);
        fillRow(valuesRange2, combinedRow, rowIndex, columnsRange1);
        return combinedRow;
    }

    private void fillRow(List<List<Object>> valuesRange, List<Object> combinedRow, int rowIndex, int offset) {
        if (rowIndex < valuesRange.size()) {
            for (int j = 0; j < valuesRange.get(rowIndex).size(); j++) {
                combinedRow.set(offset + j, valuesRange.get(rowIndex).get(j));
            }
        }
    }

    // Mostrar os horários dos professores
    @GetMapping("/Professores")
    public ResponseEntity<Map<String, Object>> getSheetValuesRangeHP(
            @RequestParam(value = "professorSelecionado", required = false) String professorSelecionado)
            throws IOException {

        Map<String, Object> response = new HashMap<>();
        response.put("professorSelecionado", professorSelecionado);

        String rangeSuperior1 = "Horário - Graduação!B3:B101";
        String rangeSuperior2 = "Horário - Graduação!C3:AW101";
        String rangeSuperiorTurmas = "Horário - Graduação!C22:AW22";
        String rangeMedio2 = "Horário - Ensino Médio!C3:V71";
        String rangeMedioTurmas = "Horário - Ensino Médio!C16:V16";
        String rangeNomesProfessores = "Validação de Dados!A2:A";

        List<List<Object>> valuesSuperior1 = sheetsService.getSheetValues(rangeSuperior1);
        List<List<Object>> valuesSuperior2 = sheetsService.getSheetValues(rangeSuperior2);
        List<List<Object>> valuesSuperiorTurmas = sheetsService.getSheetValues(rangeSuperiorTurmas);
        List<List<Object>> valuesMedio2 = sheetsService.getSheetValues(rangeMedio2);
        List<List<Object>> valuesMedioTurmas = sheetsService.getSheetValues(rangeMedioTurmas);
        List<List<Object>> nomesProfessores = sheetsService.getSheetValues(rangeNomesProfessores);

        Collator collator = Collator.getInstance(new Locale("pt", "BR"));
        List<String> nomesProfessoresValidos = nomesProfessores.stream()
                .filter(row -> !row.isEmpty())
                .map(row -> row.get(0).toString())
                .sorted(collator::compare)
                .collect(Collectors.toList());

        response.put("professores", nomesProfessoresValidos);

        if (professorSelecionado == null || professorSelecionado.isEmpty()) {
            response.put("rows", new ArrayList<>());
            response.put("maxRows", 0);
            return ResponseEntity.ok(response);
        }

        int columnsSuperior1 = 1;
        int columnsSuperior2 = 47;
        int columnsMedio2 = 20;

        int linesPerDaySuperior = 20;
        int linesPerDayMedio = 14;
        int totalDays = 5;

        List<List<Object>> valuesMedio2Adjusted = new ArrayList<>();
        for (int day = 0; day < totalDays; day++) {
            int start = day * linesPerDayMedio;
            int end = start + linesPerDayMedio - 2;

            for (int i = start; i < end; i++) {
                if (i < valuesMedio2.size()) {
                    valuesMedio2Adjusted.add(valuesMedio2.get(i));
                } else {
                    valuesMedio2Adjusted.add(new ArrayList<>(Collections.nCopies(columnsMedio2, "")));
                }
            }

            while (valuesMedio2Adjusted.size() % linesPerDaySuperior != 0) {
                valuesMedio2Adjusted.add(new ArrayList<>(Collections.nCopies(columnsMedio2, "")));
            }
        }

        final String professorFiltrado = professorSelecionado.toLowerCase();
        List<List<Object>> combinedValues = IntStream
                .range(0,
                        Math.max(valuesSuperior1.size(), Math.max(valuesSuperior2.size(), valuesMedio2Adjusted.size())))
                .mapToObj(i -> {
                    List<Object> combinedRow = new ArrayList<>(
                            Collections.nCopies(columnsSuperior1 + columnsSuperior2, ""));

                    if (i < valuesSuperior1.size()) {
                        combinedRow.set(0, valuesSuperior1.get(i).get(0));
                    }

                    List<Object> superiorData = i < valuesSuperior2.size() ? valuesSuperior2.get(i) : new ArrayList<>();
                    List<Object> medioData = i < valuesMedio2Adjusted.size() ? valuesMedio2Adjusted.get(i) : new ArrayList<>();

                    for (int j = 0; j < superiorData.size(); j++) {
                        Object cellValue = superiorData.get(j);
                        if (cellValue != null && !cellValue.toString().isEmpty()) {
                            String cellValueStr = cellValue.toString();
                            Pattern pattern = Pattern.compile("\\(([^)]+)\\)");
                            Matcher matcher = pattern.matcher(cellValueStr);

                            List<String> turmasProfessor = new ArrayList<>();

                            while (matcher.find()) {
                                String professores = matcher.group(1);
                                String[] nomes = professores.split("[/,]");

                                for (String nome : nomes) {
                                    if (nome.trim().toLowerCase().contains(professorFiltrado)) {
                                        String turma = valuesSuperiorTurmas.get(0).get(j).toString();
                                        turmasProfessor.add(turma);
                                    }
                                }
                            }

                            if (!turmasProfessor.isEmpty()) {
                                String existingValue = combinedRow.get(1).toString();
                                if (!existingValue.isEmpty()) {
                                    combinedRow.set(1, existingValue + " + " + String.join(" - ", turmasProfessor));
                                } else {
                                    combinedRow.set(1, cellValueStr + " - " + String.join(" - ", turmasProfessor));
                                }
                            }
                        }
                    }

                    for (int j = 0; j < medioData.size(); j++) {
                        Object cellValue = medioData.get(j);
                        if (cellValue != null && !cellValue.toString().isEmpty()) {
                            String cellValueStr = cellValue.toString();
                            Pattern pattern = Pattern.compile("\\(([^)]+)\\)");
                            Matcher matcher = pattern.matcher(cellValueStr);

                            List<String> turmasProfessor = new ArrayList<>();

                            while (matcher.find()) {
                                String professores = matcher.group(1);
                                String[] nomes = professores.split("[/,]");

                                for (String nome : nomes) {
                                    if (nome.trim().toLowerCase().contains(professorFiltrado)) {
                                        String turma = valuesMedioTurmas.get(0).get(j).toString();
                                        turmasProfessor.add(turma);
                                    }
                                }
                            }

                            if (!turmasProfessor.isEmpty()) {
                                String existingValue = combinedRow.get(1).toString();
                                if (!existingValue.isEmpty()) {
                                    combinedRow.set(1, existingValue + " + " + String.join(" - ", turmasProfessor));
                                } else {
                                    combinedRow.set(1, cellValueStr + " - " + String.join(" - ", turmasProfessor));
                                }
                            }
                        }
                    }
                    return combinedRow;
                })
                .collect(Collectors.toList());

        List<List<Object>> updatedValues = new ArrayList<>();
        for (int i = 0; i < linesPerDaySuperior; i++) {
            List<Object> row = new ArrayList<>();
            for (int day = 0; day < totalDays; day++) {
                int start = day * linesPerDaySuperior;
                if (start + i < combinedValues.size()) {
                    row.addAll(combinedValues.get(start + i).subList(0,
                            Math.min(2, combinedValues.get(start + i).size())));
                }
            }
            updatedValues.add(row);
        }

        int horasPorColuna = 1;
        int colunasPreenchidas = 0;
        int totalHoras = 0;

        for (List<Object> row : updatedValues) {
            for (int i = 1; i < row.size(); i += 2) {
                if (row.get(i) != null && !row.get(i).toString().isEmpty()) {
                    colunasPreenchidas++;
                }
            }
        }
        totalHoras = colunasPreenchidas * horasPorColuna;

        response.put("rows", updatedValues);
        response.put("horas", totalHoras + " h/a");
        return ResponseEntity.ok(response);
    }

    // Mostrar os horários de ocupação das salas
    @GetMapping("/Salas")
    public ResponseEntity<Map<String, Object>> getSheetValuesRangeHS(
            @RequestParam(value = "salaSelecionada", required = false) String salaSelecionada) throws IOException {

        Map<String, Object> response = new HashMap<>();
        response.put("salaSelecionada", salaSelecionada);

        String rangeSuperior1 = "Horário - Graduação!B3:B101";
        String rangeSuperior2 = "Horário - Graduação!C3:AW101";
        String rangeSuperiorTurmas = "Horário - Graduação!C22:AW22";
        String rangeMedio2 = "Horário - Ensino Médio!C3:V71";
        String rangeMedioTurmas = "Horário - Ensino Médio!C16:V16";

        List<String> salas = Arrays.asList(
            "(1/3)", "(1/4)", "(1/5)", "(1/6)", "(1/7)", "(1/8)", "(1/9)", "(1/10)", "(1/11)", "(1/12)",
            "(1/13)", "(1/14)", "(1/15)", "(1/16)", "(1/17)", "(2/1)", "(2/2)", "(2/3)", "(2/4)", "(2/5)", "(2/6)",
            "(3/7)", "(3/8)", "(3/9)", "(3/10)", "(3/11)", "(Agricult. I)", "(Agricult. II)", "(Agricult. III)",
            "(Agroin. 1)", "(Agroin. 2)", "(Anexo Lab. Solos)", "(CELIN 1)", "(CELIN 2)", "(HV 1)", "(HV 2)", 
            "(HV 3)", "(HV 4)", "(Lab. 1 - Info)", "(Lab. 2 - Info)", "(Lab. 3 - Info)", "(Lab. 4 - Info)",
            "(Lab. Bromatologia)", "(Lab. Fenôm. de Transportes)", "(Lab. Física)", "(Lab. Invertebrados)", 
            "(Lab. Microscopia)", "(Lab. Química I)", "(Lab. Química II)", "(Lab. Redes)", "(LEM)", "(Mini 1)", 
            "(Mini 2)", "(Sala de Topografia)", "(Sala Suinocultura)", "(Sl. Análise Sensorial)", "(Zoo I)", "(Zoo II)", 
            "(Zoo III)"
        );

        List<List<Object>> valuesSuperior1 = sheetsService.getSheetValues(rangeSuperior1);
        List<List<Object>> valuesSuperior2 = sheetsService.getSheetValues(rangeSuperior2);
        List<List<Object>> valuesSuperiorTurmas = sheetsService.getSheetValues(rangeSuperiorTurmas);
        List<List<Object>> valuesMedio2 = sheetsService.getSheetValues(rangeMedio2);
        List<List<Object>> valuesMedioTurmas = sheetsService.getSheetValues(rangeMedioTurmas);

        response.put("salas", salas);

        if (salaSelecionada == null || salaSelecionada.isEmpty()) {
            response.put("rows", new ArrayList<>());
            response.put("maxRows", 0);
            return ResponseEntity.ok(response);
        }

        int columnsSuperior1 = 1;
        int columnsSuperior2 = 47;
        int columnsMedio2 = 20;

        int linesPerDaySuperior = 20;
        int linesPerDayMedio = 14;
        int totalDays = 5;

        List<List<Object>> valuesMedio2Adjusted = new ArrayList<>();
        for (int day = 0; day < totalDays; day++) {
            int start = day * linesPerDayMedio;
            int end = start + linesPerDayMedio - 2;

            for (int i = start; i < end; i++) {
                if (i < valuesMedio2.size()) {
                    valuesMedio2Adjusted.add(valuesMedio2.get(i));
                } else {
                    valuesMedio2Adjusted.add(new ArrayList<>(Collections.nCopies(columnsMedio2, "")));
                }
            }

            while (valuesMedio2Adjusted.size() % linesPerDaySuperior != 0) {
                valuesMedio2Adjusted.add(new ArrayList<>(Collections.nCopies(columnsMedio2, "")));
            }
        }

        final String salaFiltrada = salaSelecionada.toLowerCase();
        List<List<Object>> combinedValues = IntStream
                .range(0,
                        Math.max(valuesSuperior1.size(), Math.max(valuesSuperior2.size(), valuesMedio2Adjusted.size())))
                .mapToObj(i -> {
                    List<Object> combinedRow = new ArrayList<>(
                            Collections.nCopies(columnsSuperior1 + columnsSuperior2, ""));

                    if (i < valuesSuperior1.size()) {
                        combinedRow.set(0, valuesSuperior1.get(i).get(0));
                    }

                    List<Object> superiorData = i < valuesSuperior2.size() ? valuesSuperior2.get(i) : new ArrayList<>();
                    List<Object> medioData = i < valuesMedio2Adjusted.size() ? valuesMedio2Adjusted.get(i) : new ArrayList<>();

                    for (int j = 0; j < superiorData.size(); j++) {
                        Object cellValue = superiorData.get(j);
                        if (cellValue != null && !cellValue.toString().isEmpty()) {
                            String cellValueStr = cellValue.toString();

                            if (cellValueStr.toLowerCase().contains(salaFiltrada)) {
                                String turma = valuesSuperiorTurmas.get(0).get(j).toString();
                                List<String> turmasSala = new ArrayList<>();
                                turmasSala.add(turma);

                                String existingValue = combinedRow.get(1).toString();
                                if (!existingValue.isEmpty()) {
                                    combinedRow.set(1, existingValue + " + " + String.join(" - ", turmasSala));
                                } else {
                                    combinedRow.set(1, String.join(" - ", turmasSala));
                                }
                            }
                        }
                    }

                    for (int j = 0; j < medioData.size(); j++) {
                        Object cellValue = medioData.get(j);
                        if (cellValue != null && !cellValue.toString().isEmpty()) {
                            String cellValueStr = cellValue.toString();

                            if (cellValueStr.toLowerCase().contains(salaFiltrada)) {
                                String turma = valuesMedioTurmas.get(0).get(j).toString();
                                List<String> turmasSala = new ArrayList<>();
                                turmasSala.add(turma);

                                String existingValue = combinedRow.get(1).toString();
                                if (!existingValue.isEmpty()) {
                                    combinedRow.set(1, existingValue + " + " + String.join(" - ", turmasSala));
                                } else {
                                    combinedRow.set(1, String.join(" - ", turmasSala));
                                }
                            }
                        }
                    }
                    return combinedRow;
                })
                .collect(Collectors.toList());

        List<List<Object>> updatedValues = new ArrayList<>();
        for (int i = 0; i < linesPerDaySuperior; i++) {
            List<Object> row = new ArrayList<>();
            for (int day = 0; day < totalDays; day++) {
                int start = day * linesPerDaySuperior;
                if (start + i < combinedValues.size()) {
                    row.addAll(combinedValues.get(start + i).subList(0,
                            Math.min(2, combinedValues.get(start + i).size())));
                }
            }
            updatedValues.add(row);
        }

        response.put("rows", updatedValues);
        return ResponseEntity.ok(response);
    }
}