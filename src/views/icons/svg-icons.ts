const req = require.context('../../icons/svg', false, /\.svg$/)
const requireAll = (requireContext: any) => requireContext.keys()

const re = /\.\/(.*)\.svg/
const commonIcons: string[] = []
const linearIcons: string[] = []
const lumpIcons: string[] = []
const otherIcons: string[] = []
const componentIcons: string[] = []
const colorfulIcons: string[] = []

const svgIcons = requireAll(req).map((i: any) => {
  const incoStr = i.match(re)[1]
  if (/^ic-/.test(incoStr)) {
    // 常用图标
    commonIcons.push(incoStr)
  } else if (/^icl/.test(incoStr)) {
    // 线性图标
    linearIcons.push(incoStr)
  } else if (/^icf-/.test(incoStr)) {
    // 填充图标
    lumpIcons.push(incoStr)
  } else if (/^ice-/.test(incoStr)) {
    // 组件图标
    componentIcons.push(incoStr)
  } else if (/^icc-/.test(incoStr)) {
    colorfulIcons.push(incoStr)
  } else {
    otherIcons.push(incoStr)
  }
  return i.match(re)[1]
})
export { commonIcons, linearIcons, lumpIcons, otherIcons, componentIcons, colorfulIcons }
export default svgIcons
