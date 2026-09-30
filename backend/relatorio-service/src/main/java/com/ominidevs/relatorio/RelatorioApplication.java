package com.ominidevs.relatorio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class RelatorioApplication {

    public static void main(String[] args) {
        SpringApplication.run(RelatorioApplication.class, args);
    }
}
