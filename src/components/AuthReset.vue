<template>
    <div class="page-content login-cover">
        <div class="content-wrapper">
            <!-- Content area -->
            <div class="content d-flex justify-content-center align-items-center" style="flex-grow: 0">
                <!-- Password recovery form -->
                <form class="login-form">
                    <div class="card mb-0">
                        <div class="card-body">
                            <div class="text-center mb-3">
                                <i class="icon-spinner11 icon-2x text-warning border-warning border-3 rounded-round p-3 mb-3 mt-1"></i>
                                <h5 class="mb-0">Password reset</h5>
                                <span class="d-block text-muted">Provide new password</span>
                            </div>
                            <div class="form-group form-group-feedback form-group-feedback-right">
                                <input type="password" v-model="reset.password" class="form-control" placeholder="New password">
                                <div class="form-control-feedback">
                                    <i class="icon-lock text-muted"></i>
                                </div>
                            </div>
                            <div class="form-group form-group-feedback form-group-feedback-right">
                                <input type="password" v-model="reset.repeat" class="form-control" placeholder="Retype password">
                                <div class="form-control-feedback">
                                    <i class="icon-lock text-muted"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <button :class="{'loading-mask': this.running.password}" @click="resetPassword($event)" class="btn bg-blue btn-block legitRipple"><i class="icon-spinner11 mr-2"></i> Reset password</button>
                            </div>
                            <div class="alert bg-success" v-if="success">{{success}}</div>
                            <div class="alert bg-danger" v-if="error">{{error}}</div>
                            <div class="form-group">
                            <router-link class="btn btn-success btn-block" :to="{name: 'auth'}">Go to login</router-link>
                            </div>
                        </div>
                    </div>
                </form>
                <!-- /password recovery form -->
            </div>
            <!-- /content area -->
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            reset: {
                repeat: '',
                password: ''
            },
            success: '',
            error: '',
            running: {
                password: false,
            }
        }
    },
    methods: {
        resetPassword(event) {

            event && event.preventDefault()

            if (!this.reset.password) {
                return this.error = 'Please provide a password'
            }
            if (this.reset.password.length < 6) {
                return this.error = 'Password must be at least 6 characters long'
            }
            if (this.reset.password !== this.reset.repeat) {
                return this.error = 'Passwords are not the same'
            }

            this.error = ''
            this.success = ''

            this.running.password = true
            this.$api.postReq('user/reset_password', {
                password: this.reset.password,
                code: this.$route.params.code
            }).then(res => {
                var m = res.body.message
                this.running.password = false
                this.success = 'We`ve set a new password for you, you can now login'
            }).catch(res => {
                this.running.password = false

                var m = res.body.message
                this.error = 'There was a problem with the process, please request password reset again or contact us directly: support@qutrunk.com'
            })
        },
    },
    mounted() {
        this.$api.area = 'public'
    }
}
</script>