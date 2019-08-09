<template>
    <!-- Page header -->
    <div>
        <div class="page-header page-header-light">
            <div class="page-header-content header-elements-md-inline">
                <div class="page-title d-flex">
                    <h4><span class="font-weight-semibold">Message log</span></h4>
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
                    </h5>
                    <div class="header-elements">
                        <div class="list-icons">
                            <a class="list-icons-item" data-action="reload" @click="load"></a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p>
                        This is message log, you can browse pushed and consumed messages here. How long your messages stay in the log depends on your subscription plan. You can browse the messages by date the were accepted by queue and certain queue. Log also allows you to browse content of your messages.
                    </p>
                    <div class="form-check form-check-inline col-md-4">
                        <label class="col-form-label col-lg-4" @click="form.active = !form.active">Select a queue:
                        </label>
                        <multiselect v-model="queue" placeholder="Search a queue" label="name" track-by="_id" :options="queues || []"></multiselect>
                    </div>
                    <div class=" float-lg-right row pull-right">
                        <button class="btn btn-primary" @click="changePage('start')">
                            <<</button> <button class="btn btn-primary" @click="changePage(-1)">
                                <</button> <button class="btn btn-default">Page {{page}} of {{pages}} ({{perPage}} per page)
                        </button>
                        <button class="btn btn-primary" @click="changePage(1)">></button>
                        <button class="btn btn-primary" @click="changePage('end')">>></button>
                    </div>
                </div>
                <div class="table-responsive">
                    <div class="col-md-12">
                        <div style="margin: 10px" class="alert alert-warning" v-if="!queue">Select queue to see message logs</div>
                    </div>
                    <div class="table-loader" v-if="loading">
                        <i class="icon-spinner2 spinner"/>
                    </div>
                    <table class="table table-striped table-sm" v-if="!loading && queue">
                        <thead>
                            <tr>
                                <th>Queue</th>
                                <th>Created date</th>
                                <th>Pushed by IP</th>
                                <th>Processed date</th>
                                <th>Pulled by IP</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="r in rows">
                                <td>{{r.queue_name || r.queue_uuid}}</td>
                                <td>
                                    {{r.pushed_at|formatDate}} ({{r.pushed_at|ago}})
                                </td>
                                <td>{{r.pushed_ip}}</td>
                                <td>
                                    <template v-if="r.processed_at">{{r.processed_at|formatDate}} ({{r.processed_at|ago}})
                                    </template>
                                </td>
                                <td>{{r.pulled_ip}}</td>
                                <td>
                                    <div class="btn-group">
                                        <button v-tooltip="'Show message'" @click="show = r._id" class="btn btn-primary"><i class="icon-eye"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <log @close="show = null" v-if="show" :id="show" />
    </div>
</template>
<script>
import Log from './modal/Log.vue'
export default {
    components: { Log },
    data() {
        return {
            show: null,
            rows: [],
            edit: false,
            count: 0,
            offset: 0,
            perPage: 25,

            queue: null,
            queues: [],
            loading: false
        }
    },
    computed: {
        pages() {
            return Math.ceil(this.count / this.perPage) || 1
        },
        page() {
            return (this.offset / this.perPage) + 1
        }
    },
    watch:{
        queue(v){
            if(!v){
                return
            }
            this.load()
        }
    },
    methods: {
        changePage(dir) {
            if (dir === 'start') {
                this.offset = 0
            } else if (dir === 'end') {
                this.offset = (this.perPage * this.pages) - this.perPage
            } else if (this.offset === 0 && dir < 0) {
                return
            } else if ((this.offset + this.rows.length) >= this.count && dir > 0) {
                return
            }

            if (typeof dir === 'number') {
                this.offset += dir * this.perPage
            }

            this.load()
        },
        loadQueues() {
            this.$api.getReq('queue/list').then(res => {
                this.queues = res.body.data
            })
        },
        load() {
            this.loading = true
            this.$api.getReq('log/list', {
                limit: this.perPage,
                offset: this.offset,
                queue: this.queue._id
            }).then(res => {
                this.rows = res.data.data
                this.count = res.data.count
                if (this.rows.length === 0) {
                    this.refreshProfile()
                }
                this.loading = false
            })
        }
    },
    mounted() {
        this.loadQueues()
    }
}
</script>
<style scoped>
table td {
    padding: 2px 10px !important;
}
</style>