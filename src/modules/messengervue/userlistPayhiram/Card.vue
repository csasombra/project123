<template>
  <div class="holder" v-bind:class="{'active-card': auth.messenger.group !== null && parseInt(auth.messenger.group.id) === parseInt(group.id)}" @click="selected(index, moduleText)" v-if="group !== null  &&group.title !== null">
    <img :src="config.BACKEND_URL + group.title.profile.url" class="profile" v-if="group.title.profile !== null">
    <i class="fa fa-user-circle-o" v-else></i>
    <label>
      ****{{group.thread.substring(24, 32)}}
    </label>
    <strong class="badge badge-danger pull-right" v-if="parseInt(group.total_unread_messages) > 0">
      {{group.total_unread_messages}}
    </strong>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.holder{
  width: 100%;
  float: left;
  height: 50px;
  padding-left: 5px;
  border-bottom: solid 1px #eee;
}

.active-card{
  background: #eee;
}

.profile{
  width: 40px;
  height: 40px;
  margin-top: 5px;
  border-radius: 50%; 
  float: left;

}

label{
  line-height: 50px;
  padding-left: 10px;
  float: left;
  text-align: center;
}

label:hover{
  cursor: pointer;
}

i{
  font-size: 30px;
  line-height: 50px;
  float: left;
  color: $primary;
}

.holder:hover{
  cursor: pointer;
  background: $hover;
}

strong{
  margin-top: 18px;
  margin-left: 10px;
  margin-right: 20px;
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default {
  data(){
    return {
      config: CONFIG,
      auth: AUTH
    }
  },
  props: ['group', 'index', 'moduleText'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    selected(index, moduleText){
      this.$parent.makeActive(index, moduleText)
      this.updateModalViewFlag()
    },
    updateModalViewFlag(){
      this.$parent.updateModalViewFlag(false)
    }
  }
}
</script>

