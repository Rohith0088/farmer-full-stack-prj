package com.agrovalueconnect.service.impl;

import com.agrovalueconnect.dto.ProductRequest;
import com.agrovalueconnect.model.Product;
import com.agrovalueconnect.model.User;
import com.agrovalueconnect.repository.ProductRepository;
import com.agrovalueconnect.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public Product create(ProductRequest request, User farmer) {
        Product product = Product.builder()
                .farmer(farmer)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .createdAt(Instant.now())
                .build();
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product update(Long id, ProductRequest request, User farmer) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (!existing.getFarmer().getId().equals(farmer.getId())) {
            throw new SecurityException("Not allowed to update this product");
        }
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setStockQuantity(request.getStockQuantity());
        existing.setImageUrl(request.getImageUrl());
        return productRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id, User farmer) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (!existing.getFarmer().getId().equals(farmer.getId())) {
            throw new SecurityException("Not allowed to delete this product");
        }
        productRepository.delete(existing);
    }

    @Override
    public List<Product> listByFarmer(User farmer) {
        return productRepository.findByFarmer(farmer);
    }

    @Override
    public List<Product> listAll() {
        return productRepository.findAll();
    }
}
