<template>
  <div class="holder">
    <div class="options">
      <label>Other Options Here</label>
    </div>
  </div>
</template>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG
    }
  },
  props: ['params'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
<style scoped>
.holder{
  width: 100%;
  float: left;
  height: 30vh;
}
.options{
  background: #999;
  height: 100%;
  text-align: center;
}

</style>
