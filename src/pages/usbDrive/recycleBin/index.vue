<template>
    <div class="wrap">
        <div class="header">
            回收站文件30天会被自动清除
        </div>
        <div class="center">
            <div class="rowCont">
                <div class="photo">
                    <!-- <img src="" alt="">     -->
                </div>
                <div class="right_lin">
                    <div class="cont">
                        <p class="name">新技术新项目中期工作报告.docx</p>
                        <p class="desc">
                            剩下30天  127KB  张丽萍  删除
                        </p>
                    </div>
                    <div class="icon" @click="getMore">
                        <i-icon type="more" size="20" color="#999999" />
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                清除回收站
            </div>
        </div>
        <van-action-sheet :show="show" :round="true" @close="getClose" z-index="999" cancel-text="取消">
            <div class="sheetWrap">
                <div class="title">
                    新技术新项目中期工作报告.docx
                </div>
                <p class="rowText">
                    还原
                </p>
                <p class="rowText">
                    彻底删除
                </p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
export default {
    data(){
        return {
            show:false
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    methods:{
        getMore(){
            this.show = true;
        },
        getClose(){
            this.show = false;
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .header{
            padding: 35rpx 32rpx;
            font-size: 28rpx;
            color: #999999;
        }
        .center{
            .rowCont{
                display: flex;
                align-items: center;
                // padding: 0 32rpx;
                padding-left: 32rpx;
                background: #fff;
                .photo{
                    width: 83rpx;
                    height: 83rpx;
                    background: #ccc;
                    padding: 32rpx 0;
                }
                .right_lin{
                    flex: 1;
                    margin-left: 26rpx;
                    padding: 32rpx 32rpx 32rpx 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1rpx solid #e2e3e5;
                    .cont{
                        .name{
                            font-size: 32rpx;
                            color: #333333;
                        }
                        .desc{
                            font-size: 24rpx;
                            color: #999999;
                        }
                    }
                }

            }
        }
        .footer{
            width: 100%;
            position: fixed;
            .box{
                padding: 33rpx 0;
                text-align: center;
                font-size: 33rpx;
                color: #3399ff;
            }
        }
        .sheetWrap{
            .title{
                text-align: center;
                color: #999999;
                font-size: 28rpx;
                padding: 30rpx 0;
            }
            .rowText{
                padding: 34rpx 0;
                color: #333333;
                font-size: 34rpx;
                text-align: center;
                border-bottom: 1rpx solid #e2e3e5;
            }
        }
    }
</style>