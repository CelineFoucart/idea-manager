import './assets/main.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(router).mount('#app');
