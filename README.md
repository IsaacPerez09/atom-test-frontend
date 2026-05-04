# Atom Task Manager - Frontend

Aplicación web de gestión de tareas construida con Angular 17, Signals y Tailwind CSS.

## Descripción

Interfaz de usuario para la aplicación de gestión de tareas. Permite a los usuarios iniciar sesión con su correo electrónico, crear tareas, marcar como completadas y eliminarlas. La aplicación se conecta a la API REST del backend desplegado en Firebase Cloud Functions.

## Tecnologías

- **Framework:** Angular 17
- **Estado:** Angular Signals
- **Estilos:** Tailwind CSS
- **HTTP:** HttpClient con interceptores
- **Lenguaje:** TypeScript
- **Hosting:** Firebase Hosting

## Requisitos Previos

- Node.js 22 o superior
- Angular CLI (`npm install -g @angular/cli`)
- Proyecto de Firebase configurado

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/atom-test-frontend.git

# Entrar al directorio
cd atom-test-frontend

# Instalar dependencias
npm install

# Instalar Angular CLI globalmente (si no está)
npm install -g @angular/cli
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `ng serve` | Inicia el servidor de desarrollo |
| `ng build` | Compila la aplicación para producción |
| `ng build --configuration production` | Compila optimizada para producción |
| `ng test` | Ejecuta las pruebas unitarias |
| `ng lint` | Verifica el código con ESLint |

### Desarrollo Local

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

La aplicación estará disponible en: http://localhost:4200

### Notas sobre el Backend

El frontend espera que el backend esté disponible en:

```
https://us-central1-atom-task-manager-77028.cloudfunctions.net/api
```

Asegúrate de que las Cloud Functions estén desplegadas antes de probar el frontend localmente.

## Variables de Entorno / Secrets

### Secrets Requeridos (CI/CD)

| Secret | Descripción |
|--------|-------------|
| `FIREBASE_TOKEN` | Token de autenticación de Firebase para deploys |
| `PROJECT_ID` | ID del proyecto Firebase (`atom-task-manager-77028`) |

### Generar Firebase Token

```bash
npm install -g firebase-tools
firebase login:ci
```

### Configuración de Environments

La configuración de producción está en `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://us-central1-atom-task-manager-77028.cloudfunctions.net/api',
  firebase: {
    projectId: 'atom-task-manager-77028',
    // ... otras config de Firebase
  }
};
```

## Estructura del Proyecto

```
atom-test-frontend/
├── src/
│   ├── app/
│   │   ├── core/               # Servicios singleton y configuraciones
│   │   │   ├── http/          # HttpService e interceptores
│   │   │   ├── services/      # AuthService
│   │   │   └── guards/        # AuthGuard
│   │   ├── features/          # Módulos de funcionalidades
│   │   │   ├── auth/         # Login
│   │   │   └── tasks/        # Gestión de tareas
│   │   ├── shared/            # Componentes y utilerías reutilizables
│   │   ├── app.config.ts     # Configuración de la aplicación
│   │   ├── app.routes.ts     # Definición de rutas
│   │   └── app.component.ts  # Componente raíz
│   ├── environments/          # Configuración por ambiente
│   ├── styles.css            # Estilos globales y Tailwind
│   └── index.html            # HTML principal
├── angular.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── firebase.json
```

### Arquitectura de Carpetas

- **Core:** Servicios singleton como AuthService, HttpService, guards. Solo se cargan una vez.
- **Features:** Funcionalidades específicas de la aplicación (login, tareas). Cada feature es independiente.
- **Shared:** Componentes y utilerías que se reutilizan en toda la aplicación.

## Funcionalidades

### Login

- Ingreso con correo electrónico
- Creación automática de cuenta si el usuario no existe
- Diálogo de confirmación para crear nueva cuenta
- Validación de formato de email

### Dashboard de Tareas

- Lista de tareas ordenadas por fecha de creación
- Formulario para crear nuevas tareas
- Toggle para marcar tareas como completadas/pendientes
- Botón de eliminar tarea
- Indicador visual de tareas completadas (texto tachado)
- Cierre de sesión

### Estados de Carga

- Skeleton loaders mientras cargan las tareas
- Indicadores de carga en botones
- Mensajes de error cuando algo falla

## Despliegue

### Despliegue Manual

```bash
# Compilar para producción
ng build --configuration production

# Desplegar a Firebase Hosting
firebase deploy --only hosting
```

### Despliegue Automático (CI/CD)

El proyecto está configurado con GitHub Actions. Cada push a la rama `main` ejecuta:

1. Checkout del código
2. Instalación de dependencias (`npm ci`)
3. Instalación de Angular CLI
4. Compilación para producción (`ng build --configuration production`)
5. Despliegue a Firebase Hosting

Para que funcione, necesitas configurar el secret `FIREBASE_TOKEN` en el repositorio de GitHub.

### Flujo de Despliegue

```
Push a main
    ↓
GitHub Actions
    ↓
npm ci
    ↓
ng build --configuration production
    ↓
firebase deploy --only hosting
    ↓
Firebase Hosting
```

## URLs Desplegadas

| Recurso | URL |
|--------|-----|
| Aplicación | https://atom-task-manager-77028.web.app |
| API Backend | https://us-central1-atom-task-manager-77028.cloudfunctions.net/api |

## Conexión Frontend-Backend

El frontend se comunica con el backend a través de HTTP requests:

```
Frontend (Firebase Hosting)
    ↓ HTTP requests
Backend (Firebase Cloud Functions 2nd Gen)
    ↓
Firestore Database
```

El endpoint base está configurado en `environment.prod.ts`:

```
apiUrl: 'https://us-central1-atom-task-manager-77028.cloudfunctions.net/api'
```