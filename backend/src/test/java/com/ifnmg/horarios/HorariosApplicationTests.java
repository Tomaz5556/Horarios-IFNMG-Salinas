package com.ifnmg.horarios;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootTest
class HorariosApplicationTests {

    @BeforeAll
    public static void setUp() {
        Dotenv dotenv = Dotenv.configure().load();
        System.setProperty("API_KEY", dotenv.get("API_KEY"));
        System.setProperty("SPREADSHEET_ID", dotenv.get("SPREADSHEET_ID"));
        System.setProperty("FRONTEND_URL", dotenv.get("FRONTEND_URL"));
    }

	@Test
	void contextLoads() {
	}

}
