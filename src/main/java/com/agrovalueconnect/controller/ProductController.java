package com.agrovalueconnect.controller;

import com.agrovalueconnect.dto.ProductRequest;
import com.agrovalueconnect.model.Product;
import com.agrovalueconnect.model.User;
import com.agrovalueconnect.service.ProductService;
import com.agrovalueconnect.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final UserRepository userRepository;

    @PreAuthorize("hasRole('FARMER')")
    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest request, Authentication authentication) {
        User farmer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(productService.create(request, farmer));
    }

    @PreAuthorize("hasRole('FARMER')")
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request, Authentication authentication) {
        User farmer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(productService.update(id, request, farmer));
    }

    @PreAuthorize("hasRole('FARMER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        User farmer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        productService.delete(id, farmer);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('FARMER')")
    @GetMapping("/farmer")
    public ResponseEntity<List<Product>> listForFarmer(Authentication authentication) {
        User farmer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(productService.listByFarmer(farmer));
    }

    @GetMapping
    public ResponseEntity<List<Product>> listAll() {
        return ResponseEntity.ok(productService.listAll());
    }
}
