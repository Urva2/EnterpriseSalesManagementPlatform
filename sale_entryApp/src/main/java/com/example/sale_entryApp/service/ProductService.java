package com.example.sale_entryApp.service;


import com.example.sale_entryApp.dto.RequestDto.ProductRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.ProductDTO;
import com.example.sale_entryApp.entity.Product;
import com.example.sale_entryApp.mapper.ProductMapper;
import com.example.sale_entryApp.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ProductService {
    @Autowired
    public ProductRepo productRepo;
    @Autowired
    public ProductMapper productMapper;
    public ProductDTO addProduct(ProductRequestDto dto){
        Product product=productMapper.toEntity(dto);
        System.out.println("stockQuantity:"+product.getStockQuantity());
        Product existing=productRepo.findByName(product.getName());
        if(existing!=null && Objects.equals(existing.getItemWeight(), product.getItemWeight())){
            throw new RuntimeException("Item Exist with Same Name and ItemWeight:"+existing.getName()+","+existing.getItemWeight());
        }
        Product saved=productRepo.save(product);
        return productMapper.productDto(saved);
    }
    public ProductDTO findProductById(int id){
        Product product=productRepo.findById(id);
        if(product!=null)
        {
            return productMapper.productDto(product);
        }
        throw new RuntimeException("Product Not Exist With ID:"+id);
    }
    public List<ProductDTO> findProducts() {
        List<Product> products = productRepo.findAll();
        if (!products.isEmpty()) {
            return productMapper.toDtoProductsList(products);
        }
        throw new RuntimeException("Products Not Found");
    }
    public ProductDTO updateproduct(ProductRequestDto productRequestDto,int id){
        Product product=productRepo.findById(id);
        System.out.println("stockQuantity in updation:"+product.getStockQuantity());
        boolean isUpdated=false;
        if(productRequestDto.getName()!=null){
            product.setName(productRequestDto.getName());
            isUpdated=true;
        }
        if(productRequestDto.getPrice()!=null && !productRequestDto.getPrice().equals(product.getPrice())){
            product.setPrice(productRequestDto.getPrice());
            isUpdated=true;
        }
        if(productRequestDto.getItemWeight()!=null && !productRequestDto.getStockQuantity().equals(product.getStockQuantity())){
            product.setItemWeight(productRequestDto.getItemWeight());
            isUpdated=true;
        }
        if(productRequestDto.getStockQuantity()!=null){
            product.setStockQuantity(productRequestDto.getStockQuantity());
            isUpdated=true;
        }
        if(isUpdated){
            productRepo.save(product);
            return productMapper.productDto(product);
        }
        throw new RuntimeException("Product Object Has Not Any Update Details!");
    }
}
