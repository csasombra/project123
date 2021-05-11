<template>
  <div class="conversations" v-if="parseInt(auth.messenger.group.account_id) !== user.userID && parseInt(auth.messenger.group.request.status) < 2 && auth.messenger.group.validations.transfer_status !== 'approved' && parseInt(auth.messenger.group.validations.validation_status) > 0">
    <div class="message-row">
      <div class="template">
        <div class="incre-row text-center">
          <label class="text-primary">Hi <b>{{user.username}}!</b> Send the requirements below. Just click the button.</label>
          <span class="incre-row">
            <button class="btn btn-white text-primary" @click="complyRequirements(item)" v-for="(item, index) in auth.messenger.group.validations.requirements" :key="index" v-if="item.validations !== null" style="margin-right: 10px;">{{item.title}}</button>
          </span>
        </div>
      </div>
    </div>
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
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import LEDGER from 'src/services/Ledger.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      auth: AUTH,
      common: COMMON,
      jquery: $
    }
  },
  props: ['group'],
  methods: {
    complyRequirements(item){
      this.$parent.validation = item
      $('#browseImagesModal').modal('show')
    }
  }
}
</script>
