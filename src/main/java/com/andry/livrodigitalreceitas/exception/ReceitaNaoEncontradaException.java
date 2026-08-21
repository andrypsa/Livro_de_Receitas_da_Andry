package com.andry.livrodigitalreceitas.exception;

// Exceção lançada quando uma receita não é encontrada
public class ReceitaNaoEncontradaException extends RuntimeException {

    public ReceitaNaoEncontradaException() {
        super("Receita não encontrada.");
    }
}