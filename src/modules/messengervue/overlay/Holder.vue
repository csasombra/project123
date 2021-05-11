<template>
  <div class="support-messenger">
    <div class="messenger-content">
      <card></card>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.support-messenger{
  min-width: 50px;
  min-height: 50px;
  overflow: hidden;
  position: fixed;
  bottom: 0px;
  right: 10px;
  max-width: 325px;
  z-index: 1000;
}
.messenger-icon{
  height: 60px;
  width: 60px;
  float: right;
  border-radius: 50%;
  background: $primary;
  color: #fff;
  text-align: center;
}
.messenger-icon:hover{
  cursor: pointer;
  color: $primary;
  background: #fff;
  border: solid 1px $primary;
}
.messenger-icon i{
  font-size: 30px;
  line-height: 60px;
}
.messenger-content{
  height: 325px;
  width: 325px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  float: left;
  border: solid 1px #ddd;
  background: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.messenger-content-first{
  height: 60px;
  width: 255px;
  margin-right: 10px;
  border-radius: 5px;
  float: left;
  background: $primary;
  border: solid 1px #ddd;
  color: #fff;
}
.messenger-content-first .username{
  font-size: 18px;
  line-height: 12px;
  float: left;
  width: 90%;
  margin-right: 5%;
  margin-left: 5%;
  padding-top: 10px;
  font-weight: 600;
}

.messenger-content-first .question{
  line-height: 12px;
  float: left;
  width: 90%;
  margin-right: 5%;
  margin-left: 5%;
  font-size: 12px;
}
@media (max-width: 991px){
  .support-messenger{
    bottom: 5px;
    right: 5px;
    width: 90%;
  }
  .messenger-icon{
    height: 50px;
    width: 50px;
  }
  .messenger-icon i{
    line-height: 50px;
  }
  // creates extra space below msg input
  .messenger-content{
    // height: 70vh;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import axios from 'axios'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      data: null,
      flag: false,
      group: null,
      auth: AUTH,
      common: COMMON
    }
  },
  components: {
    'card': require('modules/messengervue/overlay/Card.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    changeFlag(){
      this.flag = !this.flag
      if(this.conversationStatus === 'initial'){
        this.conversationStatus = 'start'
      }
      if(this.flag === true){
        AUTH.messenger.badge = 0
      }
    }
  }
}
</script>
