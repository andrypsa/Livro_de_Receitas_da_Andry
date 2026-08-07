package com.andry.livrodigitalreceitas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.andry.livrodigitalreceitas.service.ImagemReceitaService;

@RestController
@RequestMapping("/api/receitas/imagens")
public class ImagemReceitaController {

    private final ImagemReceitaService imagemReceitaService;

    public ImagemReceitaController(
            ImagemReceitaService imagemReceitaService) {
        this.imagemReceitaService = imagemReceitaService;
    }

    @PostMapping
    public ResponseEntity<ImagemReceitaResponse> enviarImagem(
            @RequestParam("imagem") MultipartFile imagem) {
        String imagemUrl = imagemReceitaService.salvar(imagem);

        return ResponseEntity.ok(
                new ImagemReceitaResponse(imagemUrl));
    }

    private record ImagemReceitaResponse(
            String imagemUrl) {
    }
}