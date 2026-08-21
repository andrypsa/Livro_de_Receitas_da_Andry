package com.andry.livrodigitalreceitas.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andry.livrodigitalreceitas.model.SolicitacaoAdministrador;
import com.andry.livrodigitalreceitas.model.StatusSolicitacaoAdministrador;

public interface SolicitacaoAdministradorRepository
                extends JpaRepository<SolicitacaoAdministrador, Long> {

        // Verifica se já existe convite ativo para o e-mail informado
        boolean existsByEmailConvidadoIgnoreCaseAndStatusIn(
                        String email,
                        Collection<StatusSolicitacaoAdministrador> status);

        // Lista solicitações por status em ordem de criação
        List<SolicitacaoAdministrador> findByStatusOrderBySolicitadoEmAsc(
                        StatusSolicitacaoAdministrador status);

        // Busca um convite pelo token de cadastro
        Optional<SolicitacaoAdministrador> findByTokenCadastro(
                        String tokenCadastro);
}