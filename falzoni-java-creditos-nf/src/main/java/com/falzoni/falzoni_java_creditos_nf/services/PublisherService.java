package com.falzoni.falzoni_java_creditos_nf.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class PublisherService {

    private static final Logger logger = LoggerFactory.getLogger(PublisherService.class);

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void sendMessage(String topic, Object message) throws Exception {
        try {
            this.kafkaTemplate.send(topic, message);
            logger.info("Mensagem enviada sincronamente para o tópico [{}]", topic);
        } catch (KafkaException ex) {
            logger.error("Erro ao enviar mensagem para o tópico [{}]: {}", topic, ex.getMessage());
            throw new Exception("Erro ao enviar mensagem para o tópico: " + topic, ex);
        }
    }
}
