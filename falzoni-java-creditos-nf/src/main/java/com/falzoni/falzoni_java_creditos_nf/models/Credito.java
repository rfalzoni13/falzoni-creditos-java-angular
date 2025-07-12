package com.falzoni.falzoni_java_creditos_nf.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Credito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private long id;
    private String numeroCredito;
    private String numeroNfse;
    private LocalDate dataConstituicao;
    private BigDecimal valorIssqn;
    private String tipoCredito;
    private boolean simplesNacional;
    private BigDecimal aliquota;
    private BigDecimal valorFaturado;
    private BigDecimal valorDeducao;
    private BigDecimal baseCalculo;

    public long getId() {
        return id;
    }

    public String getNumeroCredito() {
        return numeroCredito;
    }

    public String getNumeroNfse() {
        return numeroNfse;
    }

    public LocalDate getDataConstituicao() {
        return dataConstituicao;
    }

    public BigDecimal getValorIssqn() {
        return valorIssqn;
    }

    public String getTipoCredito() {
        return tipoCredito;
    }

    public boolean isSimplesNacional() {
        return simplesNacional;
    }

    public BigDecimal getAliquota() {
        return aliquota;
    }

    public BigDecimal getValorFaturado() {
        return valorFaturado;
    }

    public BigDecimal getValorDeducao() {
        return valorDeducao;
    }

    public BigDecimal getBaseCalculo() {
        return baseCalculo;
    }
}
