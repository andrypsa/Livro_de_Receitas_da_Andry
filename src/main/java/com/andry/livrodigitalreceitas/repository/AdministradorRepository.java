package com.andry.livrodigitalreceitas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andry.livrodigitalreceitas.model.Administrador;

public interface AdministradorRepository
        extends JpaRepository<Administrador, Long> {

    Optional<Administrador> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByAtivoTrue();

    Optional<Administrador> findByPrimeiroAdministradorTrue();
}