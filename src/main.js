import '@babel/polyfill'
import 'mutationobserver-shim'
import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import mitt from 'mitt';

const emitter = mitt();

var app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.use(VueAxios, axios).mount('#app');

emitter.on('*', (type, e) => console.log(type, e));