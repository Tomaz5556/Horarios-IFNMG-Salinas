package com.ifnmg.horarios.service;

import java.io.IOException;
import java.util.*;
import java.text.Collator;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ifnmg.horarios.model.Horarios;

@Service
public class HorariosService {

    private final SheetsService sheetsService;

    public HorariosService(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    // Retornar os horários dos cursos técnicos
    public ResponseEntity<Horarios> getSheetValuesRangeEM(String cursoSelecionado) throws IOException {

        Map<String, String[]> courseData = Map.of(
                "agroindustria", new String[] { "C2", "H71", "Técnico em Agroindústria" },
                "agropecuaria", new String[] { "J2", "O71", "Técnico em Agropecuária" },
                "informatica", new String[] { "Q2", "V71", "Técnico em Informática"
                });

        String[] selectedCourse = courseData.getOrDefault(cursoSelecionado,
                new String[] { "C2", "V71", "Todos os Cursos - Ensino Médio" });

        String range1 = "Horário - Ensino Médio!B2:B71";
        String range2 = "Horário - Ensino Médio!" + selectedCourse[0] + ":" + selectedCourse[1];
        String courseName = selectedCourse[2];

        List<List<Object>> valuesRange1 = sheetsService.getSheetValues(range1);
        List<List<Object>> valuesRange2 = sheetsService.getSheetValues(range2);

        List<List<Object>> combinedValues = combineValues(valuesRange1, valuesRange2);

        List<String> daysOfWeek = List.of("SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA");
        List<List<Object>> updatedValues = new ArrayList<>();

        for (int i = 0; i < daysOfWeek.size(); i++) {
            updatedValues.add(Collections.singletonList(daysOfWeek.get(i)));
            updatedValues.addAll(combinedValues.subList(i * 14, Math.min((i + 1) * 14, combinedValues.size())));
        }

        Horarios horarios = new Horarios(updatedValues, valuesRange1.get(0).size() + valuesRange2.get(0).size(), courseName, true);

        return ResponseEntity.ok(horarios);
    }

    private List<List<Object>> combineValues(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2) {
        int columnsRange1 = 1;
        int columnsRange2 = valuesRange2.isEmpty() ? 0 : valuesRange2.get(0).size();

        return IntStream.range(0, Math.max(valuesRange1.size(), valuesRange2.size())).mapToObj(i -> {
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
    }

    // Retornar os horários dos cursos superiores
    public ResponseEntity<Horarios> getSheetValuesRangeES(String cursoSelecionado) throws IOException {

        String[] courseParams = getCourseParams(cursoSelecionado);
        String range2Start = courseParams[0];
        String range2End = courseParams[1];
        String courseName = courseParams[2];

        String range1 = "Horário - Graduação!B2:B101";
        String range2 = "Horário - Graduação!" + range2Start + ":" + range2End;

        List<List<Object>> valuesRange1 = sheetsService.getSheetValues(range1);
        List<List<Object>> valuesRange2 = sheetsService.getSheetValues(range2);

        List<List<Object>> updatedValues = processValuesForCourse(cursoSelecionado, valuesRange1, valuesRange2);

        Horarios horarios = new Horarios(updatedValues, calculateMaxColumns(valuesRange1, valuesRange2), courseName, false);

        return ResponseEntity.ok(horarios);
    }

    private String[] getCourseParams(String cursoSelecionado) {
        return switch (cursoSelecionado) {
            case "engenharia_alimentos" -> new String[] { "C2", "G101", "Bacharelado em Engenharia de Alimentos" };
            case "engenharia_florestal" -> new String[] { "I2", "M101", "Bacharelado em Engenharia Florestal" };
            case "sistemas_informacao" -> new String[] { "O2", "R101", "Bacharelado em Sistemas de Informação" };
            case "medicina_veterinaria" -> new String[] { "T2", "X101", "Bacharelado em Medicina Veterinária" };
            case "biologia" -> new String[] { "Z2", "AC101", "Licenciatura em Ciências Biológicas" };
            case "fisica" -> new String[] { "AE2", "AH101", "Licenciatura em Física" };
            case "matematica" -> new String[] { "AJ2", "AM101", "Licenciatura em Matemática" };
            case "quimica" -> new String[] { "AO2", "AR101", "Licenciatura em Química" };
            case "pedagogia" -> new String[] { "AT2", "AW101", "Licenciatura em Pedagogia" };
            default -> new String[] { "C2", "AW101", "Todos os Cursos - Ensino Superior" };
        };
    }

    private List<List<Object>> processValuesForCourse(String cursoSelecionado, List<List<Object>> valuesRange1,
            List<List<Object>> valuesRange2) {
        return switch (cursoSelecionado) {
            case "engenharia_alimentos", "engenharia_florestal", "medicina_veterinaria" -> processDayValues(valuesRange1, valuesRange2, 5);
            case "sistemas_informacao" -> processFilteredValues(valuesRange1, valuesRange2, 6);
            case "biologia", "fisica", "matematica", "quimica", "pedagogia" -> processFilteredValues(valuesRange1, valuesRange2, 13);
            default -> processDayValues(valuesRange1, valuesRange2, 0);
        };
    }

    private int calculateMaxColumns(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2) {
        int columnsRange1 = 1;
        int columnsRange2 = valuesRange2.isEmpty() ? 0 : valuesRange2.get(0).size();
        return columnsRange1 + columnsRange2;
    }

    private List<List<Object>> processDayValues(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2,
            int ignoreLastLines) {
        return processDayValues((start, end) -> IntStream
                .range(start, end - ignoreLastLines)
                .mapToObj(i -> combineRow(valuesRange1, valuesRange2, i))
                .collect(Collectors.toList()));
    }

    private List<List<Object>> processFilteredValues(List<List<Object>> valuesRange1, List<List<Object>> valuesRange2,
            int skipThreshold) {
        return processDayValues((start, end) -> IntStream
                .range(start, end)
                .filter(i -> (i == start || i > start + skipThreshold))
                .mapToObj(i -> combineRow(valuesRange1, valuesRange2, i))
                .collect(Collectors.toList()));
    }

    private List<List<Object>> processDayValues(BiFunction<Integer, Integer, List<List<Object>>> getDayValues) {
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

    // Retornar os horários dos professores
    public ResponseEntity<Horarios> getSheetValuesRangeHP(String professorSelecionado) throws IOException {

        Horarios horarios = new Horarios();
        horarios.setProfessorSelecionado(professorSelecionado);

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

        horarios.setProfessores(nomesProfessoresValidos);

        if (professorSelecionado == null || professorSelecionado.isEmpty()) {
            horarios.setRows(new ArrayList<>());
            horarios.setMaxRows(0);
            return ResponseEntity.ok(horarios);
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

        horarios.setRows(updatedValues);
        horarios.setHoras(totalHoras + " h/a");

        return ResponseEntity.ok(horarios);
    }

    // Retornar os horários de ocupação das salas
    public ResponseEntity<Horarios> getSheetValuesRangeHS(String salaSelecionada) throws IOException {

        Horarios horarios = new Horarios();
        horarios.setSalaSelecionada(salaSelecionada);

        String rangeSuperior1 = "Horário - Graduação!B3:B101";
        String rangeSuperior2 = "Horário - Graduação!C3:AW101";
        String rangeSuperiorTurmas = "Horário - Graduação!C22:AW22";
        String rangeMedio2 = "Horário - Ensino Médio!C3:V71";
        String rangeMedioTurmas = "Horário - Ensino Médio!C16:V16";

        List<String> salas = List.of(
            "(1/3)", "(1/4)", "(1/5)", "(1/6)", "(1/7)", "(1/8)", "(1/9)", "(1/10)", "(1/11)", "(1/12)", "(1/13)", "(1/14)", 
            "(1/15)", "(1/16)", "(1/17)", "(2/1)", "(2/2)", "(2/3)", "(2/4)", "(2/5)", "(2/6)", "(3/7)", "(3/8)", "(3/9)", 
            "(3/10)", "(3/11)", "(Agricult. I)", "(Agricult. II)", "(Agricult. III)", "(Agroin. 1)", "(Agroin. 2)", 
            "(Anexo Lab. Solos)", "(CELIN 1)", "(CELIN 2)", "(HV 1)", "(HV 2)", "(HV 3)", "(HV 4)", "(Lab. 1 - Info)", 
            "(Lab. 2 - Info)", "(Lab. 3 - Info)", "(Lab. 4 - Info)", "(Lab. Bromatologia)", "(Lab. Fenôm. de Transportes)", 
            "(Lab. Física)", "(Lab. Invertebrados)", "(Lab. Microscopia)", "(Lab. Química I)", "(Lab. Química II)", 
            "(Lab. Redes)", "(LEM)", "(Mini 1)", "(Mini 2)", "(Sala de Topografia)", "(Sala Suinocultura)", 
            "(Sl. Análise Sensorial)", "(Zoo I)", "(Zoo II)", "(Zoo III)"
        );

        List<List<Object>> valuesSuperior1 = sheetsService.getSheetValues(rangeSuperior1);
        List<List<Object>> valuesSuperior2 = sheetsService.getSheetValues(rangeSuperior2);
        List<List<Object>> valuesSuperiorTurmas = sheetsService.getSheetValues(rangeSuperiorTurmas);
        List<List<Object>> valuesMedio2 = sheetsService.getSheetValues(rangeMedio2);
        List<List<Object>> valuesMedioTurmas = sheetsService.getSheetValues(rangeMedioTurmas);

        horarios.setSalas(salas);

        if (salaSelecionada == null || salaSelecionada.isEmpty()) {
            horarios.setRows(new ArrayList<>());
            horarios.setMaxRows(0);
            return ResponseEntity.ok(horarios);
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

        horarios.setRows(updatedValues);
        return ResponseEntity.ok(horarios);
    }
}