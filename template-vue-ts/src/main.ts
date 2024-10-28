import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'
import { createPinia } from 'pinia'
import { setupRouter } from './router'
import { setupStore } from './store'

import './styles/css/global.css'
import 'uno.css'

function setupApp() {
    const app = createApp(App)

    // Configure store
    setupStore(app)

    // vue custom directives
    setupDirectives(app)

    // Configure router
    setupRouter(app)
    // app.use(createPinia())
    app.mount('#app')
}

setupApp()
