package com.andry.livrodigitalreceitas.exception;

public class ReceitaNaoEncontradaException extends RuntimeException {

    public ReceitaNaoEncontradaException() {
        super("Receita não encontrada.");
    }
}