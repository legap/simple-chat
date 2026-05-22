package com.simplechat.controller;

import com.simplechat.model.User;
import com.simplechat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/by-username")
    public ResponseEntity<User> getUserByUsername(@RequestParam String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        // Create user if not exists
        User newUser = new User();
        newUser.setUsername(username);
        newUser = userRepository.save(newUser);
        return ResponseEntity.ok(newUser);
    }
}
