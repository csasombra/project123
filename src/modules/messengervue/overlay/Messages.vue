<template>
  <div id="messenger">
    <div class="support-messenger-holder" v-if="auth.messenger.messages !== null">
      <div class="message-row" v-for="item, index in auth.messenger.messages">
        <div class="template" v-if="parseInt(item.account_id) !== user.userID">
          <div class="header">
            <div class="profile">
              <img :src="config.BACKEND_URL + item.account.profile.url" v-if="item.account && item.account.profile !== null">
              <i class="fa fa-user-circle text-green" v-else></i>
            </div>
            <span class="details" v-if="item.account !== null">
              <label><b>{{item.account.username}}</b></label>
            </span>
          </div>

          <div class="content" style="line-height: 12px;">
            <label style="font-size: 11px; color: #555; margin-bottom: 0px;">
              {{item.created_at_human}}
            </label>
          </div>
          <div class="content">
            <label>
              <label v-html="item.message" class="text-holder-left"></label>
            </label>
          </div>
        </div>

        <div class="template" v-else>
          <div class="header-right">
            <div class="profile">
              <img :src="config.BACKEND_URL + item.account.profile.url" v-if="item.account && item.account.profile !== null">
              <i class="fa fa-user-circle text-green" v-else></i>
            </div>
            <span class="details" v-if="item.account !== null">
              <label><b>{{item.account.username}}</b></label>
            </span>
          </div>
          <div class="content-right" style="line-height: 12px;">
            <label style="font-size: 11px; color: #555; margin-bottom: 0px;">
              {{item.created_at_human}}
            </label>
          </div>
          <div class="content-right">
            <label>
              <bdi>
                <label v-html="item.message" class="text-holder-right"></label>
              </bdi>
            </label>
            <bdi v-if="item.sending_flag === true" class="newLineBdi">
              <label style="font-size: 8px; color: #555;">Sending...</label>
            </bdi>
          </div>
        </div>
    </div>
  </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.support-messenger-holder{
  width: 90%;
  float: left;
  margin-left: 5%;
  margin-right: 5%;
  min-height: 50px;
  overflow-y: hidden;
}
.message-row, .template{
  width: 100%;
  min-height: 10px;
  overflow-y: hidden;
  margin-top: 10px;
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
.template .content label, .template .content-right label{
  line-height: 18px;
  margin-bottom: 0px;
}

.newLineBdi{
  width: 100%;
  float: left;
  line-height: 12px;
}


.text-holder-right{
  background-color: $primary;
  color: $white;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 1px;
}

.text-holder-left{
  background-color: $primary;
  color: $white;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  border-bottom-left-radius: 1px;
  border-bottom-right-radius: 7px;
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
      config: CONFIG,
      auth: AUTH
    }
  },
  props: ['data'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
