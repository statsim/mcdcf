import App from './App.vue'

// import '@fontsource/roboto/latin-100.css';
// import '@fontsource/roboto/latin-300.css';
// import '@fontsource/roboto/latin-400.css';
// import '@fontsource/roboto/latin-500.css';
// import '@fontsource/roboto/latin-700.css';
// import '@fontsource/roboto/latin-900.css';
// import '@mdi/font/css/materialdesignicons.css'

import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import {
  mdiContentCopy,
  mdiLightningBolt,
  mdiMenu,
  mdiPlus,
  mdiViewList,
  mdiViewModule,
  mdiChevronDown,
  mdiChevronUp,
  mdiLink,
  mdiDeleteOutline as mdiDelete,
  mdiArrowDownRight
} from '@mdi/js'

const customAliases = {
  // ...aliases,
  'mdi-content-copy': mdiContentCopy,
  'mdi-lightning-bolt': mdiLightningBolt,
  'mdi-menu': mdiMenu,
  'mdi-plus': mdiPlus,
  'mdi-view-list': mdiViewList,
  'mdi-view-module': mdiViewModule,
  'mdi-chevron-down': mdiChevronDown,
  'mdi-chevron-up': mdiChevronUp,
  'mdi-link': mdiLink,
  'mdi-delete': mdiDelete,
  'mdi-arrow-down-right': mdiArrowDownRight
}


import 'vuetify/styles'
import { createVInlineFields } from '@wdns/vuetify-inline-fields';

import { createVuetify } from 'vuetify'
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: customAliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
  },
  defaults: {
    VDataTable: {
      // Override the default expand/collapse icons
      expandIcon: '$mdi-chevron-down',
      expandedIcon: '$mdi-chevron-up',
    },
  },
})

const VInlineFields = createVInlineFields({
  // See Shared Props section for available options
});

import { createApp } from 'vue'
const app = createApp(App)
app.use(vuetify)
app.use(VInlineFields)

import VuetifyMoney from "vuetify-money";
app.use(VuetifyMoney);

app.mount('#app')

window.addEventListener('load', function () {
  const loader = document.getElementById('loader')
  if (loader) loader.style.display = 'none'
  const app = document.getElementById('app')
  if (app) app.style.display = 'block'
});