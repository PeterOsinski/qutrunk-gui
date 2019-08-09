<template>
    <modal @close="$emit('close')">
        <template slot="header">
            Access Token -
            <template v-if="form._id">edit</template>
            <template v-if="!form._id">add new</template>
        </template>
        <fieldset class="mb-3">
            <div class="form-group row">
                <label class="col-form-label col-lg-2">Token name</label>
                <div class="col-lg-4">
                    <input type="text" class="form-control" v-model="form.name">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-form-label col-lg-2" @click="form.active = !form.active">Active</label>
                <div class="col-lg-8">
                    <div class="form-check form-check-inline">
                        <div class="uniform-checker">
                            <span :class="{'checked':form.active}">
                                <input type="checkbox" class="form-check-input-styled" v-model="form.active">
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label class="col-form-label col-lg-2" @click="form.active = !form.active">Active</label>
                <div class="col-lg-8">
                    <div class="form-check form-check-inline">
                        <multiselect v-model="form.queues" tag-placeholder="Add this as new tag" placeholder="Search a queue" label="name" track-by="_id" :options="queues || []" :multiple="true"></multiselect>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label class="col-form-label col-lg-2">Permissions</label>
                <div class="col-lg-8">
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <div class="uniform-checker">
                                <span :class="{'checked':form.access_create_queue}">
                                    <input type="checkbox" class="form-check-input-styled" v-model="form.access_create_queue">
                                </span>
                            </div>
                            Create queue on push
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <div class="uniform-checker">
                                <span :class="{'checked':form.access_push}">
                                    <input type="checkbox" class="form-check-input-styled" v-model="form.access_push">
                                </span>
                            </div>
                            Publish
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <div class="uniform-checker">
                                <span :class="{'checked':form.access_pull}">
                                    <input type="checkbox" class="form-check-input-styled" v-model="form.access_pull">
                                </span>
                            </div>
                            Consume
                        </label>
                    </div>
                </div>
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
        queues: {type:Array}
    },
    data() {
        return {
            form: {
                _id: null,
                name: null,
                active: false,
                access_push: false,
                access_pull: false,
                access_create_queue: false,
                queues: []
            }
        }
    },
    methods: {
        save() {
            this.form.queues = this.form.queues.map(e => e._id)
            this.$api.postReq('access_token', this.form).then(res => {
                this.$emit('close')
                this.$emit('reload')
            })
        }
    },
    mounted() {

        if (typeof this.id !== 'string') {
            return
        }

        this.$api.getReq('access_token/show/' + this.id).then(res => {
            this.form = res.body.data
            this.form.queues = this.form.queues.map(q => {
                return {
                    name: this.queues.filter(_q => _q._id === q).pop().name,
                    _id: q
                }
            })
        })
    }
}
</script>