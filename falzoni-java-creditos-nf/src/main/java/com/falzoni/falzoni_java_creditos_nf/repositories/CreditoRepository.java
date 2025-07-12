package com.falzoni.falzoni_java_creditos_nf.repositories;

import com.falzoni.falzoni_java_creditos_nf.models.Credito;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.Optional;

@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@Repository
public interface CreditoRepository extends JpaRepository<Credito, Long> {
    HashSet<Credito> findAllByNumeroNfse(String numeroNfse);
    Optional<Credito> findByNumeroCredito(String numeroNfse);
}
