package com.example.backend.service;


import com.example.backend.DTOMapper.ProductDTOMapper;
import com.example.backend.dto.ProductDTO;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.exception.ProductNotFoundException;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductDTOMapper productDTOMapper;
    private final CategoryRepository categoryRepository;
    public ProductService(ProductDTOMapper productDTOMapper, ProductRepository productRepository, CategoryRepository categoryRepository){
        this.productRepository=productRepository;
        this.productDTOMapper=productDTOMapper;
        this.categoryRepository=categoryRepository;
    }
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = productDTOMapper.toEntity(productDTO);
        if (productDTO.categoryId() != null) {
            Category category = categoryRepository.findById(productDTO.categoryId())
                    .orElseThrow(() -> new ProductNotFoundException("Category not found with id " + productDTO.categoryId()));
            product.setCategory(category);
        }
        return productDTOMapper.toDto(productRepository.save(product));
    }
    public ProductDTO getProductById(Long productId){
        Product product= productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Cannot find order with id " + productId));
        return productDTOMapper.toDto(product);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Cannot find product with id " + productId));
        productDTOMapper.updateEntityFromDto(productDTO, existingProduct);
        if (productDTO.categoryId() != null) {
            Category category = categoryRepository.findById(productDTO.categoryId())
                    .orElseThrow(() -> new ProductNotFoundException("Category not found with id " + productDTO.categoryId()));
            existingProduct.setCategory(category);
        }
        Product updatedProduct = productRepository.save(existingProduct);
        return productDTOMapper.toDto(updatedProduct);
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteProduct(Long productId){
        productRepository.deleteById(productId);
    }

}
