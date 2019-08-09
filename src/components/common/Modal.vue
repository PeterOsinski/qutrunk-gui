<template>
    <transition name="modal">
        <div class="modal-mask" @click.self="$emit('close')">
            <div class="modal-wrapper" @click.self="$emit('close')">
                <div class="modal-container">
                    <div class="modal-header">
                        <h5 class="modal-title"><slot name="header"></slot></h5>
                        <button type="button" class="close" @click="$emit('close')">×</button>
                    </div>
                    <div class="modal-body">
                        <slot>
                            default body
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script></script>
<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 50%;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 20%;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
}

.modal-default-button {
    float: right;
}

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>