<template>
  <div class="products-container" v-if="data !== null">
    <div v-bind:class="{'active-product': item.id === selectedId}" class="product-holder" v-for="(item, index) in data" :key="index" @click="selectedIdHandler(item)">
      <div class="product-image">
        <img :src="config.BACKEND_URL + item.featured[0].url" v-if="item.featured !== null">
        <i class="fa fa-image" v-else></i>
      </div>
      <div class="product-details">
        <div class="product-title">
          <label style="padding-top: 5px;"><b>{{item.title}}</b></label>
          <label>Quantity:  
            {{item.inventories[0].qty != 0 ? item.inventories[0].qty : ''}}
            <i v-if="item.inventories[0].qty === 0" class="fa fa-times-circle red" aria-hidden="true"></i>
          </label>
        </div>  
        <div class="product-price">
          <label v-if="item.price !== null">
            <label v-if="item.price.length === 1">PHP {{item.price[0].price}}</label>
            <label v-if="item.price.length > 1">PHP {{item.price[item.price.length - 1].price + ' - ' + item.price[0].price}}</label>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .red {
    color: red;
  }
  .products-container {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
  }
  .product-holder{
    width: 100%;
    height: 300px;
    border: solid 1px #ddd;
    margin-bottom: 10px;
    color: #555;
  }
  .product-holder:hover{
    cursor: pointer;
    border: solid 1px #ffaa81;
    background: #ffaa81;
    color: #fff;
  }

  .product-image{
    width: 100%;
    float: left;
    position: relative;
    height: 250px;
    text-align: center;
  }

  .product-image img{
    height: 250px;
    float: left;
    width: 100%;
  }
  .product-image .fa-image{
    font-size: 150px;
    line-height: 250px;

  }
  .product-details{
    height: 50px;
    width: 100%;
    float: left;
    border-top: solid 1px #ddd;
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
  @media (max-width: 991px){
    .product-holder{
      width: 90%;
      margin-left: 5%;
      margin-right: 5%;
    }
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
  props: ['data', 'selectedId'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    selectedIdHandler(item){
      this.$emit('selectedIdEvent', item)
    }
  }
}
</script>
