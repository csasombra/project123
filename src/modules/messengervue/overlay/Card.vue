<template>
  <div>
    <div class="messenger-header">
      <label><b>****{{auth.messenger.title.substr(55, 43)}}</b><i class="fa fa-times pull-right" @click="close()"></i></label>
    </div>
    <div class="conversation-content">
      <div class="message-holder" id="message-holder-scroll">
        <div class="loading" v-if="isLoading">
          <span class="fa fa-spinner fa-spin"></span>
        </div>
       
        <messages :data="auth.messenger.messages"  v-if="auth.messenger.messages !== null"></messages>
      </div>
      <div class="input-holder">
        <send :flag="flag" :groupId="groupId"></send>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.loading{
  text-align: center;
  position: absolute;
  z-index: 9;
  color: $primary;
  padding: 8px 18px;
  border-radius: 5px;
  left: calc(55% - 45px);
  top: calc(15% - 18px);
}

.fa-spin{
  animation-duration: 0.50s;
}

.messenger-header{
  width: 100%;
  float: left;
  height: 50px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  line-height: 50px;
  padding-left: 10px;
  padding-right: 10px;
}

.messenger-header label{
  width: 100%;
}

.messenger-header i{
  font-size: 24px;
  margin-top: 13px;
}

.messenger-header i:hover{
  cursor: pointer;
  color: $primary;
}

.conversation-content{
  height: 275px;
  width: 100%;
  float: left;
  background: #fff;
}

.message-holder{
  height: 225px;
  overflow-y: auto;
  width: 100%;
  float: left;
  background: #fff;
  display: flex;
  flex-direction: column-reverse;
}

.input-holder{
  height: 50px;
  width: 100%;
  float: left;
  background: #fff;
  border-top: solid 1px #ddd;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import axios from 'axios'
export default {
  mounted(){
    this.retrieve()
    let obj = this
    $('#message-holder-scroll').scroll(function(){
      if(this.height < $('#message-holder-scroll').scrollTop()){
      }else if($('#message-holder-scroll').scrollTop() < $('#message-holder-scroll').height()){
        this.height = $('#message-holder-scroll').scrollTop()
        obj.onScroll()
      }
    })
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      common: COMMON,
      data: null,
      groupId: null,
      flag: true,
      auth: AUTH,
      height: 0,
      isLoading: false
    }
  },
  components: {
    'send': require('modules/messengervue/overlay/Send.vue'),
    'messages': require('modules/messengervue/overlay/Messages.vue')
  },
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
    close(){
      AUTH.messenger.messages = []
      AUTH.messenger.title = null
      AUTH.messenger.messengerGroupId = null
      AUTH.messenger.group = null
      AUTH.messenger.badge = 0
      AUTH.messenger.data = null
    },
    retrieve(){
      if(AUTH.messenger.group === null){
        let parameter = {
          condition: [{
            column: 'title',
            value: AUTH.messenger.data.code,
            clause: '='
          }]
        }
        this.APIRequest('messenger_groups/retrieve', parameter).done(response => {
          if(response.data.length > 0){
            // retrieve messages using id
            AUTH.messenger.messengerGroupId = response.data[0].id
            AUTH.messenger.group = response.data[0]
            this.retrieveMessages(response.data[0].id)
          }else{
            // create new message
            this.createNewMessage()
          }
        })
      }
    },
    createNewMessage(){
      let parameter = {
        member: AUTH.messenger.data.account_id,
        creator: this.user.userID,
        title: AUTH.messenger.data.code,
        payload: AUTH.messenger.data.id
      }
      this.APIRequest('custom_messenger_groups/create', parameter).done(response => {
        if(response.data > 0){
          AUTH.messenger.messengerGroupId = response.data
          this.retrieveMessages(response.data, false, 0)
        }else{
          // Unable to create
        }
      })
    },
    retrieveMessages(id, flag, scrollTop){
      let parameter = {
        condition: [{
          column: 'messenger_group_id',
          value: id,
          clause: '='
        }],
        sort: {
          created_at: 'desc'
        },
        limit: 5,
        offset: AUTH.messenger.messages.length > 0 ? AUTH.messenger.messages.length - 1 : 0
      }
      this.isLoading = true
      this.APIRequest('messenger_messages/retrieve', parameter).done(response => {
        if(response.data.length > 0){
          if(flag === false){
            AUTH.messenger.messages = response.data.reverse()
          }else{
            $('#message-holder-scroll').animate({
              scrollTop: scrollTop - 50
            }, 50)
            if(AUTH.messenger.messages.length > 0){
              let nessages = [...response.data.reverse(), ...AUTH.messenger.messages]
              AUTH.messenger.messages = nessages
            }else{
              AUTH.messenger.messages = response.data.reverse()
            }
          }
        }else{
          // create new message
          if(flag === false){
            AUTH.messenger.messages = null
          }
        }
        this.isLoading = false
      })
    },
    onScroll(){
      var height = $('#message-holder-scroll').height()
      var scrollTop = $('#message-holder-scroll').scrollTop()
      if(scrollTop < height && scrollTop <= (((AUTH.messenger.messages.length / 5) * 301)) * -1 && this.isLoading === false){
        this.retrieveMessages(AUTH.messenger.messengerGroupId, true, scrollTop)
      }
    }
  }
}
</script>
