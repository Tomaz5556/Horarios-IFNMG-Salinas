package com.ifnmg.horarios.model;

import java.util.List;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Horarios {
    // Informações dos horários
    private List<List<Object>> rows;
    private int maxRows;
    private int maxColumns;

    // Informações dos cursos
    private String courseName;
    private boolean checkTypeMedio;

    // Informações dos professores
    private String professorSelecionado;
    private List<String> professores;
    private String horas;

    // Informações das salas
    private String salaSelecionada;
    private List<String> salas;
}