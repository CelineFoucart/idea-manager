import './assets/main.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'toastify-js/src/toastify.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount('#app');
