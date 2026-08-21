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

// Representa o convite enviado para cadastro de um novo administrador
@Entity
@Table(name = "solicitacoes_administrador")
public class SolicitacaoAdministrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_solicitante", nullable = false, length = 120)
    private String nomeConvidado;

    @Column(name = "email_solicitante", nullable = false, length = 180)
    private String emailConvidado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusSolicitacaoAdministrador status;

    // Registra qual administrador gerou o convite
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprovado_por_id")
    private Administrador administradorConvidante;

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

    // Define a data do convite e o status inicial antes do primeiro salvamento
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

    public String getNomeConvidado() {
        return nomeConvidado;
    }

    public void setNomeConvidado(String nomeConvidado) {
        this.nomeConvidado = nomeConvidado;
    }

    public String getEmailConvidado() {
        return emailConvidado;
    }

    public void setEmailConvidado(String emailConvidado) {
        this.emailConvidado = emailConvidado;
    }

    public StatusSolicitacaoAdministrador getStatus() {
        return status;
    }

    public void setStatus(StatusSolicitacaoAdministrador status) {
        this.status = status;
    }

    public Administrador getAdministradorConvidante() {
        return administradorConvidante;
    }

    public void setAdministradorConvidante(
            Administrador administradorConvidante) {
        this.administradorConvidante = administradorConvidante;
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