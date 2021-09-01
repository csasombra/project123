<template>
  <div class="ledger-summary-container">
    <div class="incre-row">
      <button class="btn btn-primary pull-right" @click="showTransferModal('create')">Add</button>
    </div>
    <filter-product v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      :grid="['list']">
    </filter-product>
    
      <Pager
        :pages="numPages"
        :active="activePage"
        :limit="limit"
        v-if="data.length > 0"
      />

    <table class="table table-bordered table-responsive" v-if="data.length > 0">
      <thead>
        <tr>
          <td>Date Added</td>
          <td>Currency</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.created_at}}</td>
          <td>{{item.payload_value}}</td>
          <td>
            <button class="btn btn-primary" @click="showTransferModal('update', item)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

      <Confirmation
      :title="'Removal Confirmation'"
      :message="'Are you sure you want to continue this action?'"
      ref="confirmation"
      @onConfirm="removeItem"
      />


    <empty v-if="data === null" :title="'No charges specified!'" :action="'Click add to create.'"></empty>
    <increment-modal :property="modalCurrency"></increment-modal>
  </div>
</template>
<style scoped>
.ledger-summary-container{
  width: 100%;
  float: left;
  height: auto;
  margin-bottom: 100px;
  margin-top: 25px;
}

.ledger-summary-container-header{
  width: 100%;
  float: left;
  height: 70px;
  border: solid 1px #ddd;
}
.summary-container-item{
  width: 100%;
  float: left;
  border-radius: 5px;
  min-height: 50px;
  overflow-y: hidden;
  border: solid 1px #ddd;
  margin-top: 10px;
  padding-left: 10px;
}
.summary-container-item .header{
  width: 100%;
  float: left;
  height: 50px;
  line-height: 50px;
  color: #555;
}
.summary-container-item .body{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
  padding-right: 10px;
}

@media (max-width: 992px){
  .ledger-summary-container{
    width: 100%;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
import Confirmation from 'src/components/increment/generic/modal/Confirmation.vue'
import currencyModal from 'src/modules/currency/createCurrencys.js'
export default{
  mounted(){
    $('#loading').css({display: 'block'})
    this.retrieve({'created_at': 'asc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      user: AUTH.user,
      data: [],
      auth: AUTH,
      limit: 5,
      numPages: null,
      activePage: 1,
      newAttachment: {
        activeId: null,
        file: null
      },
      config: CONFIG,
      modalCurrency: currencyModal,
      category: [{
        title: 'Sort By',
        sorting: [{
          title: 'Date posted ascending',
          payload: 'created_at',
          payload_value: 'desc',
          type: 'date'
        }, {
          title: 'Date posted ascending',
          payload: 'created_at',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Currency descending',
          payload: 'type',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Currency ascending',
          payload: 'type',
          payload_value: 'asc',
          type: 'text'
        }]
      }]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'filter-product': require('components/increment/generic/filter/FilterWithCalendar.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    Pager,
    Confirmation
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    // _retrieve(sort, filter){
    //   let parameter = {
    //     condition: [{
    //       column: filter.column,
    //       clause: 'like',
    //       value: filter.value + '%'
    //     }],
    //     sort: sort,
    //     limit: this.limit,
    //     offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
    //   }
    //   this.APIRequest('fund_transfer_charges/retrieve_all', parameter).then(response => {
    //     $('#loading').css({display: 'none'})
    //     if(response.data.length > 0){
    //       this.data = response.data
    //       this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
    //     }else{
    //       this.data = []
    //       this.numPages = null
    //     }
    //   })
    // },
    retrieve(sort){
      let parameter = {
        account_id: this.user.userID,
        payload: 'available_currency',
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('payloads/get_currency', parameter).then(response => {
        console.log('[response]', response.data)
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.data = []
          this.numPages = null
        }
      })
    },
    showTransferModal(action, item = null){
      switch(action){
        case 'create':
          this.modalCurrency = {...currencyModal}
          let inputs = this.modalCurrency.inputs
          this.modalCurrency.params = [{
            variable: 'account_id',
            value: AUTH.user.userID
          }]
          inputs.map(input => {
            input.value = null
          })
          break
        case 'update':
          let modalData = {...this.modalCurrency}
          let parameter = {
            title: 'Update Requests',
            route: 'payloads/update',
            button: {
              left: 'Cancel',
              right: 'Update'
            },
            sort: {
              column: 'created_at',
              value: 'desc'
            },
            params: [{
              variable: 'id',
              value: item.id
            }]
          }
          modalData = {...modalData, ...parameter} // updated data without
          let object = Object.keys(item)
          modalData.inputs.map(data => {
            if(data.variable === 'currency'){
              data.value = item.payload_value
            }
          })
          this.modalCurrency = {...modalData}
          break
      }
      $('#modalCurrencyk').modal('show')
    },
    setRemoveItem(item){
      this.$refs.confirmation.show(item.id)
    },
    removeItem(event){
      let parameter = {
        id: event.id
      }
      this.APIRequest('fund_transfer_charges/delete', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve()
      })
    },
    manageGrid(event){
      switch(event){
        case 'th-large': this.listStyle = 'columns'
          break
        case 'list': this.listStyle = 'list'
          break
      }
    }
  }
}
</script>
