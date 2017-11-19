// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
Vue.config.productionTip = false

import App from './App'
import router from './router'

import VueIdb from 'vue-idb'
Vue.use(VueIdb)

const idb = new VueIdb({
  version: 1,
  database: 'osprey',
  schemas: [
    {
      cameras: 'id, image_count, largest_image_size, largest_image_index, data_used, updated_at'
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  idb: idb,
  router,
  template: '<App/>',
  components: { App }
})
