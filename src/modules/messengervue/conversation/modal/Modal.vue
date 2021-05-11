<template>
  <div class="marketplace-holder">
    <div class="product-holder">
      <div class="listing">
        <div class="filter" v-if="data !== null">
          <div class="input-group">
            <input type="text" class="form-control" :value="searchItem" @keyup="searchItemHandler" placeholder="Search here...">
          </div>
        </div>
        <div class="results">
          <products v-if="data !== null && searchType === 'products'" :data="sortedData" :selectedId="selectedItem ? selectedItem.id : null" @selectedIdEvent="selectedIdEventHandler($event)"></products>
          <dynamic-empty v-if="data === null" :title="`No ${this.searchType} yet!`" :action="'Please be back soon.'" :icon="'far fa-smile'" :iconColor="'text-primary'"></dynamic-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.marketplace-holder{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
  margin-bottom: 50px;
  position: relative;
}
.product-holder{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
  position: relative;
}
.listing{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
  position: relative;
}
.listing .filter{
  width: 100%;
  float: left;
  height: 50px;
}
.form-control{
  height: 45px !important;
}
.input-group{
  margin-bottom: 10px !important;
}
.input-group-addon{
  width: 100px !important;
  background: #22b173 !important;
  color: #fff !important;
}
.input-group-title{
  width: 100px !important;
  background: #028170 !important;
  color: #fff !important;
}

.listing .results{
  width: 100%;
  font-size: left;
  min-height: 10px;
  overflow-y: hidden;
}

.results {
  overflow-y: auto !important;
  /* height: 438px; */
  height: calc(95vh - 362px) !important;
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
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      data: null,
      searchValue: '',
      newValue: ''
    }
  },
  components: {
    'products': require('modules/messengervue/conversation/modal/Products.vue'),
    'dynamic-empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue')
  },
  props: ['searchItem', 'messageInput', 'selectedItem', 'modalTriggers', 'searchType'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = null
      switch(this.searchType){
        case 'products':
          parameter = {
            condition: [{
              value: 'published',
              column: 'status',
              clause: '='
            },
            {
              value: this.user.userID,
              column: 'account_id',
              clause: '='
            }],
            account_id: this.user.userID
          }
          break
        default: parameter = null
      }
      $('#loading').css({display: 'block'})
      this.APIRequest(`${this.searchType}/retrieve`, parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }
      })
    },
    findIndex(type, str){ // for modal search
      let trigger = -1
      this.modalTriggers.map(obj => {
        if(obj.type === type){
          trigger = obj.trigger
          return
        }
      })
      return trigger !== -1 ? str.lastIndexOf(trigger) : -1
    },
    searchItemHandler(event){
      this.searchValue = event.target.value
      let updatedValue = this.searchValue.slice()
      let oldMessage = this.messageInput.slice()
      let index = this.findIndex(this.searchType, oldMessage)
      if(oldMessage[oldMessage.length - 1] !== '_'){
        oldMessage = oldMessage + '_'
      }
      oldMessage = oldMessage.slice(0, index + 3)
      let updatedSearchValue = oldMessage + updatedValue
      this.$emit('searchItemEvent', {searchValue: this.searchValue, updatedValue: updatedSearchValue})
    },
    selectedIdEventHandler(item){
      this.$emit('selectedIdEvent', item)
    }
  },
  computed: {
    sortedData(){
      let sorted = null
      switch(this.searchType){
        case 'products':
          sorted = this.data.filter(product => {
            return (
              product.title.toLowerCase().includes(this.searchItem.toLowerCase()) ||
              product.tags.toLowerCase().includes(this.searchItem.toLowerCase()) ||
              product.sku.toLowerCase().includes(this.searchItem.toLowerCase())
            )
          })
          break
        default: sorted = null
      }
      return sorted
    }
  }
}
</script>

