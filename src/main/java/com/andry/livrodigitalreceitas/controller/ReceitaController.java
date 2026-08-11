package com.andry.livrodigitalreceitas.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andry.livrodigitalreceitas.dto.CriarReceitaRequest;
import com.andry.livrodigitalreceitas.dto.ReceitaDetalheDTO;
import com.andry.livrodigitalreceitas.dto.ReceitaResumoDTO;
import com.andry.livrodigitalreceitas.model.ImagemReceita;
import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.service.ReceitaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    private final ReceitaService receitaService;

    public ReceitaController(ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    @GetMapping
    public List<ReceitaResumoDTO> listarReceitasPublicas() {
        return receitaService.listarPublicas()
                .stream()
                .map(ReceitaResumoDTO::de)
                .toList();
    }

    @GetMapping("/{id}")
    public ReceitaDetalheDTO buscarReceitaPorId(
            @PathVariable Long id) {
        return ReceitaDetalheDTO.de(
                receitaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ReceitaDetalheDTO> criarReceita(
            @Valid @RequestBody CriarReceitaRequest dados) {
        Receita receita = new Receita();

        receita.setNome(dados.nome());
        receita.setCategoria(dados.categoria());
        receita.setIngredientes(dados.ingredientes());
        receita.setModoPreparo(dados.modoPreparo());
        receita.setIngredientesRecheio(dados.ingredientesRecheio());
        receita.setModoPreparoRecheio(dados.modoPreparoRecheio());
        receita.setIngredientesCobertura(dados.ingredientesCobertura());
        receita.setModoPreparoCobertura(dados.modoPreparoCobertura());
        receita.setObservacoes(dados.observacoes());
        receita.setTempoPreparoMinutos(dados.tempoPreparoMinutos());
        receita.setRendimento(dados.rendimento());
        receita.setDificuldade(dados.dificuldade());
        receita.setOrigem(dados.origem());
        receita.setStatus(dados.status());
        receita.setPrivacidade(dados.privacidade());
        receita.setFavorita(dados.favorita());
        receita.setComentariosAtivos(
                dados.comentariosAtivos());

        adicionarImagens(receita, dados.imagensUrls());

        Receita receitaSalva = receitaService.salvar(receita);

        URI localizacao = URI.create(
                "/api/receitas/" + receitaSalva.getId());

        return ResponseEntity
                .created(localizacao)
                .body(ReceitaDetalheDTO.de(receitaSalva));
    }

    private void adicionarImagens(
            Receita receita,
            List<String> imagensUrls) {
        if (imagensUrls == null || imagensUrls.isEmpty()) {
            return;
        }

        for (int indice = 0; indice < imagensUrls.size(); indice++) {

            String url = imagensUrls.get(indice);

            if (url == null || url.isBlank()) {
                continue;
            }

            ImagemReceita imagem = new ImagemReceita();
            imagem.setUrl(url.trim());
            imagem.setPrincipal(indice == 0);

            receita.adicionarImagem(imagem);

            if (indice == 0) {
                receita.setImagemUrl(url.trim());
            }
        }
    }
}