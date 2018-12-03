<template>
  <div class="picker" v-if="showPicker">
    <button type="primary" size="small" @click="pickAll">全选</button>
    <button type="primary" size="small" @click="inverse">反选</button>
    <button type="primary" size="small" @click="pick">确认</button>
    <div v-for="(item, index) in originCityData" :key="item.id">
      <div class="province">
        <strong><label><input type="checkbox" v-model="provinceData[index]">{{item.province.label}}</label></strong></input>
      </div>
      <div style="display: flex;flex-wrap: wrap;">
        <div class="city" style="width: 100px;" v-for="cityItem in item.city" :key="cityItem.index">
            <strong><label><input type="checkbox" v-model="cityData[cityItem.index]">{{cityItem.name}}</label></strong></input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import city from '../assets/city'

export default {
  name: 'CnCityPicker',
  data() {
    return {
      showPicker: true,
      originCityData: Object.freeze(city),
      provinceData: [...Array(35)].map(_ => false),
      cityData: [...Array(1225)].map(_ => false),
      pickedCity: this.propPickedCity
    }
  },
  props: {
    propPickedCity: {
      type: [String],
      default: ''
    }
  },
  methods: {
    pick () {
      let checkedCity = []
      let outPut = null
      this.cityData.forEach((cityItem, index) => {
        if (cityItem) {
          checkedCity.push(index)
        }
      })
      this.originCityData.forEach(item => {
        item.city.forEach(cityItem => {
          if (checkedCity.indexOf(item.index) !== -1) {
            outPut += `${cityItem.name}、`
            this.pickedCity += `${cityItem.name}、`
          }
        })
      })
      console.log('outPut', outPut)
      if (!outPut) {
        this.pickedCity = ''
      }
      console.log('pickedCity', this.pickedCity)
    },

    pickAll () {
      this.cityData = [...Array(1225)].map(_ => true)
    },

    inverse () {
      this.cityData.forEach((item, index) => {
        this.$set(this.cityData, index, !item)
      })
    }
  },
  watch: {
    provinceData (newProvince) {
      newProvince.forEach((item, index) => {
        this.originCityData[index].city.forEach((cityItem, cityIndex) => {
          this.cityData[cityItem.index] = item
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
