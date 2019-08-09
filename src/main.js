import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import VueResource from 'vue-resource'
import VTooltip from 'v-tooltip'
import Api from './Api.js'
import Store from './Store.js'
import Notify from './Notify.js'
import confirm from './confirm.js'
import App from './App'
import router from './router'
import common from './common'
import commons from './commons'
import Multiselect from 'vue-multiselect'
import VueApexCharts from 'vue-apexcharts'


Vue.component('multiselect', Multiselect)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

Vue.use(VueProgressBar, {
    color: '#97e1c2',
    failedColor: 'red',
    thickness: '3px',
})

Vue.use(confirm, {
    message: 'Confirm operation',
    cancel: 'Cancel',
    confirm: 'Confirm'
})


Vue.config.app = process.env
Vue.use(Notify)
Vue.use(VueResource)
Vue.use(Api)
Vue.use(Store)
Vue.use(require('vue-moment'));
Vue.http.options.credentials = true;
Vue.config.productionTip = false
Vue.use(VTooltip)

Vue.http.options.credentials = true;
Vue.http.options.xhr = { withCredentials: true };
let initialized = false

let notAuth = ['auth', 'auth_reset']
router.beforeEach((to, from, next) => {
    let store = Store.get()

    console.log(to.name)

    if (to.path === "/logout") {
        console.log('logout now')
        Store.get().authenticated = false
        Store.get().profile = null
        Vue._api.getReq('logout').then(() => {})
    }

    console.log('User authenticated', !!store.authenticated)
    if (!store.authenticated) {
        if (notAuth.indexOf(to.name) >= 0) {
            return next()
        } else {
            console.log('NOPE', to.name)
            return router.push({ name: 'auth' })
        }
    } else {
        if (notAuth.indexOf(to.name) >= 0) {
            return router.push({ name: 'dashboard' })
        }
        next()
    }
})

let vu = () => {

    if (initialized) {
        return
    }

    initialized = true

    Vue.mixin({
        methods: {
            refreshProfile() {
                this.$api.getReq('user/counters').then(res => {
                    this.$storage.counters = res.body.counters
                })
            },
            refreshUser(cb) {
                this.$api.getReq('/restricted/status').then(res => {
                    this.$storage.authenticated = true
                    this.$storage.profile = res.body.user
                    cb && cb()
                })
            }
        },
    })

    new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: { App },
        created: function() {},
        mounted() {
            this.refreshProfile()
        }
    })

}
// http://localhost:8080/api/v1/public/login/email?email=foobar0@gmail.com&password=foobar&redirect=true
Vue._api.getReq('status').then(res => {
    Store.get().authenticated = true
    Store.get().profile = res.body.user
    vu()
}).catch(() => {
    vu()
})