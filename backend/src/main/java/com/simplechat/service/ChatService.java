package com.simplechat.service;

import com.simplechat.dto.ChatListResponse;
import com.simplechat.dto.ChatResponse;
import com.simplechat.dto.CreateChatRequest;
import com.simplechat.dto.LastMessageDto;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<ChatListResponse> getAllChats() {
        return chatRepository.findAll().stream()
                .map(chat -> {
                    Long memberCount = chatMemberRepository.countByChatId(chat.getId());
                    LastMessageDto lastMessage = messageRepository.findLastMessageByChatId(chat.getId(), PageRequest.of(0, 1))
                            .getContent()
                            .stream()
                            .findFirst()
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

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            if (user != null) {
                ChatMember member = new ChatMember();
                member.setChat(chat);
                member.setUser(user);
                chatMemberRepository.save(member);
            }
        }

        return new ChatResponse(chat.getId(), chat.getName(), chat.getCreatedAt());
    }

    public List<MessageDto> getMessages(Long chatId) {
        return messageRepository.findByChatIdOrderBySentAtAsc(chatId).stream()
                .map(this::toMessageDto)
                .collect(Collectors.toList());
    }

    public List<String> getMemberUsernames(Long chatId) {
        return chatMemberRepository.findByChatId(chatId).stream()
                .map(member -> member.getUser().getUsername())
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeMember(Long chatId, Long userId) {
        chatMemberRepository.deleteByChatIdAndUserId(chatId, userId);
    }

    @Transactional
    public void autoJoinMember(Long chatId, Long userId) {
        Chat chat = chatRepository.findById(chatId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        if (chat != null && user != null) {
            boolean alreadyMember = chatMemberRepository.findByChatId(chatId).stream()
                    .anyMatch(m -> m.getUser().getId().equals(userId));
            if (!alreadyMember) {
                ChatMember member = new ChatMember();
                member.setChat(chat);
                member.setUser(user);
                chatMemberRepository.save(member);
            }
        }
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