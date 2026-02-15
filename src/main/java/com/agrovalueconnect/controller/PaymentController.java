package com.agrovalueconnect.controller;

import com.agrovalueconnect.dto.PaymentIntentRequest;
import com.agrovalueconnect.service.PaymentService;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/intent")
    public ResponseEntity<PaymentIntent> createPaymentIntent(@Valid @RequestBody PaymentIntentRequest request) throws Exception {
        PaymentIntent intent = paymentService.createPaymentIntent(request.getAmount(), request.getCurrency());
        return ResponseEntity.ok(intent);
    }
}
