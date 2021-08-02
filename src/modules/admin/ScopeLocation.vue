<template>

  <div class="ledger-summary-container">
    
    <!-- <management-options /> -->
    <div class="form-group">
      <button class="btn btn-primary pull-right mb-1" @click="showModal('create', null)">Add</button>
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
      v-if="data.length > 0"
    />

    <table class="table table-bordered table-responsive" v-if="data.length > 0">
      <thead>
        <tr>
          <td>Code</td>
          <td>Location</td>
          <td>Latitude</td>
          <td>Longitude</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>
            {{item.code}}
          </td>
          <td>
            {{
              item.route + ', ' + item.city + ', ' + item.region + ', ' + item.country
            }}
          </td>
          <td>
            {{item.latitude}}
          </td>
          <td>
            {{item.longitude}}
          </td>
          <td>
            <button class="btn btn-primary" style="color: white" @click="showModal('update', item)">
              <i class="fas fa-edit green"></i>
            </button>
            <button class="btn btn-danger" @click="setOnRemoveItem(item)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Confirmation
    :title="'Removal Confirmation'"
    :message="'Are you sure you want to continue this action?'"
    ref="confirmation"
    @onConfirm="removeItem"/>

    <!-- <empty v-if="data.length > 0" :title="'No accounts available!'" :action="'Keep growing.'"></empty>  -->
    <increment-modal :property="modalProperty"></increment-modal>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.fas {
  padding-right: 0px !important;
}
// .green{ 
//   color: white
// }
// .green:hover{ 
//   background-color:white
// }
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import propertyModal from './ScopeLocation.js'
import Confirmation from 'src/components/increment/generic/modal/Confirmation.vue'
import Pager from 'src/components/increment/generic/pager/Pager.vue'
export default{
  mounted(){
    if(this.user.type !== 'ADMIN'){
      ROUTER.push('/marketplace')
    }
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      user: AUTH.user,
      data: [],
      auth: AUTH,
      limit: 5,
      activePage: 1,
      offset: 0,
      numPages: null,
      modalProperty: propertyModal,
      filter: null,
      sort: null,
      category: [{
        title: 'Sort by',
        sorting: [{
          title: 'Code ascending',
          payload: 'code',
          payload_value: 'asc'
        }, {
          title: 'Code descending',
          payload: 'code',
          payload_value: 'desc'
        }, {
          title: 'Location ascending',
          payload: 'route',
          payload_value: 'asc'
        }, {
          title: 'Location descending',
          payload: 'route',
          payload_value: 'desc'
        }, {
          title: 'Latitude ascending',
          payload: 'latitude',
          payload_value: 'asc'
        }, {
          title: 'Latitude descending',
          payload: 'latitude',
          payload_value: 'desc'
        }, {
          title: 'Longitude ascending',
          payload: 'longitude',
          payload_value: 'asc'
        }, {
          title: 'Longitude descending',
          payload: 'longitude',
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
    deleteLocation(item){
      let parameter = {
        id: item.id
      }
      this.APIRequest('location_scopes/delete', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.data.splice(this.data.indexOf(item), 1)
      })
    },
    showModal(action, item = null){
      if(action === 'create') {
        this.modalProperty = {...propertyModal}
        let inputs = this.modalProperty.inputs
        inputs.map(input => {
          input.value = null
        })
        let params = this.modalProperty.params
      }
      if(item !== null) {
        let modalData = {...this.modalProperty}
        let parameter = {
          title: 'Update Location',
          route: 'location_scopes/update',
          button: {
            left: 'Cancel',
            right: 'Update'
          },
          params: [{
            variable: 'id',
            value: item.id
          }]
        }
        modalData = {...modalData, ...parameter}
        modalData.inputs.map(input => {
          if(input.variable === 'code') {
            input.value = item.code
          }
          if(input.variable === 'route') {
            input.value = item.route
          }
          if(input.variable === 'city'){
            input.value = item.city
          }
          if(input.variable === 'region'){
            input.value = item.region
          }
          if(input.variable === 'country'){
            input.value = item.country
          }
          if(input.variable === 'latitude'){
            input.value = item.latitude
          }
          if(input.variable === 'longitude'){
            input.value = item.longitude
          }
          this.modalProperty = {...modalData}
        })
      }
      $('#scopeLocatioModal').modal('show')
    },
    setOnRemoveItem(item){
      this.$refs.confirmation.show(item.id)
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
          value: filter.value + '%',
          column: filter.column,
          clause: 'like'
        }],
        sort: sort,
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('location_scopes/retrieve', parameter).then(response => {
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
    removeItem(event){
      let parameter = {
        id: event.id
      }
      this.APIRequest('location_scopes/delete', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve()
      })
    }
  }
}
</script>
