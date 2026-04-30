package com.bloodbank.controller;

import com.bloodbank.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/chatbot")
public class ChatbotController {

    @Autowired
    private AIService aiService;

    @PostMapping("/ask")
    public ResponseEntity<?> askChatbot(@RequestBody Map<String, String> payload) {
        String query = payload.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("answer", "Query is required"));
        }
        String answer = aiService.getChatbotResponse(query);
        return ResponseEntity.ok(Map.of("answer", answer));
    }
}
