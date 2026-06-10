package com.example.sale_entryApp.controller;

import com.example.sale_entryApp.dto.RequestDto.ProductRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.ProductDTO;
import com.example.sale_entryApp.entity.Product;
import com.example.sale_entryApp.service.ProductService;
import jakarta.validation.Valid;
import jdk.jfr.Percentage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
     private ProductService productService;

    @PostMapping("/register")
    public ResponseEntity<?> addProdut(@Valid @RequestBody ProductRequestDto product)
    {
        try{
            ProductDTO savedproduct=productService.addProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedproduct);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductRequestDto productRequestDto,@PathVariable int id)
    {
        try{
            System.out.println("Hello,inside:updateproduct controller");
         ProductDTO productDTO=productService.updateproduct(productRequestDto,id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(productDTO);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // //10-6-26 name:urva Pagination
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProduct(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<ProductDTO> productDTOS = productService.getAllProduct(pageable);
        return ResponseEntity.ok(productDTOS);
    }
    //10-6-26 name:urva
    @GetMapping("/seacrh")
    public ResponseEntity<Page<?>> getAllProductByName(@RequestParam (defaultValue = "name") String keyword,
                                                           @PageableDefault(page=0,size = 10) Pageable pageable){
        Page<ProductDTO> productDTOS=productService.findProductByName(keyword,pageable);
        return ResponseEntity.ok(productDTOS);
    }
}
