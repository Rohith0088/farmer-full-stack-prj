package com.agrovalueconnect.service;

import com.stripe.model.PaymentIntent;

import java.math.BigDecimal;

public interface PaymentService {
    PaymentIntent createPaymentIntent(BigDecimal amount, String currency) throws Exception;
}
