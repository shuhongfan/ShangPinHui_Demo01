<template>
  <a :title="title" style="margin:5px;">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: "HintButton",
  props: ['title'],
  methods: {

  }
}
</script>

<style scoped>

</style>
