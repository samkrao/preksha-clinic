package com.clinic.service;

import org.atmosphere.cpr.AtmosphereResource;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    private final ConcurrentHashMap<Long, AtmosphereResource> connections = new ConcurrentHashMap<>();

    public void registerConnection(Long userId, AtmosphereResource resource) {
        connections.put(userId, resource);
        System.out.println("User " + userId + " connected. Total connections: " + connections.size());
    }

    public void unregisterConnection(Long userId) {
        connections.remove(userId);
        System.out.println("User " + userId + " disconnected. Total connections: " + connections.size());
    }

    public void notifyUser(Long userId, String message) {
        AtmosphereResource resource = connections.get(userId);
        if (resource != null && resource.isSuspended()) {
            try {
                String jsonMessage = String.format(
                    "{\"type\":\"notification\",\"message\":\"%s\",\"timestamp\":%d}",
                    message, System.currentTimeMillis()
                );
                resource.write("data: " + jsonMessage + "\n\n");
            } catch (IOException e) {
                System.err.println("Failed to send notification to user " + userId + ": " + e.getMessage());
                connections.remove(userId);
            }
        }
    }

    public void notifyAll(String message) {
        connections.forEach((userId, resource) -> {
            if (resource.isSuspended()) {
                try {
                    String jsonMessage = String.format(
                        "{\"type\":\"broadcast\",\"message\":\"%s\",\"timestamp\":%d}",
                        message, System.currentTimeMillis()
                    );
                    resource.write("data: " + jsonMessage + "\n\n");
                } catch (IOException e) {
                    System.err.println("Failed to broadcast to user " + userId);
                }
            }
        });
    }

    public int getActiveConnections() {
        return connections.size();
    }
}
