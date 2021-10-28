import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';


import { postRequest } from '@/utils/api.js';
import { getRequest } from '@/utils/api.js';
import { putRequest } from '@/utils/api.js';
import { deleteRequest } from '@/utils/api.js';
import { initMenu } from '@/utils/menus.js';
import { downloadRequest } from '@/utils/download.js';

Vue.config.productionTip = false
// 使用element
Vue.use(ElementUI, {size: 'small'});
// 插件形式使用请求
Vue.prototype.postRequest = postRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.downloadRequest = downloadRequest

router.beforeEach((to, from, next) => {
	if(window.sessionStorage.getItem('tokenStr')){
		initMenu(router,store);
		if(!window.sessionStorage.getItem('user')){
			// 判断用户信息是否存在
			return getRequest('/admin/info').then( resp => {
				if(resp){
					// 存入用户信息
					window.sessionStorage.setItem('user',JSON.stringify(resp));
					// 存入用户信息
					// store.commit('INIT_CURRENTADMIN',resp);
					store.commit('INIT_ADMIN',resp);
					next();
				}
			})
		}
		next();
	}else{
		if(to.path == '/'){
			next();
		}else{
			next('/?redirect=' + to.path);
		}
	}
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
