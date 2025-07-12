package com.falzoni.falzoni_java_creditos_nf.repositories;

import com.falzoni.falzoni_java_creditos_nf.models.Credito;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class CreditoRepositoryTest {
    @Autowired
    private CreditoRepository repository;

    @ParameterizedTest
    @ValueSource(strings = {"7891011", "1122334"})
    @DisplayName("should be list when search by nfse number")
    public void findAllByNumeroNfse_valid_returnlist(String numeroNfse) {
        HashSet<Credito> list = this.repository.findAllByNumeroNfse(numeroNfse);

        assertThat(list.size()).isGreaterThan(0);
        assertThat(list.isEmpty()).isFalse();
    }

    @Test
    @DisplayName("should be empty list when search by nfse number")
    public void findAllByNumeroNfse_invalid_returnEmpty() {
        HashSet<Credito> list = this.repository.findAllByNumeroNfse("1212121");

        assertThat(list.size()).isNotEqualTo(3);
        assertThat(list.isEmpty()).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"123456", "789012", "654321"})
    @DisplayName("should be content when search by credit number")
    public void findAllByNumeroNfse_valid_returnContent(String numeroCredito) {
        Optional<Credito> obj = this.repository.findByNumeroCredito(numeroCredito);

        assertThat(obj.isEmpty()).isFalse();
    }

    @Test
    @DisplayName("should be null when search by credit number")
    public void findAllByNumeroNfse_invalid_returnNull() {
        Optional<Credito> obj = this.repository.findByNumeroCredito("212121");

        assertThat(obj.isEmpty()).isTrue();
    }
}
