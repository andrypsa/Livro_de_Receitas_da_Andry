package com.andry.livrodigitalreceitas.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "solicitacoes_administrador")
public class SolicitacaoAdministrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_solicitante", nullable = false, length = 120)
    private String nomeSolicitante;

    @Column(name = "email_solicitante", nullable = false, length = 180)
    private String emailSolicitante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusSolicitacaoAdministrador status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprovado_por_id")
    private Administrador aprovadoPor;

    @Column(name = "token_cadastro", unique = true, length = 120)
    private String tokenCadastro;

    @Column(name = "solicitado_em", nullable = false, updatable = false)
    private LocalDateTime solicitadoEm;

    @Column(name = "respondido_em")
    private LocalDateTime respondidoEm;

    @Column(name = "expira_em")
    private LocalDateTime expiraEm;

    public SolicitacaoAdministrador() {
    }

    @PrePersist
    public void antesDeSalvar() {
        solicitadoEm = LocalDateTime.now();

        if (status == null) {
            status = StatusSolicitacaoAdministrador.PENDENTE;
        }
    }

    public Long getId() {
        return id;
    }

    public String getNomeSolicitante() {
        return nomeSolicitante;
    }

    public void setNomeSolicitante(String nomeSolicitante) {
        this.nomeSolicitante = nomeSolicitante;
    }

    public String getEmailSolicitante() {
        return emailSolicitante;
    }

    public void setEmailSolicitante(String emailSolicitante) {
        this.emailSolicitante = emailSolicitante;
    }

    public StatusSolicitacaoAdministrador getStatus() {
        return status;
    }

    public void setStatus(StatusSolicitacaoAdministrador status) {
        this.status = status;
    }

    public Administrador getAprovadoPor() {
        return aprovadoPor;
    }

    public void setAprovadoPor(Administrador aprovadoPor) {
        this.aprovadoPor = aprovadoPor;
    }

    public String getTokenCadastro() {
        return tokenCadastro;
    }

    public void setTokenCadastro(String tokenCadastro) {
        this.tokenCadastro = tokenCadastro;
    }

    public LocalDateTime getSolicitadoEm() {
        return solicitadoEm;
    }

    public LocalDateTime getRespondidoEm() {
        return respondidoEm;
    }

    public void setRespondidoEm(LocalDateTime respondidoEm) {
        this.respondidoEm = respondidoEm;
    }

    public LocalDateTime getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(LocalDateTime expiraEm) {
        this.expiraEm = expiraEm;
    }
}