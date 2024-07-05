<template>
    <div class="wrapper">
        <div class="header">
            <div class="tabs">
                <p class="tab" :class="{active:tabIdx==index}" v-for="(item,index) in tabs" :key="index"
                    @click="handleTabs(item,index)"
                >{{item}}</p>
            </div>
        </div>
        <panelTask ref="panelTask" :id="projectId" :sessionkey="sessionkey" v-if="tabIdx==0" />
        <fileTask  :projectId="projectId" :sessionkey="sessionkey" v-if="tabIdx==1"/>
    </div>
</template>
<script>
import {message} from '@/utils/message.js';
import panelTask from '@/components/task/panel_task.vue';
import fileTask from '@/components/task/file_task.vue';
export default {
    components:{
        panelTask,
        fileTask
    },
    data() {
        return {
            tabIdx: 0,
            tabs: ['任务','文件'],
            projectId: ""
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.projectId = options.projectId;
        console.log('projectId', this.projectId)
    },
    onShow(){
        
    },
    methods:{
        handleTabs(item,index){
            this.tabIdx = index;
        }
    }
}
</script>
<style lang="scss">
@import url('../../../../static/css/task.css');
.wrapper{
    .header{
        background: #fff;
        .tabs{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #e2e3e5;
            .tab{
                padding: 10rpx 20rpx;
                border-radius: 30rpx;
                font-size: 28rpx;
                color: #999;
                margin: 0 10rpx;
            }
            .tab.active{
                background: #3399ff;
                color: #fff;
            }
        }
    }
}
</style>