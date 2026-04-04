package com.example.systemsupport.controller;

import com.example.systemsupport.dto.TicketCreateResponse;
import com.example.systemsupport.dto.TicketDetailResponse;
import com.example.systemsupport.entity.Ticket;
import com.example.systemsupport.service.TicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private static final Logger log = LoggerFactory.getLogger(TicketController.class);

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * POST /tickets
     * Request body: { "query": "..." }
     * Returns: { "ticketId": ..., "aiResponse": "..." }
     */
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Map<String, String> request) {
        try {
            String query = request.get("query");
            if (query == null || query.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Query cannot be empty"));
            }
            TicketCreateResponse response = ticketService.createTicket(query.trim());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating ticket: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong. Please try again."));
        }
    }

    /**
     * GET /tickets
     */
    @GetMapping
    public ResponseEntity<?> getAllTickets() {
        try {
            return ResponseEntity.ok(ticketService.getAllTickets());
        } catch (Exception e) {
            log.error("Error fetching tickets: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong. Please try again."));
        }
    }

    /**
     * GET /tickets/{id}
     * Returns ticket details along with all messages (USER + AI).
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            TicketDetailResponse response = ticketService.getTicketWithMessages(id);
            if (response == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching ticket {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong. Please try again."));
        }
    }

    /**
     * PUT /tickets/{id}/status
     * Request body: { "status": "OPEN" | "RESOLVED" | "NEEDS_HUMAN" }
     * Returns: Updated ticket object
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id,
                                                 @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            if (status == null || status.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Status cannot be empty"));
            }
            Ticket updated = ticketService.updateTicketStatus(id, status);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error updating ticket {} status: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong. Please try again."));
        }
    }
}
