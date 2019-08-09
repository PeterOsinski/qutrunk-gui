<template>
    <!-- Page header -->
    <div>
        <div class="page-header page-header-light">
            <div class="page-header-content header-elements-md-inline">
                <div class="page-title d-flex">
                    <h4><span class="font-weight-semibold">Settings</span></h4>
                    <a href="#" class="header-elements-toggle text-default d-md-none"><i class="icon-more"></i></a>
                </div>
            </div>
        </div>
        <!-- /page header -->
        <!-- Content area -->
        <div class="content">
            <div class="card">
                <div class="card-body">
                    <h3>Account quota</h3>
                    <ul>
                        <li><strong>Messages left</strong> - how many messages you can push to any queue within this limit</li>
                        <li><strong>Queues left</strong> - how many queues more you can create</li>
                        <li><strong>Max message size</strong> - describes maximum size of the message (across all queue)</li>
                        <li><strong>Inbound transfer</strong> - every message is measured in terms of size and subtracted from this overall limit</li>
                    </ul>
                    <div class="row">
                        <settings-counter :filter="'thousands'" :value="this.quota.messages_left" :label="'Mesages left'" />
                        <settings-counter :filter="'thousands'" :value="this.quota.queues_left" :label="'Queues left'" />
                        <settings-counter :filter="'bytes'" :value="this.quota.max_msg_size" :label="'Max. message size'" />
                        <settings-counter :filter="'bytes'" :value="this.quota.bytes_left" :label="'Inbound transfer left'" />
                    </div>
                </div>
            </div>
            <div class="alert bg-info text-white" v-if="socialAccount">
                <i class="icon icon-google" v-if="socialAccount === 'google'"></i>
                <i class="fa fa-bitbucket" v-if="socialAccount === 'bitbucket'"></i>
                <i class="icon icon-github" v-if="socialAccount === 'github'"></i>
                <span class="font-weight-semibold">Heads up!</span> Your profile is connected to your <strong>{{socialAccount}}</strong> account.
            </div>
            <div class="card">
                <div class="card-body">
                    <h3>Your profile</h3>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-md-6" v-if="!socialAccount">
                                <label>Email</label>
                                <input type="text" disabled v-model="user.email" class="form-control">
                            </div>
                            <div class="col-md-6" v-if="socialAccount">
                                <label>Username</label>
                                <input type="text" disabled v-model="user.name" class="form-control">
                            </div>
                        </div>
                    </div>
                    <div class="form-group" v-if="false">
                        <div class="row">
                            <div class="col-md-6" v-if="false">
                                <label>Email notifications</label>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <div class="uniform-choice"><span class="checked"><input type="radio" name="visibility" class="form-input-styled"></span></div>
                                        Updates & new features
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <div class="uniform-choice"><span><input type="radio" name="visibility" class="form-input-styled"></span></div>
                                        Quota warnings
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label>Email notifications</label>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <div class="uniform-checker"><span :class="{'checked': notifications.updates}"><input type="checkbox" class="form-input-styled" v-model="notifications.updates"></span></div>
                                        Updates & new features
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <div class="uniform-checker"><span :class="{'checked': notifications.quota}"><input type="checkbox" class="form-input-styled" v-model="notifications.quota"></span></div>
                                        Quota warnings
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <button type="submit" class="btn btn-primary legitRipple">Save profile</button>
                    </div>
                    <hr />
                    <template v-if="!socialAccount">
                        <h3>Set new password</h3>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-6">
                                    <input v-model="password.password" type="password" placeholder="Enter new password" class="form-control">
                                </div>
                                <div class="col-md-6">
                                    <input v-model="password.repeat" type="password" placeholder="Repeat new password" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <button @click="changePassword()" class="btn btn-primary legitRipple">Save new password</button>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            quota: {
                messages_left: false,
                queues_left: false,
                max_msg_size: false,
                bytes_left: false
            },
            notifications: {
                updates: false,
                quota: false
            },
            user: {
                email: '',
            },
            password: {
                password: '',
                repeat: ''
            },
        }
    },
    computed: {
        socialAccount() {
            if (this.user.github_id) {
                return 'github'
            }
            if (this.user.bitbucket_id) {
                return 'bitbucket'
            }
            if (this.user.google_id) {
                return 'google'
            }
            return false
        }
    },
    methods: {
        changePassword() {
            if (this.password.password !== this.password.repeat) {
                this.$notify.addError('Password must be the same!')
                return
            }

            if (this.password.password.length < 6) {
                this.$notify.addError('Password must be at least 6 characters!')
                return
            }

            this.$api.postReq('user/password', {
                new_password: this.password.password
            }).then(res => {
                if (!res.body.status) {
                    this.passwordError = res.body.message
                    return
                }

                this.password.password = ''
                this.password.repeat = ''
                this.$notify.addSuccess('Password changed')
            })
        },
        loadQuota() {
            this.$api.getReq('user/quota').then(res => {
                this.quota = res.body.data
            })
        },
        loadProfile() {
            this.$api.getReq('user/profile').then(res => {
                let u = res.body.user
                this.user = u
            })
        }
    },
    mounted() {
        this.loadQuota()
        this.loadProfile()
    }
}
</script>