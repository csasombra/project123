<template>
  <div class="conversations">
    <br>
    <div class="message-row">
      <div class="template">
        <div v-if="errormessage" style="color: red">***Invalid Access</div>
        <div class="incre-row text-center">
          <label class="text-white">Hi <b>{{user.username}}!</b> Are you sure you want to cancel this transaction?</label>
          <span class="incre-row">
            <button class="btn btn-white text-primary" @click="cancel()">Ok</button>
          </span>
        </div>
      </div>
    </div>
    <authenticateOtp ref="authenticateOOTP"></authenticateOtp>
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

.message-row, .template{
  width: 98%;
  min-height: 10px;
  overflow-y: hidden;
  margin-bottom: 5px;
  margin-top: 5px;
  margin-left: 1%;
  margin-right: 1%;
  background-color: $secondary;
  padding: 5%
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import authenticateOtp from 'modules/transfer/Otp.vue'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      auth: AUTH,
      common: COMMON,
      jquery: $,
      errormessage: false
    }
  },
  props: ['group'],
  components: {
    authenticateOtp
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    cancel(){
      let parameter = {
        id: AUTH.messenger.group.id
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('requests/delete', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.redirect('/enableSupport')
      })
    }
  }
}
</script>
