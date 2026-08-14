package com.andry.livrodigitalreceitas.dto;

import java.util.List;

import com.andry.livrodigitalreceitas.model.enums.Categoria;
import com.andry.livrodigitalreceitas.model.enums.Dificuldade;
import com.andry.livrodigitalreceitas.model.enums.OrigemReceita;
import com.andry.livrodigitalreceitas.model.enums.PrivacidadeReceita;
import com.andry.livrodigitalreceitas.model.enums.StatusReceita;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AtualizarReceitaRequest(

        @NotBlank @Size(max = 150) String nome,

        @NotNull Categoria categoria,

        @NotBlank String ingredientes,

        @NotBlank String modoPreparo,

        String ingredientesRecheio,
        String modoPreparoRecheio,

        String ingredientesCobertura,
        String modoPreparoCobertura,

        List<String> imagensUrls,

        String observacoes,

        Integer tempoPreparoMinutos,

        @Size(max = 100) String rendimento,

        Dificuldade dificuldade,

        OrigemReceita origem,

        StatusReceita status,

        PrivacidadeReceita privacidade,

        boolean favorita,

        boolean comentariosAtivos) {
}