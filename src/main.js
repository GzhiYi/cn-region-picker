import Vue from 'vue'
import App from './App.vue'
import CnCityPicker from './components/index'

Vue.use(CnCityPicker)

new Vue({
  el: '#app',
  render: h => h(App)
})
