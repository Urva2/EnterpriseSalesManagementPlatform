package com.example.sale_entryApp.service;

import com.example.sale_entryApp.dto.RequestDto.AdminRequestDto;
import com.example.sale_entryApp.dto.ResponseDto.AdminDTO;
import com.example.sale_entryApp.entity.Admin;
import com.example.sale_entryApp.mapper.AdminMapper;
import com.example.sale_entryApp.repository.AdminRepositary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class AdminService {
    @Autowired
    private AdminRepositary adminRepositary;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    AdminMapper adminMapper;
    public AdminDTO createAdmin(AdminRequestDto dto)
    {
        System.out.println(dto.getName());
        Admin admin=adminMapper.toEntity(dto);
        System.out.println(admin.getName());
        Admin existing=adminRepositary.findByEmail(admin.getEmail());
        if(existing!=null)//Not checked Both are equal as ,DB has Unique=True constraint
        {
            throw new RuntimeException("ID Already Exist:"+existing.getId());
        }
        String encoded = passwordEncoder.encode(admin.getPassword());
        admin.setPassword(encoded);
        Admin saved=adminRepositary.save(admin);
        return adminMapper.adminDto(saved);
    }
}
