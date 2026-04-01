package com.example.systemsupport.controller;

import com.example.systemsupport.dto.TicketCreateResponse;
import com.example.systemsupport.dto.TicketDetailResponse;
import com.example.systemsupport.entity.Ticket;
import com.example.systemsupport.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
public class TicketController {

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
    public ResponseEntity<TicketCreateResponse> createTicket(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        TicketCreateResponse response = ticketService.createTicket(query);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /tickets
     */
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    /**
     * GET /tickets/{id}
     * Returns ticket details along with all messages (USER + AI).
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketDetailResponse> getTicketById(@PathVariable Long id) {
        TicketDetailResponse response = ticketService.getTicketWithMessages(id);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}

