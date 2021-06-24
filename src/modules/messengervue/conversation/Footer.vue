<template>
  <div id="footer" class="holder">
    <div class="product-selected" v-if="selectedItem !== null"> 
      <i class="fa fa-times close close-icon" aria-hidden="true" @click="deleteSelectedItem"></i>
      <img width="auto" height="100" v-if="selectedItem.featured !== null" :src="config.BACKEND_URL + selectedItem.featured[0].url">
      <i class="fa fa-image alt-image" v-else></i> 
      <div class="arrow-down"></div>
    </div>
    <div class="tools-container">
      <i id="attach-file" class="fa fa-paperclip" title="upload file" aria-hidden="true" @click="showImages()"></i>
      <input type="text" class="form-control" placeholder="Type your message here..." 
        v-model="newMessageInput" @keyup="keyupHandler" @keypress="keypressHandler" @input="manageInput"/>
      <i id="send-btn" class="fa fa-paper-plane" title="send message" aria-hidden="true" @click="sendMessage(selectedItem)"></i>
      <small class="instruction" v-if="user.type === 'PARTNER'">Type @P_ to show/search products</small>
    </div>
    <div class="products" v-if="messengerModal.showModal === true">
      <i class="fa fa-times-circle close close-modal" aria-hidden="true" @click="selectedIdEventHandler(null)"></i>
      <messenger-modal 
        :messageInput="newMessageInput"
        :searchItem="messengerModal.searchedItem" 
        :selectedItem="selectedItem"
        :searchType="searchType"
        :modalTriggers="modalTriggers"
        @searchItemEvent="searchItemEventHandler($event)"
        @selectedIdEvent="selectedIdEventHandler($event)">
      </messenger-modal>
    </div>
    <browse-images-modal :object="user.profile" v-if="user.profile !== null"></browse-images-modal>
    <browse-images-modal :object="newProfile" v-if="user.profile === null"></browse-images-modal>
    <!-- <img src="" alt=""> -->
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.arrow-down {
  position: absolute;
  width: 0; 
  height: 0; 
  left: 25%;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent; 
  border-top: 20px solid $secondary;
}
.close-modal {
  position: absolute;
  top: -35px;
  right: 0;
  font-size: 30px;
  color: red;
}
.close-icon {
  position: absolute;
  font-size: 15px;
  top: 0;
  right: 0;
}
.close:hover {
  cursor: pointer;
}
.alt-image {
  font-size: 90px;
  padding-top: 10px;
}
.product-selected {
  position: absolute;
  top: -110px;
  left: 50px;
  border: 1px solid $secondary;
}
.tools-container {
  display: flex;
  align-items: center;
  width: 100%;
}
.products{
  position: absolute;
  height: calc(95vh - 300px);
  width: 300px;
  z-index: 10;
  bottom: 12vh;
  right: 20px;
  background: white;
  border: 1px solid $primary;
  padding: 10px;
  border-radius: 5px;
}
small.instruction {
  position: absolute;
  bottom: 2px;
  font-size: 8pt;
  color: white;
  left: 59px;
}
.holder{
  display: inline-flex;
  align-items: center;
  width: 100%;
  float: left;
  height: 10vh;
  border-top: 1px solid $primary;
  background-color: $primary;
  align-items: flex-end;
  padding-bottom: 20px;
  position: relative;
}
.profile{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  float: left;
}
.btn{
  width: 10%;
  float: right;
  height: 45px;
  position: relative;
  bottom: 60px;
  right: 13px;
  text-align: center;
}
.form-control{
  width: 100% !important;
  float: right !important;
  height: 5vh !important;
}
span{
  width: 10%;
  float: left;
  height: 45px;
  line-height: 8vh;
  text-align: center;
}
span i{
  font-size: 24px;
}
span i:hover{
  cursor: pointer;
  color: #3f0050;
}
#attach-file {
  font-size: 3vh;
  padding: 0 20px 0 10px;
  color: $white;
}
#send-btn {
  font-size: 3vh;
  padding: 0 20px 0 10px;
  color: $white;
}
#send-btn:hover, #attach-file:hover {
  cursor: pointer;
  color: $hover;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default {
  mounted(){
    this.retrieveParams(this.$route.params)
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      newProfile: {
        account_id: null,
        url: null
      },
      errorMessage: null,
      newMessageInput: '',
      prevNewMessageIndex: null,
      payload: null,
      messengerModal: {
        showModal: false,
        searchedItem: ''
      },
      updatedMessage: '',
      selectedItem: null,
      modalTriggers: [
        {type: 'products', trigger: '@p'}, // [type] is table-name
        {type: 'templates', trigger: '@t'}
      ],
      searchType: null // search type for modal
    }
  },
  props: ['group'],
  components: {
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'messenger-modal': require('modules/messengervue/conversation/modal/Modal.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieveParams(params){
      if(params.payload && params.payloadValue){
        let parameter = {
          condition: [{
            value: 'published',
            column: 'status',
            clause: '='
          },
          {
            value: params.payloadValue,
            column: 'code',
            clause: '='
          }],
          account_id: this.user.userID
        }
        $('#loading').css({display: 'block'})
        this.APIRequest(`${params.payload}s/retrieve`, parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data.length > 0){
            this.selectedItem = response.data[0]
          }
        })
      }
    },
    findIndex(type, str, flag){ // for modal search
      let trigger = -1
      this.modalTriggers.map(obj => {
        if(obj.type === type){
          trigger = obj.trigger
          return
        }
      })
      if(flag){ // flag 1 to fix searching in searchbar with using only @p instead of @p_
        trigger = trigger + '_'
      }
      return trigger !== -1 ? str.lastIndexOf(trigger) : -1
    },
    manageInput(event){
      this.newMessageInput = event.target.value
      if(this.newMessageInput && this.user.type === 'PARTNER'){
        let str = this.newMessageInput.slice()
        let lowStr = str.toLowerCase()
        let trigger = null
        this.modalTriggers.map(obj => {
          if(lowStr.endsWith(obj.trigger)){ // check if trigger is found
            trigger = obj // set trigger
            return
          }
        })
        if(trigger){
          this.searchType = trigger.type
        }
        // trigger search =>  trigger + '_'  ex. @p_  or  @t_['search query']
        let index = this.findIndex(this.searchType, lowStr, 1)// finding index of the trigger + '_' for searching ( '@p_' )
        let temp = index > -1 ? str.substring(index) : ''  // true if '@p_ or @t_' is found
        let searchItem = temp.slice(3) // removing @P_ or @T_ in searching
        let clear = { showModal: false, searchedItem: '' }
        if(trigger && str !== ' ' || index > -1){
          this.messengerModal = {
            showModal: true,
            searchedItem: searchItem
          }
        }else{
          this.messengerModal = {...clear}
        }
        if(searchItem[0] === ' '){
          this.messengerModal = {...clear}
        }
      }
    },
    keyupHandler(event){ // hide messenger-products when text-input is cleared
      if(event.target.value === ''){
        this.messengerModal = {
          showModal: false,
          searchedItem: ''
        }
      }
    },
    keypressHandler(event){ // send message using enter key
      if(event.charCode === 13){
        this.sendMessage()
      }
    },
    searchItemEventHandler(event){
      this.messengerModal.searchedItem = event.searchValue
      this.newMessageInput = event.updatedValue
    },
    sendMessage(){
      let messageType = 'text'
      let messageValue = null
      if(this.selectedItem !== null){
        messageType = 'product'
        messageValue = this.selectedItem.id
      }
      if((this.newMessageInput !== '' || this.newMessageInput !== null) && this.group.new === false){
        let parameter = {
          messenger_group_id: this.group.id,
          message: this.newMessageInput,
          account_id: this.user.userID,
          status: 0,
          payload: messageType,
          payload_value: messageValue
        }
        if(this.selectedItem !== null){
          parameter['product'] = this.selectedItem
        }
        this.APIRequest('messenger_messages/create', parameter).then(response => {
          if(response.data !== null){
            this.newMessageInput = null
            AUTH.messenger.messages.push(response.data)
          }
        })
      }else if((this.newMessageInput !== '' || this.newMessageInput !== null) && this.group.new === true){
        let parameter = {
          creator: this.user.userID,
          message: this.newMessageInput,
          member: this.group.id,
          status: 'messenger',
          payload: 'messenger',
          type: 'messenger'
        }
        this.APIRequest('custom_messenger_groups/create', parameter).then(response => {
          if(response.data !== null){
            this.newMessageInput = null
            this.$parent.newFlag = false
            AUTH.messenger.messengerGroupId = parseInt(response.data)
            this.$emit('changeGroupEvent', response.data)
          }
        })
      }
      this.selectedItem = null
    },
    selectedIdEventHandler(product){
      if(product !== null){
        this.selectedItem = product
      }
      // remove @p_... or @t_...
      let message = this.newMessageInput.slice().toLowerCase()
      let index = this.findIndex(this.searchType, message, 0)
      let newMessage = message.slice(0, index)
      this.messengerModal = {
        showModal: false,
        searchedItem: ''
      }
      this.newMessageInput = newMessage.slice()
    },
    deleteSelectedItem(){
      this.selectedItem = null
    },
    showImages(){
      $('#browseImagesModal').modal('show')
    },
    hideImages(){
      $('#browseImagesModal').modal('hide')
    }
  }
}
</script>
