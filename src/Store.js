function Store(ls) {

    var ls = localStorage

    var self = this

    var config = {}

    this.authenticated = false
    this.area = 'restricted'
    this.profile = {}

    this.env = false

    this.counters = {
        queue: -1,
        token: -1,
        quota: {}
    }

    this.isDev = () => {
        return this.env && this.env.NODE_ENV === "development"
    }

    this.isProd = () => {
        return this.env && this.env.NODE_ENV !== "development"
    }

    this.setConfig = (c) => {
        config = c
    }

   
    this.lsSave = function(name, v) {
        ls.setItem(name, JSON.stringify(v))
    }

    this.lsGet = function(name) {
        return JSON.parse(ls.getItem(name))
    }

    this.getConfig = () => {
        return config
    }
}

var a = new Store(localStorage)
export default {
    install: function(Vue, options) {


        a.env = process.env

        Object.defineProperty(Vue.prototype, '$storage', {
            get() {
                return a
            }
        })
    },
    get(){
        return a
    }
}