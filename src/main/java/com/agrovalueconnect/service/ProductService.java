package com.agrovalueconnect.service;

import com.agrovalueconnect.dto.ProductRequest;
import com.agrovalueconnect.model.Product;
import com.agrovalueconnect.model.User;

import java.util.List;

public interface ProductService {
    Product create(ProductRequest request, User farmer);
    Product update(Long id, ProductRequest request, User farmer);
    void delete(Long id, User farmer);
    List<Product> listByFarmer(User farmer);
    List<Product> listAll();
}
