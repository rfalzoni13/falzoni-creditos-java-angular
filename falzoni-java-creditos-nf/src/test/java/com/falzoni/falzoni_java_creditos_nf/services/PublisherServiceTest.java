package com.falzoni.falzoni_java_creditos_nf.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class PublisherServiceTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private PublisherService publisherService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should be success when sending message to Kafka topic")
    void testSendMessageSuccess() {
        CompletableFuture<Object> resultFuture = CompletableFuture.completedFuture(null);
        String topic = "test-topic";
        Object message = "mensagem";
        doReturn(resultFuture).when(kafkaTemplate).send(topic, message);
        assertDoesNotThrow(() -> publisherService.sendMessage(topic, message));
    }

    @Test
    @DisplayName("Should be failure when sending message to Kafka topic")
    void testSendMessageFailure() {
        String topic = "test-topic";
        Object message = "mensagem";
        doThrow(new KafkaException("Erro Kafka")).when(kafkaTemplate).send(topic, message);
        Exception exception = assertThrows(Exception.class, () -> publisherService.sendMessage(topic, message));
        assertTrue(exception.getMessage().contains("Erro ao enviar mensagem para o tópico"));
    }
}

