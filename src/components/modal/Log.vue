<template>
    <modal @close="$emit('close')">
        <template slot="header">
            Message log
        </template>
        <div class="table-responsive">
            <table class="table">
                <tbody>
                    <tr>
                        <td>Uuid</td>
                        <td>{{form._id}}</td>
                    </tr>
                    <tr>
                        <td>Created at</td>
                        <td>{{form.processed_at|formatDate}}</td>
                    </tr>
                    <tr>
                        <td>Pushed IP</td>
                        <td>{{form.pushed_ip}}</td>
                    </tr>
                    <tr>
                        <td>Pushed token</td>
                        <td>{{form['pushed_access_token.name'] || form['pushed_access_token.value']}}</td>
                    </tr>
                    <tr>
                        <td>Processed date</td>
                        <td>{{form.processed_at|formatDate}}</td>
                    </tr>
                    <tr>
                        <td>Processed IP</td>
                        <td>{{form.processed_ip}}</td>
                    </tr>
                    <tr>
                        <td>Processed token</td>
                        <td>{{form['processed_access_token.name'] || form['processed_access_token.value']}}</td>
                    </tr>
                    <tr>
                        <td>Queue</td>
                        <td>{{form['queue.name']}}</td>
                    </tr>
                    <tr>
                        <td>Size</td>
                        <td>{{form.size}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="padding: 20px; height:200px">
            <h5>Data</h5>
            <pre>{{form.data|show}}</pre>
        </div>
    </modal>
</template>
<script>
import modal from '../common/Modal.vue'

export default {
    components: { modal },
    props: {
        id: null
    },
    filters: {
        show(v){
            try{
                if(v[0] === "[" || v[0] === "{"){
                    return JSON.stringify(JSON.parse(v), undefined, 2); 
                }else{
                    return v
                }
            }catch(e){
                return v
            }
        },
    },
    data() {
        return {
            form: {
                _id: null,
            },
            errors: {},
        }
    },
    methods: {},
    mounted() {

        if (typeof this.id !== 'string') {
            return
        }

        this.$api.getReq('log/show/' + this.id).then(res => {
            this.form = Object.flatten(res.body.data)
        })
    }
}
</script>

<style>
    .modal-container {
        word-break: break-all;
    }
</style>