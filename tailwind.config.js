module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    borderWidth: {
      1: "1px",
    },
    borderColor: {
      DEFAULT: "#000",
    },
    minHeight: {
      36: "9rem",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
