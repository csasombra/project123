<template>
  <div class="holder">
    <div class="header text-primary">
      <ul>
        <li class="right" @click="active = 'primary'" :class="{'active': active === 'primary'}">Details</li>
        <li @click="active = 'secondary'" :class="{'active': active === 'secondary'}">Comments</li>
      </ul>
    </div>
    <div class="item-holder">
      <ul v-if="active === 'primary'" class="primary-menus">
        <li v-for="(item, index) in menus" @click="setMenu(item)">{{item}}</li>
      </ul>
      <div class="content-holder" v-if="active === 'Requests Details'">
      </div>
      <div class="content-holder" v-if="active === 'Members'">
        <p><b>List of Users</b></p>
        <ul v-for="(item, index) in auth.messenger.group.members.result" :key="index">
          <li style="color: black">{{item.account_details.username}}</li><br>
        </ul>
      </div>
      <div class="content-holder" v-if="active === 'Requirements'">
        <p>List of Requirements</p>
        <ul v-for="(item, index) in requirements" :key="index">
          <p>Signature</p>
            <li v-if="item.payload === 'signature'"><img :src="`data:image/png;base64,${item.payload_value}`"></li>
          <p>Receiver Picture</p>
            <li v-if="item.payload === 'receiver_picture'"><img :src="`data:image/png;base64,${item.payload_value}`"></li>
          <p>Valid ID</p>
            <li v-if="item.payload === 'valid_id'"><img :src="`data:image/png;base64,${item.payload_value}`"></li>
        </ul>
      </div>
      <div class="content-holder" v-if="active === 'Complete Transaction'">
        <transfer :group="auth.messenger.group"></transfer>
      </div>
      <div class="content-holder" v-if="active === 'Cancel Transaction'">
        <cancel :group="auth.messenger.group"></cancel>
      </div>
      <div v-if="active === 'secondary'" class="primary-menus">
        <comments :id="auth.messenger.group.id" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.holder{
  width: 100%;
  float: right;
}
.holder .header{
  width: 100%;
  float: left;
  height: 50px;
  border-bottom: solid 1px #eee;
}

p {
  text-align: center;
  margin-top: 5%
}

ul{
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}

.header ul .right{
  border-right: 1px #eee solid;
}

.header ul li{
  width: 50%;
  float: left;
  line-height: 50px;
  text-align: center;
}

.active{
  text-decoration: underline;
}

.primary-menus{
  position: relative;
}
.primary-menus li{
  width: 100%;
  float: left;
  line-height: 50px;
  padding-left: 10px;
  padding-right: 10px;
}

.requirements-menus li{
  width: 100%;
  float: left;
  line-height: 50px;
  padding-left: 10px;
  padding-right: 10px;
}

.primary-menus li:hover{
  cursor: pointer;
  background: #eee;
}

.header ul li:hover{
  cursor: pointer;
  text-decoration: underline;
}
.create-new-group{
  line-height: 50px; 
}
.create-new-group:hover{
  cursor: pointer;
  color: $white;
}

.content-holder{
  width: 100%;
  min-height: 50px;
  overflow-y: hidden;
  margin: 0px;
  padding-left: 10px;
  padding-right: 10px;
}

.btn{
  margin-top: 7px;
}

img{
  width: 35%;
  height: 35%;
  align-content: center;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import comments from 'src/components/increment/support/Resolution/Comments.vue'
export default {
  mounted(){
    this.retrieveRequirements()
  },
  data(){
    return {
      user: AUTH.user,
      auth: AUTH,
      config: CONFIG,
      common: COMMON,
      active: 'primary',
      menus: ['Members', 'Requirements', 'Complete Transaction', 'Cancel Transaction'],
      data: null,
      require: [],
      requirements: []
    }
  },
  props: ['groups'],
  components: {
    'm-card': require('modules/messengervue/userlistPayhiram/Card.vue'),
    'm-options': require('modules/messengervue/userlistPayhiram/OtherOptions.vue'),
    'transfer': require('modules/messengervue/conversationPayhiram/templates/Transfer.vue'),
    'cancel': require('modules/messengervue/conversationPayhiram/templates/Cancel.vue'),
    comments
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    setMenu(item){
      if(item === 'Requirements'){
        this.retrieveRequirements()
      }
      this.active = item
    },
    retrieveRequirements(){
      let parameter = {
        condition: [{
          value: AUTH.messenger.group.id,
          clause: '=',
          column: 'request_id'
        }]
      }
      this.APIRequest('request_validations/retrieve', parameter).then(response => {
        this.require = response.data
        this.require.map(el => {
          if(this.require.length >= 1){
            let parameter = {
              condition: [{
                clause: '=',
                column: 'category',
                value: el.id
              }]
            }
            $('#loading').css({display: 'block'})
            this.APIRequest('payloads/retrieve', parameter).then(response => {
              $('#loading').css({display: 'none'})
              this.requirements = response.data
            })
          }else{
            this.require = []
            this.requirements = []
          }
        })
      })
    },
    makeActive(selectedIndex, moduleText){
      this.$parent.makeActiveCard(selectedIndex, moduleText)
    },
    updateModalViewFlag(flag){
      this.$parent.updateMobileViewFlag(flag)
    }
  }
}
</script>

