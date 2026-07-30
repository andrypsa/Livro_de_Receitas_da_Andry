package com.andry.livrodigitalreceitas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.model.enums.PrivacidadeReceita;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    List<Receita> findByPrivacidadeOrderByNomeAsc(
            PrivacidadeReceita privacidade);
}