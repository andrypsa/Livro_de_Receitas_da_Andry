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

import com.andry.livrodigitalreceitas.repository.AdministradorRepository;

@Configuration
public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public UserDetailsService userDetailsService(
                        AdministradorRepository administradorRepository) {
                return email -> {
                        var administrador = administradorRepository
                                        .findByEmailIgnoreCase(email)
                                        .orElseThrow(() -> new UsernameNotFoundException(
                                                        "Administrador não encontrado."));

                        return User
                                        .withUsername(administrador.getEmail())
                                        .password(administrador.getSenhaHash())
                                        .roles("ADMIN")
                                        .disabled(!administrador.isAtivo())
                                        .build();
                };
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration authenticationConfiguration) throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }

        @Bean
        public SecurityContextRepository securityContextRepository() {
                return new HttpSessionSecurityContextRepository();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        SecurityContextRepository securityContextRepository) throws Exception {

                http
                                .authorizeHttpRequests(autorizacao -> autorizacao
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/receitas",
                                                                "/api/receitas/**")
                                                .permitAll()
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/auth/admin/primeiro-acesso",
                                                                "/api/auth/admin/login")
                                                .permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .anyRequest().authenticated())
                                .securityContext(contexto -> contexto
                                                .securityContextRepository(
                                                                securityContextRepository)
                                                .requireExplicitSave(true))
                                .csrf(csrf -> csrf.ignoringRequestMatchers(
                                                "/api/auth/admin/primeiro-acesso",
                                                "/api/auth/admin/login"))
                                .formLogin(formulario -> formulario.disable());

                return http.build();
        }
}