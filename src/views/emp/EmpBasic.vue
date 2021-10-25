<template>
	<div>
		<div>
			<div style="display: flex;justify-content: space-between;">
				<div>
					<el-input style="width:300px;margin-right: 10px;" prefix-icon="el-icon-search" placeholder="请输入员工名进行搜索..."  clearable
					 v-model="empName" @keydown.enter.native="initEmps()" :disabled="showAdvanceSearchVisible" @clear="initEmps()"></el-input>
					<el-button type="primary" icon="el-icon-search" :disabled="showAdvanceSearchVisible" @click="initEmps()">搜索</el-button>
					<el-button type="primary" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible">
						<i :class="showAdvanceSearchVisible ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'" aria-hidden="true"></i>
						高级搜索
					</el-button>
				</div>
				<div>
					<el-upload
						style="display: inline-flex;margin-right: 10px;"
						:show-file-list="false"
						:before-upload="beforeUpload"
						:on-error="onError"
						:on-success="onSuccess"
						:disabled="importDataDisabled"
						:headers="headers"
						:data="{'multipartFile':multipartFile}"
						action="/employee/basic/import">
					  <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled">
					  	{{ importDataBtnText }}
					  </el-button>
					</el-upload>
					<el-button @click="exportData" type="success" icon="el-icon-download">
						导出数据
					</el-button>
					<el-button type="primary" class="el-icon-plus" @click="showAddEmpView">添加员工</el-button>
				</div>
			</div>
		</div>
		<transition name="slide-fade">
			<div style="border: 1px solid #409eff;border-radius: 5px;padding: 5px;box-sizing: border-box;margin: 10px 0;" v-show="showAdvanceSearchVisible">
				<el-row>
					<el-col :span="5">
						政治面貌:
						<el-select v-model="searchValue.politicId" size="mini" style="width: 130px;" placeholder="请选择">
							<el-option
							v-for="item in politicsstatus"
							:key="item.id"
							:label="item.name"
							:value="item.id"></el-option>
						</el-select>
					</el-col>
					<el-col :span="4">
						民族:
						<el-select v-model="searchValue.nationId" size="mini" style="width: 130px;" placeholder="请选择">
							<el-option
							v-for="item in nations"
							:key="item.id"
							:label="item.name"
							:value="item.id"></el-option>
						</el-select>
					</el-col>
					<el-col :span="4">
						职位:
						<el-select v-model="searchValue.posId" size="mini" style="width: 130px;" placeholder="请选择">
							<el-option
							v-for="item in positions"
							:key="item.id"
							:label="item.name"
							:value="item.id"></el-option>
						</el-select>
					</el-col>
					<el-col :span="4">
						职称:
						<el-select v-model="searchValue.jobLevelId" size="mini" style="width: 130px;" placeholder="请选择">
							<el-option
							v-for="item in jobLevels"
							:key="item.id"
							:label="item.name"
							:value="item.id"></el-option>
						</el-select>
					</el-col>
					<el-col :span="7">
						聘用形式:
						<el-radio-group v-model="searchValue.engageForm">
							<el-radio label="劳动合同">劳动合同</el-radio>
							<el-radio label="劳务合同">劳务合同</el-radio>
						</el-radio-group>
					</el-col>
				</el-row>
				<el-row style="margin-top: 10px;">
					<el-col :span="5">
						所属部门:
						<el-popover
							placement="bottom"
							title="请选择所属部门"
							width="200"
							trigger="manual"
							v-model="visible2">
							<el-tree :data="allDeps" :props="defaultProps" default-expand-all @node-click="searchHandleNodeClick"></el-tree>
							<div slot="reference" 
								style="width: 130px;display: inline-flex;border: 1px solid #dedede;height: 24px;padding-left: 15px;border-radius: 4px;cursor: pointer;
								align-items: center;box-sizing: border-box;"
								@click="showDepView2">
								{{ inputDepName }}
							</div>
						  </el-popover>
					</el-col>
					<el-col :span="10">
						入职日期:
						<el-date-picker
							v-model="searchValue.beginDateScope"
							size="mini"
							type="daterange"
							value-format="yyyy-MM-dd"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
							</el-date-picker>
					</el-col>
					<el-col :span="5" :offset="4">
						<el-button size="mini">取消</el-button>
						<el-button type="primary" size="mini" icon="el-icon-search" @click="initEmps('advanced')">搜索</el-button>
					</el-col>
				</el-row>
			</div>
		</transition>
		<div style="margin-top: 10px;">
			<el-table
			  :data="emps"
			  stripe border
			  v-loading="loading"
			  element-loading-text="拼命加载中"
			  element-loading-spinner="el-icon-loading"
			  element-loading-background="rgba(0, 0, 0, 0.8)"
			  style="width: 100%">
			  <el-table-column
			    type="selection"
			  	width="55">
			  </el-table-column>
			  <el-table-column
				prop="name"
				label="姓名"
				fixed
				align="left"
				width="90">
			  </el-table-column>
			  <el-table-column
				prop="workID"
				label="工号"
				width="85">
			  </el-table-column>
			  <el-table-column
				prop="gender"
				label="性别"
				align="center"
				width="50">
			  </el-table-column>
			  <el-table-column
				prop="birthday"
				label="出生日期"
				align="left"
				width="95">
			  </el-table-column>
			  <el-table-column
				prop="idCard"
				label="身份证号码"
				align="left"
				width="150">
			  </el-table-column>
			  <el-table-column
				prop="wedlock"
				label="婚姻状况"
				align="center"
				width="78">
			  </el-table-column>
			  <el-table-column
				prop="nation.name"
				label="民族"
				align="left"
				width="50">
			  </el-table-column>
			  <el-table-column
				prop="nativePlace"
				label="籍贯"
				align="left"
				width="80">
			  </el-table-column>
			  <el-table-column
				prop="politicsStatus.name"
				label="政治面貌"
				align="left"
				width="100">
			  </el-table-column>
			  <el-table-column
				prop="email"
				label="电子邮件"
				align="left"
				width="160">
			  </el-table-column>
			  <el-table-column
				prop="phone"
				label="电话号码"
				align="left"
				width="100">
			  </el-table-column>
			  <el-table-column
				prop="address"
				label="联系地址"
				align="left"
				width="270">
			  </el-table-column>
			  <el-table-column
				prop="department.name"
				label="所属部门"
				align="left"
				width="100">
			  </el-table-column>
			  <el-table-column
				prop="joblevel.name"
				label="职称"
				width="100">
			  </el-table-column>
			  <el-table-column
				prop="position.name"
				label="职位"
				width="100">
			  </el-table-column>
			  <el-table-column
				prop="engageForm"
				label="聘用形式"
				align="left"
				width="100">
			  </el-table-column>
			  <el-table-column
				prop="tiptopDegree"
				label="最高学历"
				align="left"
				width="80">
			  </el-table-column>
			  <el-table-column
				prop="school"
				label="毕业学校"
				align="left"
				width="150">
			  </el-table-column>
			  <el-table-column
				prop="specialty"
				label="专业"
				align="left"
				width="150">
			  </el-table-column>
			  <el-table-column
				prop="workState"
				label="在职状态"
				align="left"
				width="70">
			  </el-table-column>
			  <el-table-column
				prop="beginDate"
				label="入职日期"
				align="left"
				width="95">
			  </el-table-column>
			  <el-table-column
				prop="conversionTime"
				label="转正日期"
				align="left"
				width="95">
			  </el-table-column>
			  <el-table-column
				prop="beginContract"
				label="合同起始日期"
				align="left"
				width="95">
			  </el-table-column>
			  <el-table-column
				prop="contractTerm"
				label="合同期限"
				align="left"
				width="100">
				<template slot-scope="scope">
					<el-tag>{{ scope.row.contractTerm }}</el-tag>年
				</template>
			  </el-table-column>
			  <el-table-column
				label="操作"
				fixed="right"
				width="200">
				<template slot-scope="scope">
					<el-button style="padding: 3px;" size="mini" @click="showEditDmpView(scope.row)">编辑</el-button>
					<el-button style="padding: 3px;" size="mini" type="primary">查看高级资料</el-button>
					<el-button style="padding: 3px;" size="mini" type="danger" @click="deleteEmp(scope.row)">删除</el-button>
				</template>
			  </el-table-column>
			</el-table>
			<div style="display: flex;flex-direction: row;justify-content: flex-end;">
				<el-pagination
					background
					@current-change="currentChange"
					@size-change="sizeChange"
					layout="sizes, prev, pager, next, jumper, ->, total"
					:total="total">
				</el-pagination>
			</div>
		</div>
		<el-dialog
		  :title="title"
		  :visible.sync="dialogVisible"
		  width="90%">
		  <div>
			  <!-- Cannot read properties of undefined (reading 'validate')ref前面不需要冒号 -->
			<el-form ref="empForm" :model="emp" :rules="rules">
				<el-row>
					<el-col :span="6">
						<el-form-item label="姓名:" prop="name">
							<el-input size="mini" style="width: 150px;" v-model="emp.name" placeholder="请输入员工姓名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="性别:" prop="gender">
							<el-radio-group v-model="emp.gender" style="margin-top: 10px;">
								<el-radio label="男">男</el-radio>
								<el-radio label="女">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="出生日期:" prop="birthday">
							<el-date-picker v-model="emp.birthday" type="date" size="mini" style="width: 150px;" placeholder="出生日期"
							value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="政治面貌:" prop="politicId">
							<el-select v-model="emp.politicId" size="mini" style="width: 150px;" placeholder="请选择">
								<el-option
								v-for="item in politicsstatus"
							    :key="item.id"
							    :label="item.name"
							    :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<el-form-item label="民族:" prop="nationId">
							<el-select v-model="emp.nationId" size="mini" style="width: 150px;" placeholder="请选择">
								<el-option
								v-for="item in nations"
							    :key="item.id"
							    :label="item.name"
							    :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="籍贯:" prop="nativePlace">
							<el-input v-model="emp.nativePlace" size="mini" style="width: 150px;" placeholder="请输入籍贯" prefix-icon="el-icon-edit"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="电子邮箱:" prop="email">
							<el-input v-model="emp.email" size="mini" style="width: 150px;" placeholder="请输入电子邮箱" prefix-icon="el-icon-message"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="联系地址:" prop="address">
							<el-input v-model="emp.address" size="mini" style="width: 150px;" placeholder="请输入联系地址" prefix-icon="el-icon-edit"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<el-form-item label="职位:" prop="posId">
							<el-select v-model="emp.posId" size="mini" style="width: 150px;" placeholder="请选择">
								<el-option
								v-for="item in positions"
							    :key="item.id"
							    :label="item.name"
							    :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="职称:" prop="jobLevelId">
							<el-select v-model="emp.jobLevelId" size="mini" style="width: 150px;" placeholder="请选择">
								<el-option
								v-for="item in jobLevels"
							    :key="item.id"
							    :label="item.name"
							    :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="所属部门:" prop="departmentId">
							<el-popover
							    placement="bottom"
							    title="请选择所属部门"
							    width="200"
							    trigger="manual"
							    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
							    v-model="visible">
								<el-tree :data="allDeps" node-key="id" :props="defaultProps" default-expand-all @node-click="handleNodeClick"></el-tree>
								<div slot="reference" 
									style="width: 150px;display: inline-flex;border: 1px solid #dedede;height: 24px;padding-left: 15px;border-radius: 4px;cursor: pointer;
									align-items: center;box-sizing: border-box;"
									@click="showDepView">
									{{ inputDepName }}
								</div>
							  </el-popover>
							<!-- <el-input v-model="emp.departmentId" size="mini" style="width: 150px;display: inline-flex;" placeholder="请输入部门" prefix-icon="el-icon-edit"></el-input> -->
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="电话号码:" prop="phone">
							<el-input v-model="emp.phone" size="mini" style="width: 150px;" placeholder="请输入电话号码" prefix-icon="el-icon-phone"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<el-form-item label="工号:" prop="workID">
							<el-input v-model="emp.workID" size="mini" style="width: 150px;" placeholder="请选择" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="学历:" prop="tiptopDegree">
							<el-select v-model="emp.tiptopDegree" size="mini" style="width: 150px;" placeholder="学历">
								<el-option
								v-for="item in tiptopDegrees"
							    :key="item"
							    :label="item"
							    :value="item"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="毕业院校:" prop="school">
							<el-input v-model="emp.school" size="mini" style="width: 150px;" placeholder="请输入毕业院校" prefix-icon="el-icon-edit"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="专业名称:" prop="specialty">
							<el-input v-model="emp.specialty" size="mini" style="width: 150px;" placeholder="请输入专业名称" prefix-icon="el-icon-phone"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<el-form-item label="入职日期:" prop="beginDate">
							<el-date-picker v-model="emp.beginDate" type="date" size="mini" style="width: 120px;" placeholder="入职日期"
							value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="转正日期:" prop="conversionTime">
							<el-date-picker v-model="emp.conversionTime" type="date" size="mini" style="width: 120px;" placeholder="转正日期"
							value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="合同起止日期:" prop="beginContract">
							<el-date-picker v-model="emp.beginContract" type="date" size="mini" style="width: 125px;" placeholder="合同起止日期:"
							value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="合同截止日期:" prop="endContract">
							<el-date-picker v-model="emp.endContract" type="date" size="mini" style="width: 125px;" placeholder="合同截止日期"
							value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="身份证号码:" prop="idCard">
							<el-input v-model="emp.idCard" size="mini" style="width: 170px;" placeholder="请输入身份证号码" prefix-icon="el-icon-edit"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="聘用形式:" prop="engageForm">
							<el-radio-group v-model="emp.engageForm" style="margin-top: 10px;">
								<el-radio label="劳动合同">劳动合同</el-radio>
								<el-radio label="劳务合同">劳务合同</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="婚姻状况:" prop="wedlock">
							<el-radio-group v-model="emp.wedlock" style="margin-top: 10px;">
								<el-radio label="已婚">已婚</el-radio>
								<el-radio label="未婚">未婚</el-radio>
								<el-radio label="离异">离异</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="doAddEmp()">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'EmpBasic',
		data() {
			return{
				emps:[],
				loading: false,
				total:0,
				currentPage: 1,
				size: 10,
				empName:'',
				dialogVisible: false,
				nations:[], // 民族
				jobLevels:[], // 职称
				politicsstatus:[], // 政治面貌
				positions:[], // 职位
				tiptopDegrees:['博士', '硕士', '本科', '大专', '高中', '初中', '小学', '其他', ], // 学历
				visible: false,
				visible2: false,
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				allDeps:[], // 所属部门 
				inputDepName:'',
				emp:{
					id:null,
					name: '',
					gender: '',
					birthday: '',
					idCard: '',
					wedlock: '',
					nationId: null,
					nativePlace: '',
					politicId: null,
					email: '',
					phone: '',
					address: '',
					departmentId: null,
					jobLevelId: null,
					posId: null,
					engageForm: '',
					tiptopDegree: '',
					specialty: '',
					school: '',
					beginDate: '',
					workState: '在职', //在职 离职
					workID: '',
					contractTerm: null,
					conversionTime: '',
					notWorkDate: null,
					beginContract: '',
					endContract: '',
					workAge: null,
					salaryId: null,
				},
				empForm:{},
				rules:{
					name:[{required:true,message:'请输入员工姓名',trigger:'blur'}],
					gender:[{required:true,message:'请输入员工性别',trigger:'blur'}],
					birthday:[{required:true,message:'请输入出生日期',trigger:'blur'}],
					idCard:[{required:true,message:'请输入身份证号码',trigger:'blur'},
					{pattern:/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
					message:'身份证号码不正确',trigger:'blur'}],
					wedlock:[{required:true,message:'请输入婚姻状况',trigger:'blur'}],
					nationId:[{required:true,message:'请输入民族',trigger:'blur'}],
					nativePlace:[{required:true,message:'请输入籍贯',trigger:'blur'}],
					politicId:[{required:true,message:'请输入政治面貌',trigger:'blur'}],
					email:[{required:true,message:'请输入邮箱地址',trigger:'blur'},
					{type:'email',message:'邮箱地址格式不正确',trigger:'blur'}],
					phone:[{required:true,message:'请输入电话号码',trigger:'blur'}],
					address:[{required:true,message:'请输入联系地址',trigger:'blur'}],
					departmentId:[{required:true,message:'请输入部门名称',trigger:'blur'}],
					jobLevelId:[{required:true,message:'请输入职称',trigger:'blur'}],
					posId:[{required:true,message:'请输入职位',trigger:'blur'}],
					engageForm:[{required:true,message:'请输入聘用形式',trigger:'blur'}],
					tiptopDegree:[{required:true,message:'请输入学历',trigger:'blur'}],
					specialty:[{required:true,message:'请输入专业',trigger:'blur'}],
					school:[{required:true,message:'请输入毕业院校',trigger:'blur'}],
					beginDate:[{required:true,message:'请输入入职日期',trigger:'blur'}],
					workState:[{required:true,message:'请输入工作状态',trigger:'blur'}],
					workID:[{required:true,message:'请输入工号',trigger:'blur'}],
					contractTerm:[{required:true,message:'请输入合同期限',trigger:'blur'}],
					conversionTime:[{required:true,message:'请输入转正日期',trigger:'blur'}],
					notWordDate:[{required:true,message:'请输入离职日期',trigger:'blur'}],
					beginContract:[{required:true,message:'请输入合同起始日期',trigger:'blur'}],
					endContract:[{required:true,message:'请输入合同结束日期',trigger:'blur'}],
					workAge:[{required:true,message:'请输入工龄',trigger:'blur'}],
				},
				title:'',
				importDataBtnText: '导入数据',
				importDataBtnIcon: 'el-icon-upload2',
				importDataDisabled: false,
				headers: {
					Authorization: window.sessionStorage.getItem('tokenStr')
				}, //上传请求头
				multipartFile:'',
				showAdvanceSearchVisible: false, // 高级搜索
				searchValue:{
					nationId: null, // 政治面貌
					politicId: null, // 民族
					posId: null,  // 职位
					jobLevelId: null, // 职称
					engageForm: '',  // 聘用形式
					departmentId: null, // 所属部门
					beginDateScope: null,
				}
			}
		},
		mounted() {
			this.initEmps();
			this.initData();
			this.initPositions(); // 职位
		},
		methods:{
			onError(){
				this.importDataBtnText = '导入数据';
				this.importDataBtnIcon = 'el-icon-upload2';
				this.importDataDisabled = false;
			},
			onSuccess(){
				this.importDataBtnText = '导入数据';
				this.importDataBtnIcon = 'el-icon-upload2';
				this.initEmps();
				this.importDataDisabled = false;
			},
			// 导入数据
			beforeUpload(file){
				// const formdata = new FormData()
				// formdata.append('multipartFile', file)
				// this.multipartFile = file;
				// console.log("导入数据：",file,this.multipartFile);
				// this.$set(this.multipartFile,0, file);
				this.importDataBtnText = '正在导入';
				this.importDataBtnIcon = 'el-icon-loading';
				this.importDataDisabled = true;
			},
			// 导出数据
			exportData(){
				this.downloadRequest('/employee/basic/export');
			},
			// 编辑员工
			showEditDmpView(data){
				this.title = '编辑员工信息';
				this.emp = data;
				this.inputDepName = data.department.name;
				this.initPositions(); // 职位
				this.dialogVisible = true;
			},
			// 删除员工
			deleteEmp(data){
				this.$confirm('此操作将永久删除['+ data.name +']员工, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest('/employee/basic/delete/'+ data.id).then(resp => {
						if(resp){
							this.initEmps();
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				}); 
			},
			// 添加员工弹框确认按钮
			doAddEmp(){
				if(this.emp.id){
					// 员工id存在就是编辑员工信息
					this.$refs.empForm.validate((valid) => {
					// this.$refs['empForm'].validate(valid => {
						if(valid){
							this.putRequest('/employee/basic/update',this.emp).then(resp => {
								if(resp){
									this.dialogVisible = false;
									this.initEmps();
								}
							})
						}
					})
				}else{
					// 添加员工
					this.$refs.empForm.validate((valid) => {
					// this.$refs['empForm'].validate(valid => {
						if(valid){
							this.postRequest('/employee/basic/addEmp',this.emp).then(resp => {
								if(resp){
									this.dialogVisible = false;
									this.initEmps();
								}
							})
						}
					})
				}
			},
			// 高级搜索里面的所属部门弹框
			searchHandleNodeClick(data){
				console.log(111,data);
				this.inputDepName = data.name;
				this.searchValue.departmentId = data.id;
				this.visible2 = !this.visible2;
			},
			handleNodeClick(data){
				this.inputDepName = data.name;
				this.emp.departmentId = data.id;
				this.visible = !this.visible;
			},
			showDepView2(){
				this.visible2 = !this.visible2;
			},
			showDepView(){
				this.visible = !this.visible;
			},
			// 获取工号
			getMaxWorkID(){
				this.getRequest('/employee/basic/get-max-WorkID').then(resp => {
					if(resp){
						this.emp.workID = resp.obj;
					}
				})
			},
			// 职位
			initPositions(){
				this.getRequest('/employee/basic/get-all-Position').then(resp => {
					if(resp){
						this.positions = resp;
					}
				})
			},
			initData(){
				// 民族
				if(!window.sessionStorage.getItem('nations')){
					this.getRequest('/employee/basic/get-all-Nation').then(resp => {
						if(resp){
							this.nations = resp;
							window.sessionStorage.setItem('nations',JSON.stringify(resp));
						}
					})
				}else{
					this.nations = JSON.parse(window.sessionStorage.getItem('nations'));
				}
				// 职称
				if(!window.sessionStorage.getItem('jobLevels')){
					this.getRequest('/employee/basic/get-all-job').then(resp => {
						if(resp){
							this.jobLevels = resp;
							window.sessionStorage.setItem('jobLevels',JSON.stringify(resp));
						}
					})
				}else{
					this.jobLevels = JSON.parse(window.sessionStorage.getItem('jobLevels'));
				}
				// 政治面貌
				if(!window.sessionStorage.getItem('politicsstatus')){
					this.getRequest('/employee/basic/get-politics-status').then(resp => {
						if(resp){
							this.politicsstatus = resp;
							window.sessionStorage.setItem('politicsstatus',JSON.stringify(resp));
						}
					})
				}else{
					this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'));
				}
				// 所属部门
				if(!window.sessionStorage.getItem('allDeps')){
					// this.getRequest('/employee/basic/get-all-Department').then(resp => {
					this.getRequest('/system/basic/department/list').then(resp => {
						if(resp){
							this.allDeps = resp;
							window.sessionStorage.setItem('allDeps',JSON.stringify(resp));
						}
					})
				}else{
					this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'));
				}
			},
			// 添加员工弹框
			showAddEmpView(){
				this.title = '添加员工';
				this.emp = {
					id:null,
					name: '',
					gender: '',
					birthday: '',
					idCard: '',
					wedlock: '',
					nationId: null,
					nativePlace: '',
					politicId: null,
					email: '',
					phone: '',
					address: '',
					departmentId: null,
					jobLevelId: null,
					posId: null,
					engageForm: '',
					tiptopDegree: '',
					specialty: '',
					school: '',
					beginDate: '',
					workState: '在职', //在职 离职
					workID: '',
					contractTerm: null,
					conversionTime: '',
					notWorkDate: null,
					beginContract: '',
					endContract: '',
					workAge: null,
					salaryId: null,
				};
				this.inputDepName = '';
				this.dialogVisible = true;
				this.initPositions(); // 职位
				this.getMaxWorkID();  //获取最大工号
			},
			sizeChange(size){
				this.size = size;
				this.initEmps();
			},
			currentChange(currentPage){
				this.currentPage = currentPage;
				this.initEmps();
			},
			// 初始化全部员工
			initEmps(type){
				this.loading = true;
				let url = '/employee/basic/list?currentPage='+ this.currentPage +'&size='+ this.size;
				if(type && type == 'advanced'){
					if(this.searchValue.politicId){
						url += '&politicId='+this.searchValue.politicId;
					}
					if(this.searchValue.nationId){
						url += '&nationId='+this.searchValue.nationId;
					}
					if(this.searchValue.posId){
						url += '&posId='+this.searchValue.posId;
					}
					if(this.searchValue.jobLevelId){
						url += '&jobLevelId='+this.searchValue.jobLevelId;
					}
					if(this.searchValue.engageForm){
						url += '&engageForm='+this.searchValue.engageForm;
					}
					if(this.searchValue.departmentId){
						url += '&departmentId='+this.searchValue.departmentId;
					}
					if(this.searchValue.beginDateScope){
						url += '&beginDateScope='+this.searchValue.beginDateScope;
					}
				}else{
					url += '&name='+ this.empName;
				}
				this.getRequest(url).then(resp=>{
					this.loading = false;
					if(resp){
						this.emps = resp.date;
						this.total = resp.total;
					}
				})
				// this.getRequest('/employee/basic/list?currentPage='+ this.currentPage +'&size='+ this.size +'&name='+ this.empName).then(resp=>{
				// 	this.loading = false;
				// 	if(resp){
				// 		this.emps = resp.date;
				// 		this.total = resp.total;
				// 	}
				// })
			}	
		}
	}
</script>

<style>
	.el-tree-node__expand-icon.is-leaf{
		color: #C0C4CC;
	}
	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */
	.slide-fade-enter-active {
	  transition: all .8s ease;
	}
	.slide-fade-leave-active {
	  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to
	/* .slide-fade-leave-active for below version 2.1.8 */ {
	  transform: translateX(10px);
	  opacity: 0;
	}
</style>
