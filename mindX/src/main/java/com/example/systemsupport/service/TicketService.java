package com.example.systemsupport.service;

import com.example.systemsupport.dto.TicketCreateResponse;
import com.example.systemsupport.dto.TicketDetailResponse;
import com.example.systemsupport.entity.Message;
import com.example.systemsupport.entity.Ticket;
import com.example.systemsupport.repository.MessageRepository;
import com.example.systemsupport.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

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
     * Creates a new ticket with status OPEN, saves the USER message,
     * generates an AI response, and saves the AI message.
     */
    public TicketCreateResponse createTicket(String query) {
        // 1. Create ticket
        Ticket ticket = new Ticket();
        ticket.setQuery(query);
        ticket.setStatus("OPEN");
        ticket = ticketRepository.save(ticket);

        // 2. Save USER message
        Message userMessage = new Message();
        userMessage.setTicketId(ticket.getId());
        userMessage.setSender("USER");
        userMessage.setMessage(query);
        messageRepository.save(userMessage);

        // 3. Generate AI response
        String aiResponse = aiService.generateResponse(query);

        // 4. Save AI message
        Message aiMessage = new Message();
        aiMessage.setTicketId(ticket.getId());
        aiMessage.setSender("AI");
        aiMessage.setMessage(aiResponse);
        messageRepository.save(aiMessage);

        // 5. Return response
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
}
