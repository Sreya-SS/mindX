package com.example.systemsupport.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TicketCreateResponse {

    private Long ticketId;
    private String aiResponse;
}
