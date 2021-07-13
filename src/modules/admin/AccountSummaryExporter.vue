<template>
  <TemplateSummaryExport
    :propsData="data"
    ref="TemplateSummaryExport"
  >
  </TemplateSummaryExport>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
</style>
<script>
import DateManipulation from './handlers/dateManipulation.js'
import TemplateSummaryExport from './TemplateSummaryExporter.vue'
import AUTH from 'src/services/auth'
import CSV from './handlers/csv'
export default {
  name: 'Accounts',
  components: {TemplateSummaryExport},
  data(){
    return {
      data: {
        headers: [
          {name: 'created_at', label: 'Date', type: 'date'},
          {name: 'username', label: 'Username', type: 'string'},
          {name: 'name', label: 'Name', type: 'string'},
          {name: 'email', label: 'Email', type: 'string'},
          {name: 'account_type', label: 'Account Type', type: 'string'},
          {name: 'status', label: 'Status', type: 'string'}
        ],
        body: null,
        modalInfo: {
          id: 'all_users',
          title: 'Summary of Users',
          type: 'summary',
          date: DateManipulation.currentDate()
        },
        excelTitle: 'Summary of Accounts',
        date: 'JANUARY 5, 2021',
        jsonData: [],
        queryDate: null
      },
      user: AUTH.user
    }
  },
  props: ['date'],
  methods: {
    showModal(name){
      this.$refs.TemplateSummaryExport.retrieve(name)
    },
    download(){
      this.data.jsonData = CSV.toCSV(this.data, this.user, this.date, 'all_users')
    }
  }
}
</script>
