package com.example.sale_entryApp.config;

import jakarta.servlet.http.HttpFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.sql.DataSource;

@Configuration
public class BasicSecurity {
//    @Bean
//    public UserDetailsService userDetailsService(CustomUserDetailsService service)
//    {
//        return service;
//    }
    @Autowired
    private JWTAuthFilter jwtAuthFilter;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http){
http.authorizeHttpRequests(configurer->
                configurer
                        .requestMatchers(HttpMethod.POST,"/products/register").hasRole("ADMIN") //ROLE_ADMIN,SPring will covert
                        .requestMatchers("/orders/**").hasRole("SALES_PERSON")
                        .requestMatchers(HttpMethod.POST,"/salesperson/register").permitAll()
                        .requestMatchers(HttpMethod.POST,"/customers/register").hasRole("SALES_PERSON")
                        .requestMatchers(HttpMethod.POST,"/admin/register").permitAll()
                        .requestMatchers(HttpMethod.POST,"/auth/login").permitAll()
                        .requestMatchers(HttpMethod.PUT,"/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/salesperson/me").hasRole("SALES_PERSON")
                        .requestMatchers(HttpMethod.PATCH,"/salesperson/me").hasRole("SALES_PERSON")
                        .requestMatchers(HttpMethod.GET, "/products").hasAnyRole("SALES_PERSON", "ADMIN")
                        .requestMatchers(HttpMethod.GET,"/products/search").hasAnyRole("SALES_PERSON", "ADMIN")
                        //.anyRequest().authenticated()
        );
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.httpBasic(Customizer.withDefaults());
        http.csrf(csrf->csrf.disable());
        http.sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration){
        return authenticationConfiguration.getAuthenticationManager();
    }
}
