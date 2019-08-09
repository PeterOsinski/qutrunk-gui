<template>
    <div>
        <div class="content">
            <onboard-messages />
            <div class="row">
                <dashboard-counter :icon="'battery-charging'" :value="quota.left" :label="'Quota left (messages)'" />
                <dashboard-counter :icon="'bars-alt'" :value="quota.sent" :label="'Messages received today'" />
                <dashboard-counter :icon="'fold'" :value="quota.in_queue" :label="'Messages in queue'" />
                <dashboard-counter :icon="'arrow-right14'" :value="quota.processed" :label="'Messages processed today'" />
            </div>
            <realtime-usage-chart />
            <queue-usage-chart />
            <overall-messages-chart />
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import QueueUsageChart from "./dashboard/QueueUsageChart"
import OverallMessagesChart from "./dashboard/OverallMessagesChart"
import RealtimeUsageChart from "./dashboard/RealtimeUsageChart"
let interval
export default {
    components: { QueueUsageChart, OverallMessagesChart, RealtimeUsageChart},
    data: function() {
        return {
            loading: 'loading-mask',
            quota: {
                left: false,
                sent: false,
                in_queue: false,
                processed: false
            },
            charts: {
                usage: false
            }
        }
    },
    methods: {
        loadQuota() {
            this.$api.getReq('user/quota').then(res => {
                this.quota.left = res.body.data.messages_left
            })
        },
        loadUsage() {
            this.$api.getReq('usage_log/today').then(res => {
                this.quota.sent = res.body.data.message_pushed
                this.quota.processed = res.body.data.message_pulled
                this.quota.in_queue = res.body.data.in_queue
            })
        }
    },
    destroyed() {
        clearInterval(interval)
    },
    mounted() {
        this.loadUsage()
        this.loadQuota()

        interval = setInterval(() => {
            this.loadQuota()
            this.loadUsage()
        }, 60 * 1000)
    }
};
</script>