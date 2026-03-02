package com.example.backend.service;


import com.example.backend.DTOMapper.ProductDTOMapper;
import com.example.backend.dto.ProductDTO;
import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductDTOMapper productDTOMapper;
    public ProductService(ProductDTOMapper productDTOMapper, ProductRepository productRepository){
        this.productRepository=productRepository;
        this.productDTOMapper=productDTOMapper;
    }
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }
    public ProductDTO createProduct(ProductDTO productDTO) {
        return productDTOMapper
                .toDto(productRepository
                        .save(productDTOMapper.toEntity(productDTO)));
    }
    public ProductDTO getProductById(Long productId){
        Product product= productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find order with id " + productId));
        return productDTOMapper.toDto(product);
    }
    public ProductDTO updateProduct(ProductDTO productDTO){
        return productDTOMapper.toDto(productRepository.save(productDTOMapper.toEntity(productDTO)));
    }
    public void deleteProduct(Long productId){
        productRepository.deleteById(productId);
    }

}
