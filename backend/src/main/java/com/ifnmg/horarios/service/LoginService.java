package com.ifnmg.horarios.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ifnmg.horarios.constants.LoginConstants;

@Service
public class LoginService {
        
    private final SheetsService sheetsService;

    public LoginService(SheetsService sheetsService) {
        this.sheetsService = sheetsService;
    }

    public boolean getSheetsValues(String usuario, String senha) throws IOException {
        
        List<List<Object>> usuarioCell = sheetsService.getSheetValuesLogin(LoginConstants.USUARIO);
        List<List<Object>> senhaCell = sheetsService.getSheetValuesLogin(LoginConstants.SENHA);

        if (usuarioCell.isEmpty() || usuarioCell.get(0).isEmpty()) {
            return false;
        }
        
        if (senhaCell.isEmpty() || senhaCell.get(0).isEmpty()) {
            return false;
        }
    
        String usuarioSheet = usuarioCell.get(0).get(0).toString().trim();
        String senhaSheet = senhaCell.get(0).get(0).toString().trim();
        return usuarioSheet.equals(usuario) && senhaSheet.equals(senha);
    }
}