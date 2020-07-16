<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">维纳斯维护系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon slot="prefix" icon-class="icf-custom" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="ic-password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2019  All Rights Reserved.</span>
    </div>
  </div>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Login'
})

export default class extends Vue {
  private loginForm = {
    username: '喻定权',
    password: '123456',
    rememberMe: false,
    grant_type: 'password'
  }
  private loginRules = {
    username: [
      { required: true, trigger: 'blur', message: '用户名不能为空' }
    ],
    password: [
      { required: true, trigger: 'blur', message: '密码不能为空' }
    ]
  }
  private loading = false
  private redirect?:string

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
    }
  }

  created() {
    this.getCookie()
  }

  private getCookie() {
    const username = Cookies.get('username')
    const password = Cookies.get('password')
    const rememberMe = Cookies.get('rememberMe')
    this.loginForm = {
      username: username === undefined ? this.loginForm.username : username,
      password: password === undefined ? this.loginForm.password : password,
      rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      grant_type: 'password'
    }
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        if (this.loginForm.rememberMe) {
          Cookies.set('username', this.loginForm.username, { expires: 30 })
          Cookies.set('password', this.loginForm.password, { expires: 30 })
          Cookies.set('rememberMe', 'true', { expires: 30 })
        } else {
          Cookies.remove('username')
          Cookies.remove('password')
          Cookies.remove('rememberMe')
        }
        await UserModule.Login(this.loginForm)
        if (UserModule.token) {
          this.loading = false
          this.$router.push({ path: this.redirect || '/' })
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("./../../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
