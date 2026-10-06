package com.ominidevs.operacional.viagem.dto;

public class ManifestoDTO {

    private String manifesto;
    private String data;
    private String motorista;
    private String cpf_motorista;
    private String veiculo;
    private String origem;
    private String destino;
    private String valorFrete;
    private String kmSaida;
    private String kmChegada;
    private String status;
    private String observacoes;

    public ManifestoDTO() {
    }

    public ManifestoDTO(
            String manifesto,
            String data,
            String motorista,
            String cpf_motorista,
            String veiculo,
            String origem,
            String destino,
            String valorFrete,
            String kmSaida,
            String kmChegada,
            String status,
            String observacoes
    ) {
        this.manifesto = manifesto;
        this.data = data;
        this.motorista = motorista;
        this.cpf_motorista = cpf_motorista;
        this.veiculo = veiculo;
        this.origem = origem;
        this.destino = destino;
        this.valorFrete = valorFrete;
        this.kmSaida = kmSaida;
        this.kmChegada = kmChegada;
        this.status = status;
        this.observacoes = observacoes;
    }

    public String getManifesto() {
        return manifesto;
    }

    public String getData() {
        return data;
    }

    public String getMotorista() {
        return motorista;
    }

    public String getCPF() {
        return cpf_motorista;
    }

    public String getVeiculo() {
        return veiculo;
    }

    public String getOrigem() {
        return origem;
    }

    public String getDestino() {
        return destino;
    }

    public String getValorFrete() {
        return valorFrete;
    }

    public String getKmSaida() {
        return kmSaida;
    }

    public String getKmChegada() {
        return kmChegada;
    }

    public String getStatus() {
        return status;
    }

    public String getObservacoes() {
        return observacoes;
    }
}
