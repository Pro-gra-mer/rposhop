# 🛍️ RPOShop - Tienda Online de Ropa Deportiva  

![RPOShop Banner]([https://your-image-url.com/banner.png](https://res.cloudinary.com/dl7on9tjj/image/upload/v1739382135/Captura_de_pantalla_364_wmfniy.png))  

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
