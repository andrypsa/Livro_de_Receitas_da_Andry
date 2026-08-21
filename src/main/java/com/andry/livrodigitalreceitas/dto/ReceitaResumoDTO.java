package com.andry.livrodigitalreceitas.dto;

import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.model.enums.Categoria;
import com.andry.livrodigitalreceitas.model.enums.Dificuldade;

// Representa os dados resumidos de uma receita usados nas listagens
public record ReceitaResumoDTO(
        Long id,
        String nome,
        Categoria categoria,
        Integer tempoPreparoMinutos,
        String rendimento,
        Dificuldade dificuldade,
        String imagemUrl) {

    // Converte uma entidade Receita para o DTO de resumo
    public static ReceitaResumoDTO de(Receita receita) {
        return new ReceitaResumoDTO(
                receita.getId(),
                receita.getNome(),
                receita.getCategoria(),
                receita.getTempoPreparoMinutos(),
                receita.getRendimento(),
                receita.getDificuldade(),
                receita.getImagemUrl());
    }
}