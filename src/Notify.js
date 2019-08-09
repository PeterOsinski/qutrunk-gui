function Notify() {
    var self = this

    var handler

    this.messages = []

    this.addSuccess = function(msg, timeout) {
        this.add('success', msg, timeout)
    }
    this.addError = function(msg, timeout) {
        this.add('danger', msg, timeout)
    }
    this.addWarning = function(msg, timeout){
        this.add('warning', msg, timeout)
    }

    this.add = function(type, text, timeout) {
        var uuid = Math.random()
        var self = this
        this.messages.push({
            type: type,
            text: text,
            uuid: uuid
        })
        setTimeout(function() {
            self.close(uuid)
        }, timeout || 3000)
    }

    this.close = function(uuid) {
        this.messages = this.messages.filter(function(m) {
            return uuid !== m.uuid
        })

        handler(this.messages)
    }

    this.setHandler = function(fn) {
        handler = fn
        handler(this.messages)
    }

}

export default {
    install: function(Vue, options) {
        var a = new Notify()
        Object.defineProperty(Vue.prototype, '$notify', {
            get() {
                return a
            }
        })
    }
}