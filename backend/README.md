# Backend — Spring Boot + DataNucleus JPA + SQLite + JWT

## Run
```bash
mvn spring-boot:run
```

DB file: `preksha.db` (created in this folder)

## Test quickly
Register:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@demo.com","password":"secret123"}'
```

Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@demo.com","password":"secret123"}'
```
