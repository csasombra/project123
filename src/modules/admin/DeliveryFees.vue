<template>
  <div class="ledger-summary-container">
    <div class="incre-row">
      <button class="btn btn-primary pull-right" @click="showModal('create')">Add</button>
      <button class="btn btn-success pull-right" @click="showImportModal()" style="margin-right: 25px;">Import</button>
    </div>
    <basic-filter 
      v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']"></basic-filter>
    
     <Pager
        :pages="numPages"
        :active="activePage"
        :limit="limit"
        v-if="data !== null"
      />

    <table class="table table-bordered table-responsive" v-if="data !== null">
      <thead>
        <tr>
          <td>Scope</td>
          <td>Minimum Amount</td>
          <td>Minimum Distance</td>
          <td>Additional Charge / Kilometer</td>
          <td>Date Added</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.scope}}</td>
          <td class="text-primary">{{auth.displayAmountWithCurrency(item.minimum_charge, item.currency)}}</td>
          <td class="text-primary">{{item.minimum_distance + ' KM'}}</td>
          <td class="text-primary">{{auth.displayAmountWithCurrency(item.addition_charge_per_distance, item.currency)}}</td>
          <td>{{item.effective_date}}</td>
          <td>
            <button class="btn btn-primary" @click="showModal('update', item)">Edit</button>
            <button class="btn btn-danger" @click="setRemoveItem()">Delete</button>
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
    <increment-modal :property="deliveryModal"></increment-modal>
    <increment-modal :property="createImportModal"></increment-modal>
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
import deliveryCharges from 'src/modules/admin/CreateDeliveryCharges.js'
import createImport from 'src/modules/admin/CreateImport.js'
export default{
  mounted(){
    $('#loading').css({display: 'block'})
    this._retrieve({'created_at': 'asc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      auth: AUTH,
      newAttachment: {
        activeId: null,
        file: null
      },
      config: CONFIG,
      limit: 5,
      numPages: null,
      activePage: 1,
      deliveryModal: deliveryCharges,
      createImportModal: createImport,
      category: [{
        title: 'Sort by',
        sorting: [{
          title: 'Date posted ascending',
          payload: 'created_at',
          payload_value: 'asc'
        }, {
          title: 'Date posted descending',
          payload: 'created_at',
          payload_value: 'desc'
        }, {
          title: 'Type ascending',
          payload: 'type',
          payload_value: 'asc'
        }, {
          title: 'Type descending',
          payload: 'type',
          payload_value: 'desc'
        }, {
          title: 'Charge ascending',
          payload: 'charge',
          payload_value: 'asc'
        }, {
          title: 'Charge descending',
          payload: 'charge',
          payload_value: 'desc'
        }, {
          title: 'Minimum amount ascending',
          payload: 'min_amount',
          payload_value: 'asc'
        }, {
          title: 'Minimum amount descending',
          payload: 'min_amount',
          payload_value: 'desc'
        }, {
          title: 'Maximum amount ascending',
          payload: 'max_amount',
          payload_value: 'asc'
        }, {
          title: 'Maximum amount descending',
          payload: 'max_amount',
          payload_value: 'desc'
        }]
      }]
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    Confirmation,
    Pager
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
      this.APIRequest('delivery_fees/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.data = null
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
      this.APIRequest('delivery_fees/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.data = null
          this.numPages = null
        }
      })
    },
    showModal(action, item = null){
      switch(action){
        case 'create':
          this.deliveryModal = {...deliveryCharges}
          let inputs = this.deliveryModal.inputs
          inputs.map(input => {
            input.value = null
          })
          break
        case 'update':
          let modalData = {...this.deliveryModal}
          let parameter = {
            title: 'Update Requests',
            route: 'delivery_fees/update',
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
            if(data.variable === 'minimum_distance'){
              data.value = item.minimum_distance
            }
            if(data.variable === 'maximum_amount'){
              data.value = item.max_amount
            }
            if(data.variable === 'minimum_charge'){
              data.value = item.minimum_charge
            }
            if(data.variable === 'addition_charge_per_distance'){
              data.value = item.addition_charge_per_distance
            }
            if(data.variable === 'currency'){
              data.value = item.currency
            }
          })
          this.deliveryModal = {...modalData}
          break
      }
      $('#createTransferChargesModal').modal('show')
    },
    showImportModal(){
      this.createImportModal = {...createImport}
      let inputs = this.createImportModal.inputs
      inputs.map(input => {
        input.value = null
      })
      $('#importDataFromGoogleSheet').modal('show')
    },
    setRemoveItem(item){
      this.$refs.confirmation.show(item.id)
    },
    removeItem(event){
      let parameter = {
        id: event.id
      }
      this.APIRequest('delivery_fees/delete', parameter).then(response => {
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
