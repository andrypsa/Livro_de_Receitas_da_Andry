package com.andry.livrodigitalreceitas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andry.livrodigitalreceitas.dto.AtualizarReceitaRequest;
import com.andry.livrodigitalreceitas.dto.ReceitaDetalheDTO;
import com.andry.livrodigitalreceitas.dto.ReceitaResumoDTO;
import com.andry.livrodigitalreceitas.model.ImagemReceita;
import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.service.ReceitaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/receitas")
public class AdminReceitaController {

    private final ReceitaService receitaService;

    public AdminReceitaController(
            ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    @GetMapping
    public ResponseEntity<List<ReceitaResumoDTO>> listarTodas() {

        List<ReceitaResumoDTO> receitas = receitaService
                .listarTodas()
                .stream()
                .map(this::converterParaResumo)
                .toList();

        return ResponseEntity.ok(receitas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceitaDetalheDTO> buscarPorId(
            @PathVariable Long id) {

        Receita receita = receitaService.buscarPorId(id);

        return ResponseEntity.ok(
                ReceitaDetalheDTO.de(receita));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirReceita(
            @PathVariable Long id) {

        receitaService.excluirPorId(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReceitaDetalheDTO> atualizarReceita(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarReceitaRequest dados) {

        Receita receita = receitaService.buscarPorId(id);

        receita.setNome(dados.nome());
        receita.setCategoria(dados.categoria());

        receita.setIngredientes(dados.ingredientes());
        receita.setModoPreparo(dados.modoPreparo());

        receita.setIngredientesRecheio(
                dados.ingredientesRecheio());

        receita.setModoPreparoRecheio(
                dados.modoPreparoRecheio());

        receita.setIngredientesCobertura(
                dados.ingredientesCobertura());

        receita.setModoPreparoCobertura(
                dados.modoPreparoCobertura());

        receita.setObservacoes(dados.observacoes());

        receita.setTempoPreparoMinutos(
                dados.tempoPreparoMinutos());

        receita.setRendimento(dados.rendimento());

        receita.setDificuldade(dados.dificuldade());

        receita.setOrigem(dados.origem());

        receita.setStatus(dados.status());

        receita.setPrivacidade(dados.privacidade());

        receita.setFavorita(dados.favorita());

        receita.setComentariosAtivos(
                dados.comentariosAtivos());

        atualizarImagens(
                receita,
                dados.imagensUrls());

        Receita receitaAtualizada = receitaService.salvar(receita);

        return ResponseEntity.ok(
                ReceitaDetalheDTO.de(
                        receitaAtualizada));
    }

    private ReceitaResumoDTO converterParaResumo(
            Receita receita) {

        return ReceitaResumoDTO.de(receita);
    }

    private void atualizarImagens(
            Receita receita,
            List<String> imagensUrls) {

        receita.getImagens().clear();
        receita.setImagemUrl(null);

        if (imagensUrls == null ||
                imagensUrls.isEmpty()) {
            return;
        }

        for (int indice = 0; indice < imagensUrls.size(); indice++) {

            String url = imagensUrls.get(indice);

            if (url == null || url.isBlank()) {
                continue;
            }

            String urlTratada = url.trim();

            ImagemReceita imagem = new ImagemReceita();

            imagem.setUrl(urlTratada);
            imagem.setPrincipal(indice == 0);

            receita.adicionarImagem(imagem);

            if (indice == 0) {
                receita.setImagemUrl(
                        urlTratada);
            }
        }
    }
}