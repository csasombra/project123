<template>
  <div class="holder">
    <div class="header text-primary">
      <b>Threads</b>
    </div>
    <m-card v-for="(partner, index) in partners" :key="'B' + partner.id" :group="partner" :index="index" :moduleText="'partners'"></m-card>
    <m-card v-for="(group, index) in groups" :key="'A' + group.id" :group="group" :index="index" :moduleText="'groups'"></m-card>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.holder{
  width: 100%;
  float: right;
}
.holder .header{
  width: 100%;
  float: left;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  border-bottom: solid 1px #eee;
}
.create-new-group{
  line-height: 50px; 
  padding-right: 10px;
}
.create-new-group:hover{
  cursor: pointer;
  color: $white;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG
    }
  },
  props: ['groups', 'partners'],
  components: {
    'm-card': require('modules/messengervue/userlist/Card.vue'),
    'm-options': require('modules/messengervue/userlist/OtherOptions.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    makeActive(selectedIndex, moduleText){
      this.$parent.makeActiveCard(selectedIndex, moduleText)
    },
    updateModalViewFlag(flag){
      this.$parent.updateMobileViewFlag(flag)
    }
  }
}
</script>
