package com.andry.livrodigitalreceitas.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        // Expõe a pasta local de uploads para acesso pelas URLs /uploads/**
        @Override
        public void addResourceHandlers(
                        ResourceHandlerRegistry registry) {

                String pastaUploads = Paths.get("uploads")
                                .toAbsolutePath()
                                .normalize()
                                .toUri()
                                .toString();

                registry
                                .addResourceHandler("/uploads/**")
                                .addResourceLocations(pastaUploads);
        }
}