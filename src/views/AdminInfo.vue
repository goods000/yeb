<template>
	<div>
		<el-card class="admin-card" style="width:400px;">
			<div slot="header" class="clearfix">
		    <span>{{ admin.name }}</span>
			</div>
			<div>
			  <div class="img-container">
			  	<img title="点击修改用户头像" :src="admin.userFace" style="width: 100px;height: 100px;border-radius: 50px;" alt="">
			  </div>
			</div>
			<div class="userinfo-container">
			  <div>电话号码：<el-tag>{{admin.telephone}}</el-tag></div>
			  <div>手机号码：<el-tag>{{admin.phone}}</el-tag></div>
			  <div>居住地址：<el-tag>{{admin.address}}</el-tag></div>
			  <div>用户标签：<el-tag type="success" v-for="(item,index) in admin.roles" :key="index">{{item.nameZh}}</el-tag></div>
			</div>
			<!-- <div class="userinfo-container">
				<div>用户状态：
					<el-switch
					  v-model="admin.enabled"
					  active-color="#409EFF"
					  inactive-color="#ff4949"
					  active-text="启用"
					  inactive-text="禁用"
					  @change="enabledChange(admin)">
					</el-switch>
				</div>
			</div> -->
			<div class="userinfo-button">
				<el-button type="primary" @click="showUpdateAdminInfoView()">修改信息</el-button>
				<el-button type="danger">修改密码</el-button>
			</div>
		</el-card>
		<el-dialog
			title="编辑用户信息"
			:visible.sync="dialogVisible"
			width="30%">
			<div>
				<table>
					<tr>
						<td>用户昵称：</td>
						<td><el-input v-model="admin2.name"></el-input></td>
					</tr>
					<tr>
						<td>电话号码：</td>
						<td><el-input v-model="admin2.telephone"></el-input></td>
					</tr>
					<tr>
						<td>手机号码：</td>
						<td><el-input v-model="admin2.phone"></el-input></td>
					</tr>
					<tr>
						<td>居住地址：</td>
						<td><el-input v-model="admin2.address"></el-input></td>
					</tr>
				</table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateAdminInfo()">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default{
		name: 'adminInfo',
		data(){
			return{
				admin:{},
				admin2:{},
				dialogVisible:false,
			}
		},
		mounted() {
			this.initAdmin();
		},
		methods:{
			// 修改用户信息
			updateAdminInfo(){
				this.putRequest('/admin-info',this.admin2).then(resp => {
					if(resp){
						this.dialogVisible = false;
						this.initAdmin();
					}
				})
			},
			// 打开弹框
			showUpdateAdminInfoView(){
				this.dialogVisible = true;
			},
			// 获取当前登录用户的信息
			initAdmin(){
				this.getRequest('/admin/info').then(resp => {
					if(resp){
						this.admin = resp;
						this.admin2 = Object.assign({},this.admin);
						window.sessionStorage.setItem('user',JSON.stringify(resp));
						this.$store.commit('INIT_ADMIN',resp);
					}
				})
			}
		}
	}
</script>

<style>
	.img-container{
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.userinfo-container{
		font-size: 12px;
		color: #409eff;
	}
	.userinfo-container div{
		margin: 4px 0;
	}
	.userinfo-button{
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 6px;
	}
</style>
