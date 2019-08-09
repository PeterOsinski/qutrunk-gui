<template>
    <div class="row">
        <div class="col-xl-12">
            <div class="card" :class="loading">
                <div class="card-header header-elements-inline">
                    <h3 class="card-title">Queue messages (pushed) for last 12 hours</h3>
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
let interval
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
                    min: moment().subtract(12, 'hour').startOf('minute').unix() * 1000,
                    // max: moment().startOf('minute').unix() * 1000
                },
                yaxis: {
                    min: 0
                },
                markers: {
                    size: 0
                },
                stroke: {
                    width: 1
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
            this.$api.getReq('usage_log/last_12h_queue').then(res => {

                let q = {}
                res.body.data.map(e => q[e._id.queue] = 1)

                if(this.usageChartSeries.length === 0){
	                Object.keys(q).forEach(q => {
	                    this.usageChartSeries.push({
	                        name: q,
	                        key: 'messages',
	                        i: 0,
	                        data: []
	                    })
	                })
                }

                let n = moment().startOf('minute').subtract(12, 'hour')

                let _p = []

                for (let i = 0; i <= 12*60; i++) {
                    _p.push(n.unix())
                    n.add(1, 'minute')
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
    destroyed() {
        clearInterval(interval)
    },
    mounted() {
        this.loadUsage()
        interval = setInterval(() => {
            this.loadUsage()
        }, 60 * 1000)
    }
};
</script>