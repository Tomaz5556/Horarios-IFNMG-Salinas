package com.ifnmg.horarios.model;

import java.util.List;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Horarios {
    // Informações sobre os horários
    private List<List<Object>> rows;
    private int maxRows;
    private int maxColumns;

    // Informações do curso
    private String courseName;
    private boolean isMedio;

    // Informações sobre o professor
    private String professorSelecionado;
    private List<String> professores;
    private String horas;

    // Informações sobre a sala
    private String salaSelecionada;
    private List<String> salas;

    // Construtor para os Cursos
    public Horarios(List<List<Object>> rows, int maxColumns, String courseName, boolean isMedio) {
        this.rows = rows;
        this.maxColumns = maxColumns;
        this.courseName = courseName;
        this.isMedio = isMedio;
    }
}