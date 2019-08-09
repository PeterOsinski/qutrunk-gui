<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card" :class="loading">
                <div class="card-header header-elements-inline">
                    <h3 class="card-title">Queue messages for last 5 days</h3>
                </div>
                <div class="card-body" style="min-height:300px">
                    <apexchart v-if="charts.usage" height="300" type="line" :options="usageChartOptions" :series="usageChartSeries"></apexchart>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    data: function() {
        return {
            loading: 'loading-mask',

            charts: {
                usage: false
            },
            usageChartOptions: {
                chart: {
                    id: 'vuechart-example'
                },
                xaxis: {
                    type: 'datetime',
                    min: moment().subtract(5, 'day').startOf('hour').unix() * 1000,
                    max: moment().startOf('hour').unix() * 1000
                },
                yaxis: {
                    min: 0
                },
                markers: {
                    size: 0
                },
                stroke: {
                    width: 2
                },
                tooltip: {
                    x: {
                        formatter: (val, opts) => {
                            return moment(val).format('DD/MM HH:mm')
                        }
                    }
                }
            },
            usageChartSeries: []
        }
    },
    methods: {
        loadUsage() {
            this.$api.getReq('usage_log/last_5d_queue').then(res => {

                let q = {}
                res.body.data.map(e => q[e._id.queue] = 1)
                q = Object.keys(q).forEach(q => {
                    this.usageChartSeries.push({
                        name: q,
                        key: 'messages',
                        i: 0,
                        data: []
                    })
                })

                let n = moment().startOf('hour').subtract(5, 'day')

                let _p = []

                for (let i = 0; i <= 24 * 5; i++) {
                    _p.push(n.unix())
                    n.add(1, 'hour')
                }

                this.usageChartSeries.forEach((s, sk) => {
                    let p = JSON.parse(JSON.stringify(_p))
                    let d = res.body.data.filter(d => d._id.queue === s.name).map(v => {
                        let t = moment(v._id.date)
                        p.splice(p.indexOf(t.unix()), 1)
                        return [t.toDate(), v[s.key]]
                    })
                    p.forEach(t => {
                        d.push([moment(t * 1000).toDate(), 0])
                    })

                    d.sort((a, b) => moment(a[0]).unix() < moment(b[0]).unix() ? 1 : -1)

                    this.usageChartSeries[sk].data = d
                })

                this.charts.usage = true

                this.loading = ''
            })
        }
    },
    mounted() {
        this.loadUsage()
    }
};
</script>