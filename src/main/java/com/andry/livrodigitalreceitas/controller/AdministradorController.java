package com.andry.livrodigitalreceitas.controller;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andry.livrodigitalreceitas.dto.CriarPrimeiroAdministradorRequest;
import com.andry.livrodigitalreceitas.model.Administrador;
import com.andry.livrodigitalreceitas.service.AdministradorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/admin")
public class AdministradorController {

    private final AdministradorService administradorService;

    public AdministradorController(
            AdministradorService administradorService) {
        this.administradorService = administradorService;
    }

    @PostMapping("/primeiro-acesso")
    public ResponseEntity<AdministradorCriadoResponse> criarPrimeiroAdministrador(
            @Valid @RequestBody CriarPrimeiroAdministradorRequest dados) {

        Administrador administrador = administradorService.criarPrimeiroAdministrador(dados);

        AdministradorCriadoResponse resposta = new AdministradorCriadoResponse(
                administrador.getId(),
                administrador.getNome(),
                administrador.getEmail());

        URI localizacao = URI.create(
                "/api/administradores/" + administrador.getId());

        return ResponseEntity
                .created(localizacao)
                .body(resposta);
    }

    private record AdministradorCriadoResponse(
            Long id,
            String nome,
            String email) {
    }
}