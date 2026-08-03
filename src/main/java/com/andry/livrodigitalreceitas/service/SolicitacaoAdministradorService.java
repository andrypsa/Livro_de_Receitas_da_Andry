package com.andry.livrodigitalreceitas.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andry.livrodigitalreceitas.model.SolicitacaoAdministrador;
import com.andry.livrodigitalreceitas.model.StatusSolicitacaoAdministrador;
import com.andry.livrodigitalreceitas.repository.AdministradorRepository;
import com.andry.livrodigitalreceitas.repository.SolicitacaoAdministradorRepository;

@Service
public class SolicitacaoAdministradorService {

    private static final long LIMITE_ADMINISTRADORES = 2;

    private static final List<StatusSolicitacaoAdministrador>
            STATUS_QUE_BLOQUEIAM_NOVA_SOLICITACAO = List.of(
                    StatusSolicitacaoAdministrador.PENDENTE,
                    StatusSolicitacaoAdministrador.APROVADA
            );

    private final AdministradorRepository administradorRepository;
    private final SolicitacaoAdministradorRepository
            solicitacaoAdministradorRepository;

    public SolicitacaoAdministradorService(
            AdministradorRepository administradorRepository,
            SolicitacaoAdministradorRepository
                    solicitacaoAdministradorRepository
    ) {
        this.administradorRepository = administradorRepository;
        this.solicitacaoAdministradorRepository =
                solicitacaoAdministradorRepository;
    }

    @Transactional
    public SolicitacaoAdministrador solicitarAcesso(
            String nome,
            String email
    ) {
        String nomeNormalizado = normalizarNome(nome);
        String emailNormalizado = normalizarEmail(email);

        validarExistenciaDoPrimeiroAdministrador();
        validarLimiteDeAdministradores();
        validarEmailDisponivel(emailNormalizado);
        validarSolicitacaoDuplicada(emailNormalizado);

        SolicitacaoAdministrador solicitacao =
                new SolicitacaoAdministrador();

        solicitacao.setNomeSolicitante(nomeNormalizado);
        solicitacao.setEmailSolicitante(emailNormalizado);
        solicitacao.setStatus(
                StatusSolicitacaoAdministrador.PENDENTE
        );

        return solicitacaoAdministradorRepository.save(solicitacao);
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoAdministrador> listarPendentes() {
        return solicitacaoAdministradorRepository
                .findByStatusOrderBySolicitadoEmAsc(
                        StatusSolicitacaoAdministrador.PENDENTE
                );
    }

    private void validarExistenciaDoPrimeiroAdministrador() {
        if (administradorRepository.countByAtivoTrue() == 0) {
            throw new IllegalStateException(
                    "O primeiro administrador ainda não foi criado."
            );
        }
    }

    private void validarLimiteDeAdministradores() {
        if (administradorRepository.countByAtivoTrue()
                >= LIMITE_ADMINISTRADORES) {
            throw new IllegalStateException(
                    "O limite de dois administradores já foi atingido."
            );
        }
    }

    private void validarEmailDisponivel(String email) {
        if (administradorRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException(
                    "Já existe um administrador com este e-mail."
            );
        }
    }

    private void validarSolicitacaoDuplicada(String email) {
        boolean solicitacaoExistente =
                solicitacaoAdministradorRepository
                        .existsByEmailSolicitanteIgnoreCaseAndStatusIn(
                                email,
                                STATUS_QUE_BLOQUEIAM_NOVA_SOLICITACAO
                        );

        if (solicitacaoExistente) {
            throw new IllegalArgumentException(
                    "Já existe uma solicitação em andamento para este e-mail."
            );
        }
    }

    private String normalizarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException(
                    "O nome é obrigatório."
            );
        }

        return nome.trim();
    }

    private String normalizarEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "O e-mail é obrigatório."
            );
        }

        return email.trim().toLowerCase();
    }
}