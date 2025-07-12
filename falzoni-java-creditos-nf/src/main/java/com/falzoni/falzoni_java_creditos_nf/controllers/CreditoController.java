package com.falzoni.falzoni_java_creditos_nf.controllers;

import com.falzoni.falzoni_java_creditos_nf.repositories.CreditoRepository;
import com.falzoni.falzoni_java_creditos_nf.services.PublisherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.falzoni.falzoni_java_creditos_nf.models.Credito;
import java.util.HashSet;
import java.util.Optional;

@RestController
@RequestMapping("api/creditos")
@Tag(name = "Créditos")
public class CreditoController {
    @Autowired
    private CreditoRepository repository;

    @Autowired
    private PublisherService publisherService;

    Logger logger = LoggerFactory.getLogger(CreditoController.class);

    @Operation(summary = "Listar Créditos Constinuídos", description = "Retorna uma lista de créditos constituídos com base no número da NFS-e.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Credito.class)))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content)
    })
    @GetMapping("/{numeroNfse}")
    public ResponseEntity<HashSet<Credito>> findCreditByNfse(@PathVariable(name = "numeroNfse") String numeroNfse) {
        try {
            HashSet<Credito> list = this.repository.findAllByNumeroNfse(numeroNfse);
            this.logger.info("Créditos constiuídos: {}", list);
            this.publisherService.sendMessage("fila_logs", "Créditos constiuídos: " + list);
            return ResponseEntity.ok(list);
        } catch (Exception ex) {
            this.logger.error(ex.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(summary = "Obter Créditos Detalhados", description = " Retorna os detalhes de um crédito constituído específico com base no número do crédito constituído.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Credito.class))),
            @ApiResponse(responseCode = "404", description = "Not Found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content)
    })
    @GetMapping("/credito/{numeroCredito}")
    public ResponseEntity<Credito> findCreditByNumber(@PathVariable(name = "numeroCredito") String numeroCredito) {
        try {
            Optional<Credito> obj = this.repository.findByNumeroCredito(numeroCredito);
            if(obj.isEmpty()) {
                this.logger.warn("Nenhum registro encontrado");
                return ResponseEntity.notFound().build();
            }
            this.logger.info("Créditos detalhados: {}", obj.get());
            this.publisherService.sendMessage("fila_logs", "Créditos detalhados: " + obj.get());
            return ResponseEntity.ok(obj.get());
        } catch (Exception ex) {
            this.logger.error(ex.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}

