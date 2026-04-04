package com.example.systemsupport.service;

import com.example.systemsupport.dto.TicketCreateResponse;
import com.example.systemsupport.dto.TicketDetailResponse;
import com.example.systemsupport.entity.Message;
import com.example.systemsupport.entity.Ticket;
import com.example.systemsupport.repository.MessageRepository;
import com.example.systemsupport.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;
    private final MessageRepository messageRepository;
    private final AIService aiService;

    public TicketService(TicketRepository ticketRepository,
                         MessageRepository messageRepository,
                         AIService aiService) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.aiService = aiService;
    }

    /**
     * Creates a new ticket with smart status escalation and priority tagging.
     * Saves USER message, generates AI response, and saves AI message.
     */
    public TicketCreateResponse createTicket(String query) {
        String lowerQuery = query.toLowerCase();

        // 1. Determine status (escalation logic)
        String status = "OPEN";
        if (lowerQuery.contains("refund") || lowerQuery.contains("complaint") || lowerQuery.contains("angry")) {
            status = "NEEDS_HUMAN";
        }

        // 2. Determine priority
        String priority = "LOW";
        if (lowerQuery.contains("refund") || lowerQuery.contains("angry")) {
            priority = "HIGH";
        } else if (lowerQuery.contains("complaint")) {
            priority = "MEDIUM";
        }

        // 3. Create and save ticket
        Ticket ticket = new Ticket();
        ticket.setQuery(query);
        ticket.setStatus(status);
        ticket.setPriority(priority);
        ticket = ticketRepository.save(ticket);

        // 4. Save USER message
        Message userMessage = new Message();
        userMessage.setTicketId(ticket.getId());
        userMessage.setSender("USER");
        userMessage.setMessage(query);
        messageRepository.save(userMessage);

        // 5. Generate AI response
        String aiResponse;
        try {
            aiResponse = aiService.generateResponse(query);
        } catch (Exception e) {
            log.error("AI service failed for ticket {}: {}", ticket.getId(), e.getMessage());
            aiResponse = "Our AI is currently unavailable. A human agent will review your request.";
        }

        // 6. Save AI message
        Message aiMsg = new Message();
        aiMsg.setTicketId(ticket.getId());
        aiMsg.setSender("AI");
        aiMsg.setMessage(aiResponse);
        messageRepository.save(aiMsg);

        // 7. Return response
        return new TicketCreateResponse(ticket.getId(), aiResponse);
    }

    /**
     * Returns all tickets.
     */
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    /**
     * Returns a ticket by its ID, or null if not found.
     */
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    /**
     * Returns a ticket along with all its messages, or null if not found.
     */
    public TicketDetailResponse getTicketWithMessages(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) {
            return null;
        }
        List<Message> messages = messageRepository.findByTicketIdOrderByTimestampAsc(id);
        return new TicketDetailResponse(ticket, messages);
    }

    /**
     * Updates the status of a ticket.
     * Returns the updated ticket, or null if not found.
     */
    public Ticket updateTicketStatus(Long id, String status) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) {
            return null;
        }
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }
}
