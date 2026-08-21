package com.andry.livrodigitalreceitas.dto;

import java.util.List;

import com.andry.livrodigitalreceitas.model.enums.Categoria;
import com.andry.livrodigitalreceitas.model.enums.Dificuldade;
import com.andry.livrodigitalreceitas.model.enums.OrigemReceita;
import com.andry.livrodigitalreceitas.model.enums.PrivacidadeReceita;
import com.andry.livrodigitalreceitas.model.enums.StatusReceita;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

// Representa os dados recebidos pelo backend para criar uma nova receita
public record CriarReceitaRequest(

                @NotBlank(message = "O nome da receita é obrigatório.") @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres.") String nome,

                @NotNull(message = "A categoria é obrigatória.") Categoria categoria,

                @NotBlank(message = "Os ingredientes são obrigatórios.") String ingredientes,

                @NotBlank(message = "O modo de preparo é obrigatório.") String modoPreparo,

                String ingredientesRecheio,

                String modoPreparoRecheio,

                String ingredientesCobertura,

                String modoPreparoCobertura,

                List<String> imagensUrls,

                String observacoes,

                @PositiveOrZero(message = "O tempo de preparo não pode ser negativo.") Integer tempoPreparoMinutos,

                @Size(max = 100, message = "O rendimento deve ter no máximo 100 caracteres.") String rendimento,

                Dificuldade dificuldade,

                OrigemReceita origem,

                StatusReceita status,

                PrivacidadeReceita privacidade,

                boolean favorita,

                boolean comentariosAtivos) {
}