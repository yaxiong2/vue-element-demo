<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang = "ts">
import { updateUserPwd } from '@/api/system/user'
import { Vue, Component } from 'vue-property-decorator'

interface User {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
}
@Component({
  name: 'ResetPwd'
})

export default class extends Vue {
  private equalToPassword = (rule:object, value:string, callback:any) => {
    if (this.user.newPassword !== value) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  };
  private test:string = '1test'
  private user:User = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  // 表单校验
  private rules:object = {
    oldPassword: [
      { required: true, message: '旧密码不能为空', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '新密码不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '确认密码不能为空', trigger: 'blur' },
      { required: true, validator: this.equalToPassword, trigger: 'blur' }
    ]
  }

  submit() {
    (this.$refs['form'] as any).validate((valid:any) => {
      if (valid) {
        updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
          (response:any) => {
            if (response.status === 200) {
              this.$message.success('修改成功')
              this.user['oldPassword'] = ''
              this.user['newPassword'] = ''
              this.user['confirmPassword'] = ''
            } else {
              this.$message.error(response.msg)
            }
          }
        )
      }
    })
  }
  close() {
    this.$store.dispatch('tagsView/delView', this.$route)
    this.$router.push({ path: '/index' })
  }
}
</script>
