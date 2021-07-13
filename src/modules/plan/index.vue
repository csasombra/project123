<template>
  <div class="ledger-summary-container">
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
          <td>Plan</td>
          <td>Name</td>
          <td>Merchant</td>
          <td>Amount</td>
          <td>Status</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.plan}}</td>
          <td>{{item.account ? item.account.username : null}}</td>
          <td>{{item.merchant ? item.merchant.name : null}}</td>
          <td>{{item.currency + ' ' + item.amount}}</td>
          <td>{{item.status}}</td>
          <td>
            <i class="fas fa-check text-primary" @click="updateItem(item)"></i>
            <i class="fas fa-trash text-danger" @click="remove(item)"></i>
          </td>
        </tr>
      </tbody>
    </table>
    <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      v-if="data !== null"
    />
    <empty v-if="data === null" :title="'No plans found!'" ></empty>
    <Confirmation
      :title="'Removal Confirmation'"
      :message="'Are you sure you want to continue this action?'"
      ref="confirmation"
      @onConfirm="removeItem"/>
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
export default{
  mounted(){
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      user: AUTH.user,
      auth: AUTH,
      newAttachment: {
        activeId: null,
        file: null
      },
      data: null,
      option: [],
      config: CONFIG,
      category: [{
        title: 'Sort by',
        sorting: [{
          title: 'Plan ascending',
          payload: 'plan',
          payload_value: 'asc'
        }, {
          title: 'Plan descending',
          payload: 'plan',
          payload_value: 'desc'
        }, {
          title: 'Amount ascending',
          payload: 'amount',
          payload_value: 'asc'
        }, {
          title: 'Amount descending',
          payload: 'amount',
          payload_value: 'desc'
        }, {
          title: 'Status ascending',
          payload: 'status',
          payload_value: 'asc'
        }, {
          title: 'Status descending',
          payload: 'status',
          payload_value: 'desc'
        }]
      }],
      currentFilter: null,
      currentSort: null,
      activePage: 1,
      numPages: null,
      limit: 5
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    Pager,
    Confirmation
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    retrieve(sort, filter){
      if(sort !== null){
        this.currentSort = sort
      }
      if(filter !== null){
        this.currentFilter = filter
      }
      let parameter = {
        condition: [{
          column: this.currentFilter.column,
          clause: 'like',
          value: '%' + this.currentFilter.value + '%'
        }],
        sort: this.currentSort,
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('plans/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit) ? 1 : 0
        }else{
          this.data = null
          this.numPages = null
        }
      })
    },
    manageGrid(event){
      switch(event){
        case 'th-large': this.listStyle = 'columns'
          break
        case 'list': this.listStyle = 'list'
          break
      }
    },
    remove(item){
      this.$refs.confirmation.show(item.id)
    },
    removeItem(item){
      let parameter = {
        id: item.id
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('plans/delete', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
      })
    },
    updateItem(item){
      let parameter = {
        id: item.id,
        status: 'approved'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('plans/update', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
      })
    }
  }
}
</script>
