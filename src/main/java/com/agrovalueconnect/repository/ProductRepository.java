package com.agrovalueconnect.repository;

import com.agrovalueconnect.model.Product;
import com.agrovalueconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmer(User farmer);
}
