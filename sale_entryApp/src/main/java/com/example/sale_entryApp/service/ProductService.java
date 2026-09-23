package com.example.sale_entryApp.service;


import com.example.sale_entryApp.dto.RequestDto.ProductRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.ProductDTO;
import com.example.sale_entryApp.entity.Product;
import com.example.sale_entryApp.mapper.ProductMapper;
import com.example.sale_entryApp.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    public ProductRepo productRepo;
    @Autowired
    public ProductMapper productMapper;
    //10-6-26 name:urva ,changed 12-06
    public Page<ProductDTO> getAllProduct(Pageable pageable) {
        return productRepo.findAllByIsActiveTrue(pageable).map(productMapper::productDto);
    }

    public ProductDTO addProduct(ProductRequestDto dto){
        Product product=productMapper.toEntity(dto);
        System.out.println("stockQuantity:"+product.getStockQuantity());
        Product existing=productRepo.findByName(product.getName());
        if(existing!=null && Objects.equals(existing.getItemWeight(), product.getItemWeight())){
            if(!existing.getIsActive()){
                existing.setIsActive(true);
                existing.setStockQuantity(product.getStockQuantity());
                productRepo.save(existing);
                return productMapper.productDto(existing);
            }
            throw new RuntimeException("Item Exist with Same Name and ItemWeight:"+existing.getName()+","+existing.getItemWeight());
        }
        product.setIsActive(true);
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

    public ProductDTO updateproduct(ProductRequestDto productRequestDto,int id){
        Product product=productRepo.findById(id);
        if (!product.getIsActive()) {
            throw new RuntimeException("Cannot update a deleted product!");
        }
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
        if(productRequestDto.getItemWeight()!=null && !productRequestDto.getItemWeight().equals(product.getItemWeight())){
            product.setItemWeight(productRequestDto.getItemWeight());
            isUpdated=true;
        }
        if(productRequestDto.getStockQuantity()!=null && !productRequestDto.getStockQuantity().equals(product.getStockQuantity())){
            product.setStockQuantity(productRequestDto.getStockQuantity());
            isUpdated=true;
        }
        if(isUpdated){
            productRepo.save(product);
            return productMapper.productDto(product);
        }
        throw new RuntimeException("Product Object Has Not Any Update Details!");
    }
    //10-6-26 name:urva
    public Page<ProductDTO> findAllProductByName(String name, Pageable pageable) {
        Page<Product> productPage;
        // Check if the user provided a name to search for
        if (name != null && !name.trim().isEmpty()) {
            productPage = productRepo.findByNameContainingIgnoreCaseAndIsActiveTrue(name, pageable);
        } else {
            // If no name is provided, just return all products paginated
            productPage = productRepo.findAllByIsActiveTrue(pageable);
        }
        // Map the resulting page to a DTO page
        return productPage.map(productMapper::productDto);
    }
  public ProductDTO deleteProduct(int id){
       Product product=productRepo.findById(id);
       if(product!=null && product.getIsActive()){
           product.setIsActive(false);
           productRepo.save(product);
           return productMapper.productDto(product);
       }
      throw new RuntimeException("Product Not Exist With ID:"+id);
    }

    public void incrementStock(Integer productId, Integer quantity) {
        if (quantity <= 0) {
            return;
        }
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStockQuantity(product.getStockQuantity() + quantity);
        productRepo.save(product);
    }

    public List<ProductDTO> getLowStockProducts(int threshold) {
        List<Product> products = productRepo.findByStockQuantityLessThanEqualAndIsActiveTrue(threshold);
        return products.stream().map(productMapper::productDto).toList();
    }
}
