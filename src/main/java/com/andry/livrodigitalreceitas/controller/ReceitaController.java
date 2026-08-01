package com.andry.livrodigitalreceitas.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andry.livrodigitalreceitas.dto.ReceitaDetalheDTO;
import com.andry.livrodigitalreceitas.dto.ReceitaResumoDTO;
import com.andry.livrodigitalreceitas.service.ReceitaService;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    private final ReceitaService receitaService;

    public ReceitaController(ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    @GetMapping
    public List<ReceitaResumoDTO> listarReceitasPublicas() {
        return receitaService.listarPublicas()
                .stream()
                .map(ReceitaResumoDTO::de)
                .toList();
    }

    @GetMapping("/{id}")
    public ReceitaDetalheDTO buscarReceitaPorId(@PathVariable Long id) {
        return ReceitaDetalheDTO.de(receitaService.buscarPorId(id));
    }
}