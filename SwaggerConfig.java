package com.example.hellospring.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(info = @Info(
        title = "Swagger Test API 명세서",
        description = "스웨거를 테스트하기 위한 스웨거 입니다.",
        version = "v1"
))
@Configuration
public class SwaggerConfig {
    private static final String BEARER_TOKEN_PREFIX = "Bearer";
    private static final String BEARER_FORMAT = "JWT";

    @Bean
    public OpenAPI openAPI() {
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat(BEARER_FORMAT)
                .scheme(BEARER_TOKEN_PREFIX);

        Components components = new Components()
                .addSecuritySchemes("Bearer Authentication", securityScheme);

        return new OpenAPI()
                // http://localhost:8080/swagger-ui/index.html
                .addServersItem(new Server().url("/"))
                // JWT Security 사용
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(components);
    }
}