<div  align="center">
  <img src="https://images.vrm.cn/2018/12/05/preview.png" width = "620" height = "500" alt="preview" align=center />
</div>

# 适用于vue的城市选择组件

[在线Demo](https://gzhiyi.top/cn-region-picker/)

基本功能：

1. 支持全选、反选以及全部清空。
2. 支持按拼音筛选。
3. 勾选省份将会勾选省份下所有城市。
4. 返回数据可灵活处理。

## 安装

``` bash
npm install cn-region-picker
# 或者
yarn add cn-region-picker
```

## 用法

组件引入：
```javascript

// import包
import CnRegionPicker from 'cn-region-picker'

// use
Vue.use(CnRegionPicker)
```

使用：

```html
<cn-region-picker
  v-model="pickCity"
  placeholder="城市"
>
</cn-region-picker>

<!-- 省略代码 -->
data () {
  return {
    pickCity: []
  }
}
```

选择返回的数据：

```json
[{
  "cityIndex": 37,
  "id": "210200",
  "name": "大连市",
  "pinYin": "dalian",
  "shortName": "大连"
}, {
  "cityIndex": 41,
  "id": "210600",
  "name": "丹东市",
  "pinYin": "dadong",
  "shortName": "丹东"
}]
```

## 属性

| 参数       | 说明    |  类型  |  默认值  |
| --------   | -----   | ---- |  ----  |
| placeholder| -    | String | 选择城市 |

## 本地运行

```bash
npm install
npm run dev
```

## 已更新

- `1.1.1` 增加过度效果、调整按钮样式、调整排序字母样式。增加npm搜索关键字。
