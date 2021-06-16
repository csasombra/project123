<template>
  <div class="incre-row">
    <div class="row" style="display: flex; justify-content: space-between; margin-top: 25px;">
      <div class="col-3">
        <div class="card card1">
          <div class="card-body row" style="color: white">
              <div class="col-sm-6 sile1">
                <i class="fas fa-users fa-7x"></i>
              </div>
              <div class="col-sm-6">
                <h5 class="card-title">{{users === null ? 0 : users}}</h5>
                <p class="card-text">
                    No. of Users
                </p>
              </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card card2">
          <div class="card-body row" style="color: white">
              <div class="col-sm-6 sile2">
                <i class="fas fa-user-check fa-7x"></i>
              </div>
              <div class="col-sm-6">
                <h5 class="card-title">{{user_verified === null ? 0 : user_verified}}</h5>
                <p class="card-text">
                    No. of Verified Users
                </p>
              </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card card3">
          <div class="card-body row" style="color: white">
              <div class="col-sm-6 sile3">
                <i class="fas fa-handshake fa-7x"></i>
              </div>
              <div class="col-sm-6">
                <h5 class="card-title">{{partner === null ? 0 : partner}}</h5>
                <p class="card-text">
                    No. of Partners
                </p>
              </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card card4">
          <div class="card-body row" style="color: white">
              <div class="col-sm-6 sile4">
                <i class="fas fa-user-shield fa-7x"></i>
              </div>
              <div class="col-sm-6">
                <h5 class="card-title">{{admin === null ? 0 : admin}}</h5>
                <p class="card-text">
                    No. of Admins
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
    <PendingRequestsTable></PendingRequestsTable>
  </div>
</template>
<style lang='scss' scoped>
@import '~assets/style/colors.scss';
.bg-secondary {
  background-color: $secondary !important
}
h5{
  font-style: bold;
  font-size: 45px;
  text-align: center;
}
p{
  font-style: bold;
  font-size: 15px;
  text-align: center;
}
.card{
  border-radius: 5px;
  width: 100%;
}
.roa{
  margin-top: 20px
}
.card1{
  background-color: #1E88E5;
}
.card3{
  background-color: #FFB300;
}
.card4{
  background-color: #F64E60;
}
.card2{
  background-color: #6ed1ff;
}

.incre-row{
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import PendingRequestsTable from 'src/modules/admin/PendingRequests.vue'
export default {
  data() {
    return {
      user: AUTH.user,
      auth: AUTH,
      config: CONFIG,
      users: null,
      user_verified: null,
      partner: null,
      admin: null
    }
  },
  components: {
    PendingRequestsTable
  },
  mounted() {
    this.retrieveUsers()
    this.retrieveUsersVerified()
    this.retrievePartner()
    this.retrieveAdmin()
  },
  methods: {
    redirect(params) {
      ROUTER.push(params)
    },
    retrieveUsers(){
      let parameter = {
        accountType: 'USER'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/retrieve_type_size', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.users = response.data
      })
    },
    retrieveUsersVerified(){
      let parameter = {
        accountType: 'USER',
        status: 'ACCOUNT_VERIFIED'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/retrieve_type_size', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.user_verified = response.data
      })
    },
    retrievePartner(){
      let parameter = {
        accountType: 'PARTNER'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/retrieve_type_size', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.partner = response.data
      })
    },
    retrieveAdmin(){
      let parameter = {
        accountType: 'ADMIN'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/retrieve_type_size', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.admin = response.data
      })
    }
  }
}
</script>
