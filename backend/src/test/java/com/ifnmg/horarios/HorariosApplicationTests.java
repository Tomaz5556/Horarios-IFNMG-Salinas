package com.ifnmg.horarios;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class HorariosApplicationTests {

    @BeforeAll
    public static void setUp() {
        System.setProperty("API_KEY", System.getProperty("API_KEY", "default_api_key"));
        System.setProperty("SPREADSHEET_ID", System.getProperty("SPREADSHEET_ID", "default_spreadsheet_id"));
        System.setProperty("FRONTEND_URL", System.getProperty("FRONTEND_URL", "default_frontend_url"));
    }

    @Test
    void contextLoads() {
    }
}