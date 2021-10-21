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
}


module.exports = {
	devServer: {
		host:'localhost',
		port:8081,
		proxy:proxyObj
	}
}





