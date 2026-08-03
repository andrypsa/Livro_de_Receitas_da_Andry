package com.andry.livrodigitalreceitas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

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
        public SecurityFilterChain securityFilterChain(HttpSecurity http)
                        throws Exception {

                http
                                .authorizeHttpRequests(autorizacao -> autorizacao
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/receitas",
                                                                "/api/receitas/**")
                                                .permitAll()
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/auth/admin/primeiro-acesso")
                                                .permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .anyRequest().authenticated())
                                .csrf(csrf -> csrf.ignoringRequestMatchers(
                                                "/api/auth/admin/primeiro-acesso"))
                                .formLogin(formulario -> formulario.disable());

                return http.build();
        }
}