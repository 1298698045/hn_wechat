<template>
    <div class="wrap">
        <div class="content">
            <div class="title">
                <p class="name">通用</p>
                <p class="btn">收起</p>
            </div>
            <div class="rowWrap">
                <div class="box" v-for="(item,index) in 5" :key="index">
                    <div>
                        <p class="imgBox">
                            <img src="https://oawx.hnca.org.cn/img/icons/news.png" alt="">
                        </p>
                        <p class="text">新闻</p>
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

        }
    },
    computed:{
        imgUrl(){
            return this.$api.photo.url;
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
            margin: 35rpx 0;
            background: #fff;
            .title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 44rpx 33rpx;
                .name{
                    color: #333333;
                    font-size: 34rpx;
                    font-weight: bold;
                }
                .btn{
                    color: #999999;
                    font-size: 25rpx;
                }
            }
            .rowWrap{
                display: flex;
                flex-wrap: wrap;
                .box{
                    width: 25%;
                    .imgBox{
                        width: 117rpx;
                        height: 117rpx;
                        margin: 0 auto;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    .text{
                        text-align: center;
                        font-size: 26rpx;
                        color: #333333;
                        margin: 20rpx 0;
                    }
                }
            }
        }
    }
</style>