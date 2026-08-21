package com.andry.livrodigitalreceitas.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.andry.livrodigitalreceitas.model.enums.Categoria;
import com.andry.livrodigitalreceitas.model.enums.Dificuldade;
import com.andry.livrodigitalreceitas.model.enums.OrigemReceita;
import com.andry.livrodigitalreceitas.model.enums.PrivacidadeReceita;
import com.andry.livrodigitalreceitas.model.enums.StatusReceita;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

// Representa uma receita e todos os dados armazenados no sistema
@Entity
@Table(name = "receitas")
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da receita é obrigatório.")
    @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres.")
    @Column(nullable = false, length = 150)
    private String nome;

    @NotNull(message = "A categoria é obrigatória.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Categoria categoria;

    @NotBlank(message = "Os ingredientes são obrigatórios.")
    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String ingredientes;

    @NotBlank(message = "O modo de preparo é obrigatório.")
    @Lob
    @Column(name = "modo_preparo", nullable = false, columnDefinition = "TEXT")
    private String modoPreparo;

    // Dados opcionais de recheio
    @Lob
    @Column(name = "ingredientes_recheio", columnDefinition = "TEXT")
    private String ingredientesRecheio;

    @Lob
    @Column(name = "modo_preparo_recheio", columnDefinition = "TEXT")
    private String modoPreparoRecheio;

    // Dados opcionais de cobertura
    @Lob
    @Column(name = "ingredientes_cobertura", columnDefinition = "TEXT")
    private String ingredientesCobertura;

    @Lob
    @Column(name = "modo_preparo_cobertura", columnDefinition = "TEXT")
    private String modoPreparoCobertura;

    @Column(name = "imagem_url", length = 500)
    private String imagemUrl;

    // Mantém a relação entre a receita e suas imagens
    @OneToMany(mappedBy = "receita", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImagemReceita> imagens = new ArrayList<>();

    @Lob
    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @PositiveOrZero(message = "O tempo de preparo não pode ser negativo.")
    @Column(name = "tempo_preparo_minutos")
    private Integer tempoPreparoMinutos;

    @Size(max = 100, message = "O rendimento deve ter no máximo 100 caracteres.")
    @Column(length = 100)
    private String rendimento;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Dificuldade dificuldade;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private OrigemReceita origem;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private StatusReceita status;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private PrivacidadeReceita privacidade;

    @Column(nullable = false)
    private boolean favorita = false;

    @Column(name = "comentarios_ativos", nullable = false)
    private boolean comentariosAtivos = true;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime dataAtualizacao;

    public Receita() {
    }

    // Define datas e valores padrão antes do primeiro salvamento da receita
    @PrePersist
    public void antesDeSalvar() {
        LocalDateTime agora = LocalDateTime.now();

        this.dataCriacao = agora;
        this.dataAtualizacao = agora;

        if (this.status == null) {
            this.status = StatusReceita.NAO_TESTADA;
        }

        if (this.privacidade == null) {
            this.privacidade = PrivacidadeReceita.PRIVADA;
        }
    }

    // Atualiza automaticamente a data sempre que a receita é alterada
    @PreUpdate
    public void antesDeAtualizar() {
        this.dataAtualizacao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(String ingredientes) {
        this.ingredientes = ingredientes;
    }

    public String getModoPreparo() {
        return modoPreparo;
    }

    public void setModoPreparo(String modoPreparo) {
        this.modoPreparo = modoPreparo;
    }

    public String getIngredientesRecheio() {
        return ingredientesRecheio;
    }

    public void setIngredientesRecheio(String ingredientesRecheio) {
        this.ingredientesRecheio = ingredientesRecheio;
    }

    public String getModoPreparoRecheio() {
        return modoPreparoRecheio;
    }

    public void setModoPreparoRecheio(String modoPreparoRecheio) {
        this.modoPreparoRecheio = modoPreparoRecheio;
    }

    public String getIngredientesCobertura() {
        return ingredientesCobertura;
    }

    public void setIngredientesCobertura(String ingredientesCobertura) {
        this.ingredientesCobertura = ingredientesCobertura;
    }

    public String getModoPreparoCobertura() {
        return modoPreparoCobertura;
    }

    public void setModoPreparoCobertura(String modoPreparoCobertura) {
        this.modoPreparoCobertura = modoPreparoCobertura;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public List<ImagemReceita> getImagens() {
        return imagens;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Integer getTempoPreparoMinutos() {
        return tempoPreparoMinutos;
    }

    public void setTempoPreparoMinutos(Integer tempoPreparoMinutos) {
        this.tempoPreparoMinutos = tempoPreparoMinutos;
    }

    public String getRendimento() {
        return rendimento;
    }

    public void setRendimento(String rendimento) {
        this.rendimento = rendimento;
    }

    public Dificuldade getDificuldade() {
        return dificuldade;
    }

    public void setDificuldade(Dificuldade dificuldade) {
        this.dificuldade = dificuldade;
    }

    public OrigemReceita getOrigem() {
        return origem;
    }

    public void setOrigem(OrigemReceita origem) {
        this.origem = origem;
    }

    public StatusReceita getStatus() {
        return status;
    }

    public void setStatus(StatusReceita status) {
        this.status = status;
    }

    public PrivacidadeReceita getPrivacidade() {
        return privacidade;
    }

    public void setPrivacidade(PrivacidadeReceita privacidade) {
        this.privacidade = privacidade;
    }

    public boolean isFavorita() {
        return favorita;
    }

    public void setFavorita(boolean favorita) {
        this.favorita = favorita;
    }

    public boolean isComentariosAtivos() {
        return comentariosAtivos;
    }

    public void setComentariosAtivos(boolean comentariosAtivos) {
        this.comentariosAtivos = comentariosAtivos;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    // Adiciona uma imagem e mantém o relacionamento entre os dois objetos
    public void adicionarImagem(ImagemReceita imagem) {
        imagem.setReceita(this);
        imagens.add(imagem);
    }
}