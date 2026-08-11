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

    public ReceitaService(ReceitaRepository receitaRepository) {
        this.receitaRepository = receitaRepository;
    }

    public Receita salvar(Receita receita) {
        return receitaRepository.save(receita);
    }

    public List<Receita> listarTodas() {
        return receitaRepository.findAll();
    }

public List<Receita> listarPublicas() {
    return receitaRepository.findByPrivacidadeOrderByNomeAsc(
            PrivacidadeReceita.PUBLICA
    );
}

public Receita buscarPorId(Long id) {
    return receitaRepository.buscarPorIdComImagens(id)
            .orElseThrow(ReceitaNaoEncontradaException::new);
}

public void excluirPorId(Long id) {
    Receita receita = buscarPorId(id);
    receitaRepository.delete(receita);
}
}