package com.simplechat.repository;

import com.simplechat.model.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    @Query("SELECT COUNT(cm) FROM ChatMember cm WHERE cm.chat.id = :chatId")
    Long countByChatId(@Param("chatId") Long chatId);

    List<ChatMember> findByChatId(Long chatId);

    void deleteByChatIdAndUserId(Long chatId, Long userId);
}