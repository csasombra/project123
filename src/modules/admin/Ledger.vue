<template>
  <div class="ledger-summary-container" style="margin-top: 5%">
    <div class="incre-row">
    </div>
    <basic-filter 
      v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      :grid="['list', 'th-large']"></basic-filter>

      <Pager
        :pages="numPages"
        :active="activePage"
        :limit="limit"
        v-if="data.length > 0"
      />
    <!-- {{data}} -->
    <table class="table table-bordered table-responsive"  v-if="data.length > 0">
      <thead>
        <td>Date</td>
        <td>Transaction Code</td>
        <td>Sender's Code</td>
        <td>Receiver's Code</td>
        <td>Amount</td>
        <td>Description</td>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.created_at_human}}</td>
          <td>*****{{item.code.substring(56)}}</td>
          <td>{{item.owner.username}}</td>
          <td>{{item.receiver !== null ? item.receiver.username : null}}</td>
          <td v-if="item.amount > 0" class="text-primary"><b>{{auth.displayAmountWithCurrency(item.amount, item.currency)}}</b></td>
          <td v-else class="text-danger"><b>{{auth.displayAmountWithCurrency(item.amount, item.currency)}}</b></td>
          <td>{{item.description}}</td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No Transactions yet!'" :action="'Keep growing.'"></empty>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
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
  min-height: 10px;
  overflow-y: hidden;
  padding-right: 10px;
}

.attachment-header{
  width: 100%;
  float: left;
  border-bottom: solid 1px #eee;
}

.attachment-image{
  width: auto;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
}

.attachment-image:hover{
  cursor: pointer;
  border: solid 1px $primary;
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
import Pager from 'src/components/increment/generic/pager/Pager.vue'
export default{
  mounted(){
    $('#loading').css({display: 'block'})
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      user: AUTH.user,
      data: [],
      auth: AUTH,
      limit: 5,
      numPages: null,
      activePage: 1,
      offset: 0,
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
          title: 'Amount ascending',
          payload: 'amount',
          payload_value: 'asc'
        }, {
          title: 'Amount descending',
          payload: 'amount',
          payload_value: 'desc'
        }, {
          title: 'Description ascending',
          payload: 'description',
          payload_value: 'asc'
        }, {
          title: 'Description descending',
          payload: 'description',
          payload_value: 'desc'
        }, {
          title: 'Sender ascending',
          payload: 'owner.username',
          payload_value: 'asc'
        }, {
          title: 'Sender descending',
          payload: 'owner.username',
          payload_value: 'desc'
        }, {
          title: 'Receiver ascending',
          payload: 'receiver.username',
          payload_value: 'asc'
        }, {
          title: 'Receiver descending',
          payload: 'receiver.username',
          payload_value: 'desc'
        }]
      }],
      filter: null,
      sort: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    Pager
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    seeMore() {
      this.limit = this.limit + 5
      this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
    },
    pagination(flag){
      if(flag === false && this.offset > 5){
        this.offset = this.offset - 5
        this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
      }else{
        this.offset = this.offset + 5
        this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
      }
    },
    retrieve(sort, filter){
      if(sort !== null){
        this.sort = sort
      }
      if(filter !== null){
        this.filter = filter
      }
      if(sort === null && this.sort !== null){
        sort = this.sort
      }
      if(filter === null && this.filter !== null){
        filter = this.filter
      }
      let parameter = {
        condition: [{
          column: filter.column,
          value: filter.value + '%',
          clause: 'like'
        }],
        sort: sort,
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('ledger/transaction_history', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.data = []
        }
        // if(response.data.length > 0){
        //   this.data = response
        // }else{
        //   this.data = null
        // }
      })
    }
    // manageGrid(event){
    //   switch(event){
    //     case 'th-large': this.listStyle = 'columns'
    //       break
    //     case 'list': this.listStyle = 'list'
    //       break
    //   }
    // }
  }
}
</script>
