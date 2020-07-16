<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="user.nickName" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang = "ts">
import { updateUserProfile } from '@/api/system/user'
import { Vue, Component, Prop } from 'vue-property-decorator'

interface UserInfo {
   user: {
      type: Object
    }
}
@Component({
  name: 'UserInfo'
})
export default class extends Vue {
  @Prop({ required: true }) user!: UserInfo
  // 表单校验
  private rules:object = {
    nickName: [
      { required: true, message: '用户昵称不能为空', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
      {
        type: 'email',
        message: "'请输入正确的邮箱地址",
        trigger: ['blur', 'change']
      }
    ],
    phone: [
      { required: true, message: '手机号码不能为空', trigger: 'blur' },
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur'
      }
    ]
  }
  submit() {
    (this.$refs['form'] as any).validate((valid:any) => {
      if (valid) {
        updateUserProfile(this.user).then((response:any) => {
          if (response.status === 200) {
            this.$message.success('修改成功')
          } else {
            this.$message.error(response.msg)
          }
        })
      }
    })
  }
  close() {
    this.$router.push({ path: '/index' })
  }
}
</script>
