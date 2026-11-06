package com.ominidevs.operacional.veiculo.entities;

import com.ominidevs.operacional.motorista.entities.Motorista;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Veículo da frota. A placa é única e guardada normalizada (maiúscula, sem
 * hífen e sem espaço). O tipo é texto livre em maiúsculas, e não enum, para
 * que um tipo novo na planilha não quebre a importação.
 *
 * <p>Um motorista pode ter vários veículos; o veículo tem no máximo um
 * motorista atual.
 */
@Entity
@Table(name = "veiculo")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "placa", nullable = false, length = 7)
    private String placa;

    @Column(name = "tipo", length = 50)
    private String tipo;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "modelo", length = 100)
    private String modelo;

    /** "Status do Veículo" da planilha: ativo ou inativo; {@code null} se não informado. */
    @Column(name = "status")
    private Boolean ativo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motorista_id")
    private Motorista motorista;

    protected Veiculo() {
    }

    /**
     * Cria um veículo ainda não persistido.
     *
     * @param placa placa já normalizada.
     */
    public Veiculo(String placa) {
        this.placa = placa;
    }

    public Integer getId() {
        return id;
    }

    public String getPlaca() {
        return placa;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Motorista getMotorista() {
        return motorista;
    }

    public void setMotorista(Motorista motorista) {
        this.motorista = motorista;
    }
}
