package com.falzoni.falzoni_java_creditos_nf.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.SpecVersion;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customApi() {
        return new OpenAPI(SpecVersion.V30)
                .info(new Info().title("Falzoni Crédito de NFSe")
                        .description("Api de demonstração de consulta de créditos constituídos")
                        .version("v1"))
                .addServersItem(new Server().url("").description("Empty"));
    }

    @Bean
    public OpenApiCustomizer hideServers() {
        return openApi -> {
            openApi.setServers(new ArrayList<>());
        };
    }
}
