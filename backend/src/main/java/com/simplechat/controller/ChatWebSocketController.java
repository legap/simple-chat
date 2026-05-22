package com.simplechat.controller;

import com.simplechat.dto.ChatMessageRequest;
import com.simplechat.dto.MessageDto;
import com.simplechat.model.Chat;
import com.simplechat.model.ChatMember;
import com.simplechat.model.Message;
import com.simplechat.model.User;
import com.simplechat.repository.ChatMemberRepository;
import com.simplechat.repository.ChatRepository;
import com.simplechat.repository.MessageRepository;
import com.simplechat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatMemberRepository chatMemberRepository;

    @MessageMapping("/chat.{chatId}")
    @SendTo("/topic/chat.{chatId}")
    @Transactional
    public MessageDto handleMessage(@DestinationVariable Long chatId, ChatMessageRequest request) {
        Chat chat = chatRepository.findById(chatId).orElse(null);
        User user = userRepository.findById(request.getUserId()).orElse(null);

        if (chat == null || user == null) {
            return null;
        }

        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(request.getContent());
        message.setSentAt(LocalDateTime.now());
        message = messageRepository.save(message);

        return toMessageDto(message);
    }

    @MessageMapping("/chat.{chatId}.join")
    @SendTo("/topic/chat.{chatId}.members")
    public List<String> handleJoin(@DestinationVariable Long chatId, ChatMessageRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            return getMemberList(chatId);
        }

        Chat chat = chatRepository.findById(chatId).orElse(null);
        if (chat == null) {
            return getMemberList(chatId);
        }

        boolean alreadyMember = chatMemberRepository.findByChatId(chatId).stream()
                .anyMatch(m -> m.getUser().getId().equals(request.getUserId()));

        if (!alreadyMember) {
            ChatMember member = new ChatMember();
            member.setChat(chat);
            member.setUser(user);
            chatMemberRepository.save(member);
        }

        return getMemberList(chatId);
    }

    @MessageMapping("/chat.{chatId}.leave")
    @SendTo("/topic/chat.{chatId}.members")
    public List<String> handleLeave(@DestinationVariable Long chatId, ChatMessageRequest request) {
        chatMemberRepository.deleteByChatIdAndUserId(chatId, request.getUserId());
        return getMemberList(chatId);
    }

    private List<String> getMemberList(Long chatId) {
        return chatMemberRepository.findByChatId(chatId).stream()
                .map(m -> m.getUser().getUsername())
                .collect(Collectors.toList());
    }

    private MessageDto toMessageDto(Message message) {
        return new MessageDto(
                message.getId(),
                message.getChat().getId(),
                message.getUser().getUsername(),
                message.getContent(),
                message.getSentAt()
        );
    }
}
