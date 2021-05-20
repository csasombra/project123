<template>
  <div class="profile-preview-wrapper" v-if="item !== null">
    <profile-header :item="item" v-if="item.account !== null" :location="localCode"></profile-header>
    <br>
    <br>
    <div class="incre-row" style="margin-top: 25px;">
      <label class="title"><b>Actions</b></label>
      <div class="incre-row">
        <button v-if="item.status != 'BLOCKED'" class="btn btn-danger" style="margin-top: 3%; margin-bottom: 3%" @click="verify(item, 'BLOCKED')">Block Account</button>
        <button v-else class="btn btn-danger" style="margin-top: 3%; margin-bottom: 3%" @click="verify(item, '_VERIFIED')">Unblock Account</button>
        <button class="btn btn-primary" style="margin-top: 3%; margin-bottom: 3%" @click="verify(item, 'ACCOUNT_VERIFIED')">Account Verified</button>
        <button class="btn btn-primary" style="margin-top: 3%; margin-bottom: 3%" @click="verify(item, 'BASIC_VERIFIED')">Basic Verified</button>
        <button class="btn btn-primary" style="margin-top: 3%; margin-bottom: 3%" @click="verify(item, 'STANDARD_VERIFIED')">Standard Verified</button>
        <button class="btn btn-primary" style="margin-top: 3%; margin-bottom: 3%" @click="verify(item, 'BUSINESS_VERIFIED')">Business Verified</button>
        <button class="btn btn-primary" style="margin-top: 3%; margin-bottom: 3%" @click="verify(item, 'ENTERPISE_VERIFIED')">Enterprise Verified</button>
      </div>
    </div>
    <div class="incre-row" v-if="localCode !== null">
      <label class="title"><b>Location Assigned</b></label>
       <div class="incre-row" style="margin-bottom: 30px;">
          <label v-if="localCode !== null">
            <b>{{localCode.code.toUpperCase()}}</b> - {{`${localCode.route}, ${localCode.locality}, ${localCode.region}, ${localCode.country}`}}
          </label>
          <br>
          <span class="form-group">
            <input type="text" class="form-control"  style="width: 30%; float: left !important; margin-right: 10px;" v-model="scope"/>
            <button class="btn btn-primary" @click="updateScope()">Update Scope</button>
          </span>
       </div>
    </div>
    <basic :item="item"></basic>
    <ids :item="uploadImage"></ids>
    <br>
    <view-location
     ref="locate"
    ></view-location>
    <Confirmation
      ref="confirm"
      :title="'Message'"
      :message="'Are you sure you want to ' + message + ' this account?'"
      @onConfirm="verifyUser($event)"
    ></Confirmation>
  </div>
</template>
<style scoped>
.action {
  width:40%;
}
.danger {
  background-color: #EB5757;;
}
.success{
  background-color: #22B173;
}
.profile-preview-wrapper{
  width: 100%;
  float: left;
  min-height: 100px;
  overflow-y: hidden;
}
@media (max-width: 992px){
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import Confirmation from 'src/components/increment/generic/modal/Confirmation.vue'
export default{
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      uploadImage: [],
      localCode: null,
      message: null,
      scope: null
    }
  },
  props: ['item'],
  components: {
    'profile-header': require('modules/profile/Header.vue'),
    'basic': require('modules/profile/Basic.vue'),
    'works': require('modules/profile/Works.vue'),
    'ids': require('modules/profile/Ids.vue'),
    'reviews': require('modules/profile/Reviews.vue'),
    'educations': require('modules/profile/Educations.vue'),
    'payments': require('modules/profile/Payments.vue'),
    'comakers': require('modules/profile/CoMakers.vue'),
    'guarantors': require('modules/profile/Guarantors.vue'),
    'view-location': require('modules/request/ViewLocation.vue'),
    'view-modal': require('modules/request/ViewIdModal.vue'),
    Confirmation
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    verify(item, message){
      this.message = message
      this.$refs.confirm.show(item, message)
    },
    verifyUser(data){
      if(this.message == null){
        return
      }
      this.$parent.$parent.updateStatusByParams(data, this.message)
    },
    unblockUser(data){
      this.$parent.$parent.updateStat(data)
    },
    blockUser(data){
      this.$parent.$parent.updateUserStatus(data)
    },
    location(item){
      this.$refs.locate.showAddressModal(item)
    },
    viewId(item){
      this.$refs.upload.showModal(item)
    },
    updateScope(){
      if(this.localCode === null){
        return
      }
      if(this.localCode.account_id !== this.item.id){
        return
      }
      if(this.scope === null || this.scope === ''){
        return
      }
      let parameter = {
        id: this.localCode.id,
        code: this.scope
      }
      this.APIRequest('locations/update', parameter).then(response => {
        this.retrieveLocation(this.item)
      })
    },
    retrieveLocation(item){
      let parameter = {
        condition: [{
          value: item.id,
          column: 'account_id',
          clause: '='
        }]
      }
      this.APIRequest('locations/retrieve', parameter).then(response => {
        if(response.data.length > 0){
          this.localCode = response.data[0]
        }else{
          this.localCode = null
        }
      })
    },
    retrieveImage(item){
      this.uploadImage = []
      let parameter = {
        account_id: item.id,
        payload: 'upload_image'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('account_cards/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          response.data[0].content.forEach(element => {
            this.uploadImage.push(element)
          })
        }else{
          this.uploadImage = []
        }
      })
    }
  }
}
</script>
