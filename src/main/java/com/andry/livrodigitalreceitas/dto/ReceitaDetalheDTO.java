package com.andry.livrodigitalreceitas.dto;

import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.model.enums.Categoria;
import com.andry.livrodigitalreceitas.model.enums.Dificuldade;
import com.andry.livrodigitalreceitas.model.enums.OrigemReceita;
import com.andry.livrodigitalreceitas.model.enums.StatusReceita;

public record ReceitaDetalheDTO(
        Long id,
        String nome,
        Categoria categoria,
        String ingredientes,
        String modoPreparo,
        String imagemUrl,
        String observacoes,
        Integer tempoPreparoMinutos,
        String rendimento,
        Dificuldade dificuldade,
        OrigemReceita origem,
        StatusReceita status
) {

    public static ReceitaDetalheDTO de(Receita receita) {
        return new ReceitaDetalheDTO(
                receita.getId(),
                receita.getNome(),
                receita.getCategoria(),
                receita.getIngredientes(),
                receita.getModoPreparo(),
                receita.getImagemUrl(),
                receita.getObservacoes(),
                receita.getTempoPreparoMinutos(),
                receita.getRendimento(),
                receita.getDificuldade(),
                receita.getOrigem(),
                receita.getStatus()
        );
    }
}