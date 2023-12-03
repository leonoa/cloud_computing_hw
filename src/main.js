import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import axios from "axios";
import router from './router';
const app = createApp(App);
app.use(Antd);
app.config.globalProperties.$axios = axios;
app.use(router);
app.mount('#app');

