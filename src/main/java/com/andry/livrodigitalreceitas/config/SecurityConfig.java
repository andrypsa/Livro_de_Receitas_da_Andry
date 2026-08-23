package com.andry.livrodigitalreceitas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import com.andry.livrodigitalreceitas.repository.AdministradorRepository;

@Configuration
public class SecurityConfig {

        // Define o algoritmo utilizado para armazenar as senhas dos administradores
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // Carrega os dados do administrador utilizado pelo Spring Security no login
        @Bean
        public UserDetailsService userDetailsService(
                        AdministradorRepository administradorRepository) {

                return email -> {
                        var administrador = administradorRepository
                                        .findByEmailIgnoreCase(email)
                                        .orElseThrow(
                                                        () -> new UsernameNotFoundException(
                                                                        "Administrador não encontrado."));

                        var usuario = User
                                        .withUsername(administrador.getEmail())
                                        .password(administrador.getSenhaHash())
                                        .disabled(!administrador.isAtivo());

                        if (administrador.isPrimeiroAdministrador()) {
                                return usuario
                                                .roles("ADMIN", "ADMIN_PRINCIPAL")
                                                .build();
                        }

                        return usuario
                                        .roles("ADMIN")
                                        .build();
                };
        }

        // Disponibiliza o gerenciador responsável pelo processo de autenticação
        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration authenticationConfiguration)
                        throws Exception {

                return authenticationConfiguration
                                .getAuthenticationManager();
        }

        // Mantém o contexto de autenticação do administrador na sessão HTTP
        @Bean
        public SecurityContextRepository securityContextRepository() {
                return new HttpSessionSecurityContextRepository();
        }

        // Define as regras de acesso, sessão e proteção CSRF da aplicação
        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        SecurityContextRepository securityContextRepository)
                        throws Exception {

                http
                                .authorizeHttpRequests(autorizacao -> autorizacao

                                                // Permite acesso público à listagem,
                                                // detalhes públicos e imagens das receitas
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/receitas",
                                                                "/api/receitas/**",
                                                                "/uploads/**")
                                                .permitAll()

                                                // Permite o primeiro acesso e login sem autenticação prévia
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/auth/admin/primeiro-acesso",
                                                                "/api/auth/admin/login")
                                                .permitAll()

                                                .requestMatchers("/error")
                                                .permitAll()

                                                // Permite consultar e concluir um convite sem autenticação prévia
                                                .requestMatchers(
                                                                "/api/convites-administrador/**")
                                                .permitAll()

                                                // Restringe o gerenciamento de administradores ao administrador
                                                // principal
                                                .requestMatchers(
                                                                "/api/admin/administradores/**")
                                                .hasRole("ADMIN_PRINCIPAL")

                                                // Todas as demais rotas exigem autenticação
                                                .anyRequest()
                                                .authenticated())

                                // Salva explicitamente o contexto de segurança na sessão
                                .securityContext(contexto -> contexto
                                                .securityContextRepository(
                                                                securityContextRepository)
                                                .requireExplicitSave(true))

                                // Configura o token CSRF utilizado pelo frontend
                                .csrf(csrf -> csrf
                                                .csrfTokenRepository(
                                                                CookieCsrfTokenRepository
                                                                                .withHttpOnlyFalse())
                                                .csrfTokenRequestHandler(
                                                                new CsrfTokenRequestAttributeHandler())
                                                .ignoringRequestMatchers(
                                                                "/api/auth/admin/primeiro-acesso",
                                                                "/api/auth/admin/login",
                                                                "/api/auth/admin/logout",
                                                                "/api/convites-administrador/**"))

                                // O login é realizado pela API, sem formulário padrão do Spring
                                .formLogin(formulario -> formulario.disable());

                return http.build();
        }
}