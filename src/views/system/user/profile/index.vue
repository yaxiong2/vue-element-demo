<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="icl-custom" />用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="ic-phone" />手机号码
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="icf-email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="icf-department" />所属部门

                <div v-if="user.dept" class="pull-right">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="icf-employee-card" style="font-size:18px" />所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="icl-calendar" />创建日期
                <div class="pull-right">2018-08-23 09:11:56</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang = "ts">
import userAvatar from './userAvatar.vue'
import userInfo from './userInfo.vue'
import resetPwd from './resetPwd.vue'
import { getUserProfile } from '@/api/system/user'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'Profile',
  components: {
    userAvatar,
    userInfo,
    resetPwd
  }
})

export default class extends Vue {
  private user:object = {}
  private roleGroup:object = {}
  private postGroup:object = {}
  private activeTab:string = 'userinfo'

  created() {
    this.getUser()
  }

  getUser() {
    getUserProfile().then((response:any) => {
      response = response.data
      this.user = response.user
      this.roleGroup = response.roleGroup
      this.postGroup = response.postGroup
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar-uploader-icon {
  font-size: 28px;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.list-group-item {
  .svg-icon {
    font-size: 16px;
  }
}
</style>
