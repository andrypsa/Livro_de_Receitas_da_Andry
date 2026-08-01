package com.andry.livrodigitalreceitas.dto;

import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.model.enums.Categoria;
import com.andry.livrodigitalreceitas.model.enums.Dificuldade;

public record ReceitaResumoDTO(
        Long id,
        String nome,
        Categoria categoria,
        Integer tempoPreparoMinutos,
        String rendimento,
        Dificuldade dificuldade,
        String imagemUrl
) {

    public static ReceitaResumoDTO de(Receita receita) {
        return new ReceitaResumoDTO(
                receita.getId(),
                receita.getNome(),
                receita.getCategoria(),
                receita.getTempoPreparoMinutos(),
                receita.getRendimento(),
                receita.getDificuldade(),
                receita.getImagemUrl()
        );
    }
}