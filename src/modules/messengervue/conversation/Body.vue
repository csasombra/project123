<template>
  <div id="messenger">
    <div class="messenger-holder" v-if="conversations !== null">
      <div class="message-row" v-for="(item, index) in conversations" :key="index">
        
        <div v-if="parseInt(item.account_id) !== user.userID">
          <div class="template" v-if="item.payload === 'text'">
            <div class="header">
              <div class="profile">
                <img :src="config.BACKEND_URL + item.account.profile.url" v-if="item.account.profile !== null">
                <i class="fa fa-user-circle-o text-green" v-else></i>
              </div>
              <span class="details" v-if="item.account !== null">
                <label><b>{{item.account.username}}</b></label>
              </span>
            </div>
            <div class="content">
              <label>
                <label v-html="item.message"></label>
              </label>
            </div>
          </div>
          <product-message :classStyle="'left'" :data="item" v-else></product-message>
        </div>

        <div v-else>
          <div class="template" v-if="item.payload === 'text'">
            <div class="header-right">
              <div class="profile">
                <img :src="config.BACKEND_URL + item.account.profile.url" v-if="item.account.profile !== null">
                <i class="fa fa-user-circle-o text-green" v-else></i>
              </div>
              <span class="details" v-if="item.account !== null">
                <label><b>{{item.account.username}}</b></label>
              </span>
            </div>
            <div class="content-right">
              <label>
                <bdi>
                  <label v-html="item.message"></label>
                </bdi>
              </label>
            </div>
          </div>
          <product-message :classStyle="'right'" :data="item" v-else></product-message>
        </div>

      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.content-product {
  border: 1px solid $primary;
  float: right !important;
  width: auto !important;
  height: auto !important;
}
.messenger-holder{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.messenger-messages{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.message-row, .template{
  width: 98%;
  min-height: 10px;
  overflow-y: hidden;
  margin-bottom: 5px;
  margin-top: 5px;
  margin-left: 1%;
  margin-right: 1%;
}
.template .header{
  height: 40px;
  width: 100%;
  float: left;
}

.header .profile{
  float: left;
  width: 40px;
  height: 40px;
  margin-right: 2%;
}
.header .profile img{
  height: 30px;
  width: 30px;
  z-index: 0;
  border-radius: 50%;
}

.header .profile i{
  line-height: 30px;
  font-size: 30px;
  color: $secondary !important;
}
.header .details{
  float: left;
  height: 40px;
}
.header .details label{
  width: 100%;
  float: left;
  color: #555;
  line-height: 12px;
  line-height: 30px;
}


.header-right .profile{
  float: right;
  width: 40px;
  height: 40px;
  margin-left: 2%;
  text-align: right;
}
.header-right .profile img{
  height: 30px;
  width: 30px;
  z-index: 0;
  border-radius: 50%;
}

.header-right .profile i{
  line-height: 30px;
  font-size: 30px;
  color: $primary !important;
}
.header-right .details{
  float: right;
  height: 40px;
}
.header-right .details label{
  width: 100%;
  float: right;
  color: #555;
  line-height: 12px;
  line-height: 30px;
}
.template .content{
  min-height: 10px;
  float: left;
  width: 100%;
  overflow-y: hidden;
  text-align: justify;
}
.template .content-right{
  min-height: 10px;
  float: left;
  width: 100%;
  overflow-y: hidden;
  text-align: right;
}
.template .content label, .template .content-righ label{
  line-height: 18px;
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
      user: AUTH.user,
      config: CONFIG
    }
  },
  components: {
    'product-message': require('modules/messengervue/conversation/templates/Product.vue')
  },
  props: ['conversations'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
