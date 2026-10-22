import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'fretex',
    themes: {
      fretex: {
        dark: false,
        colors: {
          primary: '#4D7019',
          secondary: '#22300B',
          background: '#F3F6EC',
          surface: '#FFFFFF',
          success: '#344D0E',
          error: '#A63D2F',
          accent: '#76993D'
        }
      }
    }
  }
})

createApp(App).use(vuetify).mount('#app')
