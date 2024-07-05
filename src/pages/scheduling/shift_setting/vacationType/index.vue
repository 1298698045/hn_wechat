<template>
    <div class="wrapper">
        <div class="center">
            <div class="panel">
                <van-cell-group>
                    <van-cell v-for="(item,index) in list" :key="index" :title="item.title" :label="item.desc" />
                </van-cell-group>
            </div>
        </div>
        <div class="footer">
            <div class="row">
                <p class="btn" :class="{'active':isModelmes}">保存</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list: [
                {
                    title: '事假',
                    desc: '因私事或其他个人原因请的假。'
                },
                {
                    title: '事假',
                    desc: '因私事或其他个人原因请的假。'
                },
                {
                    title: '事假',
                    desc: '因私事或其他个人原因请的假。'
                },
                {
                    title: '事假',
                    desc: '因私事或其他个人原因请的假。'
                },
                {
                    title: '事假',
                    desc: '因私事或其他个人原因请的假。'
                },
                {
                    title: '事假',
                    desc: '因私事或其他个人原因请的假。'
                },
                {
                    title: '事假',
                    desc: '因私事或其他个人原因请的假。'
                },
                {
                    title: '事假',
                    desc: '因私事或其他个人原因请的假。'
                }
            ]
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    methods:{
    }
}
</script>
<style lang="scss">
    .wrapper{
        .panel{
            margin-top: 20rpx;
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 999;
            .row{
                display: flex;
                border-top: 1rpx solid #e2e3e5;
                .label{
                    font-size: 24rpx;
                    flex: 1;
                    padding: 30rpx 0 30rpx 20rpx;
                    text-align: center;
                    color: #3399ff;
                }
                .label.active{
                    padding-bottom: 40rpx;
                }
                .btn{
                    flex: 1;
                    padding: 30rpx 0;
                    background: #3399ff;
                    color: #fff;
                    font-size: 26rpx;
                    text-align: center;
                }
                .btn.active{
                    padding-bottom: 100rpx;
                }
            }
        }
    }
</style>