<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card" :class="loading">
                <div class="card-header header-elements-inline">
                    <h3 class="card-title">Overall messages processed (last 5 days)</h3>
                </div>
                <div class="card-body" style="min-height:300px">
                    <apexchart v-if="charts.usage" height="300" type="line" :options="usageChartOptions" :series="usageChartSeries"></apexchart>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import moment from "moment"
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
            usageChartSeries: [{
                name: 'Messages pulled',
                key: 'message_pulled',
                i: 0,
                data: []
            }, {
                name: 'Messages pushed',
                key: 'message_pushed',
                i: 0,
                data: []
            }]
        }
    },
    methods: {
        loadUsage() {
            this.$api.getReq('usage_log/last_5d').then(res => {

                let n = moment().startOf('hour').subtract(5, 'day')

                let _p = []

                for (let i = 0; i <= 24 * 5; i++) {
                    _p.push(n.unix())
                    n.add(1, 'hour')
                }

                this.usageChartSeries.forEach((s, sk) => {
                    let p = JSON.parse(JSON.stringify(_p))
                    let d = res.body.data.map(v => {
                        let t = moment(v._id)
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
}
</script>