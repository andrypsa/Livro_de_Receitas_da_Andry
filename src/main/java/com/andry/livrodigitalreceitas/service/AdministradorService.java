package com.andry.livrodigitalreceitas.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andry.livrodigitalreceitas.dto.CriarPrimeiroAdministradorRequest;
import com.andry.livrodigitalreceitas.model.Administrador;
import com.andry.livrodigitalreceitas.repository.AdministradorRepository;

@Service
public class AdministradorService {

    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdministradorService(
            AdministradorRepository administradorRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.administradorRepository = administradorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Administrador criarPrimeiroAdministrador(
            CriarPrimeiroAdministradorRequest dados
    ) {
        if (administradorRepository.count() > 0) {
            throw new IllegalStateException(
                    "O primeiro administrador já foi criado."
            );
        }

        String emailNormalizado = dados.email()
                .trim()
                .toLowerCase();

        if (administradorRepository.existsByEmailIgnoreCase(
                emailNormalizado
        )) {
            throw new IllegalArgumentException(
                    "Já existe um administrador com este e-mail."
            );
        }

        Administrador administrador = new Administrador();

        administrador.setNome(dados.nome().trim());
        administrador.setEmail(emailNormalizado);
        administrador.setSenhaHash(
                passwordEncoder.encode(dados.senha())
        );
        administrador.setAtivo(true);
        administrador.setPrimeiroAdministrador(true);

        return administradorRepository.save(administrador);
    }
}