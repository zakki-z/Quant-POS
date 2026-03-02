package com.example.backend.dto;

import java.math.BigDecimal;

public record OrderDTO(Long id, BigDecimal quantity, BigDecimal totalPrice,BigDecimal paidAmount, BigDecimal remainingAmount, String description) {
}
