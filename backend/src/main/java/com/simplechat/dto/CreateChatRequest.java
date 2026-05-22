package com.simplechat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateChatRequest {
    @NotBlank(message = "Chat name is required")
    @Size(min = 1, max = 100, message = "Chat name must be between 1 and 100 characters")
    private String name;

    private Long userId;
}