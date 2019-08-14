<template>
  <div class="outer">
    <div class="input-area" :style="`width: ${width + 30}px;`">
      <input
        type="text"
        @focus="showPicker = true"
        :value="showPickedCity"
        :title="showPickedCity"
        :class="`${inputClass || 'cn-picker-input'}`"
        :placeholder="placeholder"
        :style="`width: ${width}px;`"
      >
      <span class="input-close" v-if="showCloseBtn" @click.stop.prevent="handleAllStatus(false)"></span>
    </div>
    <transition name="fade">
      <div class="picker-bg" v-show="showPicker" @click.stop.self="closeModalPicker"><!-- 此处不能prevent -->
        <div class="picker">
          <div class="setting">
            <div class="button-area">
              <button class="clear warn color-button" @click.stop.prevent="handleAllStatus(false)">全部清空</button>
              <button @click.stop.prevent="handleAllStatus(true)">全选</button>
              <button @click.stop.prevent="inverse">反选</button>
              <button class="confirm color-button" @click.stop.prevent="pick">确认</button>
              <div class="close" @click.stop.prevent="showPicker = false"></div>
            </div>
            <div class="sort">
              <span
                :class="`letter-item ${activeLetter === item ? 'active' : ''}`"
                v-for="item in letter"
                :key="item"
                @click="clickLetter(item)"
              >{{item}}</span>
            </div>
          </div>
          <div class="content">
            <div v-for="(item, index) in originCityData" :key="item.id">
              <div class="province">
                <label>
                  <img
                    class="check-box"
                    :src="`${provinceStatus[item.province.provinceIndex] ? 'https://images.vrm.cn/2018/12/21/checked.png' : 'https://images.vrm.cn/2018/12/21/unchecked.png'}`"
                  ><input type="checkbox" v-model="provinceStatus[item.province.provinceIndex]" @change="onProvinceChange(item, index, $event)"/>{{item.province.shortName}}</label>
              </div>
              <div class="city">
                <div v-for="cityItem in item.city" :key="cityItem.index" class="city-item">
                  <label><img
                    class="check-box"
                    :src="`${cityStatus[cityItem.cityIndex] ? 'https://images.vrm.cn/2018/12/21/checked.png' : 'https://images.vrm.cn/2018/12/21/unchecked.png'}`"
                  ><input type="checkbox" v-model="cityStatus[cityItem.cityIndex]"/>{{cityItem.shortName}}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import regions from '../assets/regions'

const cityLength = regions[regions.length - 1].city[regions[regions.length - 1].city.length - 1].cityIndex + 1
const provinceLength = regions[regions.length - 1].province.provinceIndex + 1

export default {
  name: 'CnRegionPicker',
  data() {
    return {
      showPicker: false,
      originCityData: Object.freeze(regions),
      provinceStatus: [...Array(provinceLength)].map(_ => false),
      cityStatus: [...Array(cityLength)].map(_ => false),
      letter: ["全部", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      activeLetter: '全部',
      pickData: [],
    }
  },
  props: {
    placeholder: {
      type: [String],
      default: '选择城市'
    },
    showCloseBtn: {
      type: [Boolean],
      default: true
    },
    clickModal: {
      type: [Boolean],
      default: true
    },
    inputClass: {
      type: [String],
      default: null
    },
    width: {
      type: [Number],
      default: 200
    },
    pickedCity: {
      type: Array
    }
  },
  methods: {
    pick () {
      let checkedCity = [] // 勾选的城市index
      let outPutArr = []
      this.cityStatus.forEach((cityItem, index) => {
        if (cityItem) {
          checkedCity.push(index)
        }
      })
      regions.forEach(item => {
        item.city.forEach((cityItem, index) => {
          if (checkedCity.indexOf(cityItem.cityIndex) !== -1) {
            outPutArr.push(cityItem)
          }
        })
      })
      this.$emit('on-pick-city', outPutArr)
      this.pickData = outPutArr
      this.showPicker = false
    },

    inverse () {
      this.cityStatus.forEach((item, index) => {
        this.$set(this.cityStatus, index, !item)
      })
      this.provinceStatus.forEach((item, index) => {
        this.$set(this.provinceStatus, index, !item)
      })
    },

    handleAllStatus (bool) {
      this.cityStatus = [...Array(cityLength)].map(_ => bool)
      this.provinceStatus = [...Array(provinceLength)].map(_ => bool)
      if (!bool) {
        this.pickData = []
      }
    },

    clickLetter (letter) {
      this.activeLetter = letter
      let originCityData = []

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
    },

    onProvinceChange (item, index, event) {
      this.originCityData[index].city.forEach(cityItem => {
        this.$set(this.cityStatus, cityItem.cityIndex, event.target.checked)
      })
    },

    closeModalPicker () {
      if (this.clickModal) {
        this.showPicker = false
      }
    }
  },
  computed: {
    showPickedCity() {
      let result = ''
      this.pickData.forEach(city => {
        this.cityStatus[city.cityIndex] = true
        result += `${city.name} `
      })
      return result
    }
  },
  watch: {
    pickedCity: {
      handler(newOne) {
        this.pickData = newOne
      }
    },
    pickData: {
      handler(newOne) {
        newOne.forEach(city => {
          this.cityStatus[city.cityIndex] = true
          this.showPickedCity += `${city.name} `
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.outer {
  .input-area {
    position: relative;
  }
  .input-close {
    position: absolute;
    right: 0;
    top: 8px;
    width: 32px;
    height: 32px;
    opacity: 0.3;
    cursor: pointer;
    transition: .3s all;
  }
  .input-close:hover {
    opacity: 1;
  }
  .input-close:before, .input-close:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 14px;
    width: 2px;
    background-color: #333;
  }
  .input-close:before {
    transform: rotate(45deg);
  }
  .input-close:after {
    transform: rotate(-45deg);
  }
}
.picker-bg {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  outline: 0;
  background: #000000a1;
  z-index: 9999;

  .picker {
      width: 50%;
      height: 600px;
      position: absolute;
      left: 0;
      right: 0;
      margin: 4% auto;
      overflow: scroll;
      background-color: #fff;
      border-radius: 8px;
      line-height: 13px;
      z-index: 1;

      .setting {
        position: fixed;
        left: 0;
        right: 0;
        margin: auto;
        width: 48%;
        padding: 1%;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
        z-index: 99;
      }
      .content {
        margin-top: 15%;
        padding: 0 4%;

        .province {
          display: flex;
          flex-wrap: wrap;
          font-weight: bold;
          margin-bottom: 5px;

          label {
            font-size: 14px;
            font-weight: bold;
          }
        }
        .city {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 20px;

          label {
            font-size: 13.3px;
          }

          .city-item {
            width: 100px;
            text-align: left;
          }
        }
      }
      .sort {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      .button-area {
        text-align: right;
        margin-bottom: 12px;
        padding-right: 40px;
        position: relative;

        .clear {
          margin-right: 40px;
        }
        .warn {
          background-color: #6c757d;
          border-color: #6c757d;
        }
        .confirm {
          background-color: #409eff;
          border-color: #409eff;
        }
        .color-button {
          color: #fff;
          border: none;
        }
        .close {
          position: absolute;
          right: 1px;
          top: 9px;
          width: 32px;
          height: 32px;
          opacity: 0.3;
          cursor: pointer;
          transition: .3s all;
        }
        .close:hover {
          opacity: 1;
        }
        .close:before, .close:after {
          position: absolute;
          left: 15px;
          content: ' ';
          height: 16px;
          width: 2px;
          background-color: #333;
        }
        .close:before {
          transform: rotate(45deg);
        }
        .close:after {
          transform: rotate(-45deg);
        }

        button {
          background: #fff;
          border: 1px solid #dcdfe6;
          outline: none;
          cursor: pointer;
          padding: 7px 20px;
          border-radius: 4px;
          border-color: #dcdfe6;
          color: #595a5e;
          margin-right: 12px;
        }
      }
      .letter-item {
        color: #333;
        font-weight: bold;
        padding: 5px;
        font-size: 13px;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 3px;
        transition: .3s all;

        &.active {
          background-color: #337ab7;
          color: #fff;
        }
        &:hover {
          background-color: #337ab7;
          color: #fff;
        }
      }
    label {
      cursor: pointer;
    }
    input[type="checkbox"] {
      width: 13px;
      height: 13px;
      opacity: 0;
      vertical-align: middle;
      margin-right: 5px;
    }
    &::-webkit-scrollbar { width: 0 !important }
    & { -ms-overflow-style: none; }
    & { overflow: -moz-scrollbars-none; }
  }
  .check-box {
    width: 18px;
    height: 18px;
    position: absolute;
    margin-top: -1px;
  }
}
</style>
<style lang="scss">
  .cn-picker-input {
    border: 1px solid #c0c4cc;
    line-height: 30px;
    cursor: pointer;
    padding: 0 20px 0 10px;
    border-radius: 4px;
    color: #333;
    text-overflow: ellipsis;
    outline: none;

    &::-webkit-input-placeholder {
      color: #c9ccd8;
    }
    &::-moz-placeholder { /* Firefox 19+ */
      color: #c9ccd8;
    }
    &:-ms-input-placeholder { /* IE 10+ */
      color: #c9ccd8;
    }
    &:-moz-placeholder { /* Firefox 18- */
      color: #c9ccd8;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

