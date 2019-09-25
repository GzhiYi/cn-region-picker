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
      />
      <span class="input-close" v-if="showCloseBtn" @click.stop.prevent="handleAllStatus(false)"></span>
    </div>
    <transition name="fade">
      <div class="picker-bg" v-show="showPicker" @click.stop.self="closeModalPicker">
        <!-- 此处不能prevent -->
        <div class="picker">
          <div class="setting">
            <div class="button-area">
              <button
                class="clear warn color-button"
                @click.stop.prevent="handleAllStatus(false)"
              >全部清空</button>
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
                  />
                  <input
                    type="checkbox"
                    v-model="provinceStatus[item.province.provinceIndex]"
                    @change="onProvinceChange(item, index, $event)"
                  />
                  {{item.province.shortName}}
                </label>
              </div>
              <div class="city">
                <div v-for="cityItem in item.city" :key="cityItem.index" class="city-item">
                  <label>
                    <img
                      class="check-box"
                      :src="`${cityStatus[cityItem.cityIndex] ? 'https://images.vrm.cn/2018/12/21/checked.png' : 'https://images.vrm.cn/2018/12/21/unchecked.png'}`"
                    />
                    <input type="checkbox" v-model="cityStatus[cityItem.cityIndex]" />
                    {{cityItem.shortName}}
                  </label>
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
import regions from "../assets/regions";

const cityLength =
  regions[regions.length - 1].city[regions[regions.length - 1].city.length - 1]
    .cityIndex + 1;
const provinceLength = regions[regions.length - 1].province.provinceIndex + 1;

export default {
  name: "CnRegionPicker",
  data() {
    return {
      showPicker: false,
      originCityData: Object.freeze(regions),
      provinceStatus: [...Array(provinceLength)].map(_ => false),
      cityStatus: [...Array(cityLength)].map(_ => false),
      letter: [
        "全部",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      activeLetter: "全部",
      pickData: []
    };
  },
  props: {
    placeholder: {
      type: [String],
      default: "选择城市"
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
    pick() {
      let checkedCity = []; // 勾选的城市index
      let outPutArr = [];
      this.cityStatus.forEach((cityItem, index) => {
        if (cityItem) {
          checkedCity.push(index);
        }
      });
      regions.forEach(item => {
        item.city.forEach((cityItem, index) => {
          if (checkedCity.indexOf(cityItem.cityIndex) !== -1) {
            outPutArr.push(cityItem);
          }
        });
      });
      console.log('lalalla', outPutArr)
      this.$emit("on-pick-city", outPutArr);
      this.pickData = outPutArr;
      this.showPicker = false;
    },

    inverse() {
      this.cityStatus.forEach((item, index) => {
        this.$set(this.cityStatus, index, !item);
      });
      this.provinceStatus.forEach((item, index) => {
        this.$set(this.provinceStatus, index, !item);
      });
    },

    handleAllStatus(bool) {
      this.cityStatus = [...Array(cityLength)].map(_ => bool);
      this.provinceStatus = [...Array(provinceLength)].map(_ => bool);
      if (!bool) {
        this.pickData = [];
      }
    },

    clickLetter(letter) {
      this.activeLetter = letter;
      let originCityData = [];

      regions.forEach(item => {
        let sortCity = [];
        item.city.forEach(cityItem => {
          if (cityItem.pinYin[0].toUpperCase() === letter) {
            sortCity.push(cityItem);
          }
        });
        if (sortCity.length > 0) {
          originCityData.push({
            city: sortCity,
            province: item.province
          });
        }
      });
      this.originCityData =
        letter === "全部"
          ? Object.freeze(regions)
          : Object.freeze(originCityData);
    },

    onProvinceChange(item, index, event) {
      this.originCityData[index].city.forEach(cityItem => {
        this.$set(this.cityStatus, cityItem.cityIndex, event.target.checked);
      });
    },

    closeModalPicker() {
      if (this.clickModal) {
        this.showPicker = false;
      }
    }
  },
  computed: {
    showPickedCity() {
      let result = "";
      this.pickData.forEach(city => {
        this.cityStatus[city.cityIndex] = true;
        result += `${city.name} `;
      });
      return result;
    }
  },
  watch: {
    pickedCity: {
      handler(newOne) {
        this.pickData = newOne;
      }
    },
    pickData: {
      handler(newOne) {
        newOne.forEach(city => {
          this.cityStatus[city.cityIndex] = true;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './picker.scss';
</style>

