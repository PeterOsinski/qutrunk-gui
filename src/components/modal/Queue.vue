<template>
    <modal @close="$emit('close')">
        <template slot="header">
            Queue -
            <template v-if="form._id">edit</template>
            <template v-if="!form._id">add new</template>
        </template>
        <fieldset class="mb-3">
            <template v-if="form._id">
                <div class="form-group row">
                    <label class="col-form-label col-lg-2">Settings</label>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <div class="uniform-checker">
                                <span :class="{'checked':form.settings.save_log}">
                                    <input type="checkbox" class="form-check-input-styled" v-model="form.settings.save_log">
                                </span>
                            </div>
                            Save messages in log
                        </label>
                    </div>
                </div>
            </template>
            <template v-if="!form._id">
                <div class="form-group row">
                    <label class="col-form-label col-lg-2">Backend</label>
                    <div class="col-lg-8">
                        <div class="form-check form-check-inline">
                            <multiselect v-model="backendObj" tag-placeholder="Select queue backend" placeholder="Select queue backend" label="name" track-by="_id" :options="backends || []" :multiple="false"></multiselect>
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-form-label col-lg-2">Queue name</label>
                    <div class="col-lg-4">
                        <input type="text" class="form-control" v-model="form.name">
                        <span v-if="errors.name" class="form-text text-danger">{{errors.name.message}}</span>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-form-label col-lg-2">Description</label>
                    <div class="col-lg-4">
                        <textarea rows="3" class="form-control" v-model="form.description"></textarea>
                        <span v-if="errors.name" class="form-text text-danger">{{errors.description.message}}</span>
                    </div>
                </div>
            </template>
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
        id: null
    },
    data() {
        return {
            form: {
                _id: null,
                name: null,
                backend: null,
                settings: {}
            },
            backendObj: null,
            backends: [],
            errors: {},
        }
    },
    methods: {
        save() {
            let addr = 'queue'
            let body = this.form

            if (typeof this.id === 'string') {
                addr = 'queue/settings/' + this.id
                body = this.form.settings
            }else{
                if(this.backendObj){
                    body.backend_key = this.backendObj.key
                    this.backendObj = null
                }
            }

            this.$api.postReq(addr, body).then(res => {
                this.$emit('close')
                this.$emit('reload')
            }).catch(res => {
                this.errors = res.body.error
            })
        }
    },
    mounted() {
        this.$api.getReq('queue_backend/list').then(res => {
            this.backends = res.body.data.map(b => {
                return {
                    key: b.key,
                    name: b.key + ` (${b.provider})`
                }
            })
        })

        if (typeof this.id !== 'string') {
            return
        }


        this.$api.getReq('queue/show/' + this.id).then(res => {
            this.form = res.body.data
        })
    }
}
</script>