# Install the Nest CLI globally with npm:
```
npm i -g @nestjs/cli
```


# Create Porject
```
nest new my-nest-app
```

# Enable cors so you can call api from react 5173
main.ts add `app.enableCors();` before await app.listen
```
app.enableCors();
await app.listen(process.env.PORT ?? 3000);

```
# start dev
```
npm run start:dev
```

# Url
```
http://localhost:3000/
```