package com.agrovalueconnect.controller;

import com.agrovalueconnect.dto.OrderRequest;
import com.agrovalueconnect.model.Order;
import com.agrovalueconnect.model.User;
import com.agrovalueconnect.repository.UserRepository;
import com.agrovalueconnect.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        User customer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        request.setCustomerId(customer.getId());
        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<List<Order>> myOrders(Authentication authentication) {
        User customer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(orderService.listForCustomer(customer));
    }
}
