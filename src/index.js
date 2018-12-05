import CnRegionPicker from './components/index'

const components = [
  CnRegionPicker
]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  CnRegionPicker
}
