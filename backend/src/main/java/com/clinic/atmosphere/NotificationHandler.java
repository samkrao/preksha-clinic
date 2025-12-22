package com.clinic.atmosphere;

import com.clinic.service.NotificationService;
import com.clinic.util.JwtUtil;
import org.atmosphere.config.service.AtmosphereHandlerService;
import org.atmosphere.cpr.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
@AtmosphereHandlerService(path = "/notifications/stream")
public class NotificationHandler implements AtmosphereHandler {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onRequest(AtmosphereResource resource) throws IOException {
        AtmosphereRequest request = resource.getRequest();
        
        if ("GET".equals(request.getMethod())) {
            String token = request.getParameter("token");
            
            if (token != null && jwtUtil.validateToken(token)) {
                Long userId = jwtUtil.extractUserId(token);
                
                // Set content type for SSE
                AtmosphereResponse response = resource.getResponse();
                response.setContentType("text/event-stream");
                response.setCharacterEncoding("UTF-8");
                response.addHeader("Cache-Control", "no-cache");
                response.addHeader("Connection", "keep-alive");
                
                // Suspend the connection for long-polling/SSE
                resource.suspend();
                
                // Register the connection
                notificationService.registerConnection(userId, resource);
                
                // Send initial connection confirmation
                resource.write("data: {\"type\":\"connected\",\"message\":\"Connected to notification stream\"}\n\n");
                
                System.out.println("User " + userId + " connected to notification stream");
            } else {
                resource.write("data: {\"type\":\"error\",\"message\":\"Unauthorized\"}\n\n");
                resource.resume();
            }
        }
    }

    @Override
    public void onStateChange(AtmosphereResourceEvent event) throws IOException {
        AtmosphereResource resource = event.getResource();
        AtmosphereRequest request = resource.getRequest();
        
        if (event.isCancelled() || event.isClosedByClient()) {
            String token = request.getParameter("token");
            if (token != null && jwtUtil.validateToken(token)) {
                Long userId = jwtUtil.extractUserId(token);
                notificationService.unregisterConnection(userId);
                System.out.println("User " + userId + " disconnected from notification stream");
            }
        }
    }

    @Override
    public void destroy() {
        System.out.println("NotificationHandler destroyed");
    }
}
