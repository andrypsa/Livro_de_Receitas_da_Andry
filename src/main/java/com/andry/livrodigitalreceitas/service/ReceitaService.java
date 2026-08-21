package com.andry.livrodigitalreceitas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.andry.livrodigitalreceitas.exception.ReceitaNaoEncontradaException;
import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.model.enums.PrivacidadeReceita;
import com.andry.livrodigitalreceitas.repository.ReceitaRepository;

@Service
public class ReceitaService {

    private final ReceitaRepository receitaRepository;

    public ReceitaService(
            ReceitaRepository receitaRepository) {
        this.receitaRepository = receitaRepository;
    }

    // Salva uma nova receita ou atualiza uma receita existente
    public Receita salvar(Receita receita) {
        return receitaRepository.save(receita);
    }

    // Lista todas as receitas, incluindo públicas e privadas
    public List<Receita> listarTodas() {
        return receitaRepository.findAll();
    }

    // Lista somente as receitas públicas em ordem alfabética
    public List<Receita> listarPublicas() {
        return receitaRepository
                .findByPrivacidadeOrderByNomeAsc(
                        PrivacidadeReceita.PUBLICA);
    }

    // Busca uma receita pelo ID com suas imagens associadas
    public Receita buscarPorId(Long id) {
        return receitaRepository
                .buscarPorIdComImagens(id)
                .orElseThrow(
                        ReceitaNaoEncontradaException::new);
    }

    // Busca pelo ID somente se a receita estiver pública
    public Receita buscarPublicaPorId(Long id) {
        return receitaRepository
                .buscarPorIdEPrivacidadeComImagens(
                        id,
                        PrivacidadeReceita.PUBLICA)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Receita pública não encontrada."));
    }

    // Exclui uma receita após confirmar sua existência
    public void excluirPorId(Long id) {
        Receita receita = buscarPorId(id);
        receitaRepository.delete(receita);
    }
}