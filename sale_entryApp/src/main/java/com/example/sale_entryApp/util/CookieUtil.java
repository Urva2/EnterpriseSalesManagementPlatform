package com.example.sale_entryApp.util;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    private static final String REFRESH_COOKIE_NAME = "refreshToken";
    private static final int REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

    public void addRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set false ONLY for local http testing, true in prod
        cookie.setPath("/auth");
        cookie.setMaxAge(REFRESH_COOKIE_MAX_AGE);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    public String extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (REFRESH_COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    public void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/auth");
        cookie.setMaxAge(0); // deletes immediately
        response.addCookie(cookie);
    }
}
