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
          <td>Scope</td>
          <td>Currency</td>
          <td>Minimum Amount</td>
          <td>Maximum Amount</td>
          <td>Charge</td>
          <td>Date Added</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.scope}}</td>
          <td>{{item.currency}}</td>
          <td class="text-primary">{{auth.displayAmountWithCurrency(item.min_amount, item.currency)}}</td>
          <td class="text-primary">{{auth.displayAmountWithCurrency(item.max_amount, item.currency)}}</td>
          <td class="text-danger">{{item.type === 'percentage' ? item.charge + ' %' : item.currency + ' ' + item.charge}}</td>
          <td>{{item.created_at_human}}</td>
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
    <browse-images-modal></browse-images-modal>
    <increment-modal :property="transferModal"></increment-modal>
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
import CURRENCY from 'src/services/currency.js'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
import Confirmation from 'src/components/increment/generic/modal/Confirmation.vue'
import transferCharges from 'src/modules/admin/CreateTransferCharges.js'
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
      transferModal: transferCharges,
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
          title: 'Type descending',
          payload: 'type',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Type ascending',
          payload: 'type',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Charge descending',
          payload: 'charge',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Charge ascending',
          payload: 'charge',
          payload_value: 'asc',
          type: 'text'
        }]
      }]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'filter-product': require('components/increment/imarketvue/filter/Product.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    Pager,
    Confirmation
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    _retrieve(sort, filter){
      let parameter = {
        condition: [{
          column: filter.column,
          clause: 'like',
          value: filter.value + '%'
        }],
        sort: sort,
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      this.APIRequest('fund_transfer_charges/retrieve_all', parameter).then(response => {
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
    retrieve(sort){
      let parameter = {
        sort: {
          created_at: 'desc'
        },
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('fund_transfer_charges/retrieve_all', parameter).then(response => {
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
          this.transferModal = {...transferCharges}
          let inputs = this.transferModal.inputs
          inputs.map(input => {
            input.value = null
          })
          break
        case 'update':
          let modalData = {...this.transferModal}
          let parameter = {
            title: 'Update Requests',
            route: 'fund_transfer_charges/update',
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
            if(data.variable === 'effective_date'){
              data.value = item.effective_date
            }
            if(data.variable === 'scope'){
              data.value = item.scope
            }
            if(data.variable === 'destination'){
              data.value = item.destination
            }
            if(data.variable === 'type'){
              data.value = item.type
            }
            if(data.variable === 'minimum_amount'){
              data.value = item.min_amount
            }
            if(data.variable === 'maximum_amount'){
              data.value = item.max_amount
            }
            if(data.variable === 'charge'){
              data.value = item.charge
            }
            if(data.variable === 'currency'){
              data.value = item.currency
            }
          })
          this.transferModal = {...modalData}
          break
      }
      $('#createTransferChargesModal').modal('show')
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
