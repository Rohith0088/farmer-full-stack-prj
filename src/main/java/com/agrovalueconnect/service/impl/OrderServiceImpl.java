package com.agrovalueconnect.service.impl;

import com.agrovalueconnect.dto.OrderItemRequest;
import com.agrovalueconnect.dto.OrderRequest;
import com.agrovalueconnect.model.*;
import com.agrovalueconnect.model.enums.OrderStatus;
import com.agrovalueconnect.model.enums.PaymentStatus;
import com.agrovalueconnect.repository.*;
import com.agrovalueconnect.service.EmailService;
import com.agrovalueconnect.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public Order placeOrder(OrderRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Order order = Order.builder()
                .customer(customer)
                .orderDate(Instant.now())
                .orderStatus(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        List<OrderItem> items = request.getItems().stream().map(itemReq -> toOrderItem(itemReq, order)).collect(Collectors.toList());
        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        order.setItems(items);
        Order saved = orderRepository.save(order);
        items.forEach(orderItemRepository::save);

        emailService.sendOrderPlaced(customer.getEmail(), "Order placed", "Your order has been created.");
        return saved;
    }

    private OrderItem toOrderItem(OrderItemRequest itemReq, Order order) {
        Product product = productRepository.findById(itemReq.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(itemReq.getQuantity())
                .price(product.getPrice())
                .build();
    }

    @Override
    public List<Order> listForCustomer(User customer) {
        return orderRepository.findByCustomer(customer);
    }

    @Override
    public List<Order> listAll() {
        return orderRepository.findAll();
    }
}
