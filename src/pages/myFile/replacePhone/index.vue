<template>
    <div class="wrap">
        <h3>更换手机号</h3>
        <div class="content">
            <van-field
                :value="phone"
                @change="changePhone"
                clearable
                label="手机号"
                placeholder="请输入手机号"
            />
            <van-field
                :value="password"
                @change="changePassword"
                clearable
                label="密码"
                placeholder="请输入密码"
            />
            <!-- 暂且不用 -->
            <!-- <van-field
                :value="sms"
                center
                clearable
                label="验证码"
                placeholder="请输入验证码"
                :border="false"
                use-button-slot
            >
                <p class="send" slot="button">发送验证码</p>
            </van-field> -->
            <van-button type="primary" @click="getSubmit" custom-class="btn" color="#3399ff" block>完成</van-button>
        </div>
    </div>
</template>
<script>
import { isMobile } from '@/utils/email';

export default {
    data(){
        return {
            phone:"",
            sms:"",
            sessionkey:"",
            password:"",
            username:""
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.username = options.nickName;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
    },
    methods:{
        changePhone(e){
            this.phone = e.mp.detail;
        },
        changePassword(e){
            this.password = e.mp.detail;
        },
        getSubmit(){
            if(!isMobile(this.phone)){
                wx.showToast({
                    title:'请输入正确格式手机号',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(this.password==''){
                wx.showToast({
                    title:'请输入密码',
                    icon:'none',
                    duration:2000
                })
                return false;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.my.editMobile,
                    SessionKey:this.sessionkey,
                    username:this.username,
                    password:this.password,
                    mobileNumber:this.phone
                }
            }).then(res=>{
                if(res.status==1){
                    wx.showToast({
                        title:res.msg,
                        icon:"success",
                        duration:2000,
                        success:res=>{
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                }else {
                    wx.showToast({
                        title:res.msg,
                        icon:"success",
                        duration:2000
                    })
                }
            })
            // this.$httpWX.get({
            //     url:this.$api.message.queryList,
            //     data:{
            //         method:"entity.save",
            //         SessionKey:this.sessionkey,
            //         ObjTypeCode:8,
            //         id:this.sessionkey,
            //         MobilePhone:this.phone
            //     }
            // }).then(res=>{
            //     console.log(res);
            //     wx.showToast({
            //         title:"修改成功",
            //         icon:"success",
            //         duration:2000,
            //         success:res=>{
            //             wx.navigateBack({
            //                 delta: 1
            //             })
            //         }
            //     })
            // })
        }
    }
}
</script>
<style lang="scss">
    page{
        background: #fff;
    }
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        h3{
            text-align: center;
            margin-top: 124rpx;
            font-size: 47rpx;
            font-weight: bold;
        }
        .content{
            padding: 50rpx 67rpx;
            .send{
                color: #3399ff;
            }
            .btn{
                margin-top: 30rpx;
            }
        }
    }
</style>