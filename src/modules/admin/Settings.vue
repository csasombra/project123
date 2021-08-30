<template>
  <div class="ledger-summary-container">
        <h1 style="display: flex; justify-content: center; margin-right: 50%">Settings</h1>
        <div class="row" style="display: flex; justify-content: center; margin-top: 25px;">
        <div class="col-6">
            <div class="card card1" style="border-radius: 25px; cursor: pointer" @click="redirect('/currency')">
            <div class="card-body row" style="color: black">
                <div class="col-sm-11 sile1">
                    <b>Currency</b>
                    <p>Add another Cuurrency</p>
                </div>
                <div class="col-sm-1">
                    <i class="fas fa-chevron-right fa-2x" style="color: #3F0050"></i>
                </div>
            </div>
            </div>
        </div>
        </div>
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
export default{
  data(){
    return {}
  },
  methods: {
    redirect(params){
      ROUTER.push(params)
    }
  }
}
</script>
