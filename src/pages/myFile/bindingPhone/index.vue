<template>
    <div class="wrap">
        <div class="content">
            <img src="https://oawx.hnca.org.cn/img/wechat/06.1.3.Phone.png" alt="">
            <p class="phone">
                你的手机号：{{mobile}}
            </p>
            <p class="sign">
                更换手机号后，单位通讯录号码均改变。
            </p>
            <van-button type="primary" color="#3399ff" custom-class="btn" @click="getReplacePhone" block>更换手机号</van-button>
            <van-button type="primary" color="#ffffff" custom-class="btnT" @click="getUnbound" block>解绑手机号</van-button>
        </div>
        <van-popup
        :show="isShow"
        position="center"
        custom-style="width:80%;height: auto;border-radius:7rpx;"
        @close="onClosePopup"
        >
            <div class="popup">
                <h3>
                    确定要解绑手机号？
                </h3>
                <p>
                    解绑后将无法使用该手机号进行身份安全验证
                </p>
                <div>
                    <span @click="onClosePopup">取消</span>
                    <span>确定</span>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data(){
        return {
            isShow:false,
            mobile:"",
            nickName:""
        }
    },
    computed:{
        ...mapState({
            imgUrl:state=>{
                return state.user.imgUrl;
            }
        })
    },
    onReady(){
        console.log(this.imgUrl,'123123');
    },
    onLoad(options){
        this.mobile = options.mobile;
        this.nickName = options.nickName;
    },
    methods:{
        getUnbound(){
            this.isShow = true;
        },
        onClosePopup(){
            this.isShow = false;
        },
        getReplacePhone(){
            const url = '/pages/myFile/replacePhone/main?nickName='+this.nickName;
            wx.navigateTo({url:url});
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
            padding: 69rpx 33rpx;
            text-align: center;
            img{
                width: 163rpx;
                height: 287rpx;
                vertical-align: middle;
            }
            .phone{
                font-size: 32rpx;
                color: #333333;
                font-weight: bold;
                margin-top: 69rpx;
            }
            .sign{
                font-size: 26rpx;
                color: #999999;
                margin-top: 20rpx;
            }
            .btn{
                font-size: 33rpx;
                color: #fff;
                margin-top: 50rpx;
                margin-bottom: 20rpx;
                border-radius: 9rpx;
            }
            .btnT{
                font-size: 33rpx;
                color: #3399ff !important;
                border-radius: 9rpx;
            }
        }
        .popup{
            padding: 20rpx 30rpx;
            h3{
                font-size: 33rpx;
                color: #333333;
                text-align: center;
            }
            p{
                font-size: 25rpx;
                color: #999999;
                padding: 30rpx 0;
                text-align: center;
            }
            div{
                text-align: right;
                span{
                    font-size: 28rpx;
                    color: #3399ff;
                }
                span:nth-child(1){
                    margin-right: 60rpx;
                }
            }
        }
    }
</style>