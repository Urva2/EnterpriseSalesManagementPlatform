package com.example.sale_entryApp.config;

import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import com.example.sale_entryApp.entity.Admin;
import com.example.sale_entryApp.entity.SalesPerson;
import com.example.sale_entryApp.entity.UserType;
import com.example.sale_entryApp.repository.AdminRepositary;
import com.example.sale_entryApp.repository.SalesPersonRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AdminRepositary adminRepositary;
    @Autowired
    private SalesPersonRepo salesPersonRepo;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        // 1. Check Admin by name or email
        Admin admin = adminRepositary.findByName(username);
        if (admin == null) {
            admin = adminRepositary.findByEmail(username);
        }
        if (admin != null) {
            return new AuthenticatedUser(
                    (long) admin.getId(),
                    admin.getName(),
                    admin.getPassword(),
                    UserType.ADMIN,
                    List.of(
                            new SimpleGrantedAuthority("ROLE_ADMIN")
                    )
            );
        }

        // 2. Check SalesPerson by name or email
        SalesPerson salesPerson = salesPersonRepo.findByName(username);
        if (salesPerson == null) {
            salesPerson = salesPersonRepo.findByEmail(username);
        }
        if (salesPerson != null) {
            if (Boolean.FALSE.equals(salesPerson.getIsActive())) {
                throw new DisabledException("Account is deactivated. Contact administrator.");
            }
            return new AuthenticatedUser(
                    (long) salesPerson.getId(),
                    salesPerson.getName(),
                    salesPerson.getPassword(),
                    UserType.SALES_PERSON,
                    List.of(
                            new SimpleGrantedAuthority("ROLE_SALES_PERSON")
                    )
            );
        }

        throw new UsernameNotFoundException("User not found with username/email: " + username);
    }
}
