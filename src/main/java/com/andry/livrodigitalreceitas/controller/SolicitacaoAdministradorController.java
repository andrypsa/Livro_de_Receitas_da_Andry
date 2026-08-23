package com.andry.livrodigitalreceitas.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andry.livrodigitalreceitas.model.Administrador;
import com.andry.livrodigitalreceitas.model.SolicitacaoAdministrador;
import com.andry.livrodigitalreceitas.service.SolicitacaoAdministradorService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api")
public class SolicitacaoAdministradorController {

        private final SolicitacaoAdministradorService
                        solicitacaoAdministradorService;

        public SolicitacaoAdministradorController(
                        SolicitacaoAdministradorService
                                        solicitacaoAdministradorService) {

                this.solicitacaoAdministradorService =
                                solicitacaoAdministradorService;
        }

        // Gera um convite para cadastro de um segundo administrador
        @PostMapping("/admin/administradores/convites")
        public ResponseEntity<ConviteAdministradorResponse> gerarConvite(
                        @Valid @RequestBody CriarConviteAdministradorRequest dados,
                        Authentication autenticacao) {

                SolicitacaoAdministrador convite =
                                solicitacaoAdministradorService
                                                .gerarConvite(
                                                                dados.nome(),
                                                                dados.email(),
                                                                autenticacao.getName());

                ConviteAdministradorResponse resposta =
                                new ConviteAdministradorResponse(
                                                convite.getId(),
                                                convite.getNomeConvidado(),
                                                convite.getEmailConvidado(),
                                                convite.getTokenCadastro(),
                                                convite.getExpiraEm());

                return ResponseEntity.ok(resposta);
        }

        // Consulta os dados públicos de um convite pelo token
        @GetMapping("/convites-administrador/{token}")
        public ResponseEntity<ConvitePublicoResponse> consultarConvite(
                        @PathVariable String token) {

                SolicitacaoAdministrador convite =
                                solicitacaoAdministradorService
                                                .buscarConviteValido(token);

                ConvitePublicoResponse resposta =
                                new ConvitePublicoResponse(
                                                convite.getNomeConvidado(),
                                                convite.getEmailConvidado(),
                                                convite.getExpiraEm());

                return ResponseEntity.ok(resposta);
        }

        // Conclui o convite e cria o segundo administrador
        @PostMapping("/convites-administrador/{token}/concluir")
        public ResponseEntity<AdministradorCriadoResponse> concluirConvite(
                        @PathVariable String token,
                        @Valid @RequestBody ConcluirConviteRequest dados) {

                Administrador administrador =
                                solicitacaoAdministradorService
                                                .concluirConvite(
                                                                token,
                                                                dados.senha());

                AdministradorCriadoResponse resposta =
                                new AdministradorCriadoResponse(
                                                administrador.getId(),
                                                administrador.getNome(),
                                                administrador.getEmail());

                return ResponseEntity.ok(resposta);
        }

        private record CriarConviteAdministradorRequest(
                        @NotBlank(message = "O nome é obrigatório.")
                        @Size(
                                        max = 120,
                                        message = "O nome deve ter no máximo 120 caracteres.")
                        String nome,

                        @NotBlank(message = "O e-mail é obrigatório.")
                        @Email(message = "Informe um e-mail válido.")
                        @Size(
                                        max = 180,
                                        message = "O e-mail deve ter no máximo 180 caracteres.")
                        String email) {
        }

        private record ConcluirConviteRequest(
                        @NotBlank(message = "A senha é obrigatória.")
                        @Size(
                                        min = 8,
                                        max = 100,
                                        message = "A senha deve ter entre 8 e 100 caracteres.")
                        String senha) {
        }

        private record ConviteAdministradorResponse(
                        Long id,
                        String nome,
                        String email,
                        String token,
                        LocalDateTime expiraEm) {
        }

        private record ConvitePublicoResponse(
                        String nome,
                        String email,
                        LocalDateTime expiraEm) {
        }

        private record AdministradorCriadoResponse(
                        Long id,
                        String nome,
                        String email) {
        }
}