<template>
    <!-- Page header -->
    <div>
        <div class="page-header page-header-light">
            <div class="page-header-content header-elements-md-inline">
                <div class="page-title d-flex">
                    <h4><span class="font-weight-semibold">Access tokens</span></h4>
                    <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
                </div>
            </div>
        </div>
        <!-- /page header -->
        <!-- Content area -->
        <div class="content">
            <onboard-messages/>
            <div class="row">
                <dashboard-counter 
                :col-class="'col-sm-6 col-xl-6'" 
                :label="'Active tokens'"
                :icon="'checkmark3'"
                :value="rows.filter(q => q.active).length"/>
                <dashboard-counter 
                :col-class="'col-sm-6 col-xl-6'" 
                :label="'Inactive tokens'"
                :icon="'cross2'"
                :color="'danger'"
                :value="rows.filter(q => !q.active).length"/>
            </div>
            <div class="card">
                <div class="card-header header-elements-inline">
                    <h5 class="card-title">
                        <button class="btn btn-primary" @click="edit = !edit">Add token</button>
                    </h5>
                    <div class="header-elements">
                        <div class="list-icons">
                            <a class="list-icons-item" data-action="reload" @click="load"></a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p>
                        Publishing, consuming and other actions on queues requires an active access token. You can manage them here.
                    </p>
                </div>
                <div class="table-responsive">
                    <div class="table-loader" v-if="loading">
                        <i class="icon-spinner2 spinner"/>
                    </div>
                    <table class="table table-striped table-sm" v-if="!loading">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Value</th>
                                <th>Active</th>
                                <th>Queues</th>
                                <th>Permissions</th>
                                <th>Last used date</th>
                                <th>Created date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="r in rows">
                                <td>{{r.name}}</td>
                                <td>{{r.value}}</td>
                                <td>
                                    <span v-if="!r.active" class="badge badge-danger">Inactive</span>
                                    <span v-if="r.active" class="badge badge-success">Active</span>
                                </td>
                                <td>
                                    <span v-if="r.queues.length === 0" class="badge badge-warning">All queues</span>
                                    <span v-for="q in r.queues" style="margin-left:3px" class="badge badge-success">{{q.name}}</span>
                                </td>
                                <td>
                                    <span v-if="r.access_create_queue" class="badge badge-primary">Create queue on push</span>
                                    <span v-if="r.access_push" class="badge badge-primary">Publish</span>
                                    <span v-if="r.access_pull" class="badge badge-primary">Consume</span>
                                </td>
                                <td>
                                    <template v-if="r.last_used">{{r.last_used|formatDate}} ({{r.last_used|ago}})
                                    </template>
                                </td>
                                <td>{{r.created_at|formatDate}} ({{r.created_at|ago}})</td>
                                <td>
                                    <div class="btn-group">
                                        <button v-tooltip="'Edit token'" class="btn btn-primary" @click="edit = r._id"><i class="icon-pencil"></i></button>
                        <button v-tooltip="'Remove token'" class="btn btn-danger" @click="remove($event, r._id)"><i class="icon-trash"></i></button>
                    </div>
                    </td>
                    </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- /content area -->
        <access-token v-if="edit" :id="edit" 
        :queues="queues"
        @close="edit = false" @reload="load()"/>
    </div>
</template>
<script>
import AccessToken from './modal/AccessToken.vue'
export default {
    components: {
        AccessToken
    },
    data() {
        return {
            queues:[],
            rows: [],
            loading: false,
            edit: false,
        }
    },
    methods: {
        toggleActive(_, id) {
            this.$confirm({ message: 'Are you sure you want to REMOVE this queue?' }).then(() => {
                this.$api.postReq('access_token/active/' + id).then(res => {
                    this.load()
                })
            })
        },
        remove(_, id) {
            this.$confirm({ message: 'Are you sure you want to REMOVE this access token?' }).then(() => {
                this.$api.postReq('access_token/delete/' + id).then(res => {
                    this.load()
                })
            })
        },
        load() {
            this.loading = true
            this.$api.getReq('access_token/list').then(res => {
                this.rows = res.data.data
                this.queues = res.data.queues
                this.loading = false

                if(this.rows.length === 0){
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