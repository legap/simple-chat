package com.simplechat.repository;

import com.simplechat.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.chat.id = :chatId ORDER BY m.sentAt DESC")
    Page<Message> findByChatIdOrderBySentAtDesc(@Param("chatId") Long chatId, Pageable pageable);

    @Query("SELECT m FROM Message m WHERE m.chat.id = :chatId ORDER BY m.sentAt DESC")
    Page<Message> findLastMessageByChatId(@Param("chatId") Long chatId, org.springframework.data.domain.Pageable pageable);
}