package com.andry.livrodigitalreceitas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Representa as credenciais enviadas para autenticação do administrador
public record LoginAdministradorRequest(

                @NotBlank(message = "O e-mail é obrigatório.") @Email(message = "Informe um e-mail válido.") String email,

                @NotBlank(message = "A senha é obrigatória.") String senha) {
}