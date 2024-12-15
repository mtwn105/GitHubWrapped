package dev.amitwani.githubwrapped.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@WebFilter
@Component
public class AuthFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(AuthFilter.class);

    @Value("${auth.token}")
    private String token;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Validate requests
        if (request.getRequestURI().contains("/actuator") || request.getRequestURI().contains("/health")) {
            filterChain.doFilter(request, response);
        } else if (request.getHeader("Authorization") != null && request.getHeader("Authorization").equals(token)) {
            Instant start = Instant.now();
            filterChain.doFilter(request, response);
            Instant end = Instant.now();
            LOGGER.info("Request {} {} took {} ms", request.getMethod(), request.getRequestURI(), end.toEpochMilli() - start.toEpochMilli());
        } else {
            LOGGER.warn("Unauthorized request {} from {}", request.getRequestURI(), request.getRemoteAddr());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setHeader("Content-Type", "application/json");
            response.getWriter().write("{\"message\": \"Unauthorized\"}");
        }
    }
}
