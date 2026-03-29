package com.example.backend.service.impl;

import com.example.backend.DAO.CategoryDAO;
import com.example.backend.dto.CategoryDTO;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl {
    private final CategoryDAO categoryDAO;
    public CategoryServiceImpl(CategoryDAO categoryDAO){
        this.categoryDAO=categoryDAO;
    }
}
