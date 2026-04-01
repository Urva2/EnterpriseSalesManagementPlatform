package com.example.sale_entryApp.config;

import com.example.sale_entryApp.entity.Admin;
import com.example.sale_entryApp.entity.SalesPerson;
import com.example.sale_entryApp.repository.AdminRepositary;
import com.example.sale_entryApp.repository.SalesPersonRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AdminRepositary adminRepositary;
    @Autowired
    private SalesPersonRepo salesPersonRepo;

    @Override
        public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        Admin admin = adminRepositary.findByName(username);
        if (admin != null) {
             return new User(
                    admin.getName(),
                    admin.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }
        SalesPerson salesPerson = salesPersonRepo.findByName(username);
        if (salesPerson != null) {
           return new User(
                    salesPerson.getName(),
                    salesPerson.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_SALESPERSON"))
            );
        }
        throw new UsernameNotFoundException("User not found");
    }
}
