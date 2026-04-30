package com.bloodbank.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

    private static final String SYSTEM_PROMPT =
        "You are Apheresis AI, a friendly and knowledgeable assistant for the Apheresis Blood Bank Management System. " +
        "You help users with questions about blood donation, blood types, eligibility, apheresis procedures (collecting specific components like platelets, plasma, RBCs), " +
        "how to request blood, donation certificates, blood camp hosting, and navigating the Apheresis platform. " +
        "Keep answers concise, warm, and medically accurate. Use bullet points or numbered lists when helpful. " +
        "If asked something outside blood banking, politely redirect to blood bank topics. " +
        "Always end sensitive medical questions by recommending they consult a doctor.";

    private final RestTemplate restTemplate = new RestTemplate();

    public String getChatbotResponse(String userMessage) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return "⚠️ Apheresis AI is not configured yet. Please add your Gemini API key to application.properties.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build Gemini request body
            Map<String, Object> body = Map.of(
                "system_instruction", Map.of(
                    "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                ),
                "contents", List.of(
                    Map.of("role", "user",
                           "parts", List.of(Map.of("text", userMessage)))
                ),
                "generationConfig", Map.of(
                    "temperature", 0.7,
                    "maxOutputTokens", 512
                )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                GEMINI_URL + geminiApiKey, entity, Map.class
            );

            if (response.getBody() != null) {
                List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "I couldn't generate a response. Please try again.";

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            if (e.getStatusCode().value() == 400) {
                return "⚠️ Invalid Gemini API key. Please check your configuration.";
            } else if (e.getStatusCode().value() == 429) {
                return "⚠️ Too many requests. Please wait a moment and try again.";
            }
            return "⚠️ Error: " + e.getStatusText();
        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ Could not connect to Apheresis AI. Please try again.";
        }
    }
}
