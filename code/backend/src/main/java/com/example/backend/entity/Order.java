package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(nullable = false, updatable = true, precision = 10, scale = 2)
    private BigDecimal quantity;
    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal totalPrice;
    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal paidAmount;
    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal remainingAmount;
    private String description;
}
