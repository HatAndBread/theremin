import './app.css'
import App from './App.svelte'

document.getElementById("start").remove()
const app = new App({
  target: document.getElementById('app'),
})

export default app
