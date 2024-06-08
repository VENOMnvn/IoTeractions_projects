
import keepPreset from "keep-react/preset";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/keep-react/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [keepPreset],
};



module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#1679AB",
        secondary: "#074173",
        tertiary: "#5DEBD7",
        alter: "#2D9596",
      },
      fontFamily:{
        bhoomi : ["Montserrat", "sans-serif"]
      }
    },
  },
  plugins: [],
};
