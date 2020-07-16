import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IModuleState {
  businessName: string
  keyTypeCode: number
  groupId: number | null
  moduleName: string
  moduleIdName: string
  moveIdName:string
  groupList:any
  opId:number
  opName:string
}

@Module({ dynamic: true, store, name: 'OpState' })
class OpState extends VuexModule implements IModuleState {
  public businessName = ''
  public keyTypeCode = 0
  public groupId = null
  public moduleName = ''
  public moduleIdName = ''
  public moveIdName=''
  public groupList=''
  public opId=NaN
  public opName = ''
  public procDefId = ''

  @Mutation
  private SET_GROUP_ID(formGroupId:any) {
    this.groupId = formGroupId
  }
  @Mutation
  public SET_PROC_DEF_Id(procDefId:any) {
    this.procDefId = procDefId
  }
  @Mutation
  public GET_PROC_DEF_Id() {
    return this.procDefId
  }

  @Mutation
  private SET_BUSINESS_NAME(name:string) {
    this.businessName = name
  }

  @Mutation
  private SET_KEY_TYPE_CODE(keyTypeCode:number) {
    this.keyTypeCode = keyTypeCode
  }

  @Mutation
  private SET_MODULE_NAME(moduleName:string) {
    this.moduleName = moduleName
  }

  @Mutation
  private SET_MODULE_ID_NAME(moduleIdName:string) {
    this.moduleIdName = moduleIdName
  }
  // 储存业务名称
  @Mutation
  private SET_MODULE_OP_NAME(opName:string) {
    this.opName = opName
  }
// 判断移动是否分组还是业务
  @Mutation
  private SET_MODULE_MOVE_NAME(moveIdName:string) {
    this.moveIdName = moveIdName
  }
// 储存tree数据
  @Mutation
  private SET_MODULE_GROUP_LIST(groupList:string) {
    this.groupList = groupList
  }
  // @Mutation
  // private GET_OPID() {
  //   return this.opId
  // }
// 储存业务id
  @Mutation
  private SET_MODULE_OP_ID(opId:number) {
    this.opId = opId
  }
  @Action
  public SetGroupId(formGroupId:number) {
    this.SET_GROUP_ID(formGroupId)
  }

  @Action
  public SetBusinessName(businessName:string) {
    this.SET_BUSINESS_NAME(businessName)
  }

  @Action
  public setKeyTypeCode(keyTypeCode:number) {
    this.SET_KEY_TYPE_CODE(keyTypeCode)
  }

  @Action
  public setModuleName(moduleName:string) {
    this.SET_MODULE_NAME(moduleName)
  }

  @Action
  public setModuleIdName(moduleIdName:string) {
    this.SET_MODULE_ID_NAME(moduleIdName)
  }

  @Action
  public setmoveIdName(moveIdName:string) {
    this.SET_MODULE_MOVE_NAME(moveIdName)
  }

  @Action
  public setgroupList(groupList:any) {
    this.SET_MODULE_GROUP_LIST(groupList)
  }

  @Action
  public setopId(opId:any) {
    this.SET_MODULE_OP_ID(opId)
  }

  @Action
  public setopName(opName:any) {
    this.SET_MODULE_OP_NAME(opName)
  }
}

export const ModuleState = getModule(OpState)
