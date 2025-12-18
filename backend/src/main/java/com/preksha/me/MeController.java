package com.preksha.me;

import com.preksha.user.User;
import com.preksha.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MeController {

    private final UserRepository userRepo;

    public MeController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping("/me")
    public MeResponse me(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepo.findByEmailIgnoreCase(email).orElseThrow();
        return new MeResponse(user.getName(), user.getEmail());
    }

    public record MeResponse(String name, String email) {}
}
