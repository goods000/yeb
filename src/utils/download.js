import axios from "axios"

// 让axios自带默认类型  流
const service = axios.create({
	responseType: 'arraybuffer'
})

// 请求拦截器
service.interceptors.request.use(config => {
	config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
	return config;
}, error => {
	console.log(error);
})

// 响应拦截器
service.interceptors.response.use(resp => {
	// 获取响应的头部信息
	const headers = resp.headers;
	// 定义正则表达式（判断头部请求是不是返回的这个类型）
	let reg = RegExp(/application\/json/);
	if(headers['content-type'].match(reg)){
		resp.data =  unitToString(resp.data);
	}else{
		// 返回JSON流
		let fileDownload = require('js-file-download');
		let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
		let contentType = headers['content-type'];
		// 格式转换，防止乱码
		fileName = decodeURIComponent(fileName);
		console.log("resp.data：",resp.data,'---fileName：',fileName,'---contentType：',contentType);
		fileDownload(resp.data, fileName, contentType);
 	}
}, error => {
	console.log(error);
})

// JSON格式的转换
function unitToString(unitArray){
	// 编码
	let encodedString = String.fromCharCode.apply(null,new Unit8Array(unitArray));
	// 解码
	let decodedString = decodeURIComponent(escape(encodedString));
	return JSON.parse(decodedString);
}

// 定义请求
let base = '';
 
export const downloadRequest = (url,params) => {
	console.log(url,'----',params)
	return service({
		method: 'get',
		url: `${base}${url}`,
		data: params
	})
}

export default service;