package com.simplechat.controller;

import com.simplechat.dto.ChatListResponse;
import com.simplechat.dto.ChatResponse;
import com.simplechat.dto.CreateChatRequest;
import com.simplechat.dto.MessageDto;
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

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(
            @PathVariable Long chatId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId != null) {
            chatService.autoJoinMember(chatId, userId);
        }
        return ResponseEntity.ok(chatService.getMessages(chatId));
    }

    @GetMapping("/{chatId}/members")
    public ResponseEntity<List<String>> getMembers(
            @PathVariable Long chatId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId != null) {
            chatService.autoJoinMember(chatId, userId);
        }
        return ResponseEntity.ok(chatService.getMemberUsernames(chatId));
    }

    @DeleteMapping("/{chatId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long chatId, @PathVariable Long userId) {
        chatService.removeMember(chatId, userId);
        return ResponseEntity.noContent().build();
    }
}