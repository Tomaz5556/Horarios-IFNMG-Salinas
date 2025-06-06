package com.ifnmg.horarios.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Curso {
    // Nome do curso com intervalo de início e fim
    String nome;
    String rangeStart;
    String rangeEnd;
}
