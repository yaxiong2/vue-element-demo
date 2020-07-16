import { DirectiveOptions } from 'vue'
import { UserModule } from '@/store/modules/user'

export const hasRole: DirectiveOptions = {
  inserted(el, binding, vnode) {
    const { value } = binding
    const super_admin = 'admin'
    const roles = UserModule.roles

    if (value && value instanceof Array && value.length > 0) {
      const roleFlag = value

      const hasRole = roles === null ? false : roles.some(role => {
        return super_admin === role || roleFlag.includes(role)
      })

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置角色权限标签值"`)
    }
  }
}
