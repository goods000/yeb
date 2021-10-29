<template>
	<div>
		<el-card class="admin-card" style="width:400px;">
			<div slot="header" class="clearfix">
		    <span>{{ admin.name }}</span>
			</div>
			<div>
			  <div class="img-container">
				<el-upload 
					action="/admin/userface"
					:headers="headers"
					:data="admin"
					:show-file-list="false"
					:on-success="onSuccess">
					<img title="点击修改用户头像" :src="admin.userFace" style="width: 100px;height: 100px;border-radius: 50px;" alt="">
				</el-upload>
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
				<el-button type="danger" @click="showUpdatePasswordView()">修改密码</el-button>
			</div>
		</el-card>
		<!-- 修改用户信息弹框 -->
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
		<!-- 修改密码弹框 -->
		<el-dialog
			title="更新密码"
			:visible.sync="passwordDialogVisible"
			width="40%">
			<div>
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				  <el-form-item label="旧密码" prop="oldPass">
				    <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
				  </el-form-item>
				  <el-form-item label="新密码" prop="pass">
				    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
				  </el-form-item>
				  <el-form-item label="确认密码" prop="checkPass">
				      <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
				    </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				    <el-button @click="resetForm('ruleForm')">重置</el-button>
				  </el-form-item>
				</el-form>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default{
		name: 'adminInfo',
		data(){
			// https://stackoverflow.com/questions/58087754/understanding-why-element-ui-event-handlers-are-triggering-rangeerror-maximum-c
			// elementUI输入框 Error in event handler for "el.form.blur": "RangeError: Maximum call stack size exceeded"(堆栈溢出)
			// 您将看到它们实现了自定义规则，setTimeout用于限制调用规则的次数。在您的情况下，只要该字段具有值（因此，if大小写为 false），您的else块就会一遍又一遍地执行，直到超过最大调用堆栈大小。您可以通过像这样限制对自定义规则的调用来解决此问题：
			var validatePass = (rule, value, callback) => {
				if (value === '') {
				  callback(new Error('请输入旧密码'));
				} 
				setTimeout(() => {
					if (this.ruleForm.oldPass !== '') {
						this.$refs.ruleForm.validateField('oldPass');
					}
					callback();
				}, 1000);
				// else {
				//   if (this.ruleForm.oldPass !== '') {
				//   	this.$refs.ruleForm.validateField('oldPass');
				//   }
				//   callback();
				// }
			};
			var validatePass1 = (rule, value, callback) => {
				if (value === '') {
				  callback(new Error('请输入新密码'));
				} 
				setTimeout(() => {
					if (this.ruleForm.pass !== '') {
						this.$refs.ruleForm.validateField('pass');
					}
					callback();
				}, 1000);
				// else {
				//   if (this.ruleForm.pass !== '') {
				// 	this.$refs.ruleForm.validateField('pass');
				//   }
				//   callback();
				// }
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
				  callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
				  callback(new Error('两次输入密码不一致!'));
				} else {
				  callback();
				}
			};
			return{
				admin:{},
				admin2:{},
				dialogVisible:false,
				passwordDialogVisible:false,
				ruleForm: {
					oldPass: '',
					pass: '',
					checkPass: '',
				},
				rules: {
				  oldPass: [
					{ validator: validatePass, trigger: 'blur' }
				  ],
				  pass: [
				  	{ validator: validatePass1, trigger: 'blur' }
				  ],
				  checkPass: [
					{ validator: validatePass2, trigger: 'blur' }
				  ],
				},
				headers: {
					Authorization: window.sessionStorage.getItem('tokenStr')
				}, //上传请求头
			};
		},
		mounted() {
			this.initAdmin();
		},
		methods:{
			onSuccess(){
				this.initAdmin();
			},
			// 修改密码
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// this.info = this.ruleForm;
						this.ruleForm.adminId = this.admin.id;
						console.log("进来了");
						this.putRequest('/admin-pass',this.ruleForm).then(resp => {
							if(resp){
								this.passwordDialogVisible = false;
								this.postRequest('/logout');
								window.sessionStorage.removeItem('user');
								window.sessionStorage.removeItem('tokenStr');
								this.$store.commit('initRoutes',[]);
								this.$router.replace('/');
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 打开修改密码弹框
			showUpdatePasswordView(){
				this.passwordDialogVisible = true;
			},
			// 修改用户信息
			updateAdminInfo(){
				this.putRequest('/admin-info',this.admin2).then(resp => {
					if(resp){
						this.dialogVisible = false;
						this.initAdmin();
					}
				})
			},
			// 打开修改用户信息弹框
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
