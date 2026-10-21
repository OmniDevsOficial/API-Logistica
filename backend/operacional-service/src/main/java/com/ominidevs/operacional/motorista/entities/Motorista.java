package com.ominidevs.operacional.motorista.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "motorista")
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome", length = 255)
    private String nome;

    @Column(name = "cpf", length = 11)
    private String cpf;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusMotorista status;

    @Column(name = "veiculo_placa", length = 20)
    private String veiculoPlaca;

    @Column(name = "veiculo_tipo", length = 50)
    private String veiculoTipo;

    @Column(name = "ultima_operacao")
    private LocalDate ultimaOperacao;

    @Column(name = "ultima_localizacao", length = 255)
    private String ultimaLocalizacao;

    @Column(name = "previsao_disponibilidade")
    private LocalDate previsaoDisponibilidade;

    public Motorista() {
    }

    public Motorista(String nome, String cpf, LocalDate dataCriacao, StatusMotorista status) {
        this.nome = nome;
        this.cpf = cpf;
        this.dataCriacao = dataCriacao;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public StatusMotorista getStatus() {
        return status;
    }

    public void setStatus(StatusMotorista status) {
        this.status = status;
    }

    public String getVeiculoPlaca() {
        return veiculoPlaca;
    }

    public void setVeiculoPlaca(String veiculoPlaca) {
        this.veiculoPlaca = veiculoPlaca;
    }

    public String getVeiculoTipo() {
        return veiculoTipo;
    }

    public void setVeiculoTipo(String veiculoTipo) {
        this.veiculoTipo = veiculoTipo;
    }

    public LocalDate getUltimaOperacao() {
        return ultimaOperacao;
    }

    public void setUltimaOperacao(LocalDate ultimaOperacao) {
        this.ultimaOperacao = ultimaOperacao;
    }

    public String getUltimaLocalizacao() {
        return ultimaLocalizacao;
    }

    public void setUltimaLocalizacao(String ultimaLocalizacao) {
        this.ultimaLocalizacao = ultimaLocalizacao;
    }

    public LocalDate getPrevisaoDisponibilidade() {
        return previsaoDisponibilidade;
    }

    public void setPrevisaoDisponibilidade(LocalDate previsaoDisponibilidade) {
        this.previsaoDisponibilidade = previsaoDisponibilidade;
    }
}
