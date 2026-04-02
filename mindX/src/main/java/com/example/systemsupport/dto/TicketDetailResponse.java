package com.example.systemsupport.dto;

import com.example.systemsupport.entity.Message;
import com.example.systemsupport.entity.Ticket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TicketDetailResponse {

    private Ticket ticket;
    private List<Message> messages;
}
