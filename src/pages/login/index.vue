<template>
    <div class="wrap">
        <div class="logo">
            <p>
                <img :src="imgUrl+'logo.png'" alt="">
            </p>
        </div>
        <div class="title">
            <p>凤凰办公账号登录</p>
        </div>
        <div class="content">
            <!-- <van-field
                :value="username"
                title-width="100rpx"
                clearable
                label="主机："
                placeholder="(如：phxinfo.cn)"
            /> -->
            <van-field
                :value="username"
                @change="changeUserName"
                title-width="100rpx"
                clearable
                label="账号："
                placeholder="请输入账号"
                label-class="label"
                placeholder-style="color:#ccc;"
            />
            <!-- <van-field
                type="password"
                :value="password"
                @change="changePassword"
                title-width="100rpx"
                clearable
                label="密码："
                placeholder="请输入密码"
                label-class="label"
                placeholder-style="color:#ccc;"
            /> -->
            <van-field
                type="password"
                :value="password"
                clearable
                label-class="label"
                title-width="100rpx"
                @change="changePassword"
                label="密码："
                placeholder="请输入密码"
                placeholder-style="color:#ccc;"
                v-if="!isIcon"
            >
                <p class="icon" slot="right-icon">
                    <i class="iconfont icon-mimayincang2" @click="getIsShow"></i>
                    <!-- <i class="iconfont" :class="{'icon-mimayincang2':!isIcon,'icon-mimaxianshi':isIcon}"  @click="getIsShow"></i> -->
                </p>
            </van-field>
            <van-field
                type="text"
                :value="password"
                clearable
                label-class="label"
                title-width="100rpx"
                @change="changePassword"
                label="密码："
                placeholder="请输入密码"
                placeholder-style="color:#ccc;"
                v-if="isIcon"
            >
                <p class="icon" slot="right-icon">
                    <i class="iconfont icon-mimaxianshi" @click="getIsShow"></i>
                    <!-- <i class="iconfont" :class="{'icon-mimayincang2':!isIcon,'icon-mimaxianshi':isIcon}"  @click="getIsShow"></i> -->
                </p>
            </van-field>
            <div class="btn">
                <van-button custom-style="border-radius:14rpx;" type="info" color="#3399ff" :disabled="disabled" @click="getLogin" block>登录</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState,mapMutations,mapActions,mapGetters } from 'vuex';
export default {
    data(){
        return {
            code:"",
            openid:"",
            username:"",
            password:"",
            userId:"",
            fullName:"",
            sessionkey:"",
            isIcon:false
        }
    },
    computed:{
        imgUrl(){
            return this.$api.photo.url;
        },
        disabled(){
            let isDisabled = true;
            if(this.username!=''&&this.password!=''){
                isDisabled = false;
            }else {
                isDisabled = true;
            }
            return isDisabled;
        }
    },
    onLoad(){
        let openid = wx.getStorageSync('openid');
        this.openid = openid;
        // if(openid){
        //     const url = '/pages/messages/main';
        //     wx.switchTab({url:url});
        // }else {
        //     this.login();
        // }
        this.login();
        // if(openid){
            // this.getLogin();
            // const url = '/pages/messages/main';
            // wx.switchTab({url:url});
        // }
    },
    onShow(){
        this.login();
    },
    methods:{
        getIsShow(){
            this.isIcon = !this.isIcon;
        },
        login(){
            let that = this;
            wx.login({
                success:res=>{
                    console.log(res);
                    that.code = res.code;
                }
            })
        },
        getLogin(){
            let data = {};
            if(this.openid){
                data = {
                    openid:this.openid,
                    username:this.username,
                    password:this.password
                }
            }else {
                data = {
                    code:this.code,
                    username:this.username,
                    password:this.password
                }
            }
            if(this.openid==''){
                if(this.username==''){
                    wx.showToast({
                        title:"请输入账号",
                        icon:"none",
                        duration:2000
                    })
                    return false;
                }else if(this.password==''){
                    wx.showToast({
                        title:"请输入密码",
                        icon:"none",
                        duration:2000
                    })
                    return false;
                }
            }
            this.$httpWX.get({
                url:this.$api.login.login,
                data:data
            }).then(res=>{
                console.log(res);
                wx.setStorageSync('openid',res.openid);
                wx.setStorageSync('sessionkey',res.sessionkey);
                wx.setStorageSync('organizationName',res.organizationName);
                wx.setStorageSync('fullName',res.fullName);
                wx.setStorageSync('userId',res.userId);
                wx.setStorageSync('businessUnitName',res.businessUnitName);
                wx.setStorageSync('businessUnitId',res.businessUnitId);
                this.openid = res.openid;
                this.sessionkey = res.sessionkey;
                this.userId = res.userId;
                this.fullName = res.fullName;
                this.updateOpenid(res.openid);
                this.updateSessionkey(res.sessionkey);
                this.updateUserId(res.userId);
                this.updateFullName(res.fullName);
                if(res.status*1===1){
                    const url = '/pages/work/main';
                    wx.switchTab({url:url});
                }else {
                    wx.showToast({
                        title:res.msg,
                        icon:'none',
                        duration:2000
                    })
                }
            })
        },
        ...mapMutations([
            'updateOpenid',
            'updateSessionkey',
            'updateUserId',
            'updateFullName'
        ]),
        changeUserName(e){
            this.username = e.mp.detail;
        },
        changePassword(e){
            this.password = e.mp.detail;
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    page{
        background: #fff;
    }
    @font-face {
        font-family: 'iconfont';
        src: url('data:font/truetype;charset=utf-8;base64,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') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }
    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-mimayincang2:before {
        content: "\e650";
    }

    .icon-mimaxianshi:before {
        content: "\e60e";
    }

    .icon-tixing:before {
        content: "\e600";
    }

    .wrap{
        .van-cell{
            border-bottom: 1rpx solid #e2e3e5!important;
        }
        .logo{
            display: flex;
            justify-content: center;
            padding: 40px 0;
            p{
                width: 139rpx;
                height: 139rpx;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
        .title{
            font-size: 47rpx;
            color: #333333;
            font-weight: bold;
            text-align: center;
            font-size: 47rpx;
            color: #333333;
        }
        .content{
            margin-top: 50rpx;
            padding: 0 67rpx;
            .btn{
                margin-top: 38rpx;
            }
            .label{
                font-size: 34rpx;
                color: #333333;
            }
            
        }
    }
</style>