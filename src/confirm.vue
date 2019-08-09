<template>
    <div>
        <div class="bootbox modal fade bootbox-confirm show" tabindex="-1" role="dialog" style="padding-right: 15px; display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header"><h5 class="modal-title">Confirm action</h5><button type="button" class="bootbox-close-button close" data-dismiss="modal" aria-hidden="true">×</button></div>
                    <div class="modal-body">
                        <div class="bootbox-body">{{message}}</div>
                    </div>
                    <div class="modal-footer"><button data-bb-handler="cancel" type="button" class="btn btn-link" @click="cancelAction">Cancel</button><button data-bb-handler="confirm" type="button" @click="confirmAction" class="btn btn-primary">Confirm</button></div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    </div>
</template>
<script>
var self
var remove = function(e) {
    window.removeEventListener('keyup', h);
}

var h = function(e) {
    if (e.keyCode === 13) {
        self.onConfirm(e)
        remove(e)
    }
    if (e.keyCode === 27) {
        self.onCancel(e)
        remove(e)
    }
}

export default {
    components: {},
    methods: {
        cancelAction: function() {
            this.onCancel()
            remove()
        },
        confirmAction: function() {
            this.onConfirm()
            remove()
        },
    },
    created: function() {
        self = this
        window.addEventListener("keyup", h)
    }
}
</script>