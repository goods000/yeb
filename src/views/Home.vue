<template>
	<div>
		<el-container>
		  <el-header class="homeHeader">
				<div class="title">云E办</div>
				<div>
					<el-button icon="el-icon-bell" type="text" size="normal" style="color: black;margin-right: 8px;" @click="goChat"></el-button>
					<el-dropdown class="userInfo" @command="commandHeader">
						<span class="el-dropdown-link"  style="display: flex;align-items: center;">
						  {{ user.name }}<i><img :src="user.userFace" ></i>
						</span>
						<el-dropdown-menu slot="dropdown">
						  <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
						  <el-dropdown-item command="setting">设置</el-dropdown-item>
						  <el-dropdown-item command="logout">注销登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
		  </el-header>
		  <el-container>
		    <el-aside width="200px">
				<!-- <el-menu @select="menuClike"> -->
				<el-menu router unique-opened>
				    <el-submenu :index="index + ''" v-for="(item,index) in routes" :key="index" 
					v-if="!item.hidden">
				        <template slot="title">
							<i :class="item.iconCls" style="color: #409EFF;margin-right: 5px;"></i>
							<span>{{ item.name }}</span>
						</template>
				        <el-menu-item :index="children.path" v-for="(children,index) in item.children" :key="index">{{ children.name }}</el-menu-item>
					</el-submenu>		
				</el-menu>
			</el-aside>
		    <el-main>
				<el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path != '/home'">
				  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				  <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
				</el-breadcrumb>
				<div class="homeWelcome" v-if="this.$router.currentRoute.path == '/home'">
					欢迎来到云E办
				</div>
				<router-view class="homeRouterView"/>
			</el-main>
		  </el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return{
				user: JSON.parse(window.sessionStorage.getItem('user')),
			}
		},
		computed:{
			routes(){
				// return this.$router.options.routes;
				return this.$store.state.routes;
			}
		},
		methods:{
			// 在线聊天
			goChat(){
				this.$router.push('/chat');
			},
			// menuClike(index){
			// 	this.$router.push(index);
			// }
			commandHeader(command){
				if(command == "logout"){
					this.$confirm('此操作将注销登录, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
						// 注销登录
						this.postRequest('/logout');
						// 清空用户信息
						window.sessionStorage.removeItem('tokenStr');
						window.sessionStorage.removeItem('user');
						this.$router.replace('/');
						this.$store.commit('initRouter',[]);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消操作'
						});
					});
				}
			}
		},
	}
</script>

<style>
	.homeHeader{
		background: #409eff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
		box-sizing: border-box;
	}
	.homeHeader .title{
		font-size: 30px;
		font-family:"楷体";
		color: white;
	}
	.homeHeader .userInfo{
		cursor: pointer;
	}
	.el-dropdown-link img{
		width: 48px;
		height: 48px;
		border-radius: 24px;
		margin-left: 8px;
	}
	.homeWelcome{
		text-align: center;
		font-size: 30px;
		font-family: "楷体";
		color: #409eff;
		padding-top: 50px;
	}
	.homeRouterView{
		margin-top: 10px;
	}
</style>
