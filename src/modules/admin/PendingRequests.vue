<template>
  <div style="margin-top: 5%" class="row">
    <div class="ledgers-container-item col-6">
      <h5 style="margin-top: 3%">Pending Requests for Account Verification</h5>
      <hr>
      <table class="table table-bordered table-responsive" v-if="pending != null">
      <thead>
        <tr>
          <td>Account</td>
          <td>Account Type</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in pending" :key="index">
          <td>
            {{item.username}}
          </td>
          <td>
            {{item.account_type}}
          </td>
        </tr>
      </tbody>
    </table>
    <empty v-if="pending === null" :title="'No Pending Requests for Account Verification!'" ></empty>
    </div>
    <div class="ledgers-container-item col-6">
      <h5 style="margin-top: 3%">Pending Requests for Partners</h5>
      <hr>
      <table class="table table-bordered table-responsive" v-if="data != null">
      <thead>
        <tr>
          <td>Account</td>
          <td>Plan</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>
            {{item.account.username}}
          </td>
          <td>
            {{item.plan}}
          </td>
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'No Pending Requests for Partners!'" ></empty>
    </div>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.fas{
  padding-right: 0px !important;
}
.row{
  width: 95%;
  margin-left: 3%;
}
h5{
  text-align: center;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default{
  mounted(){
    if(this.user.type !== 'ADMIN'){
      ROUTER.push('/marketplace')
    }
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
    this.retrievePendingAccount()
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      auth: AUTH,
      limit: 5,
      activePage: 0,
      offset: 0,
      pending: null
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue')
  },
  methods: {
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
          response.data.map(el => {
            if(el.status === 'pending'){
              this.data = response.data
            }
          })
        }else{
          this.data = null
        }
      })
    },
    retrievePendingAccount(){
      let parameter = {
        status: 'EMAIL_VERIFIED',
        limit: 10
      }
      this.APIRequest('accounts/retrieve_pending_verified', parameter).then(response => {
        if(response.data.length > 0){
          this.pending = response.data
        }else{
          this.pending = null
        }
      })
    }
  }
}
</script>
