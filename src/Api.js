function Api($http, apiAddress) {
    var http = $http
    var progress
    var self = this

    this.area = 'restricted'

    apiAddress = apiAddress || ''

    var progressExclude = [
        '/api/v1/config', '/api/v1/health_check'
    ]

    var currentRequestsCounter = 0
    http.interceptors.push((request, next) => {

        let exclude = false
        progressExclude.forEach(e => {
            if (request.url.indexOf(e) >= 0) {
                exclude = true
            }
        })

        if (exclude) {
            return next()
        }

        progress && progress.start()
        currentRequestsCounter++
        next(res => {
            currentRequestsCounter--
            if (currentRequestsCounter === 0) {
                progress && progress.finish()
            }
        })
    })

    this.setNotificationHandler = (cb) => {
        http.interceptors.push((request, next) => {
            next(res => {
                if (res.data.notification) {
                    cb && cb(res.data.notification)
                }
            })
        })
    }

    this.setUnauthorizedHandler = (cb) => {
        http.interceptors.push((request, next) => {
            next(function(res){
                if(res.status === 401){
                    cb && cb()
                }
            })
        })
    }

    var U = '/api/v1/'+this.area+'/'

    this.getU = function(url){
        if(url[0] === '/'){
            return '/api/v1' + url
        }
        return '/api/v1/'+this.area+'/' + url
    }

    var errFn = function(err) {
        console.log(err)
    }

    this.getUrl = function(){
        return U
    }

    var qs = function(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return "?" + str.join("&");
    }

    this.qs = qs

    this.setProgress = function(p) {
        progress = p
    }

    var toArray = function(id) {
        if (id instanceof Array) {
            return id;
        }
        return [id];
    }

    this.getReq = function(url, data){
        var qs = ""
        if(data){
            qs = this.qs(data)
        }

        return http.get(this.getU(url) + qs)
    }

    this.postReq = function(url, data){
        return http.post(this.getU(url), data)
    }

    this.uploadReq = function(url, data, progressCb){
        return http.post(this.getU(url), data, {
            progress(e) {
                progressCb && progressCb(e, e.lengthComputable && (e.loaded / e.total * 100))
            }
        })
    }

    this.deleteReq = function(url){
        return http.delete(this.getU(url))
    }

}


export default {
    install: function(Vue, options) {
        Vue._api = new Api(Vue.http)

        Object.defineProperty(Vue.prototype, '$api', {
            get() {
                return Vue._api
            }
        })
    }
}