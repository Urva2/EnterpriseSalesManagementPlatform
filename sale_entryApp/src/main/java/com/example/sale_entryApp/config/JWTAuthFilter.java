package com.example.sale_entryApp.config;

import com.example.sale_entryApp.dto.ResponseDto.AuthenticatedUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@AllArgsConstructor
@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private AuthUtil authUtil;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("Incoming Request:"+request.getRequestURI());

        final String requestTokenHeader=request.getHeader("Authorization");

        if(requestTokenHeader==null || !requestTokenHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        String token=requestTokenHeader.split("Bearer ")[1];
        String userName=authUtil.getUserNameFromToken(token);
        System.out.println("Username from token = " + userName);
        if(userName!=null  && SecurityContextHolder.getContext().getAuthentication()==null){
            AuthenticatedUser authenticatedUser=(AuthenticatedUser)customUserDetailsService.loadUserByUsername(userName);
            UsernamePasswordAuthenticationToken uptoken=new UsernamePasswordAuthenticationToken(
                    authenticatedUser,
                    null,
                    authenticatedUser.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(uptoken);
        }
        filterChain.doFilter(request,response);
    }
}
