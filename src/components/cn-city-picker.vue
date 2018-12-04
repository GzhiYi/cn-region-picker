<template>
  <div class="outer">
    <div class="input-area">
      <input type="text" @focus="showPicker = true" :value="pickedCity">
    </div>
    <div class="picker" v-if="showPicker">
      <button @click="handleAllStatus(true)">全选</button>
      <button @click="inverse">反选</button>
      <button @click="handleAllStatus(false)">清空</button>
      <button @click="pick">确认</button>
      <div v-for="(item, index) in originCityData" :key="item.id">
        <div class="province" style="text-align: left;">
          <strong><label><input type="checkbox" v-model="provinceStatus[index]">{{item.province.shortName}}</input></label></strong>
        </div>
        <div style="display: flex;flex-wrap: wrap;margin-bottom: 20px;">
          <div class="city" style="width: 100px;" v-for="cityItem in item.city" :key="cityItem.index">
              <strong><label><input type="checkbox" v-model="cityStatus[cityItem.cityIndex]">{{cityItem.shortName}}</label></strong></input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import city from '../assets/city'
console.log('city', city)
export default {
  name: 'CnCityPicker',
  data() {
    return {
      showPicker: false,
      originCityData: Object.freeze(city),
      provinceStatus: [...Array(34)].map(_ => false),
      cityStatus: [...Array(377)].map(_ => false),
      pickedCity: ''
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
      let outPutArr = []
      this.pickedCity = ''
      this.cityStatus.forEach((cityItem, index) => {
        if (cityItem) {
          checkedCity.push(index)
        }
      })
      this.originCityData.forEach(item => {
        item.city.forEach((cityItem, index) => {
          if (checkedCity.indexOf(cityItem.cityIndex) !== -1) {
            outPutArr.push(cityItem)
            this.pickedCity += `${cityItem.name}${index === item.city.length - 1 ? '' : '、'}`
          }
        })
      })
      this.$emit('getPickCity', outPutArr)
      this.showPicker = false
    },

    inverse () {
      this.cityStatus.forEach((item, index) => {
        this.$set(this.cityStatus, index, !item)
      })
    },

    handleAllStatus (bool) {
      this.cityStatus = [...Array(377)].map(_ => bool)
      this.provinceStatus = [...Array(34)].map(_ => bool)
    }
  },
  watch: {
    provinceStatus (newProvince) {
      newProvince.forEach((item, index) => {
        this.originCityData[index].city.forEach(cityItem => {
          this.$set(this.cityStatus, cityItem.cityIndex, item)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
