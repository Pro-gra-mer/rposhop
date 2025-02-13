# 🛍️ RPOShop - Tienda Online de Ropa Deportiva  

![RPOShop Banner](https://res.cloudinary.com/dl7on9tjj/image/upload/v1739382135/Captura_de_pantalla_364_wmfniy.png)


## 🚀 Introducción  
**RPOShop** es una tienda online de ropa deportiva que permite a los usuarios explorar productos, agregarlos al carrito y gestionar compras de manera intuitiva. La aplicación cuenta con autenticación, zona de administración y un diseño moderno y responsive.  

🔗 **Demo en Vivo:** [RPOShop](https://rposhop.netlify.app/)  
🔗 **Documentación API (Swagger):** [Swagger UI](https://rposhop-backend-latest.onrender.com/swagger-ui/index.html)  

---

## ✨ Características Clave  
✅ **Autenticación y roles:** Registro, login, recuperación de contraseña y verificación por correo.  
✅ **Formularios en ventana modal:** Inicio de sesión y registro sin recargar la página.  
✅ **Carrito de compras dinámico:** Fusiona el carrito de usuarios anónimos con el de usuarios autenticados.  
✅ **Barra de búsqueda:** Búsqueda dinámica de productos.  
✅ **Zona de administración:** CRUD de productos y categorías (solo para administradores).  
✅ **Diseño responsive:** Adaptado para móviles y escritorio.  
✅ **Integración con servicios externos:** Cloudinary (imágenes), Railway (Base de datos), Render (Backend), Netlify (Frontend).  

---

## 🛠 Herramientas y Tecnologías Utilizadas  
![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white) ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black) <br> [Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white) ![Render](https://img.shields.io/badge/Render-00979D?style=flat&logo=render&logoColor=white) ![Railway](https://img.shields.io/badge/Railway-121212?style=flat&logo=railway&logoColor=white)

### **Frontend (Angular 17)**  
- 🖥 **Framework:** Angular con componentes standalone  
- 🎨 **Estilos:** TailwindCSS  
- 🔀 **Rutas:** Angular Router  
- 📊 **Gestión de estado:** BehaviorSubject  

### **Backend (Spring Boot 3)**  
- 🔐 **Seguridad:** Spring Security con JWT  
- 🗄 **Base de datos:** MySQL (en Railway)  
- 📜 **ORM:** Hibernate con JPA  
- 📖 **Documentación API:** Swagger  

### **Despliegue**  
✅ **Frontend:** Netlify  
✅ **Backend:** Render  
✅ **Base de datos:** Railway  
✅ **Contenerización:** Docker para entornos locales y de producción  

---

## 🛠 Instalación y Configuración  

### 🔹 **Requisitos Previos**  
- Node.js y Angular CLI (`npm install -g @angular/cli`)  
- Java 21 y Maven  
- MySQL  

### 🔹 **Clonar el Repositorio**  
```sh
git clone https://github.com/tu-usuario/rposhop.git
cd rposhop
