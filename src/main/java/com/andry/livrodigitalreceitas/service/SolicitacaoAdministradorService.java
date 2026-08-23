package com.andry.livrodigitalreceitas.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andry.livrodigitalreceitas.model.Administrador;
import com.andry.livrodigitalreceitas.model.SolicitacaoAdministrador;
import com.andry.livrodigitalreceitas.model.StatusSolicitacaoAdministrador;
import com.andry.livrodigitalreceitas.repository.AdministradorRepository;
import com.andry.livrodigitalreceitas.repository.SolicitacaoAdministradorRepository;

@Service
public class SolicitacaoAdministradorService {

        private static final long LIMITE_ADMINISTRADORES = 2;

        private static final long DIAS_VALIDADE_CONVITE = 7;

        private static final List<StatusSolicitacaoAdministrador> STATUS_QUE_BLOQUEIAM_NOVA_SOLICITACAO = List.of(
                        StatusSolicitacaoAdministrador.PENDENTE,
                        StatusSolicitacaoAdministrador.APROVADA);

        private final AdministradorRepository administradorRepository;

        private final SolicitacaoAdministradorRepository solicitacaoAdministradorRepository;

        private final PasswordEncoder passwordEncoder;

        public SolicitacaoAdministradorService(
                        AdministradorRepository administradorRepository,
                        SolicitacaoAdministradorRepository solicitacaoAdministradorRepository,
                        PasswordEncoder passwordEncoder) {

                this.administradorRepository = administradorRepository;

                this.solicitacaoAdministradorRepository = solicitacaoAdministradorRepository;

                this.passwordEncoder = passwordEncoder;
        }

        // Gera um convite para cadastro de um segundo administrador
        @Transactional
        public SolicitacaoAdministrador gerarConvite(
                        String nome,
                        String email,
                        String emailAdministradorPrincipal) {

                String nomeNormalizado = normalizarNome(nome);

                String emailNormalizado = normalizarEmail(email);

                Administrador administradorPrincipal = buscarEValidarAdministradorPrincipal(
                                emailAdministradorPrincipal);

                validarLimiteDeAdministradores();
                validarEmailDisponivel(emailNormalizado);
                validarSolicitacaoDuplicada(emailNormalizado);

                SolicitacaoAdministrador solicitacao = new SolicitacaoAdministrador();

                solicitacao.setNomeConvidado(
                                nomeNormalizado);

                solicitacao.setEmailConvidado(
                                emailNormalizado);

                solicitacao.setAdministradorConvidante(
                                administradorPrincipal);

                solicitacao.setTokenCadastro(
                                UUID.randomUUID().toString());

                solicitacao.setExpiraEm(
                                LocalDateTime.now()
                                                .plusDays(
                                                                DIAS_VALIDADE_CONVITE));

                solicitacao.setStatus(
                                StatusSolicitacaoAdministrador.APROVADA);

                solicitacao.setRespondidoEm(
                                LocalDateTime.now());

                return solicitacaoAdministradorRepository
                                .save(solicitacao);
        }

        // Lista os convites que ainda aguardam conclusão
        @Transactional(readOnly = true)
        public List<SolicitacaoAdministrador> listarPendentes() {
                return solicitacaoAdministradorRepository
                                .findByStatusOrderBySolicitadoEmAsc(
                                                StatusSolicitacaoAdministrador.APROVADA);
        }

        // Busca um convite disponível para conclusão
        @Transactional
        public SolicitacaoAdministrador buscarConviteValido(
                        String token) {

                if (token == null || token.isBlank()) {
                        throw new IllegalArgumentException(
                                        "O token do convite é obrigatório.");
                }

                SolicitacaoAdministrador solicitacao = solicitacaoAdministradorRepository
                                .findByTokenCadastro(
                                                token.trim())
                                .orElseThrow(
                                                () -> new IllegalArgumentException(
                                                                "Convite inválido."));

                if (solicitacao.getStatus() != StatusSolicitacaoAdministrador.APROVADA) {

                        throw new IllegalStateException(
                                        "Este convite não está disponível.");
                }

                if (solicitacao.getExpiraEm() == null ||
                                LocalDateTime.now()
                                                .isAfter(
                                                                solicitacao.getExpiraEm())) {

                        solicitacao.setStatus(
                                        StatusSolicitacaoAdministrador.EXPIRADA);

                        solicitacao.setRespondidoEm(
                                        LocalDateTime.now());

                        solicitacaoAdministradorRepository
                                        .save(solicitacao);

                        throw new IllegalStateException(
                                        "Este convite expirou.");
                }

                return solicitacao;
        }

        // Conclui um convite válido e cria o segundo administrador
        @Transactional
        public Administrador concluirConvite(
                        String token,
                        String senha) {

                if (senha == null || senha.isBlank()) {
                        throw new IllegalArgumentException(
                                        "A senha é obrigatória.");
                }

                SolicitacaoAdministrador solicitacao = buscarConviteValido(token);

                validarLimiteDeAdministradores();

                String emailConvidado = normalizarEmail(
                                solicitacao.getEmailConvidado());

                validarEmailDisponivel(
                                emailConvidado);

                Administrador administrador = new Administrador();

                administrador.setNome(
                                solicitacao
                                                .getNomeConvidado()
                                                .trim());

                administrador.setEmail(
                                emailConvidado);

                administrador.setSenhaHash(
                                passwordEncoder.encode(
                                                senha));

                administrador.setAtivo(true);
                administrador.setPrimeiroAdministrador(false);

                Administrador administradorSalvo = administradorRepository
                                .save(administrador);

                solicitacao.setStatus(
                                StatusSolicitacaoAdministrador.CONCLUIDA);

                solicitacao.setRespondidoEm(
                                LocalDateTime.now());

                solicitacaoAdministradorRepository
                                .save(solicitacao);

                return administradorSalvo;
        }

        // Confirma que o convite está sendo gerado pelo administrador principal
        private Administrador buscarEValidarAdministradorPrincipal(
                        String email) {

                Administrador administrador = administradorRepository
                                .findByEmailIgnoreCase(
                                                email)
                                .orElseThrow(
                                                () -> new IllegalArgumentException(
                                                                "Administrador não encontrado."));

                if (!administrador.isAtivo() ||
                                !administrador.isPrimeiroAdministrador()) {

                        throw new IllegalStateException(
                                        "Somente o administrador principal pode gerar convites.");
                }

                return administrador;
        }

        // Impede que o sistema ultrapasse dois administradores ativos
        private void validarLimiteDeAdministradores() {
                if (administradorRepository
                                .countByAtivoTrue() >= LIMITE_ADMINISTRADORES) {

                        throw new IllegalStateException(
                                        "O limite de dois administradores ativos já foi atingido.");
                }
        }

        // Impede novo convite para um administrador já cadastrado
        private void validarEmailDisponivel(
                        String email) {

                Optional<Administrador> administradorExistente = administradorRepository
                                .findByEmailIgnoreCase(
                                                email);

                if (administradorExistente.isEmpty()) {
                        return;
                }

                Administrador administrador = administradorExistente.get();

                if (administrador.isAtivo()) {
                        throw new IllegalArgumentException(
                                        "Já existe um administrador ativo com este e-mail.");
                }

                throw new IllegalStateException(
                                "Este e-mail pertence a um administrador desativado. Reative o administrador existente em vez de gerar um novo convite.");
        }

        // Impede convites simultâneos para o mesmo e-mail
        private void validarSolicitacaoDuplicada(
                        String email) {

                boolean solicitacaoExistente = solicitacaoAdministradorRepository
                                .existsByEmailConvidadoIgnoreCaseAndStatusIn(
                                                email,
                                                STATUS_QUE_BLOQUEIAM_NOVA_SOLICITACAO);

                if (solicitacaoExistente) {
                        throw new IllegalArgumentException(
                                        "Já existe um convite em andamento para este e-mail.");
                }
        }

        // Normaliza e valida o nome do convidado
        private String normalizarNome(String nome) {
                if (nome == null || nome.isBlank()) {
                        throw new IllegalArgumentException(
                                        "O nome é obrigatório.");
                }

                return nome.trim();
        }

        // Normaliza e valida o e-mail do convidado
        private String normalizarEmail(String email) {
                if (email == null || email.isBlank()) {
                        throw new IllegalArgumentException(
                                        "O e-mail é obrigatório.");
                }

                return email
                                .trim()
                                .toLowerCase(Locale.ROOT);
        }
}