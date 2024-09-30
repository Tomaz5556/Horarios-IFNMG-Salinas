package com.ifnmg.horarios;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class HorariosApplicationTests {

	// Carregar variáveis de ambiente antes de fazer os testes
	@BeforeAll
    public static void setUp() {
        System.setProperty("API_KEY", System.getenv("API_KEY"));
        System.setProperty("SPREADSHEET_ID", System.getenv("SPREADSHEET_ID"));
        System.setProperty("FRONTEND_URL", System.getenv("FRONTEND_URL"));
    }

	@Test
	void contextLoads() {
	}

}