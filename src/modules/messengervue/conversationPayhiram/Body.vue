<template>
  <div id="messenger">
    <div class="messenger-holder" v-if="auth.messenger.messages !== null">
      <div class="message-row" v-for="(item, index) in auth.messenger.messages" :key="index">
        <div v-if="item.account_id != auth.messenger.group.members.result[0].account_id">
        <!-- <div v-if="parseInt(item.account_id) !== user.userID"> -->
          <image-message :message="item" :template="''" :group="auth.messenger.group" v-if="item.payload === 'image'" @showImage="showImage($event)"></image-message>
          <div class="template" v-if="item.payload === 'text'">
            <div class="header">
              <div class="profile">
                <img :src="config.BACKEND_URL + item.account.profile.url" v-if="item.account.profile !== null">
                <i class="fa fa-user-circle-o text-green" v-else></i>
              </div>
              <span class="details" v-if="item.account !== null">
                <!-- <label><b>{{auth.messenger}}</b></label> -->
                <label><b>{{item.account.username}}</b></label>
              </span>
            </div>
            <div class="content" style="margin-top:-10px;">
              <i style="font-size: 11px;color: #555;">{{item.created_at_human}}</i>
            </div>
            <div class="content">
              <label>
                <label v-html="item.message"></label>
              </label>
            </div>
          </div>
        </div>

        <div v-else>
          <image-message :message="item" :template="'-right'" :group="auth.messenger.group" v-if="item.payload === 'image'" @showImage="showImage($event)"></image-message>
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
            <div class="content-right" style="margin-top:-10px;">
                <i style="font-size: 11px;color: #555;">{{item.created_at_human}}</i>
            </div>
            <div class="content-right">
              <label id="labelRight">
                <bdi>
                  <label v-html="item.message"></label>
                </bdi>
              </label>
<!--               <span style="width: 100%" v-if="auth.messenger.messages[index].sending_flag === true">
                <i class="text-gray">Sending ...</i>
              </span> -->
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- <add-requirements :group="auth.messenger.group"></add-requirements>
    <send-requirements :group="auth.messenger.group"></send-requirements>
    <transfer :group="auth.messenger.group"></transfer>
    <add-reviews :group="auth.messenger.group"></add-reviews>
    <browse-images-modal></browse-images-modal>
    <show-image-modal ref="showImage"></show-image-modal> -->
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.btn{
  height: 45px !important;
}
.btn-white{
  background: $white;
  border: solid 1px $textBlue !important;
}

.btn-white:hover{
  cursor: pointer;
  background: $primary !important;
  color: $white !important;
}
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
  text-align: left;
  max-width: 60%;
}
.template .content-right{
  min-height: 10px;
  float: left;
  width: 100%;
  overflow-y: hidden;
  text-align: right;
}
.template .content label{
  line-height: 18px;
  background: $textBlue;
  color: $white;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-right: 5px;
  padding-left: 5px;
  margin-bottom: 0px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.template .content-right label{
  line-height: 18px;
  background: $textBlue;
  color: $white;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 5px;
  padding-left: 5px;
  margin-bottom: 0px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.template .content-right #labelRight{
  max-width: 60%;
}


</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import LEDGER from 'src/services/Ledger.js'
export default {
  mounted(){
    console.log(AUTH.messenger.group.members.result[0])
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      auth: AUTH,
      validation: null,
      requirements: {
        url: null
      }
    }
  },
  components: {
    'image-message': require('modules/messengervue/conversationPayhiram/templates/Image.vue'),
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'show-image-modal': require('components/increment/generic/modal/Image.vue'),
    'add-requirements': require('modules/messengervue/conversationPayhiram/templates/AddRequirements.vue'),
    'send-requirements': require('modules/messengervue/conversationPayhiram/templates/SendRequirements.vue'),
    'transfer': require('modules/messengervue/conversationPayhiram/templates/Transfer.vue'),
    'add-reviews': require('modules/messengervue/conversationPayhiram/templates/Reviews.vue')
  },
  props: ['conversations', 'group'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      this.$parent.retrieveParent()
    },
    showImage(event){
      this.$refs.showImage.setImage(event.url)
    },
    manageImageUrl(url){
      if(this.validation !== null){
        this.sendMessage(url)
      }
    },
    sendMessage(url){
      if(url !== null){
        let parameter = {
          messenger_group_id: AUTH.messenger.group.id,
          message: null,
          account_id: this.user.userID,
          status: 0,
          payload: 'image',
          payload_value: this.validation.validations.id,
          url: url,
          code: AUTH.messenger.messages.length + 1
        }
        this.APIRequest('messenger_messages/create_with_images', parameter).then(response => {
          if(response.data !== null){
            this.newMessageInput = null
            AUTH.messenger.messages.push(response.data)
            this.$parent.retrieve()
          }
        })
      }
    }
  }
}
</script>
