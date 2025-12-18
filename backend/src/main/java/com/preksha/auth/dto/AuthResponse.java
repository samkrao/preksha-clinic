package com.preksha.auth.dto;

public class AuthResponse {
    public String token;
    public String email;
    public String name;

    public AuthResponse(String token, String email, String name) {
        this.token = token;
        this.email = email;
        this.name = name;
    }
}
