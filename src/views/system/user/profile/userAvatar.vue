<template>
  <div class="userinfo-avatar">
    <img :src="require('@/assets/image/123.jpg')" title="点击上传头像" class="img-circle img-lg" @click="editCropper()">
    <!-- <img :src="options.img" title="点击上传头像" class="img-circle img-lg" @click="editCropper()"> -->
    <el-dialog :title="title" class="upadte-avatar-dialog" :visible.sync="open" width="800px">
      <el-row>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            @realTime="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload :show-file-list="false" :before-upload="beforeUpload" action="">
            <!-- <el-upload :show-file-list="false" :on-change='changeUpload' :auto-upload="false" action =""> -->
            <el-button size="small">
              上传
              <i class="el-icon-upload el-icon--right" />
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :md="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)" />
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)" />
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()" />
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()" />
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()">上 传</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang = "ts">
import { VueCropper } from 'vue-cropper'
import { uploadAvatar } from '@/api/system/user'
import { UserModule } from '@/store/modules/user'
import { Vue, Component, Prop } from 'vue-property-decorator'

interface UserInfo {
  user: {
    type:object
  }
}
@Component({
  name: 'UserAvatar',
  components: {
    VueCropper
  }
})

export default class extends Vue {
  @Prop({ required: true }) private user!:UserInfo
  // 是否显示弹出层
  private open:boolean = false
  // 弹出层标题
  private title:string = '修改头像'
  private options:object = {
    img: UserModule.avatar, // 裁剪图片的地址
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 200, // 默认生成截图框宽度
    autoCropHeight: 200, // 默认生成截图框高度
    fixedBox: true // 固定截图框大小 不允许改变
  }
  private previews:object = {}

  // 编辑头像
  editCropper() {
    this.open = true
  }
  // 向左旋转
  rotateLeft() {
    (this.$refs.cropper as any).rotateLeft()
  }
  // 向右旋转
  rotateRight() {
    (this.$refs.cropper as any).rotateRight()
  }
  // 图片缩放
  changeScale(num:number) {
    num = num || 1;
    (this.$refs.cropper as any).changeScale(num)
  }
  // 上传预处理
  beforeUpload(file:any) {
    if (file.type.indexOf('image/') === -1) {
      this.$message.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
    } else {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        (this.options as any).img = reader.result
      }
    }
  }
  // 上传图片
  uploadImg() {
    (this.$refs.cropper as any).getCropBlob((data:any) => {
      const formData = new FormData()
      formData.append('avatarFile', data)
      uploadAvatar(formData).then((response:any) => {
        if (response.status === 200) {
          this.open = false
          this.$message.success('修改成功')
        } else {
          this.$message.error(response.msg)
        }
        (this.$refs.cropper as any).clearCrop()
      })
    })
  }
  // 实时预览
  realTime(data:any) {
    this.previews = data
  }
}
</script>
<style lang="scss">
.userinfo-avatar  .upadte-avatar-dialog .el-dialog{
  width: 800px!important;
}
</style>
