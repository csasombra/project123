<template>
  <div class="holder" id="groupConversation">
    <c-header :group="auth.messenger.group" v-if="auth.messenger.group !== null"></c-header>
    <div class="conversation-messages-holder">
      <c-body :conversations="auth.messenger.messages" :group="auth.messenger.group" v-if="auth.messenger.group !== null"></c-body>
    </div>

    <!-- && parseInt(auth.messenger.group.request.status) < 2 -->
    
    <!-- <c-footer :group="auth.messenger.group" v-if="auth.messenger.group !== null" @changeGroupEvent="changedGroupHandler($event)"></c-footer> -->
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.holder{
  width: 100%;
  float: left;
}
.conversation-messages-holder{
  width: 100%;
  float: left;
  // height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}
.products{
  position: absolute;
  height: 500px;
  width: 300px;
  z-index: 10;
  bottom: 10px;
  right: 20px;
  background: white;
  border: 1px solid $primary;
  border-radius: 5px;
  overflow: auto;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
export default {
  mounted(){
    this.retrieve()
    console.log('[df', AUTH.messenger)
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      auth: AUTH,
      id: null,
      newFlag: false
    }
  },
  components: {
    'c-header': require('modules/messengervue/conversationPayhiram/Header.vue'),
    'c-body': require('modules/messengervue/conversationPayhiram/Body.vue'),
    'c-footer': require('modules/messengervue/conversationPayhiram/Footer.vue')
  },
  props: ['groupId', 'group'],
  watch: {
    groupId: function(newVal, oldVal) { // watch it
      this.groupId = newVal
      this.retrieve()
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      if(AUTH.messenger.messengerGroupId){
        let parameter = {
          condition: [{
            value: AUTH.messenger.messengerGroupId,
            column: 'messenger_group_id',
            clause: '='
          }],
          sort: {
            'created_at': 'ASC'
          }
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('messenger_messages/retrieve', parameter).done(response => {
          $('#loading').css({display: 'none'})
          if(response.data.length > 0){
            AUTH.messenger.messages = response.data
            this.updateUnreadToRead()
          }else{
            AUTH.messenger.messages = null
          }
        })
      }else{
        AUTH.messenger.messages = null
      }
    },
    updateUnreadToRead(){
      if(AUTH.messenger.messages !== null){
        let lastMessage = AUTH.messenger.messages[AUTH.messenger.messages.length - 1]
        if(parseInt(lastMessage.account.id) !== this.user.userID){
          // update
          let parameter = {
            id: lastMessage.id,
            status: 1
          }
          this.APIRequest('messenger_messages/update', parameter).then(response => {
            AUTH.retrieveMessages(this.user.userID, this.user.type)
          })
        }
      }
    },
    updateMobileViewFlag(flag){
      this.$parent.updateMobileViewFlag(flag)
    },
    changedGroupHandler(data){
      this.$emit('changeGroupEvent', data)
    },
    retrieveParent(){
      this.$parent.retrieve(true)
    }
  }
}
</script>
