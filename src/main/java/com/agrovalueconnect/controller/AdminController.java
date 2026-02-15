package com.agrovalueconnect.controller;

import com.agrovalueconnect.model.Order;
import com.agrovalueconnect.model.Transaction;
import com.agrovalueconnect.model.User;
import com.agrovalueconnect.repository.OrderRepository;
import com.agrovalueconnect.repository.TransactionRepository;
import com.agrovalueconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final OrderRepository orderRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> users() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> transactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> orders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }
}
