<template>
  <div class="dashboard-wrapper" v-if="data !== null">
    <div class="dashboard-left-container">
      <ledgers :data="data.ledger"></ledgers>
    </div>
    <div class="dashboard-right-container">
      <label style="margin-top: 15px;"><b>Ledger Summary</b></label>
      <summary-ledger :data="data.history"></summary-ledger>
    </div>
  </div>
</template>
<style scoped>
.dashboard-wrapper{
  width: 100%;
  float: left;
  min-height: 400px;
  overflow-y: hidden;
  margin-top: 25px;
  margin-bottom: 100px;
}

.dashboard-left-container{
  float: left;
  width: 25%;
  min-height: 50px;
  overflow-y: hidden;
}
.dl-container-item{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
  border: solid 1px #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}
.dl-container-item label, .dl-container-item span{
  width: 96%;
  float: left;
  height: 40px;
  line-height: 40px;
  margin-left: 2%;
  margin-right: 2%;
  padding: 0px;
  margin-bottom: 0px;
}

.dl-container-item .content{
  font-size: 20px;
  margin-bottom: 0px;
}
.dashboard-right-container{
  float: left;
  width: 72%;
  min-height: 50px;
  overflow-y: hidden;
  margin-left: 2%;
  margin-right: 1%;
}
.dr-container-header{
  width: 100%;
  float: left;
  height: 50px;
}
.dr-container-header label{
  line-height: 50px;
  height: 50px;
  float: left;
  padding-left: 10px;
}
.dr-container-item{
  width: 100%;
  float: left;
  border-radius: 5px;
  min-height: 50px;
  overflow-y: hidden;
  border: solid 1px #ddd;
  margin-top: 10px;
  padding-left: 10px;
}
.dr-container-item .header{
  width: 100%;
  float: left;
  height: 50px;
  line-height: 50px;
  color: #555;
}
.dr-container-item .body{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
@media (max-width: 992px){
  .dashboard-wrapper{
    margin-bottom: 200px;
  }
  .dashboard-right-container, .dashboard-left-container{
    width: 100%;
    margin-left: 0%;
  }

  .dr-container-header button{
    display: none;
  }

}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
export default{
  mounted(){
    // this.retrieve()
    this.retrieve({column: 'created_at', value: 'desc'}, {column: 'created_at', value: ''})
  },
  components: {
    'ledgers': require('modules/dashboard/Ledger.vue'),
    'summary-ledger': require('modules/dashboard/Summary.vue')
  },
  data(){
    return {
      user: AUTH.user,
      data: null
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(sort, filter){
      let parameter = {
        account_code: this.user.code,
        account_id: this.user.userID
      }
      setTimeout(() => {
        $('#loading').css({display: 'block'})
        this.APIRequest('ledger/dashboard', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response !== null){
            this.data = response.data
            AUTH.user.ledger.amount = response.data.ledger
          }else{
            this.data = null
            AUTH.user.ledger.amount = null
          }
        })
      }, 1000)
    }
  }
}

</script>
