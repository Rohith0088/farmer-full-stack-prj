package com.agrovalueconnect.repository;

import com.agrovalueconnect.model.Order;
import com.agrovalueconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer(User customer);
}
