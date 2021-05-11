<template>
  <div>
    <div class="messenger-holder" v-if="groups !== null">
      <div class="conversation" v-bind:class="{'active-conversation': mobileViewFlag === false}">
        <conversation :groupId.sync="auth.messenger.id" :group="auth.messenger.members"></conversation>   
      </div>
      <div class="users" v-bind:class="{'active-users': mobileViewFlag === true}">
        <groups :groups="groups" v-if="groups !== null"></groups>
      </div>
    </div>

    <empty-dynamic v-if="groups === null" :icon="'fa fa-smile-o'" :iconColor="'text-primary'" :title="'Invalid transaction code.'" :action="'Wait for peers to contact you!'"></empty-dynamic>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";

.messenger-holder{
  width: 100%;
  float: left;
  border: 1px solid #eee;
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
  border-left: solid 1px #eee;
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
    this.retrieve(true)
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      newTitle: null,
      groups: null,
      partners: null,
      selectedIndex: 0,
      mobileViewFlag: false,
      auth: AUTH
    }
  },
  props: ['params'],
  components: {
    'conversation': require('modules/messengervue/conversationPayhiram/Conversation.vue'),
    'groups': require('modules/messengervue/userlistPayhiram/Groups.vue'),
    'empty-dynamic': require('components/increment/generic/empty/EmptyDynamicIcon.vue')
  },
  watch: {
    '$route.params.username': function(){
      if(this.$route.params.username){
        let indexGroup = this.checkIfExistUsername(this.$route.params.username, this.groups)
        if(indexGroup !== null){
          this.makeActiveCard(indexGroup, 'groups')
        // }
        }else{
          let indexPartner = this.checkIfExistUsername(this.$route.params.username, this.partners)
          if(indexPartner !== null){
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
    retrieve(flag){
      let parameter = {
        code: this.$route.params.code.substring(1)
      }
      this.APIRequest('custom_messenger_groups/retrieve_web', parameter).done(response => {
        this.groups = response.data
        this.partners = response.accounts
        let active = 0
        for (var i = 0; i < response.data.length; i++) {
          let item = response.data[i]
          if(item.id === parseInt(AUTH.messenger.id)){
            active = i
            break
          }
        }
        setTimeout(() => {
          this.makeActive(active, 'groups')
        }, 100)
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
    makeActiveCard(index, moduleText){
      AUTH.messenger.group = this.groups[index]
      AUTH.messenger.messengerGroupId = this.groups[index].id
      console.log('hi')
      this.updateMessages(this.groups[index])
      this.retrieve(false)
    },
    makeActive(index, moduleText){
      AUTH.messenger.group = this.groups[index]
      AUTH.messenger.messengerGroupId = this.groups[index].id
      this.updateMessages(this.groups[index])
    },
    updateMobileViewFlag(flag){
      this.mobileViewFlag = flag
    },
    updateMessages(item){
      if(item.total_unread_messages > 0){
        let parameter = {
          messenger_group_id: item.id
        }
        this.APIRequest('messenger_messages/update_by_status', parameter).then(response => {
        })
        item.total_unread_messages = 0
      }
    }
  }
}
</script>
