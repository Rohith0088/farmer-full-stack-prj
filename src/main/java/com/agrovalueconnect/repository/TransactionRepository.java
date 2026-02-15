package com.agrovalueconnect.repository;

import com.agrovalueconnect.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
