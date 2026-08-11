package com.andry.livrodigitalreceitas.controller;

import com.andry.livrodigitalreceitas.dto.ReceitaResumoDTO;
import com.andry.livrodigitalreceitas.model.Receita;
import com.andry.livrodigitalreceitas.service.ReceitaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/receitas")
public class AdminReceitaController {

    private final ReceitaService receitaService;

    public AdminReceitaController(
            ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    @GetMapping
    public ResponseEntity<List<ReceitaResumoDTO>> listarTodas() {

        List<ReceitaResumoDTO> receitas = receitaService
                .listarTodas()
                .stream()
                .map(this::converterParaResumo)
                .toList();

        return ResponseEntity.ok(receitas);
    }

private ReceitaResumoDTO converterParaResumo(
        Receita receita
) {
    return ReceitaResumoDTO.de(receita);
}
}