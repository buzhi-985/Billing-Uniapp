import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
import uView from 'uview-ui';
Vue.use(uView);
uni.$u.http.setConfig((config) => {
    /* config 为默认全局配置*/
    config.baseURL = `http://localhost:8080/`; /* 根域名 */
    // config.baseURL = `/api`; /* 根域名 */
	// config.header= { "Access-Control-Allow-Origin": '*'}
    return config
})
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif