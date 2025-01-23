module.exports = {
  content: ["./src/**/*.{html,ts}"], // Incluye todos los archivos donde usarás Tailwind
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "transparent", // Cambia el borde predeterminado a transparente
      },
      colors: {
        primary: "#14213d", // Azul oscuro para bordes y fondos
        accent: "#fca311", // Naranja para detalles
        bgLight: "#e5e5e5", // Gris claro para fondos
        textDark: "#000000", // Negro para texto
        white: "#ffffff", // Blanco para fondos
      },
    },
  },
  plugins: [],
};
