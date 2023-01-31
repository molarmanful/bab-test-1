import { createApp } from 'vue'
import '@unocss/reset/normalize.css'
import 'uno.css'
import './style.css'
import App from './App.vue'
import VueResizeObserver from 'vue-resize-observer'

let app = createApp(App)
app.use(VueResizeObserver)
app.mount('#app')
