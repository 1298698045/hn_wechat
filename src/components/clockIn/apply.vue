<template>
    <div class="wrap">
        <div class="navs">
            <h3>以下审批单,已和考勤智能关联,将会自动计入考勤报表</h3>
        </div>
        <div class="applyCenter">
            <div class="parentWrap">
                <div class="boxWrap">
                    <div class="box" v-for="(item,index) in list" :key="index" @click="getRouter(item,index)">
                        <p class="imgs">
                            <img :src="item.link" alt="">
                        </p>
                        <p class="name">{{item.name}}</p>
                    </div>
                </div>
            </div>
            <div class="rowWrap">
                <div class="row">
                    <p>
                        <i-icon type="document" size="20" color="#349cfc" />
                        <span class="record">申请记录</span>
                    </p>
                    <p><i-icon type="enter" size="20" color="#cccccc" /></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'apply',
    data(){
        return {
            list:[
                {
                    link:"https://oawx.hnca.org.cn/img/wechat/04.2.2.Leave_请假.png",
                    name:"请假"
                },
                {
                    link:"https://oawx.hnca.org.cn/img/wechat/04.2.2.Evection_出差.png",
                    name:"出差"
                },
                {
                    link:"https://oawx.hnca.org.cn/img/wechat/04.2.2.Egress_外出.png",
                    name:"外出"
                },
                {
                    link:"https://oawx.hnca.org.cn/img/wechat/04.2.2.Overtime_加班.png",
                    name:"加班"
                },
                {
                    link:"https://oawx.hnca.org.cn/img/wechat/04.2.2.Ask_for_补卡申请.png",
                    name:"补卡申请"
                }
            ]
        }
    },
    methods:{
        getRouter(item,index){
            if(index==0){
                const url = '/pages/clockIn/leaveApply/main';
                wx.navigateTo({url:url});
            }else if(index==1){
                const url = '/pages/hr/businesstravel/main';
                wx.navigateTo({url:url});
            }else if(index==2){
                const url = '/pages/hr/goOut/main';
                wx.navigateTo({url:url});
            }
            else if(index==3){
                const url = '/pages/hr/overTimeApply/main';
                wx.navigateTo({url:url});
            }else if(index==4){
                const url = '/pages/clockIn/patchcardApply/main';
                wx.navigateTo({url:url});
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .wrap{
        .navs{
            background: #f4f4f4;
            padding: 31rpx 33rpx;
            h3{
                color: #999999;
                font-size: 26rpx;
            }
        }
        .applyCenter{
            .parentWrap{
                background: #fff;
                .boxWrap{
                    display: flex;
                    flex-wrap: wrap;
                    // padding: 20rpx 40rpx 40rpx 40rpx;
                    width: 100%;
                    margin: 0 auto;
                    .box{
                        // margin-right: 70rpx;
                        // margin-top: 20rpx;
                        width: 25%;
                        margin: 20rpx 0;
                        .imgs{
                            width: 96rpx;
                            height: 96rpx;
                            margin: 0 auto;
                            img{
                                width: 100%;
                                height: 100%;
                                vertical-align: middle;
                            }
                        }
                        .name{
                            text-align: center;
                            color: #666666;
                            font-size: 24rpx;
                            margin-top: 10rpx;
                        }
                    }
                }
            }
            .rowWrap{
                margin-top: 35rpx;
                background: #fff;
                .row{
                    display: flex;
                    padding: 26rpx 33rpx;
                    justify-content: space-between;
                    .record{
                        color: #666666;
                        font-size: 32rpx;
                    }
                }
            }
        }
    }
</style>