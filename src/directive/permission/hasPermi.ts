import { DirectiveOptions } from 'vue'
import { UserModule } from '@/store/modules/user'

export const hasPermi: DirectiveOptions = {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = '*:*:*'
    return true
    // const permissions = store.getters && store.getters.permissions
    // const permissions = UserModule.permissions
    // if (value && value instanceof Array && value.length > 0) {
    //   const permissionFlag = value
    //   const hasPermissions = (permissions as any).some((permission:any) => {
    //     return all_permission === permission || permissionFlag.includes(permission)
    //   })
    //   if (!hasPermissions) {
    //     el.parentNode && el.parentNode.removeChild(el)
    //   }
    // } else {
    //   throw new Error(`请设置操作权限标签值`)
    // }
  }
}
