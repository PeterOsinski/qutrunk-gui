<template>
    <modal @close="$emit('close')">
        <template slot="header">
            Queue backend -
            <template v-if="form._id">edit</template>
            <template v-if="!form._id">add new</template>
        </template>
        <fieldset class="mb-3">
            <div class="form-group row">
                <label class="col-form-label col-lg-2">Backend name</label>
                <div class="col-lg-4">
                    <input type="text" class="form-control" v-model="form.key">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-form-label col-lg-2">Provider</label>
                <div class="col-lg-8">
                    <div class="form-check form-check-inline">
                        <multiselect v-model="form.providerObj" tag-placeholder="Add this as new tag" placeholder="Search provider" label="name" track-by="value" :options="providers || []" :multiple="false"></multiselect>
                    </div>
                </div>
            </div>
            <div class="form-group row" v-if="['mongodb', 'rabbitmq'].indexOf(form.providerObj.value) >= 0">
                <label class="col-form-label col-lg-2">Connection string</label>
                <div class="col-lg-4">
                    <input type="text" class="form-control" v-model="form.connection.addr">
                </div>
            </div>
            <div class="form-group row" v-if="['redis'].indexOf(form.providerObj.value) >= 0">
                <label class="col-form-label col-lg-2">Connection host</label>
                <div class="col-lg-4">
                    <input type="text" class="form-control" v-model="form.connection.host">
                </div>
            </div>
            <div class="form-group row" v-if="['redis'].indexOf(form.providerObj.value) >= 0">
                <label class="col-form-label col-lg-2">Connection port</label>
                <div class="col-lg-4">
                    <input type="text" class="form-control" v-model="form.connection.port">
                </div>
            </div>
            <div class="form-group row" v-if="error">
                <div class="alert alert-danger">{{error}}</div>
            </div>
            <div class="form-group row">
                <label class="col-form-label col-lg-12">
                    <button type="button" class="btn btn-primary" @click="save()">Save</button>
                    <button class="btn btn-link" @click="$emit('close')">Cancel</button>
                </label>
            </div>
        </fieldset>
    </modal>
</template>
<script>
import modal from '../common/Modal.vue'

export default {
    components: { modal },
    props: {
        id: null,
        queues: { type: Array }
    },
    data() {
        return {
            providers: [
                {name: 'RabbitMQ', value: 'rabbitmq'},
                {name: 'MongoDB', value: 'mongodb'},
                {name: 'Redis', value: 'redis'},
            ],
            error: null,
            form: {
                _id: null,
                key: null,
                providerObj: {},
                provider: null,
                connection: {
                    addr: null,
                    host: null,
                    port: null
                }
            }
        }
    },
    methods: {
        save() {

            this.form.provider = this.form.providerObj.value

            this.$api.postReq('queue_backend', this.form).then(res => {
                this.$emit('close')
                this.$emit('reload')
            }).catch(e => {
                this.error = e.body.error
            })
        }
    },
    mounted() {

        if (typeof this.id !== 'string') {
            return
        }

        this.$api.getReq('queue_backend/show/' + this.id).then(res => {
            this.form = res.body.data
        })
    }
}
</script>