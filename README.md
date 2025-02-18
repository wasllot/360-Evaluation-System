# Evaluación 360

Sistema de evaluación de desempeño para empleados.

## Requisitos

- Node.js 16+
- MongoDB
- NPM

## Estructura del Proyecto

El proyecto sigue una arquitectura cliente-servidor con la siguiente estructura:

### Backend (Servidor)
- **src/controllers**: Lógica de los endpoints de la API
- **src/models**: Definición de los modelos de datos
- **src/routes**: Configuración de las rutas de la API
- **src/middleware**: Middlewares para autenticación y manejo de errores
- **tests**: Pruebas unitarias y de integración

### Frontend (Cliente)
- **src/components**: Componentes reutilizables de la UI
- **src/pages**: Vistas principales de la aplicación
- **src/store**: Gestión del estado global con Redux
- **src/services**: Lógica para consumir la API del backend
- **src/styles**: Estilos globales y personalizados

## Decisiones de Diseño

### Arquitectura del Sistema
- **Cliente-Servidor**: Separación clara entre frontend y backend
- **API REST**: Comunicación mediante endpoints RESTful
- **MVC**: Patrón Modelo-Vista-Controlador en el backend

### Diagrama de Base de Datos
```Diagram
    USER {
        string _id PK
        string email UK
        string password
        string role
    }
    
    TEMPLATE {
        string _id PK
        string name
        ObjectId createdBy FK
    }
    
    EVALUATION {
        string _id PK
        ObjectId template FK
        ObjectId employee FK
        ObjectId evaluator FK
        array criteria
        number overallScore
        date createdAt
    }
    
    COMMENT {
        string _id PK
        ObjectId evaluationId FK
        ObjectId userId FK
        ObjectId parentCommentId FK
        string content
        date createdAt
        date updatedAt
    }
    
    USER ||--o{ EVALUATION : "recibe como empleado"
    USER ||--o{ EVALUATION : "realiza como evaluador"
    TEMPLATE ||--o{ EVALUATION : "utiliza"
    EVALUATION ||--o{ COMMENT : "contiene"
    USER ||--o{ COMMENT : "escribe"
    COMMENT ||--o{ COMMENT : "responde a"
```

### Tecnologías Principales
- **Frontend**: React con Redux para gestión de estado
- **Backend**: Node.js con Express para la API
- **Base de datos**: MongoDB para almacenamiento de datos
- **Autenticación**: JWT (JSON Web Tokens) para seguridad

### Patrones de Diseño Implementados
- **Redux**: Gestión predecible del estado en el frontend
- **Middleware**: Interceptores para autenticación y validación
- **Componentización**: UI modular y reutilizable

## Instalación y Configuración

1. Clonar el repositorio:
2. Instalar dependencias:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Configurar variables de entorno en `.env`

## Ejecución del Proyecto

1. Iniciar el servidor backend:
   ```bash
   cd backend && npm run dev
   ```
2. Iniciar el frontend:
   ```bash
   cd frontend && npm start
   ```

## Pruebas y Validación

Para ejecutar las pruebas del backend:

1. Instalar dependencias de desarrollo:
   ```bash
   cd backend && npm install --save-dev jest supertest
   ```
2. Ejecutar las pruebas:
   ```bash
   npm test
   ```

Las pruebas cubren:
- Autenticación de usuarios
- Funcionalidad de comentarios

## Contribución al Proyecto

1. Crear una nueva rama (branch):
2. Hacer los cambios
3. Crear un Pull Request

## Licencia del Proyecto

MIT
