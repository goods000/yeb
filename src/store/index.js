import Vue from 'vue'
import Vuex from 'vuex'
import { getRequest } from '@/utils/api.js'

Vue.use(Vuex)

const now = new Date();

const store = new Vuex.Store({
  state: {
	  routes: [],
	  sessions:[
		 //  {
	  // 	id:1,
	  // 	user:{
	  // 		name:'示例介绍',
	  // 		img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202001%2F18%2F20200118124251_tdbgd.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1637829749&t=5391c82151d63bcec7d2007aed6b2e18'
	  // 	},
	  // 	messages:[{
	  // 		content:'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
	  // 		date:now
	  // 	},{
	  // 		content:'项目地址(原作者): https://github.com/coffcer/vue-chat',
	  // 		date:now
	  // 	},{
	  // 		content:'本项目地址(重构): https://github.com/is-liyiwei',
	  // 		date:now
	  // 	}]
	  // },{
	  // 	id:2,
	  // 	user:{
	  // 		name:'webpack',
	  // 		img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_360_360%2F5a%2Fda%2F59%2F5ada5977ec71ae3377488c551108c9c5.jpeg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1637829794&t=013cdc5f9808abcbd649dd3a6438b7ab'
	  // 	},
	  // 	messages:[{
	  // 		content:'Hi，我是webpack哦',
	  // 		date:now
	  // 	}]
	  // },
	  ],
	  admins:[],
	  currentSessionId:-1,
	  filterKey:''
  },
  mutations: {
	  initRoutes(state,data){
		  state.routes = data;
	  },
	  changeCurrentSessionId (state,id) {
	  	state.currentSessionId = id;
	  },
	  addMessage (state,msg) {
	  	state.sessions[state.currentSessionId-1].messages.push({
	  		content:msg,
	  		date: new Date(),
	  		self:true
	  	})
	  },
	  INIT_DATA (state) {
	  	// 浏览器本地的历史聊天记录
	    // let data = localStorage.getItem('vue-chat-session');
	    // //console.log(data)
	    // if (data) {
	    //   state.sessions = JSON.parse(data);
	    // }
	  },
	  INIT_ADMINS(state, data){
	  	state.admins = data;
	  }
  },
  actions: {
	  initData (context) {
		getRequest('/chat/admin').then(resp => {
	   			if(resp){
	   				context.commit('INIT_ADMINS',resp);
	   			}
	   		})
		// context.commit('INIT_DATA')
	  }
  },
  modules: {
  }
})

store.watch(function (state) {
  return state.sessions
},function (val) {
  console.log('CHANGE: ', val);
  localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
  deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;
