<template>
  <div class="template">
    <div :class="'header' + `${classStyle === 'right' ? '-right' : ''}`">
      <div class="profile">
        <img :src="config.BACKEND_URL + data.account.profile.url" v-if="data.account.profile !== null">
        <i class="fa fa-user-circle-o text-green" v-else></i>
      </div>
      <span class="details" v-if="data.account !== null">
        <label><b>{{data.account.username}}</b></label>
      </span>
    </div>
    <div class="messege-container">
      <div :class="'content' + `${classStyle === 'right' ? '-right' : ''}`">
        <label>
          <bdi>
            <label v-html="data.message"></label>
          </bdi>
        </label>
      </div>
      <div :class="'content' + `${classStyle === 'right' ? '-right' : ''}` + ' content-product ' + classStyle">
        <div class="products-container" v-if="data.product !== null">
          <div class="product-holder">
            <div class="product-image">
              <img :src="config.BACKEND_URL + data.product.featured[0].url" v-if="data.product.featured !== null" @click="redirect('/marketplace/product/' + data.product.code)">
              <i class="fa fa-image" @click="redirect('/marketplace/product/' + data.product.code)" v-else></i>
            </div>
            <div class="product-details">
              <div class="product-title">
                <label style="padding-top: 5px;"><b>{{data.product.title}}</b></label>
                <label>Quantity:  
                  {{data.product.inventories[0].qty != 0 ? data.product.inventories[0].qty : ''}}
                  <i v-if="data.product.inventories[0].qty === 0" class="fa fa-times-circle red" aria-hidden="true"></i>
                </label>
              </div>  
              <div class="product-price">
                <label v-if="data.product.price !== null">
                  <label v-if="data.product.price.length === 1">PHP {{data.product.price[0].price}}</label>
                  <label v-if="data.product.price.length > 1">PHP {{data.product.price[data.product.price.length - 1].price + ' - ' + data.product.price[0].price}}</label>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.red {
  color: red;
}
.message-container {
  border: 1px solid red;
}
.products-container {
  display: flex;
  flex-direction: column;
}
.product-holder{
  width: 100%;
  height: auto !important;
  border: solid 1px $primary;
  color: #555;
  border-radius: 10px;
}
.product-holder:hover{
  cursor: pointer;
  border: solid 1px #ffaa81;
  background: #ffaa81;
  color: #fff;
  .product-details {
    border: solid 1px #ffaa81;
  }
}
.product-image{
  width: 100%;
  position: relative;
  height: auto;
  text-align: center;
}
.product-image img {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.product-image img{
  float: left;
  width: 200px;
}
.product-image .fa-image{
  font-size: 10rem;
  // line-height: 250px;
}
.product-details{
  height: 50px;
  width: 100%;
  float: left;
  border-top: solid 1px $primary;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.product-title{
  width: 50%;
  float: left;
  height: 50px;
}
.product-title label{
  width: 100%;
  float: left;
  font-size: 12px;
  margin: 0px !important;
  padding-left: 10px;
}
.product-price{
  width: 50%;
  float: left;
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  text-align: right;
  padding-right: 5px;
}

.product-wishlist{
  height: 50px;
  text-align: center;
  line-height: 50px;
  width: 100%;
  position: absolute;
  top: 50%;
  z-index: 10;
  display: none;
}

.product-wishlist:hover, .product-wishlist i:hover, .product-wishlist label:hover{
  cursor: pointer;
}

.product-wishlist label{
  line-height: 50px;
  float: left;
  width: 50%;
  text-align: center;
}

.product-wishlist i{
  font-size: 32px;
  line-height: 50px;
}

.product-holder:hover .product-wishlist{
  display: block;
}
.active-product {
  cursor: pointer;
  border: solid 1px #ffaa81;
  background: #ffaa81;
  color: #fff;
}
.content-product {
  width: auto !important;
  height: auto !important;
}
.right {
  float: right !important;
}
.left {
  float: left !important;
}
.messenger-holder{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.messenger-messages{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.message-row, .template{
  width: 98%;
  min-height: 10px;
  overflow-y: hidden;
  margin-top: 10px;
  margin-left: 1%;
  margin-right: 1%;
}
.template .header{
  height: 40px;
  width: 100%;
  float: left;
}

.header .profile{
  float: left;
  width: 40px;
  height: 40px;
  margin-right: 2%;
}
.header .profile img{
  height: 30px;
  width: 30px;
  z-index: 0;
  border-radius: 50%;
}

.header .profile i{
  line-height: 30px;
  font-size: 30px;
  color: $secondary !important;
}
.header .details{
  float: left;
  height: 40px;
}
.header .details label{
  width: 100%;
  float: left;
  color: #555;
  line-height: 12px;
  line-height: 30px;
}


.header-right .profile{
  float: right;
  width: 40px;
  height: 40px;
  margin-left: 2%;
  text-align: right;
}
.header-right .profile img{
  height: 30px;
  width: 30px;
  z-index: 0;
  border-radius: 50%;
}

.header-right .profile i{
  line-height: 30px;
  font-size: 30px;
  color: $primary !important;
}
.header-right .details{
  float: right;
  height: 40px;
}
.header-right .details label{
  width: 100%;
  float: right;
  color: #555;
  line-height: 12px;
  line-height: 30px;
}
.template .content{
  min-height: 10px;
  float: left;
  width: 100%;
  overflow-y: hidden;
  text-align: justify;
}
.template .content-right{
  min-height: 10px;
  float: left;
  width: 100%;
  overflow-y: hidden;
  text-align: right;
}
.template .content label, .template .content-righ label{
  line-height: 18px;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null
    }
  },
  props: ['data', 'classStyle'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
