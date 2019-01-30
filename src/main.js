import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueApexCharts from 'vue-apexcharts'

Vue.config.productionTip = false;
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
new Vue({
  render: h => h(App),
}).$mount('#app');
