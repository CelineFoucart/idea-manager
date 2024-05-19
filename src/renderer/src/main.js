import './assets/main.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'toastify-js/src/toastify.css';
import 'floating-vue/dist/style.css';
import FloatingVue from 'floating-vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(FloatingVue).mount('#app');
