import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ru } from 'vuetify/locale'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './styles.css'
import App from './App.vue'
import router from './router'
import { theme } from './theme'

const vuetify = createVuetify({
  components,
  directives,
  locale: { locale: 'ru', messages: { ru } },
  theme: { defaultTheme: 'bank', themes: { bank: theme } },
  defaults: {
    VBtn: { rounded: 'lg', class: 'text-none', elevation: 0 },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary', hideDetails: 'auto' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary', hideDetails: 'auto' },
    VCard: { rounded: 'lg', elevation: 0, border: true },
    VChip: { rounded: 'lg', size: 'small' }
  }
})

createApp(App).use(router).use(vuetify).mount('#app')
