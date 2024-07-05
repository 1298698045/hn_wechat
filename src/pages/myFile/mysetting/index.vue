<template>
    <div class="wrap">
        <div class="header">
            <div class="box">
                <p class="text">
                    显示我的手机号
                </p>
                <p>
                    <van-switch :checked="checked" @change="changeSwitch" size="25px" />
                </p>
            </div>
            <div class="box" @click="editPhone">
                <p class="text">
                     更换手机号
                </p>
                <p>
                    <i-icon type="enter" size="25" color="#cccccc" />
                </p>
            </div>
            <div class="box" @click="getEditPass">
                <p class="text">
                     修改密码
                </p>
                <p>
                    <i-icon type="enter" size="25" color="#cccccc" />
                </p>
            </div>
        </div>
         <div class="header">
            <div class="box" @click="getAbout">
                <p class="text">
                     关于我们
                </p>
                <p>
                    <i-icon type="enter" size="25" color="#cccccc" />
                </p>
            </div>
        </div>
        <!-- 暂且不用 -->
        <!-- <div class="btnWrap">
            <van-button type="default" @click="getSwitchNumber" block>切换账号</van-button>
        </div> -->
        <!-- <div class="btnWrap">
            <van-button type="default" @click="getReplaceCode" block>更换code</van-button>
        </div> -->
        <div class="btnOut" @click="getSignOut">
            退出登录
            <!-- <van-button type="default"  @click="getSignOut" block>
                <span style="color:#ff6666">退出登录</span>
            </van-button> -->
        </div>
        <van-popup
            :show="isShow"
            position="center"
            custom-style="width:80%;height: 30%;"
            @close="onClose"
        >
            <div class="popup">
                <h3 @click="getCopy">
                    {{code}}
                </h3>
            </div>
        </van-popup>
        <van-popup
            :show="editShow"
            position="center"
            custom-style="width:80%;height: auto;border-radius: 28rpx;"
            @close="onClose"
        >
            <div class="popupWrap">
                <div class="cont">
                    <h3 class="title">修改密码</h3>
                    <p class="describe">为了保障你的账号安全，修改密码前请填写原密码</p>
                    <div class="inps">
                        <p>
                            <input placeholder-class="placeholder" type="password" v-model="oldPwd" placeholder="原密码">
                        </p>
                        <p>
                            <input placeholder-class="placeholder" type="password" v-model="newPassword" placeholder="新密码">
                        </p>
                        <p>
                            <input placeholder-class="placeholder" type="password" v-model="confirmPwd" placeholder="重复新密码">
                        </p>
                    </div>
                </div>
                <div class="btnWrap">
                    <p @click="getCancalPass">
                        取消
                    </p>
                    <p @click="getSubmitPass">
                        确认
                    </p>
                </div>
            </div>
        </van-popup>
        <van-popup
            :show="isPhone"
            position="center"
            custom-style="width:80%;height: auto;border-radius: 28rpx;"
            @close="closePhone"
        >
            <div class="phone_wrap">
                <h3 class="title">更换手机号</h3>
                <div class="phone_bd">
                    <van-field
                        type="number"
                        title-width="100rpx"
                        label="手机号:"
                        :value="phone"
                        placeholder="请输入手机号"
                        :border="false"
                        @change="changePhone"
                        :clearable="true"
                        maxlength="11"
                    />
                    <div class="btnWrap">
                        <p @click="handlePhoneCancel">
                            取消
                        </p>
                        <p @click="submitPhone">
                            确认
                        </p>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    data(){
        return {
            sessionkey:"",
            checked:false,
            code:"",
            isShow:false,
            editShow:false,
            oldPwd:"",
            newPassword:"",
            sessionKey:"",
            confirmPwd:"",
            isPhone: false,
            phone: ""
        }
    },
    onLoad(){
        this.sessionKey = wx.getStorageSync('sessionkey');
    },
    methods:{
        changeSwitch(e){
            this.checked = e.mp.detail;
            let HiddenPhone = '';
            if(this.checked){
                HiddenPhone = 1;
            }else {
                HiddenPhone = 0;
            }
            console.log(this.sessionKey,'1222222');
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.save",
                    SessionKey:this.sessionKey,
                    ObjTypeCode:8,
                    id:this.sessionKey,
                    HiddenPhone:HiddenPhone
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getSignOut(){
            wx.clearStorage();
            const url = '/pages/login/main';
            wx.reLaunch({url:url});
        },
        getAbout(){
            const url = '/pages/myFile/aboutWe/main';
            wx.navigateTo({url:url});
        },
        getSwitchNumber(){
            const url = '/pages/myFile/numberAdmin/main';
            wx.navigateTo({url:url});
        },
        getReplaceCode(){
            let that = this;
            wx.login({
                success:res=>{
                    console.log(res.code);
                    that.code = res.code;
                    that.isShow = true;
                }
            })
        },
        onClose(){
            this.isShow = false;
        },
        getCopy(){
            wx.setClipboardData({
                data: this.code,
                success (res) {
                    wx.getClipboardData({
                        success (res) {
                            console.log(res.data) // data
                        }
                    })
                }
            })
        },
        getEditPass(){
            this.editShow = true;
        },
        getCancalPass(){
            this.password = '';
            this.newPassword = '';
            this.editShow = false;
        },
        getSubmitPass(){
            if(this.oldPwd==''){
                wx.showToast({
                    title:"原密码不能为空",
                    icon:"none",
                    duration:2000
                })
                return ;
            }else if(this.newPassword==''||this.confirmPwd==''){
                wx.showToast({
                    title:"新密码不能为空",
                    icon:"none",
                    duration:2000
                })
                return ;
            }else if(this.newPassword != this.confirmPwd){
                wx.showToast({
                    title:"新密码不一致",
                    icon:"none",
                    duration:2000
                })
            }else {
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"sys.user.changepwd",
                        SessionKey:this.sessionKey,
                        oldPwd:this.oldPwd,
                        newPwd:this.newPassword,
                        confirmPwd:this.confirmPwd
                    }
                }).then(res=>{
                    console.log(res);
                    wx.showToast({
                        title:res.msg,
                        icon:"success",
                        duration:2000
                    })
                    this.editShow = false;
                })
            }
        },
        // 更换手机号
        editPhone(){
            this.isPhone = true
        },
        changePhone(e){
            this.phone = e.mp.detail
        },
        handlePhoneCancel(){
            this.isPhone = false
        },
        submitPhone(){
            var obj = {
                recordRep: {
                    objTypeCode: 8,
                    fields: {
                        MobilePhone: this.phone
                    },
                    id: ""
                }
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.scheduling.add_shift,
                    SessionKey: this.sessionKey,
                    message: JSON.stringify(obj)
                }
            }).then(res=>{
                console.log(res);
            })
            // this.isPhone = false
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .header{
            background: #fff;
            margin-top: 16rpx;
            .box{
                display: flex;
                justify-content: space-between;
                padding: 20rpx 33rpx;
                align-items: center;
                border-bottom: 1rpx solid #eaebeb;
                .text{
                    font-size: 35rpx;
                    color: #666666;
                }
            }
        }
        // .btnWrap{
        //     margin-top: 34rpx;
        // }
        .btnOut{
            margin-top: 16rpx;
            display: flex;
            justify-content: center;
            padding: 20rpx 33rpx;
            align-items: center;
            border-bottom: 1rpx solid #eaebeb;
            background: #fff;
            font-size: 35rpx;
            color: #ff6666;
        }
        .popup{
            padding: 33rpx;
        }
        .popupWrap{
            .cont{
                padding: 0 32rpx;
                .title{
                    text-align: center;
                    font-weight: bold;
                    padding-top: 30rpx;
                }
                .describe{
                    font-size: 23rpx;
                    color: #000000;
                }
                .inps{
                    margin: 30rpx 0;
                    input{
                        font-size: 24rpx;
                        border: 1rpx solid #a6a6a6;
                        padding: 0 10rpx;
                        height: 30px;
                        line-height: 30px;
                    }
                    .placeholder{
                        line-height: 30px;
                    }
                }
            }
            .btnWrap{
                display: flex;
                justify-content: center;
                border-top: 2rpx solid #ccc;
                p{
                    flex: 1;
                    font-size: 30rpx;
                    color: #007aff;
                    padding: 22rpx 0;
                    text-align: center;
                }
                p:nth-child(1){
                    border-right: 1rpx solid #ccc;
                }
            }
        }
        .phone_wrap{
            .title{
                text-align: center;
                line-height: 100rpx;
                color: #333;
                font-weight: bold;
            }
            .btnWrap{
                display: flex;
                justify-content: center;
                border-top: 2rpx solid #ccc;
                margin-top: 30rpx;
                p{
                    flex: 1;
                    font-size: 30rpx;
                    color: #007aff;
                    padding: 22rpx 0;
                    text-align: center;
                }
                p:nth-child(1){
                    border-right: 1rpx solid #ccc;
                }
            }
        }
    }
</style>