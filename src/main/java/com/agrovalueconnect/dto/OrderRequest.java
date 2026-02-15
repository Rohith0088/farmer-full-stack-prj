package com.agrovalueconnect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    @NotNull
    private Long customerId;

    @NotNull
    private List<OrderItemRequest> items;
}
