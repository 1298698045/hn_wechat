<template>
    <div class="wrap">
        <div class="header">
            <div class="box">
                <div class="l">
                    <p>崔曼</p>
                </div>
                <div class="c">
                    <p class="name">崔曼</p>
                    <p class="zh">zlp1010</p>
                </div>
                <div class="r">
                    <p class="icon">
                        <i-icon type="right" size="20" i-class="icon" color="#3399ff" />
                    </p>
                </div>
            </div>
        </div>
        <div class="center">
            <div class="box">
                <p>
                    <i-icon type="add" i-class="icon" size="20" />
                </p>
                <p class="add" @click="getAddNumber">添加账号</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods:{
        getAddNumber(){
            const url = '/pages/login/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .header{
        background: #fff;
        margin-top: 35rpx;
        .box{
            display: flex;
            align-items: center;
            padding: 18rpx 33rpx;
            border-bottom: 1rpx solid #eceeed;
            .l{
                p{
                    width: 72rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    border-radius: 50%;
                    background: #3399ff;
                    color: #fff;
                    text-align: center;
                    font-size: 22rpx;
                }
            }
            .c{
                flex: 1;
                margin-left: 25rpx;
                .name{
                    color: #333333;
                    font-size: 33rpx;
                }
                .zh{
                    color: #999999;
                    font-size: 28rpx;
                }
            }
            .r{
                .icon{
                    font-weight: bold;
                }
            }
        }
    }
    .center{
        background: #fff;
        .box{
            display: flex;
            padding: 39rpx 33rpx;
            .icon{
                font-size: 30px;
                font-weight: bold;
                color: #229bfa;
            }
            .add{
                color: #229bfa;
                font-size: 32rpx;
                margin-left: 25rpx;
            }
        }
    }
</style>