package com.andry.livrodigitalreceitas.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andry.livrodigitalreceitas.model.Administrador;

public interface AdministradorRepository
        extends JpaRepository<Administrador, Long> {

    // Busca um administrador pelo e-mail, ignorando diferenças entre maiúsculas e
    // minúsculas
    Optional<Administrador> findByEmailIgnoreCase(String email);

    // Verifica se já existe um administrador cadastrado com o e-mail informado
    boolean existsByEmailIgnoreCase(String email);

    // Conta quantos administradores estão ativos no sistema
    long countByAtivoTrue();

    // Busca o administrador principal do sistema
    Optional<Administrador> findByPrimeiroAdministradorTrue();

    // Busca o segundo administrador que está ativo atualmente
    Optional<Administrador> findByPrimeiroAdministradorFalseAndAtivoTrue();

    // Lista todos os administradores secundários, ativos ou desativados
    List<Administrador> findByPrimeiroAdministradorFalseOrderByNomeAsc();
}