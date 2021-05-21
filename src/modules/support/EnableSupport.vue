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
          <td>Initiator</td>
          <td>Assigned To</td>
          <td>Status</td>
          <!-- <td>Request Status</td> -->
          <!-- <td>Actions</td> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td style="cursor: pointer;" @click="redirect('/thread/:' + item.request_code.code)">{{item.payload_value}}</td>
          <td>
              <p v-if="item.assigned_to !== null">{{item.assigned_to}}</p>
              <!--<select v-if="item.assigned_to !== null">
                <option v-for="(option, index) in item.assigned_to" :value="option" :key="index">{{option}}</option>
              </select>-->
              <p v-else>No Assigned </p>
          </td>
          <td>{{item.request_status === null ? null : item.request_status.status === 1 ? 'ON GOING' : 'COMPLETED' }}</td>
          <!-- <td>{{item.request_status.status == 1 ? 'ON GOING' : 'COMPLETED'}}</td> -->
          <!-- <td>
            <button class="btn btn-secondary" @click="messageConfirm(item, a = 'a')"><i class="fa fa-check" style="padding: 0"></i></button>
            <button class="btn btn-danger" @click="messageConfirm(item, a = 'b')"><i class="fa fa-times" style="padding: 0"></i></button>
          </td> -->
        </tr>
      </tbody>
    </table>
    <button class="btn pull-right btn-primary" @click="seeMore(sort, filter)">See More</button>
    <Confirmation
    ref="confirm"
    :title="'Confirmation'"
    :message="a == 'a' ? 'Are you sure you want to complete this transaction?' : 'Are you sure you want to cancel this transaction?'"
    @onConfirm="a == 'a' ? complete($event) : remove($event)"
    >
    </Confirmation>
    <empty v-if="data === null" :title="'No enable support found!'" ></empty>
    <browse-images-modal></browse-images-modal>

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
          title: 'Initiator ascending',
          payload: 'payload_value',
          payload_value: 'asc'
        }, {
          title: 'Initiator descending',
          payload: 'payload_value',
          payload_value: 'desc'
        }, {
          title: 'Assigned To ascending',
          payload: 'assigned_to',
          payload_value: 'asc'
        }, {
          title: 'Assigned To descending',
          payload: 'assigned_to',
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
      limit: 5,
      offset: 0,
      sort: null,
      filter: null,
      a: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    'increment-modal': require('components/increment/generic/modal/Modal.vue'),
    Pager,
    Confirmation
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    },
    seeMore(sort, filter) {
      this.offset += this.limit
      if(filter !== null){
        this.currentFilter = filter
      }
      if(sort !== null){
        this.currentSort = sort
      }
      let parameter = {
        condition: [{
          column: this.currentFilter.column,
          clause: 'like',
          value: '%' + this.currentFilter.value + '%'
        }],
        sort: sort,
        limit: this.limit,
        offset: this.activePage
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('enable_supports/retrieve', parameter).then(response => {
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
        sort: sort,
        limit: this.limit,
        offset: this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('enable_supports/retrieve', parameter).then(response => {
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
    messageConfirm(item, npx){
      this.$refs.confirm.show(item.id, npx)
    },
    complete(item){
      console.log('[]')
    },
    remove(item){
      console.log('eerer')
    }
  }
}
</script>
