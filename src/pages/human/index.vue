<template>
    <div class="wrapper">
        <div class="header">
            <div class="banner">
                <swiper class="swiper" :indicator-dots="indicatorDots"
                    :autoplay="autoplay" :interval="interval" :duration="duration">
                    <block v-for="(item,index) in bannerList" :key="index">
                        <swiper-item>
                            <view :class="['swiper-item']">
                                <img :src="item" alt="">
                            </view>
                        </swiper-item>
                    </block>
                </swiper>
            </div>
            <div class="column">
                <div class="box_item">
                    <block>
                        <div class="img_icon">

                        </div>
                        <p class="name">考勤打卡</p>
                    </block>
                </div>
                <div class="box_item">
                    <block>
                        <div class="img_icon">

                        </div>
                        <p class="name">团队打卡</p>
                    </block>
                </div>
                <div class="box_item">
                    <block>
                        <div class="img_icon">

                        </div>
                        <p class="name">团队考勤</p>
                    </block>
                </div>
                <div class="box_item" @click="handleRouter(2)">
                    <block>
                        <div class="img_icon">

                        </div>
                        <p class="name">排班</p>
                    </block>
                </div>
                <div class="box_item" @click="handleRouter(1)">
                    <block>
                        <div class="img_icon">

                        </div>
                        <p class="name">员工花名册</p>
                    </block>
                </div>
                <div class="box_item">
                    <block>
                        <div class="img_icon">

                        </div>
                        <p class="name">更多</p>
                    </block>
                </div>
                <div class="fake_item"></div>
                <div class="fake_item"></div>
            </div>

        </div>
        <div class="center">
            <div class="panel">
                <div class="head">
                    <p class="label">
                        我的考勤
                    </p>
                    <p class="more_text">
                        更多 <van-icon name="arrow" color="#3399ff" />
                    </p>
                </div>
                <div class="bd">
                    <div class="column">
                        <div class="box_item">
                            <block>
                                <p class="num">0</p>
                                <p class="name">迟到</p>
                            </block>
                        </div>
                        <div class="box_item">
                            <block>
                                <p class="num">0</p>
                                <p class="name">迟到</p>
                            </block>
                        </div>
                        <div class="box_item">
                            <block>
                                <p class="num">0</p>
                                <p class="name">迟到</p>
                            </block>
                        </div>
                        <div class="box_item">
                            <block>
                                <p class="num">0</p>
                                <p class="name">迟到</p>
                            </block>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            indicatorDots: true,
            autoplay: true,
            interval: 3000,
            duration: 500,
            bannerList: [
                'https://oawx.hnca.org.cn/img/banner/work_banner.png?1645156214233',
                'https://oawx.hnca.org.cn/img/banner/work_banner.png?1645156214233',
                'https://oawx.hnca.org.cn/img/banner/work_banner.png?1645156214233'
            ]
        }
    },
    methods:{
        handleRouter(state){
            switch(state) {
                case 1: 
                    wx.navigateTo({
                        url:"/pages/human/employeeRoster/main"
                    })
                    break;
                case 2:
                    wx.navigateTo({
                        url: "/pages/scheduling/administrator/main"
                    })
                    break;
            }
        }
    }
}
</script>
<style lang="scss">
    .wrapper{
        .header{
            background: #fff;
            .banner{
                padding: 30rpx;
                .swiper{
                    width: 100%;
                    height: 300rpx;
                    .swiper-item{
                        width: 100%;
                        height: 100%;
                        img{
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            border-radius: 10rpx;
                        }
                    }
                }
            }
            .column{
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                padding: 0 30rpx;
                box-sizing: border-box;
                .box_item{
                    width: 22%;
                    height: 150rpx;
                    // background: #3399ff;
                    margin-bottom: 20rpx;
                    .img_icon{
                        width: 100rpx;
                        height: 100rpx;
                        background: yellow;
                        border-radius: 20rpx;
                        margin: 0 auto;
                    }
                    .name{
                        text-align: center;
                        font-size: 24rpx;
                        padding-top: 15rpx;
                    }
                }
                .fake_item{
                    flex: 0 0 22%;
                    height: 0;
                }
            }
        }
        .center{
            .panel{
                margin-top: 20rpx;
                background: #fff;
                .head{
                    border-bottom: 1rpx solid #e2e3e5;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15rpx 30rpx;
                    .label{
                        font-size: 26rpx;
                        color: #333;
                    }
                    .more_text{
                        font-size: 24rpx;
                        color: #3399ff;
                    }
                }
                .bd{
                    .column{
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 30rpx;
                        box-sizing: border-box;
                        .box_item{
                            width: 22%;
                            margin: 30rpx 0;
                            text-align: center;
                            .img_icon{
                                width: 100rpx;
                                height: 100rpx;
                                background: yellow;
                                border-radius: 20rpx;
                                margin: 0 auto;
                            }
                            .name{
                                text-align: center;
                                font-size: 24rpx;
                                padding-top: 15rpx;
                            }
                        }
                        .fake_item{
                            flex: 0 0 22%;
                            height: 0;
                        }
                    }
                }
            }
        }
    }
</style>