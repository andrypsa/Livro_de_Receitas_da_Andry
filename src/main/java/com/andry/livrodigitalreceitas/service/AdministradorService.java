package com.andry.livrodigitalreceitas.service;

import java.util.List;
import java.util.Locale;

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
                        PasswordEncoder passwordEncoder) {
                this.administradorRepository = administradorRepository;
                this.passwordEncoder = passwordEncoder;
        }

        // Cria o primeiro administrador do sistema e impede cadastros duplicados
        @Transactional
        public Administrador criarPrimeiroAdministrador(
                        CriarPrimeiroAdministradorRequest dados) {

                if (administradorRepository.count() > 0) {
                        throw new IllegalStateException(
                                        "O primeiro administrador já foi criado.");
                }

                String emailNormalizado = dados.email()
                                .trim()
                                .toLowerCase(Locale.ROOT);

                if (administradorRepository.existsByEmailIgnoreCase(
                                emailNormalizado)) {
                        throw new IllegalArgumentException(
                                        "Já existe um administrador com este e-mail.");
                }

                Administrador administrador = new Administrador();

                administrador.setNome(dados.nome().trim());
                administrador.setEmail(emailNormalizado);

                // Armazena somente o hash da senha, nunca a senha original
                administrador.setSenhaHash(
                                passwordEncoder.encode(dados.senha()));

                administrador.setAtivo(true);
                administrador.setPrimeiroAdministrador(true);

                return administradorRepository.save(administrador);
        }

        // Busca o administrador principal do sistema
        @Transactional(readOnly = true)
        public Administrador buscarAdministradorPrincipal() {
                return administradorRepository
                                .findByPrimeiroAdministradorTrue()
                                .orElseThrow(
                                                () -> new IllegalStateException(
                                                                "Administrador principal não encontrado."));
        }

        // Lista todos os administradores secundários, ativos ou desativados
        @Transactional(readOnly = true)
        public List<Administrador> listarAdministradoresSecundarios() {
                return administradorRepository
                                .findByPrimeiroAdministradorFalseOrderByNomeAsc();
        }

        // Desativa o acesso de um administrador secundário
        @Transactional
        public Administrador desativarAdministradorSecundario(
                        Long administradorId,
                        String emailAdministradorPrincipal) {

                validarAdministradorPrincipal(
                                emailAdministradorPrincipal);

                Administrador administrador = buscarAdministradorSecundario(
                                administradorId);

                if (!administrador.isAtivo()) {
                        throw new IllegalStateException(
                                        "Este administrador já está desativado.");
                }

                administrador.setAtivo(false);

                return administradorRepository.save(administrador);
        }

        // Reativa um administrador secundário quando não existe outro ativo
        @Transactional
        public Administrador reativarAdministradorSecundario(
                        Long administradorId,
                        String emailAdministradorPrincipal) {

                validarAdministradorPrincipal(
                                emailAdministradorPrincipal);

                Administrador administrador = buscarAdministradorSecundario(
                                administradorId);

                if (administrador.isAtivo()) {
                        throw new IllegalStateException(
                                        "Este administrador já está ativo.");
                }

                administradorRepository
                                .findByPrimeiroAdministradorFalseAndAtivoTrue()
                                .ifPresent(administradorAtivo -> {
                                        throw new IllegalStateException(
                                                        "Já existe um segundo administrador ativo.");
                                });

                administrador.setAtivo(true);

                return administradorRepository.save(administrador);
        }

        // Confirma que a operação está sendo realizada pelo administrador principal
        private void validarAdministradorPrincipal(
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
                                        "Somente o administrador principal pode realizar esta operação.");
                }
        }

        // Busca um administrador e impede alterações no administrador principal
        private Administrador buscarAdministradorSecundario(
                        Long administradorId) {

                Administrador administrador = administradorRepository
                                .findById(administradorId)
                                .orElseThrow(
                                                () -> new IllegalArgumentException(
                                                                "Administrador não encontrado."));

                if (administrador.isPrimeiroAdministrador()) {
                        throw new IllegalStateException(
                                        "O administrador principal não pode ser desativado.");
                }

                return administrador;
        }
}