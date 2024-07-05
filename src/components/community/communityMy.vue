<template>
    <div class="community">
        <div class="header">
            <div class="row">
                <div class="avatar">{{fullName}}</div>
                <div class="rInfo">
                    <p class="name">{{fullName}}</p>
                    <p class="jd">简介：社区，让生活变得更有乐趣</p>
                </div>
            </div>
            <div class="column">
                <div class="box">
                    <p class="num">0</p>
                    <p class="text">社区</p>
                </div>
                <div class="box">
                    <p class="num">0</p>
                    <p class="text">关注</p>
                </div>
                <div class="box">
                    <p class="num">0</p>
                    <p class="text">粉丝</p>
                </div>
            </div>
        </div>
        <div class="c_content">
            <div class="module">
                <p class="icon"></p>
                <p class="label">我的相册</p>
            </div>
            <div class="module">
                <p class="icon"></p>
                <p class="label">我的故事</p>
            </div>
            <div class="module">
                <p class="icon"></p>
                <p class="label">我的赞</p>
            </div>
            <div class="module">
                <p class="icon"></p>
                <p class="label">粉丝服务</p>
            </div>
            <div class="module">
                <p class="icon"></p>
                <p class="label">凤凰钱包</p>
            </div>
            <div class="module">
                <p class="icon"></p>
                <p class="label">凤凰运动</p>
            </div>
            <div class="module">
                <p class="icon"></p>
                <p class="label">粉丝头条</p>
            </div>
            <div class="module">
                <p class="icon"></p>
                <p class="label">客服中心</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"CommunityMy",
    data(){
        return {

        }
    },
    computed:{
        fullName(){
            return wx.getStorageSync('fullName');
        }
    },
    onLoad(){

    },
    methods:{

    }
}
</script>
<style lang="scss">
    .community{
        .header{
            background: #fff;
            .row{
                display: flex;
                align-items: center;
                padding: 20rpx 33rpx;
                border-bottom: 1rpx solid #e2e3e5;
                .avatar{
                    width: 80rpx;
                    height: 80rpx;
                    line-height: 80rpx;
                    text-align: center;
                    border-radius: 50%;
                    background: #3399ff;
                    color: #fff;
                    font-size: 28rpx;
                }
                .rInfo{
                    margin-left: 20rpx;
                    .name{
                        font-size: 33rpx;
                        color: #333;
                    }
                    .jd{
                        color: #999999;
                        font-size: 28rpx;
                    }
                }
            }
            .column{
                padding: 20rpx 0;
                display: flex;
                .box{
                    flex: 1;
                    text-align: center;
                    .num{
                        font-size: 28rpx;
                        color: #333;
                    }
                    .text{
                        font-size: 26rpx;
                        color: #999999;
                    }
                }
            }
        }
        .c_content{
            margin-top: 33rpx;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 33rpx 0;
            background: #fff;
            .module{
                width: 25%;
                text-align: center;
                .icon{
                    width: 100rpx;
                    height: 100rpx;
                    background: #ccc;
                    margin: 20rpx auto;
                }
                .label{
                    font-size: 28rpx;
                    color: #333;
                }
            }
        }
    }
</style>