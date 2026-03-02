package com.example.backend.DTOMapper;

import com.example.backend.dto.OrderDTO;
import com.example.backend.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderDTOMapper {
    Order toEntity(OrderDTO dto);
    OrderDTO toDto(Order order);
    void updateEntityFromDto(OrderDTO dto, @MappingTarget Order entity);
}
