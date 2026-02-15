package com.agrovalueconnect.service;

import com.agrovalueconnect.dto.OrderRequest;
import com.agrovalueconnect.model.Order;
import com.agrovalueconnect.model.User;

import java.util.List;

public interface OrderService {
    Order placeOrder(OrderRequest request);
    List<Order> listForCustomer(User customer);
    List<Order> listAll();
}
