<template>
  <div>
    <div class="messenger-holder" v-if="groups !== null || partners !== null">
      <div class="conversation" v-bind:class="{'active-conversation': mobileViewFlag === false}">
        <conversation :groupId.sync="groupId" :group="selectedGroupData" @changeGroupEvent="changeGroupHandler($event)"></conversation>   
      </div>
      <div class="users" v-bind:class="{'active-users': mobileViewFlag === true}">
        <groups :groups="groups" :partners="partners" v-if="groups !== null || partners !== null"></groups>
      </div>
    </div>

    <empty v-if="groups === null && partners === null" :title="'You do not have conversation right now.'" :action="'Wait for your customer to message you.'"></empty>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";

.messenger-holder{
  width: 100%;
  float: left;
  border: 1px solid $primary;
}
.conversation{
  width: 70%;
  float: left;
  min-height: 500px;
  overflow-y:hidden;
  height: 90vh;
}
.users{
  width: 30%;
  float: left;
  height: 90vh;
  overflow-y:scroll;
  border-left: solid 1px $primary;
}

.users::-webkit-scrollbar { width: 0; }
@media (max-width: 992px){
  .users{
    display: none;
    width: 100%;
    border-left: 0px;
    margin-left: 0%;
  }
  .conversation{
    width: 100%;
    display: none;
  }
  .active-conversation, .active-users{
    display: block;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
export default {
  mounted(){
    AUTH.checkPlan()
    this.retrieve(this.$route.params.username ? this.$route.params.username : '')
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      newTitle: null,
      data: null,
      groups: null,
      partners: null,
      selectedIndex: 0,
      selectedGroupData: null,
      prevModuleSelected: null,
      groupId: null,
      mobileViewFlag: false
    }
  },
  props: ['params'],
  components: {
    'conversation': require('modules/messengervue/conversation/Conversation.vue'),
    'groups': require('modules/messengervue/userlist/Groups.vue'),
    'empty': require('components/increment/generic/empty/Empty.vue')
  },
  watch: {
    '$route.params.username': function(){
      if(this.$route.params.username){
        let indexGroup = this.checkIfExistUsername(this.$route.params.username, this.groups)
        if(indexGroup !== null){
          this.prevModuleSelected = 'groups'
          this.makeActiveCard(indexGroup, 'groups')
        }else{
          let indexPartner = this.checkIfExistUsername(this.$route.params.username, this.partners)
          if(indexPartner !== null){
            this.prevModuleSelected = 'partners'
            this.makeActiveCard(indexPartner, 'partners')
          }
        }
      }
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    create(){
      if(this.newTitle !== null || this.newTitle !== ''){
        let parameter = {
          'account_id': this.user.userID,
          'title': this.newTitle
        }
        this.APIRequest('custom_messenger_groups/create', parameter).then(response => {
          console.log(response)
        })
      }
    },
    retrieve(username){
      let parameter = {
        account_id: this.user.userID,
        account_type: this.user.type,
        username: username
      }
      this.APIRequest('custom_messenger_groups/retrieve', parameter).done(response => {
        this.groups = response.data
        this.partners = response.accounts
        setTimeout(() => {
          if(username){
            let indexGroup = this.checkIfExistUsername(username, this.groups)
            let flag = false
            if(indexGroup !== null){
              this.prevModuleSelected = 'groups'
              this.makeActiveCard(indexGroup, 'groups')
              flag = true
            }else{
              let indexPartner = this.checkIfExistUsername(username, this.partners)
              if(indexPartner !== null){
                this.prevModuleSelected = 'partners'
                this.makeActiveCard(indexPartner, 'partners')
                flag = true
              }
            }
            if(flag === false && this.groups !== null){
              this.prevModuleSelected = 'groups'
              this.makeActiveCard(0, 'groups')
            }else if(flag === false && this.partners !== null){
              this.prevModuleSelected = 'partners'
              this.makeActiveCard(response.active, 'partners')
            }
          }
        }, 1000)
      })
    },
    checkIfExistUsername(username, list){
      if(list !== null){
        for (var i = 0; i < list.length; i++) {
          if(list[i].title.username === username){
            return i
          }
        }
      }
      return null
    },
    selectedGroup(index, moduleText){
      this.selectedIndex = index
      var i = 0
      if(moduleText === 'groups'){
        this.groupId = this.groups[index].id
        this.selectedGroupData = this.groups[index]
        AUTH.messenger.messengerGroupId = parseInt(this.groups[index].id)
        for (i = 0; i < this.$children.length; i++) {
          if(this.$children[i].$el.id === 'groupConversation'){
            this.$children[i].newFlag = false
            this.$children[i].conversations = null
          }
        }
      }else if(moduleText === 'partners'){
        this.groupId = null
        this.selectedGroupData = this.partners[index]
        AUTH.messenger.messengerGroupId = parseInt(this.partners[index].id)
        for (i = 0; i < this.$children.length; i++) {
          if(this.$children[i].$el.id === 'groupConversation'){
            this.$children[i].newFlag = true
            this.$children[i].conversations = null
            this.$children[i].retrieve()
          }
        }
      }
    },
    makeActiveCard(index, moduleText){
      if(moduleText === 'groups' && this.prevModuleSelected === 'groups'){
        if(this.selectedIndex !== index){
          this.groups[this.selectedIndex].flag = false
          this.groups[index].flag = true
        }
      }
      if(moduleText === 'groups' && this.prevModuleSelected === 'partners'){
        this.partners[this.selectedIndex].flag = false
        this.groups[index].flag = true
      }
      if(moduleText === 'partners' && this.prevModuleSelected === 'groups'){
        this.groups[this.selectedIndex].flag = false
        this.partners[index].flag = true
      }
      if(moduleText === 'partners' && this.prevModuleSelected === 'partners'){
        if(this.selectedIndex !== index){
          this.groups[this.selectedIndex].flag = false
          this.groups[index].flag = true
        }
      }
      this.prevModuleSelected = moduleText
      this.selectedGroup(index, moduleText)
    },
    updateMobileViewFlag(flag){
      this.mobileViewFlag = flag
    },
    changeGroupHandler(data){
      this.selectedGroupData = data
      this.retrieve(this.user.username)
    }
  }
}
</script>
