import daisyui from "daisyui";
export default {
  plugins: [daisyui],
    theme: {
    extend: {},
  },
  content: ["./index.html",'./src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  daisyui: {
    themes: ["cyberpunk", "cupcake", "emerald", "valentine", "forest", "dracula", "acid"],
  },
  darkMode: false, // or 'media' or 'class'
}