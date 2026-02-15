package com.agrovalueconnect.service;

public interface EmailService {
    void sendOrderPlaced(String to, String subject, String body);
}
