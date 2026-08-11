package com.andry.livrodigitalreceitas.controller;

import java.net.URI;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andry.livrodigitalreceitas.dto.CriarPrimeiroAdministradorRequest;
import com.andry.livrodigitalreceitas.dto.LoginAdministradorRequest;
import com.andry.livrodigitalreceitas.model.Administrador;
import com.andry.livrodigitalreceitas.service.AdministradorService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/admin")
public class AdministradorController {

        private final AdministradorService administradorService;
        private final AuthenticationManager authenticationManager;
        private final SecurityContextRepository securityContextRepository;

        public AdministradorController(
                        AdministradorService administradorService,
                        AuthenticationManager authenticationManager,
                        SecurityContextRepository securityContextRepository) {
                this.administradorService = administradorService;
                this.authenticationManager = authenticationManager;
                this.securityContextRepository = securityContextRepository;
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

        @PostMapping("/login")
        public ResponseEntity<LoginAdministradorResponse> login(
                        @Valid @RequestBody LoginAdministradorRequest dados,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                Authentication tentativa = UsernamePasswordAuthenticationToken.unauthenticated(
                                dados.email().trim().toLowerCase(),
                                dados.senha());

                Authentication autenticacao = authenticationManager.authenticate(tentativa);

                var contexto = SecurityContextHolder.createEmptyContext();
                contexto.setAuthentication(autenticacao);

                SecurityContextHolder.setContext(contexto);

                securityContextRepository.saveContext(
                                contexto,
                                request,
                                response);

                LoginAdministradorResponse resposta = new LoginAdministradorResponse(
                                autenticacao.getName(),
                                "Login realizado com sucesso.");

                return ResponseEntity.ok(resposta);
        }

        @GetMapping("/sessao")
        public ResponseEntity<SessaoAdministradorResponse> consultarSessao(
                        Authentication autenticacao) {
                SessaoAdministradorResponse resposta = new SessaoAdministradorResponse(
                                true,
                                autenticacao.getName());

                return ResponseEntity.ok(resposta);
        }

        @PostMapping("/logout")
        public ResponseEntity<MensagemResponse> logout(
                        HttpServletRequest request) {
                HttpSession sessao = request.getSession(false);

                if (sessao != null) {
                        sessao.invalidate();
                }

                SecurityContextHolder.clearContext();

                return ResponseEntity.ok(
                                new MensagemResponse(
                                                "Logout realizado com sucesso."));
        }

        @GetMapping("/csrf")
        public ResponseEntity<Void> csrf(CsrfToken csrfToken) {
                csrfToken.getToken();

                return ResponseEntity.noContent().build();
        }

        private record AdministradorCriadoResponse(
                        Long id,
                        String nome,
                        String email) {
        }

        private record LoginAdministradorResponse(
                        String email,
                        String mensagem) {
        }

        private record SessaoAdministradorResponse(
                        boolean autenticado,
                        String email) {
        }

        private record MensagemResponse(
                        String mensagem) {
        }
}