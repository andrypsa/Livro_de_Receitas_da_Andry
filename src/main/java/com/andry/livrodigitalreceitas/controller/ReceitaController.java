package com.andry.livrodigitalreceitas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.andry.livrodigitalreceitas.service.ReceitaService;

@Controller
@RequestMapping("/receitas")
public class ReceitaController {

    private final ReceitaService receitaService;

    public ReceitaController(ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    @GetMapping
    public String listarReceitasPublicas(Model model) {
        model.addAttribute(
                "receitas",
                receitaService.listarPublicas()
        );

        return "receitas/lista";
    }
}