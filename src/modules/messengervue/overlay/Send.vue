<template>
  <div class="send-holder">
    <input type="text" class="custom-input" placeholder="Send a message" v-model="newMessageInput" @keyup.enter="newmessage()">
  </div>
</template>
<style scoped>
.send-holder{
  width: 100%;
  float: left;
  height: 48px;
}
.custom-input{
  border: 0px;
  height: 46px;
  width: 100%;
  float: left;
  padding-left: 10px;
  padding-right: 10px;
  color: #555;
}
.custom-input:focus{
  outline: none;
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
      newMessageInput: null
    }
  },
  props: ['flag', 'groupId'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    setToSent(indexParam, object){
      let item = AUTH.messenger.messages.map((item, index) => {
        if(index === indexParam){
          return {
            ...item,
            sending_flag: false,
            ...object
          }
        }
        return item
      })
      AUTH.messenger.messages = item
    },
    newmessage(){
      console.log('hhi')
      if((this.newMessageInput !== '' || this.newMessageInput !== null)){
        let input = this.newMessageInput
        AUTH.messenger.messages.push({
          messenger_group_id: AUTH.messenger.messengerGroupId,
          message: input,
          account_id: this.user.userID,
          payload: 'text',
          sending_flag: true,
          account: this.user
        })
        let parameter = {
          messenger_group_id: AUTH.messenger.messengerGroupId,
          message: input,
          account_id: this.user.userID,
          payload: 'text'
        }
        this.newMessageInput = null
        this.APIRequest('messenger_messages/create_less_return', parameter).then(response => {
          if(response.data !== null){
            this.newMessageInput = null
            for (var i = AUTH.messenger.messages.length - 1; i >= 0; i--) {
              let item = AUTH.messenger.messages[i]
              this.setToSent(i, response.data)
            }
          }else{
            // error message here
          }
        })
      }else{
        this.newMessageInput = null
      }
    }
  }
}
</script>
