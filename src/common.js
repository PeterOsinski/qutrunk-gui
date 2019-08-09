import Vue from 'vue'
import momentDurationFormatSetup from "moment-duration-format"
import moment from 'moment'

Vue.filter("toFixed", (v, decimal) => v && parseFloat(v).toFixed(decimal || 2))
Vue.filter("thousands", function numberWithCommas(x) {
    return (x || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
})
Vue.filter("duration", (v, format) => moment.duration(v, 'seconds').format(format || 'HH[g] mm[m]'))
Vue.filter("duration2", (duration) => {
    var neg = duration < 0 && '-' || ''

    duration = Math.abs(duration)

    var h = String(parseInt(duration / 3600))
    if (h.length <= 2) {
        h = ('00' + h).slice(-2)
    }
    return neg + h + ':' +
        String('00' + parseInt((duration / 60) % 60)).slice(-2) + ':' +
        String('00' + parseInt(duration % 60)).slice(-2);
})

Vue.filter("bytes", (x) => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0,
        n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l)
        n = n / 1024;

    //include a decimal point and a tenths-place digit if presenting 
    //less than ten of KB or greater units
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
})

Vue.filter("durationDay", (duration) => {
    if (!duration) {
        return '-'
    }
    return moment.duration(duration).days()
})

//only if less than 24 hours
Vue.filter("durationFull", (v, f) => moment.utc(v * 1000).format(f || 'HH:mm:ss'))
Vue.filter("date", v => moment.unix(v).utcOffset(0).format('HH:mm:ss'))
Vue.filter("ago", v => moment(v).fromNow())
Vue.filter("formatDate", (v, format) => moment(v).format(format || 'DD-MM-YY HH:mm:ss'))

Vue.mixin({
    methods: {
        globalRefreshConfig() {
            var self = this
            this.$storage.refreshConfig((d) => {
                self.$schema.setEntities(d.entity)
            })
        }
    }
})


Array.prototype.diff = function(a) {
    return this.filter(function(i) {
        return a.indexOf(i) < 0;
    });
};

Object.unflatten = function(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (var p in data) {
        var cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
};

Object.flatten = function(data) {
    var result = {};

    function recurse(cur, prop) {
        if (Object(cur) !== cur || Array.isArray(cur)) {
            result[prop] = cur;
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}