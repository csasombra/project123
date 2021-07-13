<template>
  <div
    class="modal fade"
    :id="data.modalInfo.id"
    tabindex="-1"
    role="dialog"
    :aria-labelledby="data.modalInfo.id"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">
        <!-- head -->
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title w-100 text-center"  v-if="data.modalInfo.type === 'summary'" id="ModalTitle">{{data.modalInfo.title}}</h5> 
          <button type="button" class="close" @click="hideModal()" aria-label="Close">
            <span aria-hidden="true" class="text-white">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <table v-if="data.body.length > 0" class="table table-bordered table-responsive">
            <thead>
              <th v-for="(datum, index) in data.headers" :key="index">{{datum.label}}</th>
            </thead>
            <tbody v-if="data.modalInfo.id === 'all_users'">
              <tr v-for="(item, index) in data.body" :key="index" >
                <td>{{item.created_at}}</td>
                <td>{{item.username}}</td>
                <td>{{item.name}}</td>
                <td>{{item.email}}</td>
                <td>{{item.account_type}}</td>
                <td>{{item.status}}</td>
              </tr>
            </tbody>
          </table>
          <div style="text-align:center;color:grey;margin-top:50px" v-if="data.body.length <= 0">
            <h3>Opps!!sorry no record :(</h3>
          </div>
          <span style="float:left;" v-if="data.body.length > 0">
            <p style="display:inline;font-weight:500">Date published</p>
            <span v-if="data.modalInfo.type === 'summary'">{{ data.modalInfo.date }}</span>
          </span>
        </div>
        <div class="modal-footer">
          <span
            style="margin-right:5%;color:#c5c5c5;font-weight:bold"  
            v-if="data.body === null"
          >cannot export an empty record. :(</span>
          <vue-json-to-csv :json-data="data.jsonData" :csv-title="data.excelTitle" v-if="data.body.length > 0">
            <button
              type="button"
              class="btn btn-primary"
              v-if="data.body.length > 0"
              @click="download('csv')"
            >Download as CSV</button>
          </vue-json-to-csv>
          <button type="button" class="btn btn-danger" @click="hideModal()">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
  .bg-primary{
    background: $primary !important
  }
  .modal-dialog{
    overflow-y: initial !important
  }
  .modal-body{
    height: 70vh;
    overflow-y: auto;
  }
  #inventoryTotaldiv{
    width: 50%;
    min-height: 100px;
    float: right;
  }
  #subheader .col-md-3{
    float:right;
  }
  #subheader #label{
    font-weight: bold;
    padding-right: 3px;
  }
</style>
<script>
import CURRENCY from 'src/services/currency.js'
import VueJsonToCsv from 'vue-json-to-csv'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
export default {
  name: 'TemplateSummaryExporter',
  components: {
    'vue-json-to-csv': VueJsonToCsv
  },
  data() {
    return {
      data: this.propsData,
      currency: CURRENCY,
      user: AUTH.user,
      currentDate: '',
      config: CONFIG,
      path: '',
      name: null
    }
  },
  methods: {
    hideModal(){
      $('#' + this.data.modalInfo.id).modal('hide')
    },
    download(type){
      this.$parent.data = this.data
      this.$parent.download(type)
    },
    retrieve(name){
      this.name = name
      var parameter = {}
      var data = []
      if(name !== null){
        if(name === 'all_users'){
          parameter = {
            hasCard: false
          }
        }
        if(name === 'users'){
          parameter = {
            hasCard: false,
            accountType: 'USER'
          }
        }
        if(name === 'users_with_image'){
          parameter = {
            accountType: 'USER',
            hasCard: true
          }
        }
        if(name === 'partners'){
          parameter = {
            hasCard: false,
            accountType: 'PARTNER'
          }
        }
        if(name === 'investor'){
          parameter = {
            hasCard: false,
            accountType: 'INVESTOR'
          }
        }
        if(name === 'marketing'){
          parameter = {
            hasCard: false,
            accountType: 'MARKETING'
          }
        }
        if(name === 'support'){
          parameter = {
            hasCard: false,
            accountType: 'SUPPORT'
          }
        }
        if(name === 'admin'){
          parameter = {
            hasCard: false,
            accountType: 'ADMIN'
          }
        }
        this.path = 'admin/retrieve_account'
        $('#loading').css({display: 'block'})
        this.APIRequest(this.path, parameter).then(response => {
          $('#loading').css({display: 'none'})
          data = response.data
          if(data.length > 0){
            this.data.body = data
          }else{
            this.data.body = []
          }
          $('#' + this.data.modalInfo.id).modal('show')
        })
      }
    }
  },
  props: ['propsData']
}
</script>
