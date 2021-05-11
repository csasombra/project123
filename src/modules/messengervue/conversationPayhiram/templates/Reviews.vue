<template>
  <div class="conversations" v-if="parseInt(auth.messenger.group.request.status) === 2">
    <div class="message-row" v-if="auth.messenger.group.rating === null">
      <div class="template">
        <div class="incre-row text-center">
          <label class="text-primary">Hi <b>{{user.username}}!</b> Please help <b>{{auth.messenger.group.title.username}}</b> by giving a review.</label>
          <span class="incre-row">
            <button class="btn btn-white text-primary" @click="review()">Submit review and rating</button>
          </span>
        </div>
      </div>
    </div>
    <div class="incre-row text-center">
      <label><i style="color: #aaa">Transaction completed!</i></label>
    </div>
    <add-ratings ref="addRatings"></add-ratings>
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
  props: ['group'],
  components: {
    'add-ratings': require('components/increment/generic/rating/Create.vue')
  },
  methods: {
    review(){
      let payload = 'profile'
      let payloadValue = AUTH.messenger.group.title.id
      if(payloadValue !== null){
        this.$refs.addRatings.show(payload, payloadValue, 'request', AUTH.messenger.group.payload)
      }
    },
    retrieve(){
      this.$parent.retrieve()
    }
  }
}
</script>
