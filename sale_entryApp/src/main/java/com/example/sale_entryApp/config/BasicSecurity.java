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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(configurer -> configurer
                // 1. Public Endpoints (Registration & Login)
                .requestMatchers(HttpMethod.POST, "/salesperson/register", "/admin/register", "/auth/login").permitAll()

                .requestMatchers("/admin/**").hasRole("ADMIN")
                // 2. Product Endpoints
                .requestMatchers(HttpMethod.GET, "/products", "/products/search").hasAnyRole("SALES_PERSON", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/products/register").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")

                // 3. SalesPerson & Customer Endpoints
                .requestMatchers(HttpMethod.POST, "/customers/register").hasRole("SALES_PERSON")
                .requestMatchers(HttpMethod.GET, "/salesperson/me").hasRole("SALES_PERSON")
                .requestMatchers(HttpMethod.PATCH, "/salesperson/me").hasRole("SALES_PERSON")
                .requestMatchers(HttpMethod.GET, "/salesperson", "/salesperson/search").hasRole("ADMIN")

                // 4. Sale Order Endpoints (Admin specific management)
                .requestMatchers(HttpMethod.GET, "/orders/viewOrders", "/orders/search", "/orders/search-status").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/admin/dashboard/stats").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/orders/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/orders/totalrev/**").hasAnyRole("SALES_PERSON", "ADMIN")

                // 5. Sale Order Endpoints (Salesperson cart operations & personal views)
                // Because Spring reads top-to-bottom, Admins get caught by the specific rules above.
                // Everything else falling to /orders/** (like addToCart, incrsQty, my-orders) requires SALES_PERSON.
                .requestMatchers("/orders/**").hasRole("SALES_PERSON")

                // 6. Secure everything else by default! (Crucial for security)
                .anyRequest().authenticated()
        );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.cors(Customizer.withDefaults());
        http.httpBasic(Customizer.withDefaults());
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

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
