<template>
  <div class="ledger-summary-container">
    <div class="incre-row">
      <button class="btn btn-primary pull-right" @click="showTransferAddModal('create')">Add</button>
    </div>
    <basic-filter 
      v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']"></basic-filter>
    
    <table class="table table-bordered table-responsive" v-if="data !== null">
      <thead>
        <tr> 
          <td>Date</td>
          <td>Scope</td>
          <td>Destination</td>
          <td>Type</td>
          <td>Currency</td>
          <td>Minimum Amount</td>
          <td>Maximum Amount</td>
          <td>Charge</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.effective_date}}</td>
          <td>{{item.scope}}</td>
          <td>{{item.destination}}</td>
          <td>{{item.type}}</td>
          <td>{{item.currency}}</td>
          <td class="text-primary">{{auth.displayAmountWithCurrency(item.min_amount, item.currency)}}</td>
          <td class="text-primary">{{auth.displayAmountWithCurrency(item.max_amount, item.currency)}}</td>
          <td class="text-danger">{{auth.displayAmountWithCurrency(item.charge, item.currency)}}</td>
          <td>{{item.created_at_human}}</td>
          <td>
            <button class="btn btn-primary" @click="showTransferAddModal('update', item)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No charges specified!'" :action="'Click add to create.'"></empty>
    <browse-images-modal></browse-images-modal>
    <increment-modal :property="showTransferAddFeeModal"></increment-modal>
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
import transferFeeAddCharges from 'src/modules/admin/CreateAddCharges.js'
export default{
  mounted(){
    $('#loading').css({display: 'block'})
    this._retrieve({type: 'asc'}, {column: 'created_at', value: ''})
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
      showTransferAddFeeModal: transferFeeAddCharges,
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
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue')
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
        sort: sort
      }
      this.APIRequest('fund_transfer_charges/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    retrieve(sort){
      let parameter = {
        sort: {
          created_at: 'desc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('fund_transfer_charges/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    showTransferAddModal(action, item = null){
      switch(action){
        case 'create':
          this.showTransferAddFeeModal = {...transferFeeAddCharges}
          let inputs = this.showTransferAddFeeModal.inputs
          inputs.map(input => {
            input.value = null
          })
          break
        case 'update':
          let modalData = {...this.showTransferAddFeeModal}
          let parameter = {
            title: 'Update Requests',
            route: 'fund_tranfer_charges/update',
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
            if(data.variable === 'destination'){
              data.value = item.destination
            }
            if(data.variable === 'min_amount'){
              data.value = item.min_amount
            }
            if(data.variable === 'max_amount'){
              data.value = item.max_amount
            }
            if(data.variable === 'type'){
              data.value = item.type
            }
            if(data.variable === 'charge'){
              data.value = item.charge
            }
            if(data.variable === 'currency'){
              data.value = item.currency
            }
            if(data.variable === 'scope'){
              data.value = item.scope
            }
          })
          this.showTransferAddFeeModal = {...modalData}
          break
      }
      $('#createAddChargesModal').modal('show')
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
