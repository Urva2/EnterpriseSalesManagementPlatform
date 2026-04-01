package com.example.sale_entryApp.config;

import jakarta.servlet.http.HttpFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
public class BasicSecurity {
//    @Bean
//    public UserDetailsService userDetailsService(CustomUserDetailsService service)
//    {
//        return service;
//    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http){
http.authorizeHttpRequests(configurer->
                configurer
                        .requestMatchers(HttpMethod.POST,"/products/register").hasRole("ADMIN") //ROLE_ADMIN,SPring will covert
                        .requestMatchers("/sale-order/**").hasRole("SALESPERSON")
                        .requestMatchers(HttpMethod.POST,"/salesperson/register").permitAll()
                        .requestMatchers(HttpMethod.POST,"/customers/register").hasRole("SALESPERSON")
                        .requestMatchers(HttpMethod.POST,"/admin/register").permitAll()
                        .anyRequest().authenticated()
        );
        http.httpBasic(Customizer.withDefaults());
        http.csrf(csrf->csrf.disable());

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
