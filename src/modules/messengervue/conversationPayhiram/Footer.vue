<template>
  <div id="footer" class="holder">
    <div class="tools-container">
      <div class="action-container">
        <i class="fa fa-image" title="Add photo" aria-hidden="true" @click="showImages()"></i>
        <i class="fas fa-paperclip" title="Add photo" aria-hidden="true" @click="showImages()"></i>
        <input type="text" placeholder="Type your message here..." v-model="newMessageInput" @keypress="keypressHandler" class="message-input">
  <!--       <i class="fa fa-paper-plane" title="Send message" aria-hidden="true" @click="sendMessage()"></i> -->
        <button class="btn send-btn" @click="sendMessage()">Send</button>
      </div>
    </div>
    <!-- <browse-images-modal :customId="'sendImageModal'"></browse-images-modal> -->
    <!-- <img src="" alt=""> -->
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";

.holder{
  align-items: center;
  width: 100%;
  float: left;
  height: 10vh;
  border-top: 1px solid #eee;
  background-color: $white;
  position: relative;
  display: table;
  min-height: 50px;
}

.tools-container {
  align-items: center;
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}

.action-container{
  align-items: center;
  width: 100%;
  display: flex;
}

.tools-container i{
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

.tools-container i:hover{
  cursor: pointer;
  color: $secondary;
}

.message-input{
  border: 0px;
  width: 100%;
  line-height: 45px;
}

.send-btn{
  background: $white;
  color: #007bff;
  border: solid 1px #007bff;
  height: 40px;
  margin-right: 10px;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
// import Echo from 'laravel-echo'
export default {
  mounted(){
    // window.Echo.private('PAYHIRAM')
    // .listenForWhisper(COMMON.pusher.typing, e => {
    //   console.log('typing', e)
    // })
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      newMessageInput: ''
    }
  },
  props: ['group'],
  components: {
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'messenger-modal': require('modules/messengervue/conversationPayhiram/modal/Modal.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    keypressHandler(event){
      if(event.charCode === 13){
        this.sendMessage()
      }
    },
    manageImageUrl(url){
      this.sendImageAsMessage(url)
      this.hideImages()
    },
    sendImageAsMessage(url){
      if(url !== null){
        console.log(this.validation)
        let parameter = {
          messenger_group_id: AUTH.messenger.group.id,
          message: null,
          account_id: this.user.userID,
          status: 0,
          payload: 'image',
          payload_value: null,
          url: url,
          code: AUTH.messenger.messages.length + 1
        }
        let newMessageTemp = {
          ...parameter,
          account: this.user,
          created_at_human: null,
          sending_flag: true,
          error: null,
          files: [{
            url: url
          }]
        }
        AUTH.messenger.messages.push(newMessageTemp)
        this.APIRequest('messenger_messages/create_with_image_without_payload', parameter).then(response => {
          if(response.data !== null){
            this.newMessageInput = null
            this.manageResponse(response.data)
          }
        })
      }
    },
    onTyping(){
      // let data = {
      //   user: this.user.username,
      //   typing: true
      // }
      // console.log('data', data)
      // window.Echo.private('PAYHIRAM')
      // .whisper(COMMON.pusher.typing, data)
    },
    sendMessage(){
      if((this.newMessageInput !== '' || this.newMessageInput !== null) && AUTH.messenger.group.new === false){
        let parameter = {
          messenger_group_id: AUTH.messenger.group.id,
          message: this.newMessageInput,
          account_id: this.user.userID,
          status: 0,
          payload: 'text',
          payload_value: null,
          code: AUTH.messenger.messages.length + 1
        }
        let newMessageTemp = {
          ...parameter,
          account: this.user,
          created_at_human: null,
          sending_flag: true,
          error: null
        }
        AUTH.messenger.messages.push(newMessageTemp)
        this.newMessageInput = null
        this.APIRequest('messenger_messages/create', parameter).then(response => {
          if(response.data !== null){
            this.newMessageInput = null
            // update previous message
            this.manageResponse(response.data)
          }
        })
      }
    },
    manageResponse(data){
      for (var i = AUTH.messenger.messages.length - 1; i > 0; i--) {
        let item = AUTH.messenger.messages[i]
        if(typeof item.code === 'undefined' || item.code === undefined){
          break
        }
        if(parseInt(item.code) === parseInt(data.code)){
          AUTH.messenger.messages[i] = data
          break
        }
      }
    },
    showImages(){
      $('#sendImageModal').modal('show')
    },
    hideImages(){
      $('#sendImageModal').modal('hide')
    }
  }
}
</script>
