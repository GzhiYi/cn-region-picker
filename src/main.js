import Vue from 'vue'
import App from './App.vue'
import CnRegionPicker from './components/index'

Vue.use(CnRegionPicker)

new Vue({
  el: '#app',
  render: h => h(App)
})
