<template>
  <div class="messenger-header-holder" v-if="group !== null">
    <img :src="config.BACKEND_URL + group.title.profile.url" class="profile" v-if="group.title.profile !== null">
    <i class="fa fa-user-circle-o" v-else></i>
    <label id="user-name">{{group.title.username}}
      <!-- <span class="badge badge-primary">{{group.total_members}}</span> -->
    </label> 
    <!-- <i id="icon-call" class="fa fa-phone bg-primary icons" @click="callHandler(group.title.id)"></i> -->
    <i class="fa fa-chevron-right" @click="setMobileView()"></i>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
#user-name{
  flex: 1;
}
#icon-call {
    margin-right: 25px;
    background-color: $primary !important;
}
#icon-call:hover {
    cursor: pointer;
}
.icons{
    font-size: 30px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    color: white;
    line-height: 40px;
    text-align: center;
}
.messenger-header-holder{
  width: 100%;
  float: left;
  height: 8vh;
  padding-left: 5px;
  border-bottom: solid 1px #eee;
  padding-left: 10px;
  display: flex;
  align-items: center;
}
.profile{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  float: left;
  margin-top: 5px;
}
label{
  line-height: 8vh;
  padding-left: 10px;
  float: left;
  align: center;
}
i{
  font-size: 30px;
  line-height: 8vh;
  float: left;
  color: $primary;
}
.fa-chevron-right{
  display: none;
  padding-right: 10px;
  float: right;
}
@media (max-width: 991px){
  .fa-chevron-right{
    display: block;
  }
  #icon-call {
    margin-right: 10px;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default {
  mounted(){
  },
  data(){
    return {
      config: CONFIG
    }
  },
  props: ['group'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    setMobileView(){
      this.$parent.updateMobileViewFlag(true)
    },
    callHandler(id){
      AUTH.triggerAudioCall(2, id)
    }
  }
}
</script>
