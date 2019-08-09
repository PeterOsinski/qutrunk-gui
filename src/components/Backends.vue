<template>
    <!-- Page header -->
    <div>
        <div class="page-header page-header-light">
            <div class="page-header-content header-elements-md-inline">
                <div class="page-title d-flex">
                    <h4><span class="font-weight-semibold">Backends</span></h4>
                    <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
                </div>
            </div>
        </div>
        <!-- /page header -->
        <!-- Content area -->
        <div class="content">
            <onboard-messages />
            <div class="card">
                <div class="card-header header-elements-inline">
                    <h5 class="card-title">
                        <button class="btn btn-primary" @click="edit = !edit">Add backend</button>
                    </h5>
                    <div class="header-elements">
                        <div class="list-icons">
                            <a class="list-icons-item" data-action="reload" @click="load"></a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p>
                        Queues need backends to run. Create one here.
                    </p>
                </div>
                <div class="table-responsive">
                    <div class="table-loader" v-if="loading">
                        <i class="icon-spinner2 spinner" />
                    </div>
                    <table class="table table-striped table-sm" v-if="!loading">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Provider</th>
                                <th>Default</th>
                                <th>Created date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="r in rows">
                                <td>{{r.key}}</td>
                                <td>{{r.provider}}</td>
                                <td>
                                    <span v-if="r.default" class="badge badge-success">Default</span>
                                </td>
                                <td>{{r.created_at|formatDate}} ({{r.created_at|ago}})</td>
                                <td>
                                    <div class="btn-group">
                                        <button v-tooltip="'Show'" class="btn btn-primary" @click="edit = r._id"><i class="icon-pencil"></i></button>
                                        <button v-tooltip="'Set as default'" class="btn btn-success" @click="setAsDefault($event, r._id)"><i class="icon-home"></i></button>
                                        <button v-tooltip="'Remove backend'" class="btn btn-danger" @click="remove($event, r._id)"><i class="icon-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- /content area -->
        <backend v-if="edit" :id="edit" @close="edit = false" @reload="load()" />
    </div>
</template>
<script>
import Backend from './modal/Backend.vue'
export default {
    components: {
        Backend
    },
    data() {
        return {
            rows: [],
            loading: false,
            edit: false,
        }
    },
    methods: {
        setAsDefault(_, id) {
            this.$confirm({ message: 'Are you sure you want to set this backend as default?' }).then(() => {
                this.$api.postReq('queue_backend/change_default', {
                    id: id
                }).then(res => {
                    this.load()
                }).catch(err => {
                    this.$notify.addError(err.body.error)
                })
            })
        },
        remove(_, id) {
            this.$confirm({ message: 'Are you sure you want to REMOVE this queue backend?' }).then(() => {
                this.$api.postReq('queue_backend/delete/' + id).then(res => {
                    this.load()
                }).catch(err => {
                    this.$notify.addError(err.body.error)
                })
            })
        },
        load() {
            this.loading = true
            this.$api.getReq('queue_backend/list').then(res => {
                this.rows = res.data.data
                this.loading = false

                if (this.rows.length === 0) {
                    this.refreshProfile()
                }
            })
        }
    },
    mounted() {
        this.load()
    }
}
</script>