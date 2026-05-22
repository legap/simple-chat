package com.simplechat.service;

import com.simplechat.dto.ChatListResponse;
import com.simplechat.dto.ChatResponse;
import com.simplechat.dto.CreateChatRequest;
import com.simplechat.dto.LastMessageDto;
import com.simplechat.model.Chat;
import com.simplechat.repository.ChatMemberRepository;
import com.simplechat.repository.ChatRepository;
import com.simplechat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final MessageRepository messageRepository;

    public List<ChatListResponse> getAllChats() {
        return chatRepository.findAll().stream()
                .map(chat -> {
                    Long memberCount = chatMemberRepository.countByChatId(chat.getId());
                    LastMessageDto lastMessage = messageRepository.findLastMessageByChatId(chat.getId())
                            .map(msg -> new LastMessageDto(
                                    msg.getContent().length() > 50
                                            ? msg.getContent().substring(0, 50)
                                            : msg.getContent(),
                                    msg.getSentAt()))
                            .orElse(null);
                    return new ChatListResponse(chat.getId(), chat.getName(), memberCount, lastMessage);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatResponse createChat(CreateChatRequest request) {
        Chat chat = new Chat();
        chat.setName(request.getName());
        chat = chatRepository.save(chat);
        return new ChatResponse(chat.getId(), chat.getName(), chat.getCreatedAt());
    }
}