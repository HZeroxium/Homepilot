module.exports = {
  content: ["./views/**/*.ejs", "./views/*.ejs"],
  theme: {
    extend: {
      colors: {
        primary: "#1A73E8", // Màu xanh dương tươi sáng
        secondary: "#34A853", // Màu xanh lá
        accent: "#FBBC05", // Màu vàng
        dark: "#202124", // Màu tối cho nền
        light: "#F1F3F4", // Màu sáng cho nền
      },
      fontFamily: {
        sans: ["Roboto", "Arial", "sans-serif"],
      },
    },
  },

  plugins: [],
};
