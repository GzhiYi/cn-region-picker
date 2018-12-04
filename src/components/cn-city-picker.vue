<template>
  <div class="outer">
    <div class="input-area">
      <input
        type="text"
        @focus="showPicker = true"
        :value="pickedCity"
        :title="pickedCity"
      >
    </div>
    <div class="picker" v-if="showPicker">
      <div class="sort">
        <span
          :class="`letter-item ${activeLetter === item ? 'active' : ''}`"
          v-for="item in letter"
          :key="item"
          @click="clickLetter(item)"
        >{{item}}</span>
      </div>
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
import regions from '../assets/regions'
const cityLength = 377
const provinceLength = 34

export default {
  name: 'CnCityPicker',
  data() {
    return {
      showPicker: false,
      originCityData: Object.freeze(regions),
      provinceStatus: [...Array(provinceLength)].map(_ => false),
      cityStatus: [...Array(cityLength)].map(_ => false),
      pickedCity: '',
      letter: ["全部", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      activeLetter: '全部'
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
            this.pickedCity += `${cityItem.name} `
          }
        })
      })
      this.$emit('input', outPutArr)
      this.showPicker = false
    },

    inverse () {
      this.cityStatus.forEach((item, index) => {
        this.$set(this.cityStatus, index, !item)
      })
    },

    handleAllStatus (bool) {
      this.cityStatus = [...Array(cityLength)].map(_ => bool)
      this.provinceStatus = [...Array(provinceLength)].map(_ => bool)
      if (!bool) {
        this.pickedCity = ''
      }
    },

    clickLetter (letter) {
      this.activeLetter = letter
      let originCityData = []

      this.handleAllStatus(false)

      regions.forEach(item => {
        let sortCity = []
        item.city.forEach(cityItem => {
          if (cityItem.pinYin[0].toUpperCase() === letter) {
            sortCity.push(cityItem)
          }
        })
        if (sortCity.length > 0) {
          originCityData.push({
            city: sortCity,
            province: item.province
          })
        }
      })
      this.originCityData = letter === '全部' ? Object.freeze(regions) : Object.freeze(originCityData)
    }
  },
  watch: {
    provinceStatus (newProvince) {
      newProvince.forEach((item, index) => {
        if (this.originCityData[index] && this.originCityData[index].hasOwnProperty('city')) {
          this.originCityData[index].city.forEach(cityItem => {
            this.$set(this.cityStatus, cityItem.cityIndex, item)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.letter-item {
  margin: 4px 6px;
  cursor: pointer;
  &.active {
    background: #7e3f26;
    color: #fff;
  }
}
</style>
