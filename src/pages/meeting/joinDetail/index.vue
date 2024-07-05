<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="未响应"></i-tab>
            <i-tab key="tab2" title="已接受"></i-tab>
            <i-tab key="tab3" title="已拒绝"></i-tab>
        </i-tabs>
        <div class="center">
            <div v-if="current=='tab1'">
                <div class="row" v-for="(item,index) in list" :key="index">
                    <div class="l">
                        <p>
                            {{item.name}}
                        </p>
                    </div>
                    <div class="c">
                        <p>
                            {{item.owningUserName}}
                            <span>{{item.owningBusinessUnitName}}</span>
                        </p>
                    </div>
                    <div class="r">
                        <p>未读</p>
                    </div>
                </div>
            </div>
            <div  v-if="current=='tab2'||current=='tab3'">
                <div class="row"  v-for="(item,index) in list" :key="index">
                    <div class="l">
                        <p>
                            {{item.owningUserName}}
                        </p>
                    </div>
                    <div class="c">
                        <p>
                            {{item.owningUserName}}
                            <span>信息中心</span>
                        </p>
                        <p class="time">08:23</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" v-if="isEdit=='true'" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box" v-if="current=='tab1'">
                <p @click="getRemind">提醒</p>
                <p>修改参与人</p>
            </div>
            <div class="box" v-if="current=='tab2'">
                <p>提醒</p>
            </div>
            <div class="box" v-if="current=='tab3'">
                <p>修改参与人</p>
            </div>
        </div>
    </div>
</template>
<script>
import { splitName } from '@/utils/splitName';
export default {
    data(){
        return {
            current:"tab1",
            id:"",
            sessionkey:"",
            status:0,
            list:[],
            userIds:"",
            isEdit:false
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.id = options.id;
        this.isEdit = options.isEdit;
        this.getQueryList();
    },
    methods:{
        getQueryList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.peoples.getlist",
                    SessionKey:this.sessionkey,
                    status:this.status,
                    id:this.id
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
                let temp = [];
                this.list.forEach(item=>{
                    temp.push(item.meetingId);
                })
                this.list.map(v=>{
                    v.name = splitName(v.owningUserName);
                    return v;
                })
                this.userIds = temp.join(',');
            })
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.status = 0;
            }else if(this.current=='tab2'){
                this.status = 2;
            }else if(this.current=='tab3'){
                this.status = 6;
            }
            this.getQueryList();
        },
        getRemind(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.message.send",
                    SessionKey:this.sessionkey,
                    objectId:this.id,
                    objectTypeCode:"5000",
                    userIds:this.userIds,
                    msgType:0
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:"success",
                    duration:2000
                })
            })
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .center{
            background: #fff;
            .row:last-child{
                border-bottom: none;
            }
            .row{
                display: flex;
                align-items: center;
                padding: 16rpx 32rpx;
                border-bottom: 2rpx solid #e2e3e5;
                .l{
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        text-align: center;
                        font-size: 26rpx;
                        color: #fff;
                        background: #3399ff;
                        border-radius: 50%;
                    }
                }
                .c{
                    flex: 1;
                    margin-left: 20rpx;
                    p{
                        font-size: 35rpx;
                        color: #333333;
                        span{
                            color: #999999;
                            font-size: 26rpx;
                            margin-left: 20rpx;
                        }
                    }
                    .time{
                        font-size: 24rpx;
                        color: #666666;
                    }
                }
                .r{
                    font-size: 24rpx;
                    color: #666666;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            .box{
                display: flex;
                p{
                    flex: 1;
                    text-align: center;
                    font-size: 34rpx;
                    color: #3399ff;
                    padding: 41rpx 0;
                }
            }
        }
    }
</style>