package com.andry.livrodigitalreceitas.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImagemReceitaService {

    private static final Path PASTA_UPLOADS = Paths.get("uploads", "receitas");

    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp");

    private static final long TAMANHO_MAXIMO = 5L * 1024L * 1024L;

    public String salvar(MultipartFile arquivo) {

        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException(
                    "Selecione uma imagem para a receita.");
        }

        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new IllegalArgumentException(
                    "A imagem deve ter no máximo 5 MB.");
        }

        String tipoConteudo = arquivo.getContentType();

        if (tipoConteudo == null
                || !TIPOS_PERMITIDOS.contains(tipoConteudo)) {
            throw new IllegalArgumentException(
                    "Formato de imagem não permitido. "
                            + "Utilize JPG, PNG ou WebP.");
        }

        String extensao = obterExtensao(tipoConteudo);

        String nomeArquivo = UUID.randomUUID() + extensao;

        try {
            Files.createDirectories(PASTA_UPLOADS);

            Path destino = PASTA_UPLOADS
                    .resolve(nomeArquivo)
                    .normalize();

            Files.copy(
                    arquivo.getInputStream(),
                    destino,
                    StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/receitas/" + nomeArquivo;

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Não foi possível salvar a imagem da receita.",
                    exception);
        }
    }

    private String obterExtensao(String tipoConteudo) {
        return switch (tipoConteudo) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new IllegalArgumentException(
                    "Formato de imagem não permitido.");
        };
    }
}