<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <screenfull class="right-menu-item hover-effect" />
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="require('@/assets/image/123.jpg')"
            class="user-avatar"
          >
          <!-- <img
            :src="avatar+'?imageView2/1/w/80/h/80'"
            class="user-avatar"
          > -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span @click="showSetting = true">布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="dialogVisible = true"
            >退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 退出登录蒙版 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <span>确定要退出登录吗</span>
        <span slot="footer" class="dialog-footer">
          <form action="/logout" method="POST" onsubmit="return false" name="toLogout">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <input class="el-button el-button--primary el-button--small" type="submit" value="确定" @click="logout">
          </form>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { SettingsModule } from '@/store/modules/settings'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect
  }
})
export default class extends Vue {
  private dialogVisible:boolean = false

  get showSetting() {
    return SettingsModule.showRightPanel
  }
  set showSetting(value:boolean) {
    SettingsModule.ChangeSetting({ key: 'showRightPanel', value: value })
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device.toString()
  }

  get avatar() {
    return UserModule.avatar
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  logout() {
    this.dialogVisible = false
    UserModule.LogOut();
    // 系统提交退出
    (document as any).toLogout.submit()
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
