package com.agrovalueconnect.service.impl;

import com.agrovalueconnect.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Value("${stripe.secret-key}")
    private String secretKey;

    @Value("${stripe.webhook-secret:}")
    private String webhookSecret;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    @Override
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency) throws Exception {
        long amountInCents = amount.setScale(2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).longValue();
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency)
                .setAutomaticPaymentMethods(PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build())
                .build();
        return PaymentIntent.create(params);
    }
}
