package com.example.backend.DTOMapper;
import com.example.backend.dto.ProductDTO;
import com.example.backend.entity.Product;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ProductDTOMapper {
    Product toEntity(ProductDTO dto);
    ProductDTO toDto(Product product);
}
