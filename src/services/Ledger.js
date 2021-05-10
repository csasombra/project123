import {router} from 'src/router/index'
import ROUTER from 'src/router'
import Vue from 'vue'
import Config from 'src/config.js'
export default {
  processRequest(group, user, callback){
    let vue = new Vue()
    let parameter = {
      code: group.title,
      account_code: user.code
    }
    $('#loading').css({display: 'block'})
    vue.APIRequest('requests/manage_request_by_thread', parameter).then(response => {
      $('#loading').css({display: 'none'})
      callback(response)
    })
  }
}
