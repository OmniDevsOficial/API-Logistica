package com.ominidevs.operacional.motorista.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/motoristas")
public class MotoristaController {

    @GetMapping("/ping")
    public String ping() {
        return "operacional-service ativo";
    }
}
