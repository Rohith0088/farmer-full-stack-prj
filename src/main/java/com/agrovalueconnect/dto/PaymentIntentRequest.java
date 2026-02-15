package com.agrovalueconnect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentIntentRequest {
    @NotNull
    private BigDecimal amount;

    @NotNull
    private String currency;
}
