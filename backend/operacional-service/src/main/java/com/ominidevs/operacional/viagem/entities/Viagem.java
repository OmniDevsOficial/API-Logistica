package com.ominidevs.operacional.viagem.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "viagem")
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "manifesto", nullable = false, length = 50)
    private String manifesto;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Column(name = "motorista", nullable = false, length = 255)
    private String motorista;

    @Column(name = "cpf_motorista", nullable = false, length = 50)
    private String cpf_motorista;

    @Column(name = "veiculo", nullable = false, length = 50)
    private String veiculo;

    @Column(name = "cidade_destino", length = 255)
    private String cidadeDestino;

    @Column(name = "valor_frete", precision = 8, scale = 2)
    private BigDecimal valorFrete;

    @Column(name = "km_saida")
    private Integer kmSaida;

    @Column(name = "km_chegada")
    private Integer kmChegada;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusViagem status;

    @Column(name = "observacoes", length = 500)
    private String observacoes;

    public Viagem() {
    }

    public Viagem(
            String manifesto,
            LocalDate data,
            String motorista,
            String cpf_motorista,
            String veiculo,
            String cidadeDestino,
            BigDecimal valorFrete,
            Integer kmSaida,
            Integer kmChegada,
            StatusViagem status,
            String observacoes
    ) {
        this.manifesto = manifesto;
        this.data = data;
        this.motorista = motorista;
        this.cpf_motorista = cpf_motorista;
        this.veiculo = veiculo;
        this.cidadeDestino = cidadeDestino;
        this.valorFrete = valorFrete;
        this.kmSaida = kmSaida;
        this.kmChegada = kmChegada;
        this.status = status;
        this.observacoes = observacoes;
    }

    public Integer getId() {
        return id;
    }

    public String getManifesto() {
        return manifesto;
    }

    public void setManifesto(String manifesto) {
        this.manifesto = manifesto;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getMotorista() {
        return motorista;
    }

    public void setMotorista(String motorista) {
        this.motorista = motorista;
    }

    public String getCPF() {
        return cpf_motorista;
    }

    public void setCPF(String cpf_motorista) {
        this.cpf_motorista = cpf_motorista;
    }

    public String getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(String veiculo) {
        this.veiculo = veiculo;
    }

    public String getCidadeDestino() {
        return cidadeDestino;
    }

    public void setCidadeDestino(String cidadeDestino) {
        this.cidadeDestino = cidadeDestino;
    }

    public BigDecimal getValorFrete() {
        return valorFrete;
    }

    public void setValorFrete(BigDecimal valorFrete) {
        this.valorFrete = valorFrete;
    }

    public Integer getKmSaida() {
        return kmSaida;
    }

    public void setKmSaida(Integer kmSaida) {
        this.kmSaida = kmSaida;
    }

    public Integer getKmChegada() {
        return kmChegada;
    }

    public void setKmChegada(Integer kmChegada) {
        this.kmChegada = kmChegada;
    }

    public StatusViagem getStatus() {
        return status;
    }

    public void setStatus(StatusViagem status) {
        this.status = status;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}