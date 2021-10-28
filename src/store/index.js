import Vue from 'vue'
import Vuex from 'vuex'
import { getRequest } from '@/utils/api.js'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Notification } from 'element-ui';

Vue.use(Vuex)

const now = new Date();

const store = new Vuex.Store({
  state: {
	  routes: [],
	  sessions: {},
	  // sessions:[
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
	  // ],
	  admins:[],
	  currentAdmin:JSON.parse(window.sessionStorage.getItem('user')),
	  // currentAdmin:null,
	  currentSession:null,
	  filterKey:'',
	  stomp:null,
	  idDot:{},
  },
  mutations: {
	 //  INIT_CURRENTADMIN(state,admin){
		// state.currentAdmin = admin;  
	 //  },
	 INIT_ADMIN(state,admin){
		 state.currentAdmin = admin;
	 },
	  initRoutes(state,data){
		  state.routes = data;
	  },
	  changeCurrentSession (state,currentSession) {
	  	state.currentSession = currentSession;
		// 点击用户的时候红色小点点标记消失
		Vue.set(state.idDot,state.currentAdmin.username+'#'+state.currentSession.username,false);
	  },
	  // 消息发送
	  addMessage (state,msg) {
	  	let mss = state.sessions[state.currentAdmin.username+'#'+msg.to];
		if(!mss){
			// state.sessions[state.currentAdmin.username+'#'+msg.to] = [];
			Vue.set(state.sessions,state.currentAdmin.username+'#'+msg.to,[]);
		}
		state.sessions[state.currentAdmin.username+'#'+msg.to].push({
	  		content:msg.content,
	  		date: new Date(),
	  		self:!msg.notSelf
	  	})
	  },
	  INIT_DATA (state) {
	  	// 浏览器本地的历史聊天记录
	    let data = localStorage.getItem('vue-chat-session');
	    //console.log(data)
	    if (data) {
	      state.sessions = JSON.parse(data);
	    }
	  },
	  INIT_ADMINS(state, data){
	  	state.admins = data;
	  }
  },
  actions: {
	  // 消息接受
	  connect(context){
		  context.state.stomp = Stomp.over(new SockJS('/ws/ep', null, { timeout: 15000}));
		  // context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
		  let token = window.sessionStorage.getItem('tokenStr');
		  context.state.stomp.connect({'Auth-token':token},success => {
			  context.state.stomp.subscribe('/user/queue/chat',msg => {
				  console.log('接受的信息',msg.body);
				  let receiveMsg = JSON.parse(msg.body);
				  if(!context.state.currentSession || receiveMsg.from !=context.state.currentSession.username ){
					  Notification.info({
						  title:'['+ receiveMsg.formNickName +']发来一条消息',
						  message: receiveMsg.content.length>10 ? receiveMsg.content.substr(0,10) : receiveMsg.content,
						  position:'bottom-right'
					  })
					  Vue.set(context.state.idDot,context.state.currentAdmin.username+'#'+receiveMsg.from,true);
				  }
				  receiveMsg.notSelf = true;
				  receiveMsg.to = receiveMsg.from;
				  content.commit('addMessage', receiveMsg);
			  })
		  },error => {
			  
		  })
	  },
	  initData (context) {
		  context.commit('INIT_ADMINS');
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
