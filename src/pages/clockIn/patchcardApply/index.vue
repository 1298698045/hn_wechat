<template>
    <div class="wrap">
        <div class="navHeader">
            <p>补卡班次 2019-05-16,星期四,默认班次,上班时间08:00</p>
        </div>
        <picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">                    
            <div class="rowWRrap padding">
                <p class="label">
                    补卡时间点
                </p>
                <p class="time">
                        <span>2019-05-16 09:00</span>
                        <i-icon type="enter" />
                </p>
            </div>
        </picker>
        <div class="navHeader">
            <p>本月已申请0次补卡，剩余5次</p>
        </div>
        <div class="textWrap padding">
            <p>缺卡原因<span>*</span></p>
            <textarea name="" id="" placeholder="请输入" cols="30" rows="10"></textarea>
        </div>
        <div class="photoWrap padding top">
            <div class="titleBox" @click="getChooseImage">
                <p class="label">
                    图片
                </p>
                <p class="icon">
                    <i class="iconfont icon-tupian"></i>
                </p>
            </div>
            <div class="imgWrap">
                <!-- <div class="imgs" v-if="imgList==''">
                </div> -->
                <div class="imgs" v-if="imgList!=''" v-for="(item,index) in imgList" :key="index">
                    <img :src="item" alt="">
                </div>
            </div>
        </div>
        <div class="apply padding top">
            <p class="title">审批人<span>*</span><span>审批人已由管理员设置,并将自动去重</span></p>

        </div>
        <div class="rowWRrap padding top" @click="getRecord">
            <p class="label">
                历史补卡记录
            </p>
            <p>
                <i-icon type="enter" />
            </p>
        </div>
        <div class="footer">
            <div class="box">
                <van-button type="primary" color="#3399ff" block>提交</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            time:"",
            imgList:[]
        }
    },
    methods:{
        getChooseImage(){
            let that = this;
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths
                    that.imgList = tempFilePaths;
                }
            })
        },
        getRecord(){
            const url = '/pages/clockIn/patchcardApply/record/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/public.scss';
@import '../../../../static/css/icon.css';
    .padding{
        padding: 31rpx 33rpx;
    }
    .top{
        margin-top: 35rpx;
    }
    .wrap{
        .navHeader{
            font-size: 26rpx;
            color: #999999;
            padding: 31rpx 33rpx;
            background: #f4f4f4;
        }
        .rowWRrap{
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .label{
                font-size: 32rpx;
                color: #666666;
            }
            .time{
                color: #333;
            }
            .icon{
                color: #3399ff;
            }
        }
        .photoWrap{
            background: #fff;
            .titleBox{
                background: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .label{
                    font-size: 32rpx;
                    color: #666666;
                }
                .icon{
                    color: #3399ff;
                }
            }
            .imgWrap{
                display: flex;
                flex-wrap: wrap;
                margin-top: 20rpx;
                .imgs{
                    width: 100rpx;
                    height: 100rpx;
                    background: #dce1e4;
                    border-radius: 7rpx;
                    margin-right: 20rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
            }
        }
        .apply{
            background: #fff;
            .title{
                font-size: 32rpx;
                color: #666666;
                span:nth-child(1){
                    font-size: #ff6666;
                }
                span:nth-child(2){
                    color: #999999;
                    font-size: 26rpx;
                }
            }
        }
        .textWrap{
            background: #fff;
            p{
                font-size: 32rpx;
                color: #666666;
                padding-bottom: 10rpx;
                span{
                    color: #ff6666;
                }
            }
            textarea{
                height: 150rpx;
                font-size: 31rpx;
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .box{
                padding: 21rpx 33rpx;
            }
        }
    }
</style>