package com.example.backend.DTOMapper;

import com.example.backend.dto.OrderDTO;
import com.example.backend.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderDTOMapper {
    Order toEntity(OrderDTO dto);
    OrderDTO toDto(Order order);
}
