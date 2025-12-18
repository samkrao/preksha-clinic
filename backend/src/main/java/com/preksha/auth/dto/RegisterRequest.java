package com.preksha.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank @Size(max = 120)
    public String name;

    @NotBlank @Email @Size(max = 200)
    public String email;

    @NotBlank @Size(min = 6, max = 100)
    public String password;
}
