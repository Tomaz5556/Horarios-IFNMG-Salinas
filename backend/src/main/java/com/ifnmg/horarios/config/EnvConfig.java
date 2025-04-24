package com.ifnmg.horarios.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {
    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    
    public static final String API_KEY = getEnvVar("API_KEY");
    public static final String SPREADSHEET_ID = getEnvVar("SPREADSHEET_ID");
    public static final String FRONTEND_URL = getEnvVar("FRONTEND_URL");

    private EnvConfig() {
    }

    private static String getEnvVar(String key) {
        String value = dotenv.get(key);
        if (value == null) {
            value = System.getenv(key);
        }
        return value;
    }
}