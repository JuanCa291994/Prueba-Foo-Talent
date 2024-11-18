# Proyecto de Gestión de Usuarios con Redis y Next.js

Este proyecto es una aplicación para gestionar usuarios, utilizando Next.js en el frontend y Redis como base de datos. Los usuarios pueden ser creados, actualizados, eliminados y consultados a través de una API RESTful.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

- [Node.js](https://nodejs.org/) (LTS recomendado)
- [Redis](https://redis.io/) o acceso a un servicio Redis (como [Upstash](https://upstash.com/))
- [Vercel](https://vercel.com/) si deseas desplegar en la nube

## Primeros pasos

1. **Clonar el repositorio**

   Primero, clona este repositorio en tu máquina local.

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
Instalar dependencias

2. **Instala todas las dependencias necesarias para ejecutar el proyecto.**

    npm install

3. **Configurar Redis**

 - Si estás utilizando [Upstash Redis](), obtén tu URL y token de Redis desde el panel de Upstash.

 - Crea un archivo .env.local en la raíz de tu proyecto y añade las siguientes variables de entorno:

        UPSTASH_REDIS_REST_URL=tu-url-de-redis
        UPSTASH_REDIS_REST_TOKEN=tu-token-de-redis

4. **Ejecutar el proyecto en desarrollo**

Ahora puedes ejecutar el proyecto en modo desarrollo con el siguiente comando:

npm run dev

Esto iniciará el servidor de desarrollo en http://localhost:3000.

5.  **Acceder a la aplicación**

Abre tu navegador y visita http://localhost:3000. Aquí podrás interactuar con la aplicación para crear, actualizar y eliminar usuarios.

## Estructura del proyecto

La estructura básica del proyecto es la siguiente:

    /pages
    /api
        usuarios.js        # API para gestionar usuarios (GET, POST, PUT, DELETE)
    /index.js            # Página principal donde se visualizan los usuarios
    /services
    redisClient.js       # Configuración del cliente Redis
    usuariosService.js   # Lógica para interactuar con Redis y gestionar usuarios
    /components
    UsuarioForm.js       # Componente para crear y editar usuarios
    UsuarioList.js       # Componente para mostrar la lista de usuarios

## Funcionalidades:

- **Obtener usuarios :** Los usuarios se almacenan en Redis y se pueden obtener mediante la API GET /api/usuarios.
- **Crear usuario :** Se pueden crear nuevos usuarios mediante la API POST /api/usuarios.
- **Actualizar usuario:** Los datos de los usuarios se pueden actualizar mediante la API PUT /api/usuarios/{id}.
- **Eliminar usuario:** Se puede eliminar un usuario mediante la API DELETE /api/usuarios/{id}.

## Despliegue
Si deseas desplegar la aplicación en la nube, puedes hacerlo fácilmente utilizando Vercel. Solo sigue estos pasos:

1. Crea una cuenta en [Vercel](https://vercel.com/).
2. Conecta tu repositorio de GitHub o GitLab.
3. Configura las variables de entorno ( UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN ) en el panel de Vercel.
4. Despliega el proyecto.

Vercel se encargará de construir y desplegar tu aplicación automáticamente.
