<template>
  <div class="outer">
    <div class="input-area">
      <input
        type="text"
        @focus="showPicker = true"
        :value="pickedCity"
        :title="pickedCity"
        class="pick-input"
        :placeholder="propsPlaceholder"
      >
    </div>
    <div class="picker-bg" v-show="showPicker">
      <div class="picker">
        <div class="setting">
          <div class="button-area">
            <button class="clear warn" @click="handleAllStatus(false)">全部清空</button>
            <button @click.stop.prevent="handleAllStatus(true)">全选</button>
            <button @click.stop.prevent="inverse">反选</button>
            <button @click.stop.prevent="pick">确认</button>
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
              <label><input type="checkbox" v-model="provinceStatus[index]" @change="onProvinceChange(item, index, $event)"/>{{item.province.shortName}}</label>
            </div>
            <div class="city">
              <div v-for="cityItem in item.city" :key="cityItem.index" class="city-item">
                <label><input type="checkbox" v-model="cityStatus[cityItem.cityIndex]"/>{{cityItem.shortName}}</label>
              </div>
            </div>
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
  name: 'CnRegionPicker',
  data() {
    return {
      showPicker: false,
      originCityData: Object.freeze(regions),
      provinceStatus: [...Array(provinceLength)].map(_ => false),
      cityStatus: [...Array(cityLength)].map(_ => false),
      pickedCity: '',
      letter: ["全部", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      activeLetter: '全部',
      propsPlaceholder: this.placeholder
    }
  },
  props: {
    placeholder: {
      type: [String],
      default: '选择城市'
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
      this.provinceStatus.forEach((item, index) => {
        this.$set(this.provinceStatus, index, !item)
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
    },
    onProvinceChange (item, index, event) {
      this.originCityData[index].city.forEach(cityItem => {
        this.$set(this.cityStatus, cityItem.cityIndex, event.target.checked)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pick-input {
  border: 1px solid #c0c4cc;
  line-height: 30px;
  cursor: pointer;
  padding: 0 10px 0 10px;
  border-radius: 4px;
  color: #333;
  text-overflow: ellipsis;
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
      margin: 30px auto;
      overflow: scroll;
      background-color: #fff;
      border-radius: 8px;
      z-index: 1;

      .setting {
        position: fixed;
        width: 50%;
        padding: 1%;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
      }
      .content {
        margin-top: 100px;
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
        text-align: center;
      }
      .button-area {
        text-align: right;
        margin-bottom: 12px;

        .clear {
          margin-right: 40px;
        }
        .warn {
          color: #e6a23c;
        }

        button {
          background: #fff;
          border: 1px solid #dcdfe6;
          outline: none;
          cursor: pointer;
          padding: 4px 14px;
          border-radius: 4px;
          border-color: #dcdfe6;
          color: #595a5e;

          &.active {
            background: red;
          }
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
      vertical-align: middle;
    }
    &::-webkit-scrollbar { width: 0 !important }
    & { -ms-overflow-style: none; }
    & { overflow: -moz-scrollbars-none; }
  }

}
</style>
