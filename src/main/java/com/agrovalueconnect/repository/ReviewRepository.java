package com.agrovalueconnect.repository;

import com.agrovalueconnect.model.Review;
import com.agrovalueconnect.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);
}
