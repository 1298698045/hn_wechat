<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="未投票 4"></i-tab>
            <i-tab key="tab2" title="已投票 15"></i-tab>
            <i-tab key="tab3" title="未响应 2"></i-tab>
        </i-tabs>
        <div class="center">
            <div v-if="current=='tab1'">
                <div class="row" v-for="(item,index) in list" :key="index">
                    <div class="l">
                        <p>
                            {{item.FullName}}
                        </p>
                    </div>
                    <div class="c">
                        <p>
                            {{item.FullName}}
                            <span>{{item.BusinessUnitIdName}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div  v-if="current=='tab2'||current=='tab3'">
                <div class="row"  v-for="(item,index) in list" :key="index">
                    <div class="l">
                        <p>
                            {{item.FullName}}
                        </p>
                    </div>
                    <div class="c">
                        <p>
                            {{item.FullName}}
                            <span>{{item.BusinessUnitIdName}}</span>
                        </p>
                        <p class="time">08:23</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box" v-if="current=='tab1'">
                <p @click="getRemind">提醒</p>
                <p>添加</p>
            </div>
            <div class="box" v-if="current=='tab2'||current=='tab3'">
                <p>添加</p>
            </div>
        </div>
        <van-action-sheet
            :show="show"
            @close="onClose"
            @cancel="onClose"
            cancel-text="取消"
            z-index="999"
        >
            <div class="sheetWrap">
                <p class="title" @click="getRemind">提醒方式</p>
                <p class="text">应用内</p>
                <p class="text">短信</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
export default {
    data(){
        return {
            current:"tab1",
            id:"",
            sessionkey:"",
            list:[
                {
                    owningUserName:"名字",
                    owningBusinessUnitName:"技术部门"
                }
            ],
            show:false,
            PollId:"",
            statusCode:0
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
        this.PollId = options.PollId;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.peopleList,
                    SessionKey:this.sessionkey,
                    Pollid:this.PollId,
                    statusCode:this.statusCode
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.statusCode = 0;
            }else if(this.current=='tab2'){
                this.statusCode = 1;
            }else if(this.current=='tab3'){
                this.statusCode = 2;
            }
            this.getQuery();
        },
        getRemind(){
            this.show = true;
        },
        onClose(){
            this.show = false;
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
            border-top: 1rpx solid #e2e3e5;
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
        .sheetWrap{
            width: 100%;
            text-align: center;
            .title{
                font-size: 28rpx;
                color: #999999;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #e2e3e5;
            }
            .text{
                font-size: 36rpx;
                color: #333333;
                padding: 30rpx 0;
            }
        }
    }
</style>