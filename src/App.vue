<template>
  <div id="app">
    <cn-region-picker
      :pickedCity="pickedCity"
      @on-pick-city="pickedCity = $event"
      :showClose="true"
    ></cn-region-picker>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      pickedCity: []
    }
  },
  methods: {
    onPickCity(value) {
      console.log('选择的数据', value)
    }
  },
  created() {}
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
