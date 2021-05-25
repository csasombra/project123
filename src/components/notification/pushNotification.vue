<template>
  <div>
  </div>
</template>
<script>
/* eslint-disable */
import CONFIG from 'src/config'
import firebase from 'firebase/app'
import AUTH from 'src/services/auth'
import 'firebase/messaging'
export default {
  props: ['currentToken'],
  data () {
    return {
      hasServiceWorker: false,
      auth: AUTH
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      console.log('initialize')
      if (!('serviceWorker' in navigator)) {
        console.warn('serviceWorker not working')
        return
      }
      if (!('PushManager' in window)) {
        console.warn('PushManager not working')
        return
      }
      this.hasServiceWorker = true
    },
    askForPermission () {
      if (!this.hasServiceWorker) {
        return
      }
      if (!firebase.apps.length) {
        firebase.initializeApp(CONFIG.firebaseConfig)
      }else {
        firebase.app(); // if already initialized, use that one
      }

      navigator.serviceWorker.register('static/firebase-messaging-sw.js')
        .then((registration) => {
          const messaging = firebase.messaging()
          messaging.useServiceWorker(registration)
          messaging.requestPermission().then(() => {
            messaging.getToken().then((token) => {
              if (token !== this.currentToken) {
                console.log('token', token)
                let topic = 'Payhiram-' + AUTH.user.userID
                 fetch('https://iid.googleapis.com/iid/v1/'+ token +'/rel/topics/' + topic, {
                    method: 'POST',
                    headers: new Headers({
                      'Authorization': `key=${CONFIG.firebaseServerKey}`
                    })
                }).then(response => {
                  if (response.status < 200 || response.status >= 400) {
                    throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
                  }
                  console.log('Subscribed to "' + topic + '"');
                }).catch(error => {
                  console.error(error);
                })
              }
            }).catch((err) => console.log('--- token error:', err))

          }).catch(function (err) {
            console.log('Unable to get permission to notify.', err)
          })

          messaging.onMessage((payload) => {
            console.log('payload', payload)
            // this.$emit('new-message', payload)
            if (payload.data.topic !== undefined && payload.data.topic !== null && payload.data.topic !== '' ) {
              switch(payload.data.topic.replace(/-[0-9]/, '').toLowerCase()) {
                case 'request':
                  console.log('request')
                  break
              }
              console.log('<new message> ', payload)
            }
          })

        }).catch(err => {
          firebase.app()
        })
    }
  }
}
</script>
