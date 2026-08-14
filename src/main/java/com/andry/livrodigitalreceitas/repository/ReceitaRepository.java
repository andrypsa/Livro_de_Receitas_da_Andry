package com.andry.livrodigitalreceitas.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.model.enums.PrivacidadeReceita;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {

        List<Receita> findByPrivacidadeOrderByNomeAsc(
                        PrivacidadeReceita privacidade);

        @Query("""
                        SELECT DISTINCT r
                        FROM Receita r
                        LEFT JOIN FETCH r.imagens
                        WHERE r.id = :id
                        """)
        Optional<Receita> buscarPorIdComImagens(
                        @Param("id") Long id);

        @Query("""
                        SELECT DISTINCT r
                        FROM Receita r
                        LEFT JOIN FETCH r.imagens
                        WHERE r.id = :id
                        AND r.privacidade = :privacidade
                        """)
        Optional<Receita> buscarPorIdEPrivacidadeComImagens(
                        @Param("id") Long id,
                        @Param("privacidade") PrivacidadeReceita privacidade);
}