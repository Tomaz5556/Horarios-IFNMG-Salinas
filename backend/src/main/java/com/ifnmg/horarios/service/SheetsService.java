package com.ifnmg.horarios.service;

import java.io.IOException;
import java.util.List;
import java.security.GeneralSecurityException;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;

import org.springframework.stereotype.Service;

import com.ifnmg.horarios.config.EnvConfig;

@Service
public class SheetsService {
    private static final String APPLICATION_NAME = "Horários do IFNMG Salinas";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    private final Sheets sheetsService;

    public SheetsService() throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        this.sheetsService = new Sheets.Builder(HTTP_TRANSPORT, JSON_FACTORY, null)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public List<List<Object>> getSheetValues(String range) throws IOException {
        ValueRange response = sheetsService.spreadsheets().values()
                .get(EnvConfig.SPREADSHEET_ID, range)
                .setKey(EnvConfig.API_KEY)
                .execute();
        return response.getValues();
    }

    public List<List<Object>> getSheetValuesLogin(String range) throws IOException {
        ValueRange response = sheetsService.spreadsheets().values()
                .get(EnvConfig.SPREADSHEET_LOGIN, range)
                .setKey(EnvConfig.API_KEY)
                .execute();
        return response.getValues();
    }
}