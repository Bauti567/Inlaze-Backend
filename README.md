# NestJS Auth API

Este es un proyecto sencillo que implementa un sistema de autenticación con registro y login utilizando **NestJS** y **JWT**. 

## Características
- Registro de usuarios con contraseñas encriptadas usando `bcrypt`.
- Login con generación de tokens JWT (`access_token` y `refresh_token`).
- Validación de credenciales.
- Un único recurso: `users`.
- Almacenamiento de datos en un clúster privado de MongoDB.

---

## Requisitos previos

Antes de ejecutar este proyecto, asegúrate de tener instalado lo siguiente:
- [Node.js](https://nodejs.org/) v16 o superior.
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/).

---

## Configuración del proyecto

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/tu-usuario/nestjs-auth-api.git
   cd nestjs-auth-api
  
  // ACCESO A CLUSTER MONGODB
  MONGO_URI=mongodb+srv://jbautistapulido:nSf698KVJfWvF92B@cluster0.tuza9.mongodb.net/Inlaze?retryWrites=true&w=majority&appName=Cluster0

  
Instala las dependencias:
  npm install

Para iniciar el servidor en modo desarrollo:

  npm run start:dev

  1. Registro
    POST /users/register
    Registra un nuevo usuario.

    Body (JSON):
    {
      "username": "usuario123",
      "email": "usuario@example.com",
      "password": "contraseña123"
    }

    {
      "message": "User created successfully",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR..."
    }

  2. Login
    POST /users/login
    Inicia sesión con un usuario registrado.
    Body (JSON):

    {
      "email": "usuario@example.com",
      "password": "contraseña123"
    }

    Estructura del proyecto

      src/
      ├── users/
      │   ├── dto/               # Data Transfer Objects (CreateUserDto, LoginDto, etc.)
      │   ├── entities/          # Definición de los esquemas (User entity)
      │   ├── users.controller.ts # Controlador de usuarios
      │   ├── users.service.ts    # Lógica de negocio de usuarios
      ├── app.module.ts          # Módulo principal
      ├── main.ts                # Archivo de entrada de la aplicación

Tecnologías utilizadas
  NestJS: Framework para Node.js.
  Mongoose: ODM para MongoDB.
  JWT: Autenticación basada en tokens.
  bcrypt: Encriptación de contraseñas.
