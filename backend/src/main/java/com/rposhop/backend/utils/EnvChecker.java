package com.rposhop.backend.utils;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EnvChecker {

    @Value("${MYSQL_URL:NOT_DEFINED}")
    private String mysqlUrl;

    @Value("${MYSQLUSER:NOT_DEFINED}")
    private String mysqlUser;

    @Value("${MYSQLPASSWORD:NOT_DEFINED}")
    private String mysqlPassword;

    @PostConstruct
    public void printEnv() {
        System.out.println("🚀 MYSQL_URL en el backend: " + mysqlUrl);
        System.out.println("🚀 MYSQLUSER en el backend: " + mysqlUser);
        System.out.println("🚀 MYSQLPASSWORD en el backend: " + mysqlPassword);
    }
}
