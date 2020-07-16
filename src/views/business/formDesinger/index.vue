
<template>
  <div>
    <fm-making-form
      ref="makingform"
      style="height: 91vh;"
      preview
      generate-code
      generate-json
      select-form
      clearable
      upload
      :params="{
        getOPTreeUrl: `${opManagerBaseUrl}/op/manager/group/tree`, // 获取业务树
        getFormsUrl: `${opManagerBaseUrl}/op/manager/form/list`, // 根据表单组id获取表单
        getFormFieldsUrl: `${formBaseUrl}/form/field`, // 根据表单id获取所有字段信息
        getFormUIUrl: `${formBaseUrl}/form/designer`, // 获取保存后的表单UI
        getSystemFieldUrl: `${opManagerBaseUrl}/op/system/fld/manager/fields`, // 获取系统字段
        getfieldsControlUrl: `${formBaseUrl}/form/ui/fields`, // 获取字段控件
        addFormDataUrl: `${formBaseUrl}/form/fieldDesigner` // 获取字段控件
      }"
    >
      <!--       <template slot="action" /></fm-making-form></div></template> -->
    </fm-making-form>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'Form-Making'
})
export default class FormMaking extends Vue {
  private formBaseUrl: any = process.env.VUE_APP_FORM_API // 即为/api
  private opManagerBaseUrl:any = process.env.VUE_APP_MANAGER_API // 即为/api
}
</script>
