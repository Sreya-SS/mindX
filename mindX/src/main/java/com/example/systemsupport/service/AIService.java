package com.example.systemsupport.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Value("${openai.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public String generateResponse(String query) {

        // 1. Basic validation
        if (query == null || query.isBlank()) {
            return fallbackResponse(query);
        }

        // 2. If API key missing → use mock
        if (apiKey == null || apiKey.isBlank()) {
            return fallbackResponse(query);
        }

        try {
            String url = "https://api.openai.com/v1/chat/completions";

            // Request body
            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini");

            List<Map<String, String>> messages = new ArrayList<>();

            // System message
            Map<String, String> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content", "You are a helpful customer support assistant.");

            // User message
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", query);

            messages.add(systemMsg);
            messages.add(userMsg);

            body.put("messages", messages);

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // API Call
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null) {
                return fallbackResponse(query);
            }

            // Extract choices
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");

            if (choices == null || choices.isEmpty()) {
                return fallbackResponse(query);
            }

            Map<String, Object> choice = choices.get(0);
            Map<String, Object> message = (Map<String, Object>) choice.get("message");

            if (message == null || message.get("content") == null) {
                return fallbackResponse(query);
            }

            return message.get("content").toString();

        } catch (Exception e) {
            System.out.println("OpenAI API failed: " + e.getMessage());

            // Fallback if API fails
            return fallbackResponse(query);
        }
    }

    /**
     * Mock AI logic (fallback)
     */
    private String fallbackResponse(String query) {

        if (query == null || query.isBlank()) {
            return "Our support team will assist you shortly";
        }

        String lowerQuery = query.toLowerCase();

        if (lowerQuery.contains("order")) {
            return "Please share your order ID";
        } else if (lowerQuery.contains("refund")) {
            return "We will connect you to support";
        } else {
            return "Our support team will assist you shortly";
        }
    }
}