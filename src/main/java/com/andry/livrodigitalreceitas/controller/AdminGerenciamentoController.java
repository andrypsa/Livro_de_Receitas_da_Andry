package com.andry.livrodigitalreceitas.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andry.livrodigitalreceitas.model.Administrador;
import com.andry.livrodigitalreceitas.service.AdministradorService;

@RestController
@RequestMapping("/api/admin/administradores")
public class AdminGerenciamentoController {

        private final AdministradorService administradorService;

        public AdminGerenciamentoController(
                        AdministradorService administradorService) {
                this.administradorService = administradorService;
        }

        // Retorna o administrador principal e os administradores secundários
        @GetMapping
        public ResponseEntity<AdministradoresResponse> listarAdministradores() {
                Administrador principal = administradorService.buscarAdministradorPrincipal();

                List<AdministradorResumoResponse> secundarios = administradorService
                                .listarAdministradoresSecundarios()
                                .stream()
                                .map(this::converterResumo)
                                .toList();

                AdministradoresResponse resposta = new AdministradoresResponse(
                                converterResumo(principal),
                                secundarios);

                return ResponseEntity.ok(resposta);
        }

        // Desativa o acesso de um administrador secundário
        @PatchMapping("/{id}/desativar")
        public ResponseEntity<AdministradorResumoResponse> desativarAdministrador(
                        @PathVariable Long id,
                        Authentication autenticacao) {

                Administrador administrador = administradorService
                                .desativarAdministradorSecundario(
                                                id,
                                                autenticacao.getName());

                return ResponseEntity.ok(
                                converterResumo(administrador));
        }

        // Reativa o acesso de um administrador secundário
        @PatchMapping("/{id}/reativar")
        public ResponseEntity<AdministradorResumoResponse> reativarAdministrador(
                        @PathVariable Long id,
                        Authentication autenticacao) {

                Administrador administrador = administradorService
                                .reativarAdministradorSecundario(
                                                id,
                                                autenticacao.getName());

                return ResponseEntity.ok(
                                converterResumo(administrador));
        }

        private AdministradorResumoResponse converterResumo(
                        Administrador administrador) {

                return new AdministradorResumoResponse(
                                administrador.getId(),
                                administrador.getNome(),
                                administrador.getEmail(),
                                administrador.isAtivo(),
                                administrador.isPrimeiroAdministrador());
        }

        private record AdministradoresResponse(
                        AdministradorResumoResponse principal,
                        List<AdministradorResumoResponse> secundarios) {
        }

        private record AdministradorResumoResponse(
                        Long id,
                        String nome,
                        String email,
                        boolean ativo,
                        boolean primeiroAdministrador) {
        }
}