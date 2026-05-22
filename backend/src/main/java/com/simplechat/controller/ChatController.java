package com.simplechat.controller;

import com.simplechat.dto.ChatListResponse;
import com.simplechat.dto.ChatResponse;
import com.simplechat.dto.CreateChatRequest;
import com.simplechat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<ChatListResponse>> getAllChats() {
        return ResponseEntity.ok(chatService.getAllChats());
    }

    @PostMapping
    public ResponseEntity<ChatResponse> createChat(@Valid @RequestBody CreateChatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.createChat(request));
    }
}