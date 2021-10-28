let proxyObj = {}

proxyObj['/'] = {
	// websocket
	wx:false,
	// 目标地址(后端地址)
	target:'http://dongeast.top:8181',
	// 发送请求头host会被设置target
	changeOrigin: true,
	
	pathReWrite:{
		'^/':'/'
	}
};

// WebSocket代理 (需要下载两个js ---  npm install sockjs-client / npm install stompjs  ---)
proxyObj['/wx'] = {
	ws:true,
	target:'ws://localhost:8081'
};

module.exports = {
	devServer: {
		host:'localhost',
		port:8081,
		proxy:proxyObj
	}
}





