<template>
  <div style="margin-top: 5%" class="row">
    <div class="ledgers-container-item col-4">
      <span class="body">
        <label>
          fasdf
        </label>
        <label class="pull-right amount"><b>sdfasdf</b></label>
      </span>
      <span class="footer">
        <label style="padding: 10px">
          Transaction ID:
        </label>
      </span>
    </div>
    <div class="ledgers-container-item col-4">
      <span class="body">
        <label>
          fasdf
        </label>
        <label class="pull-right amount"><b>sdfasdf</b></label>
      </span>
      <span class="footer">
        <label style="padding: 10px">
          Transaction ID:
        </label>
      </span>
    </div>
    <div class="ledgers-container-item col-4">
      <span class="body">
        <label>
          fasdf
        </label>
        <label class="pull-right amount"><b>sdfasdf</b></label>
      </span>
      <span class="footer">
        <label style="padding: 10px">
          Transaction ID:
        </label>
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped> 
@import "~assets/style/colors.scss";
.fas{
  padding-right: 0px !important;
}
.ledgers-container-item{
  border: solid 1px #ddd;
//   margin-left: 10px;
//   margin-right: 10px
}
.row{
  width: 95%
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
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      auth: AUTH,
      limit: 5,
      activePage: 0,
      offset: 0
    }
  },
  components: {},
  methods: {
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
        offset: this.offset
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('location_scopes/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.data = null
          this.numPages = null
        }
      })
    }
  }
}
</script>
