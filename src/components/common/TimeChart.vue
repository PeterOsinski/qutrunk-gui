<template>
    <apexchart v-if="charts.usage" type="line" :height="height" :width="width" :options="chart" :series="usageChartSeries"></apexchart>
</template>
<script>
import moment from 'moment'
export default {
    props: {
        data: { type: Array },
        series: { type: Array },
        chart: {type: Object},
        hoursBack: {type: Number, default: 24},
        height: {type: Number, default: 35},
        width: {type: Number, default: 100},
    },
    data: function() {
        return {
            loading: 'loading-mask',

            charts: {
                usage: false
            },
            usageChartSeries: []
        }
    },
    methods: {
        loadUsage() {
            this.usageChartSeries = this.series


            let n = moment().startOf('hour').subtract(this.hoursBack, 'hour')

            let _p = []

            for (let i = 0; i <= this.hoursBack; i++) {
                _p.push(n.unix())
                n.add(1, 'hour')
            }

            this.usageChartSeries.forEach((s, sk) => {
                let p = JSON.parse(JSON.stringify(_p))
                let d = this.data.map(v => {
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
        }
    },
    mounted() {
        this.loadUsage()
    }
};
</script>