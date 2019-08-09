<template>
    <!-- Page header -->
    <div>
        <div class="page-header page-header-light">
            <div class="page-header-content header-elements-md-inline">
                <div class="page-title d-flex">
                    <h4><span class="font-weight-semibold">Queues</span></h4>
                    <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
                </div>
            </div>
        </div>
        <!-- /page header -->
        <!-- Content area -->
        <div class="content">
            <onboard-messages/>
            <div class="row">
                <dashboard-counter :col-class="'col-sm-4 col-xl-4'" :label="'Queues left'" :icon="'battery-charging'" :value="$storage.counters.quota.queues_left || 0" />
                <dashboard-counter :col-class="'col-sm-4 col-xl-4'" :label="'Queues count'" :icon="'checkmark3'" :value="rows.length" />
                <dashboard-counter :col-class="'col-sm-4 col-xl-4'" :label="'Non-empty queues'" :icon="'database-menu'" :color="'danger'" :value="rows.filter(q => q.messages_in_queue > 0).length" />
            </div>
            <div class="card">
                <div class="card-header header-elements-inline">
                    <h5 class="card-title">
                        <button class="btn btn-primary" @click="edit = !edit">Add queue</button>
                    </h5>
                    <div class="header-elements">
                        <div class="list-icons">
                            <a class="list-icons-item" data-action="reload" @click="load"></a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p>
                        This is the list of your queues, in this section you can create, purge and delete queues. You can also view basic statistics about them. Remember, you dont need to create a queue directly from this section. Queues can be created while pushing a first message to them (assuming that the access token has certain permissions). To learn more about the queues and how they work - read <strong>Queues</strong> section in <strong>documentation</strong>
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
                                <th>Backend</th>
                                <th>Total messages pushed</th>
                                <th>Messages in queue</th>
                                <th>Last message pushed at</th>
                                <th>Last message pulled at</th>
                                <th>Created date</th>
                                <th>Last 24h activity</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="r in rows">
                                <td>
                                    {{r.name}}
                                    <i v-tooltip="r.description" v-if="r.description" class="icon-info22"></i>
                                </td>
                                <td>{{r.backend_key}}</td>
                                <td>{{r.total_messages|thousands}}</td>
                                <td>{{r.messages_in_queue|thousands}}</td>
                                <td>
                                    <template v-if="r.last_pushed">{{r.last_pushed|formatDate}} ({{r.last_pushed|ago}})</template></td>
                                <td>
                                    <template v-if="r.last_pulled">{{r.last_pulled|formatDate}} ({{r.last_pulled|ago}})</template></td>
                                <td>
                                    {{r.created_at|formatDate}} ({{r.created_at|ago}})
                                </td>
                                <td>
                                    <time-chart :height="50" :width="150" v-if="usage.length>0" :data="usage.filter(u => u._id.queue === r._id)" :series="[{
                                        name: r._id, key: 'messages', i:0, data:[]
                                    }]" :chart="chartOptions" />
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <button  @click="edit = r._id" v-tooltip="'Edit'" class="btn btn-primary"><i class="icon-pencil"/></button>
                                        <button v-tooltip="'Purge (clear) queue'" class="btn btn-danger" @click="purge($event, r.name)"><i class="icon-eraser3"></i></button>
                                        <button v-tooltip="'Remove queue'" class="btn btn-danger" @click="remove($event, r.name)"><i class="icon-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- /content area -->
        <queue v-if="edit" :id="edit" @close="edit = false" @reload="load()" />
        <!-- /content area -->
    </div>
</template>
<script>
import Queue from './modal/Queue.vue'
import TimeChart from './common/TimeChart'
let interval
export default {
    components: { Queue, TimeChart },
    data() {
        return {
            chartOptions: {
                stroke: {
                    width: 3
                },
                markers: {
                    size: 0
                },
                xaxis:{
                    type:'datetime'
                },
                chart: {
                    type: 'line',
                    width: 100,
                    height: 35,
                    sparkline: {
                        enabled: true
                    }
                },
                tooltip: {
                    fixed: {
                        enabled: true
                    },
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function(seriesName) {
                                return ''
                            }
                        }
                    },
                    marker: {
                        show: false
                    }
                }
            },
            rows: [],
            usage: [],
            edit: false,
            loading:false,
        }
    },
    methods: {
        purge(_, id) {
            this.$confirm({ message: 'Are you sure you want to REMOVE this queue?' }).then(() => {
                this.$api.postReq('queue/purge/' + id).then(res => {
                    this.load()
                })
            })
        },
        remove(_, id) {
            this.$confirm({ message: 'Are you sure you want to REMOVE this queue?' }).then(() => {
                this.$api.postReq('queue/delete/' + id).then(res => {
                    this.load()
                })
            })
        },
        loadUsage() {
            if(this.rows.length === 0){
                return
            }
            
            this.$api.getReq('usage_log/last_24h_queue', {
                queues: this.rows.map(q => q._id)
            }).then(res => {
                this.usage = res.body.data
            })
        },
        load() {
            this.loading = true
            this.$api.getReq('queue/list').then(res => {
                this.rows = res.data.data
                this.loadUsage()
                this.refreshProfile()
                this.loading = false
            })
        }
    },
    destroyed() {
        clearInterval(interval)
    },
    mounted() {
        this.load()
        interval = setInterval(() => {
            this.load()
        }, 60 * 1000)
    }
}
</script>