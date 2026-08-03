package com.andry.livrodigitalreceitas.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andry.livrodigitalreceitas.model.SolicitacaoAdministrador;
import com.andry.livrodigitalreceitas.model.StatusSolicitacaoAdministrador;

public interface SolicitacaoAdministradorRepository
        extends JpaRepository<SolicitacaoAdministrador, Long> {

    boolean existsByEmailSolicitanteIgnoreCaseAndStatusIn(
            String email,
            Collection<StatusSolicitacaoAdministrador> status
    );

    List<SolicitacaoAdministrador>
            findByStatusOrderBySolicitadoEmAsc(
                    StatusSolicitacaoAdministrador status
            );

    Optional<SolicitacaoAdministrador> findByTokenCadastro(
            String tokenCadastro
    );
}