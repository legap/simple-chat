package com.simplechat.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatListResponse {
    private Long id;
    private String name;
    private Long memberCount;
    private LastMessageDto lastMessage;
}