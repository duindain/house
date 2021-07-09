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

//Replicate Vue.js 2 behaviour for PictureInput plugin
app.config.globalProperties.$on = (...args) => { emitter.on(...args); };
app.config.globalProperties.$once = (...args) => { emitter.once(...args); }
app.config.globalProperties.$off = (...args) => { emitter.off(...args); }
app.config.globalProperties.$emit = (...args) => { emitter.emit(...args); }

app.use(VueAxios, axios).mount('#app');

//Log all emitted messages to console
emitter.on('*', (type, e) => console.log(type, e));