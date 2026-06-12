    package com.example.sale_entryApp.controller;

    import com.example.sale_entryApp.dto.RequestDto.CustomerRequestDto;
    import com.example.sale_entryApp.dto.ResponseDto.CustomerDTO;
    import com.example.sale_entryApp.service.CustomerService;
    import jakarta.validation.Valid;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/customers")
    public class CustomerController {
        @Autowired
        private CustomerService customerService;

        @PostMapping("/register")
        public ResponseEntity<?> addCustomer(@Valid @RequestBody CustomerRequestDto customer)
        {
            try{
                CustomerDTO savedcustomer=customerService.createCustomer(customer);
                return ResponseEntity.status(HttpStatus.CREATED).body(savedcustomer);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        @GetMapping
        public ResponseEntity<?> findAllCustomer(){
            try {
                List<CustomerDTO> customerList = customerService.findCustomers();
                return ResponseEntity.status(HttpStatus.OK).body(customerList);
            }catch (RuntimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }

        @GetMapping("/search")
        public ResponseEntity<?> searchCustomer(
                @RequestParam String phone) {
            try {
                CustomerDTO customer = customerService.searchCustomers(phone);
                return ResponseEntity.ok(customer);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
        }
    }
