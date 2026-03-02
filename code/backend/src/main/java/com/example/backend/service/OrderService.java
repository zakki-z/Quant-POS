package com.example.backend.service;

import com.example.backend.DTOMapper.OrderDTOMapper;
import com.example.backend.dto.OrderDTO;
import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDTOMapper orderDTOMapper;
    public OrderService(OrderRepository orderRepository, OrderDTOMapper orderDTOMapper){
        this.orderRepository=orderRepository;
        this.orderDTOMapper=orderDTOMapper;
    }
    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }
    public OrderDTO getOrderById(long orderId){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()->new IllegalArgumentException(""));
        return orderDTOMapper.toDto(order);
    }
    public OrderDTO createOrder(OrderDTO orderDTO){
        return orderDTOMapper.toDto(orderDTOMapper.toEntity(orderDTO));
    }
    public OrderDTO updateOrder(OrderDTO orderDTO){
        return orderDTOMapper.toDto(orderRepository.save(orderDTOMapper.toEntity(orderDTO)));
    }
    public void deleteProduct(long orderId){
        orderRepository.deleteById(orderId);
    }
}

