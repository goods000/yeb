<template>
	<div>
		<div style="display: flex;justify-content: center;margin-top: 10px;">
			<el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-input-search" style="width: 400px;margin-right: 10px;"></el-input>
			<el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
		</div>
		<div class="admin-container">
			<el-card class="admin-card" v-for="(item,index) in  admins" :key="index">
			  <div slot="header" class="clearfix">
			    <span>{{ item.name }}</span>
			    <el-button style="float: right; padding: 3px 0;color: red;" type="text" icon="el-icon-delete" @click="deleteAdmin(item)"></el-button>
			  </div>
			  <div>
				  <div class="img-container">
					<img :src="item.userFace" :alt="item.name" :title="item.name" class="userFace-img">
				  </div>
			  </div>
			  <div class="userinfo-container">
			  	<div>用户名：{{ item.name }}</div>
			  	<div>手机号码：{{ item.phone }}</div>
			  	<div>电话号码：{{ item.telephone }}</div>
			  	<div>地址：{{ item.address }}</div>
			  	<div>用户状态：
					<el-switch
					  v-model="item.enabled"
					  active-color="#409EFF"
					  inactive-color="#ff4949"
					  active-text="启用"
					  inactive-text="禁用"
					  @change="enabledChange(item)">
					</el-switch>
				</div>
				<div>
					用户角色：
					<el-tag style="margin-right: 4px;" type="success" v-for="(role,indexj) in item.roles" :key="indexj">{{ role.nameZh }}</el-tag>
					<el-popover
					    placement="bottom"
					    title="角色列表"
					    width="200"
						@show="showPop(item)"
						@hide="hidePop(item)"
					    trigger="click">
						<el-select v-model="selectedRoles" multiple placeholder="请选择">
						    <el-option
						      v-for="(r,index) in addRoles"
						      :key="index"
						      :label="r.nameZh"
						      :value="r.id">
						    </el-option>
						  </el-select>
						<el-button slot="reference" type="text" icon="el-icon-more"></el-button>
					</el-popover>
				</div>
				<div>
					备注：{{ item.remark }}
				</div>
			  </div>
			</el-card>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'SysAdmin',
		data() {
			return{
				admins:[],
				keywords:'',
				addRoles:[],
				selectedRoles:[],
			}
		},
		mounted() {
			this.initAdmins();
		},
		methods:{
			// 更新操作员角色
			hidePop(admin){
				let role = [];
				Object.assign(roles,admin,roles);
				let flag = false;
				if(roles.legnth == this.selectedRoles.length){
					flag = true;
				}else{
					for(let i = 0;i<roles.length;i++){
						let role = roles[i];
						for(let j = 0;j<this.selectedRoles.length;j++){
							let sr = this.selectedRoles[j];
							if(role.id == sr){
								roles.splice(i,1);
								i--;
								break;
							}
						}
					}
					if(roles.length != 0){
						flag = true;
					}
				}
				
				if(flag){
					let url = '/admin/updaterole?adminId=' + admin.id;
					this.selectedRoles.forEach(sr => {
						url += '&rids=' + sr;
					})
					this.putRequest(url).then(resp => {
						if(resp){
							this.initAdmins();
						}
					})
				}
			},
			// 查看操作员角色
			showPop(admin){
				this.initAddRoles();
				let roles = admin.roles;
				this.selectedRoles = [];
				roles.forEach((r,index) => {
					this.selectedRoles.push(r.id);
				});
			},
			// 初始化角色
			initAddRoles(){
				this.getRequest('/admin/roles').then(resp => {
					if(resp){
						this.addRoles = resp;
					}
				})
			},
			// 更新用户
			enabledChange(admin){
				this.putRequest('/admin/update',admin).then(resp => {
					if(resp){
						this.initAdmins();
					}
				})
			},
			deleteAdmin(item){
				this.$confirm('此操作将永久删除该['+ item.name +'], 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							// this.deleteRequest('/admin/delete/' + item.id).then(resp => {
							this.deleteRequest('/admin/delete?id='+item.id).then(resp => {
								if(resp){
									this.initAdmins();
								}
							})
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			doSearch(){
				this.initAdmins();
			},
			initAdmins(){
				this.getRequest('/admin/list/?keywords='+ this.keywords).then(resp => {
					if(resp){
						this.admins = resp;
					}
				})
			}
		}
	}
</script>

<style>
	.admin-container{
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 10px;
	}
	.admin-card{
		width: 350px;
		margin-bottom: 20px;
	}
	.img-container{
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.userFace-img{
		width: 72px;
		height: 72px;
		border-radius: 72px;
	}
	.userinfo-container{
		font-size: 12px;
		color: #409eff;
	}
	.userinfo-container div{
		margin: 4px 0;
	}
</style>
