<template>
    <div class="wrap">
        <div class="header">
            <div class="nav">
                <div class="box left">
                    <p>
                        <i class="iconfont icon-zuzhijiagou"><span>部门筛选</span></i>
                    </p>
                    <!-- <p class="rText">部门筛选</p> -->
                </div>
                <div class="box right">
                    <p class="imgWrap">
                        <img src="https://oawx.hnca.org.cn/img/wechat/02.3.2.Screen.png" alt="">
                    </p>
                    <p class="rText">人员筛选</p>
                </div>
            </div>
            <van-search :value="value" placeholder="搜索" />
        </div>
        <div class="row">
            <div>
                <picker class="pickers" mode="date" @change="changeDate">
                    <p>{{date}}<i-icon type="unfold" color="#3399ff" /></p>
                </picker>
                <p>全部人员外出  54人</p>
            </div>
        </div>
        <div class="center">
            <div class="rowWrap" v-for="(item,index) in 5" :key="index">
                <div class="rows">
                    <div class="name">
                        <p>李</p>
                    </div>
                </div>
                <div class="rBox">
                    <div class="text">
                        <p>李碧池</p>
                        <p>临床科室</p>
                        <p>外出原因：临床护理进修</p>
                    </div>
                    <div class="iconWrap">
                        <p>
                            <van-icon name="phone-o" custom-class="icon" size="30" color="#3399ff" @click="getPhone" />
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return  {
            value:"",
            date:"2019.05.05"
        }
    },
    methods:{
        changeDate(e){
            console.log(e);
            this.date = e.mp.detail.value;
            this.date = this.date.replace(/-/g,'.');
        },
        getPhone(){
            wx.makePhoneCall({
                phoneNumber: '1340000'
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .header{
            background: #fff;
        .nav{
            width: 100%;
            padding: 20rpx 0;
            display: flex;
            justify-content: space-between;
            .box{
                display: flex;
                .imgWrap{
                    width: 30rpx;
                    height: 30rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
                .rText{
                    font-size: 28rpx;
                    margin-left: 10px;
                    color: #333333;
                    line-height: 50rpx;
                }
            }
            .left{
                margin-left: 50px;
                i{
                    color: #d2d2d2;
                    font-size: 20px;
                    span{
                        font-size: 28rpx;
                        margin-left: 10px;
                        color: #333333;
                    }
                }
            }
            .right{
                margin-right: 50px;
            }
        }
    }
    .row{
        width: 100%;
        div{
            padding: 10rpx 30rpx;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            p:nth-child(1){
                color: #3399ff;
            }
            p:nth-child(2){
                color: #999999;
            }
        }
    }
    .center{
        width: 100%;
        background: #fff;
        .rowWrap{
            padding: 0 30rpx;
            display: flex;
            .rows{
                padding: 20rpx 0;
                display: flex;
                justify-content: center;
                align-items: center;
                .name{
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        text-align: center;
                        border-radius: 50%;
                        color: #fff;
                        font-size: 24rpx;
                        background: #3399ff;
                    }
                }
            }
            .rBox{
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 20rpx 0;
                margin-left: 10px;
                border-bottom: 1rpx solid #e2e4e3;
                .text{
                    p:nth-child(1){
                        font-size: 28rpx;
                        color: #333333;
                    }
                    p:nth-child(2){
                        font-size: 12px;
                        color: #333333;
                    }
                    p:nth-child(3){
                        font-size: 12px;
                        color: #999999;
                    }
                }
                .iconWrap{
                    .icon{
                        margin-top: 10px;
                    }
                }
            }
        }
        .rowWrap:last-child .rBox{
            border:none;
        }
    }
</style>