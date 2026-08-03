package com.andry.livrodigitalreceitas.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

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

    private record ErroApiResponse(
            int status,
            String mensagem,
            Map<String, String> campos,
            LocalDateTime horario) {
    }
}