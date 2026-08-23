package com.andry.livrodigitalreceitas.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

        // Trata erros de validação dos dados recebidos pela API
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErroApiResponse> tratarErroDeValidacao(
                        MethodArgumentNotValidException exception) {

                Map<String, String> campos = new LinkedHashMap<>();

                exception.getBindingResult()
                                .getFieldErrors()
                                .forEach(erro -> campos.put(
                                                erro.getField(),
                                                erro.getDefaultMessage()));

                ErroApiResponse resposta = new ErroApiResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Os dados informados são inválidos.",
                                campos,
                                LocalDateTime.now());

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(resposta);
        }

        // Trata tentativas de acessar receitas que não foram encontradas
        @ExceptionHandler(ReceitaNaoEncontradaException.class)
        public ResponseEntity<ErroApiResponse> tratarReceitaNaoEncontrada(
                        ReceitaNaoEncontradaException exception) {

                ErroApiResponse resposta = new ErroApiResponse(
                                HttpStatus.NOT_FOUND.value(),
                                exception.getMessage(),
                                Map.of(),
                                LocalDateTime.now());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(resposta);
        }

        // Trata argumentos inválidos enviados para as regras de negócio
        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErroApiResponse> tratarArgumentoInvalido(
                        IllegalArgumentException exception) {

                ErroApiResponse resposta = new ErroApiResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                exception.getMessage(),
                                Map.of(),
                                LocalDateTime.now());

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(resposta);
        }

        // Trata operações que não podem ser executadas no estado atual do sistema
        @ExceptionHandler(IllegalStateException.class)
        public ResponseEntity<ErroApiResponse> tratarEstadoInvalido(
                        IllegalStateException exception) {

                ErroApiResponse resposta = new ErroApiResponse(
                                HttpStatus.CONFLICT.value(),
                                exception.getMessage(),
                                Map.of(),
                                LocalDateTime.now());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(resposta);
        }

        // Trata falhas de autenticação do administrador
        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<ErroApiResponse> tratarErroDeAutenticacao(
                        AuthenticationException exception) {

                ErroApiResponse resposta = new ErroApiResponse(
                                HttpStatus.UNAUTHORIZED.value(),
                                "E-mail ou senha inválidos.",
                                Map.of(),
                                LocalDateTime.now());

                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(resposta);
        }

        // Define o formato padrão das respostas de erro da API
        private record ErroApiResponse(
                        int status,
                        String mensagem,
                        Map<String, String> campos,
                        LocalDateTime horario) {
        }
}