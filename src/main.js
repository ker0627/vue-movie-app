import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import loadImage from './plugins/loadImage'
// import store from './store/index.js' index.js 파일은 생략 가능

createApp(App)
  .use(router) //플러그인 연결
  .use(store) //플러그인 연결
  .use(loadImage) //플러그인 연결
  .mount('#app')