package com.andry.livrodigitalreceitas.dto;

import java.util.List;

import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.model.enums.Categoria;
import com.andry.livrodigitalreceitas.model.enums.Dificuldade;
import com.andry.livrodigitalreceitas.model.enums.OrigemReceita;
import com.andry.livrodigitalreceitas.model.enums.PrivacidadeReceita;
import com.andry.livrodigitalreceitas.model.enums.StatusReceita;

// Representa os dados detalhados de uma receita enviados pelo backend
public record ReceitaDetalheDTO(
                Long id,
                String nome,
                Categoria categoria,
                String ingredientes,
                String modoPreparo,

                String ingredientesRecheio,
                String modoPreparoRecheio,

                String ingredientesCobertura,
                String modoPreparoCobertura,

                String imagemUrl,
                List<String> imagens,

                String observacoes,
                Integer tempoPreparoMinutos,
                String rendimento,
                Dificuldade dificuldade,
                OrigemReceita origem,
                StatusReceita status,
                PrivacidadeReceita privacidade,
                boolean favorita,
                boolean comentariosAtivos) {

        // Converte uma entidade Receita para o DTO de detalhes
        public static ReceitaDetalheDTO de(Receita receita) {
                return new ReceitaDetalheDTO(
                                receita.getId(),
                                receita.getNome(),
                                receita.getCategoria(),
                                receita.getIngredientes(),
                                receita.getModoPreparo(),

                                receita.getIngredientesRecheio(),
                                receita.getModoPreparoRecheio(),

                                receita.getIngredientesCobertura(),
                                receita.getModoPreparoCobertura(),

                                receita.getImagemUrl(),

                                receita.getImagens()
                                                .stream()
                                                .map(imagem -> imagem.getUrl())
                                                .toList(),

                                receita.getObservacoes(),
                                receita.getTempoPreparoMinutos(),
                                receita.getRendimento(),
                                receita.getDificuldade(),
                                receita.getOrigem(),
                                receita.getStatus(),
                                receita.getPrivacidade(),
                                receita.isFavorita(),
                                receita.isComentariosAtivos());
        }
}