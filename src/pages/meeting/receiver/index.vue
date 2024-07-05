<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="未读 2"></i-tab>
            <i-tab key="tab2" title="已读 28"></i-tab>
        </i-tabs>
        <div class="content">
            <div class="row">
                <div class="lBox">
                    <p>碧池</p>
                </div>
                <div class="rBox">
                    <p>
                        碧池
                        <span>信息中心</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="boxW">
                <p>
                    崔一下
                </p>
                <p>
                    修改接收人
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            current:"tab1",
            sessionkey:"",
            status:'',
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        // this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.peoples.getlist",
                    SessionKey:this.sessionkey,
                    status:this.status
                }
            }).then(res=>{
                console.log(res);
            })
        },
        handleChange(e){
            this.current = e.mp.detail.key;
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .content{
            background: #fff;
            .row{
                display: flex;
                align-items: center;
                padding: 0 33rpx;
                .lBox{
                    padding: 16rpx 0;
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
                .rBox{
                    width: 100%;
                    flex: 1;
                    margin-left: 25rpx;
                    // border-bottom: 2rpx solid #e2e3e5;
                    padding: 16rpx 0;
                    p{
                        font-size: 35rpx;
                        color: #333333;
                        span{
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxW{
                display: flex;
                padding: 30rpx 0;
                p{
                    flex: 1;
                    text-align: center;
                    font-size: 35rpx;
                    color: #3399ff;
                }
            }
        }
    }
</style>