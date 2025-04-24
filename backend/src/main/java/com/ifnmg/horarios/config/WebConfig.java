package com.ifnmg.horarios.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(EnvConfig.FRONTEND_URL)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
