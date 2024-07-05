<template>
    <div class="wrap">
        <div class="header padding">
            <p>
                {{info.newFullName}}
            </p>
            <h3>{{info.fullName}}</h3>
        </div>
        <div class="center">
            <ul class="uls">
                <li>
                    <p>单位名称</p>
                    <p>{{organizationName}}</p>
                </li>
                <li>
                    <p>部门</p>
                    <p>{{info.deptName}}</p>
                </li>
                <li>
                    <p>职位</p>
                    <p>{{info.jobTitle}}</p>
                </li>
                <li>
                    <p>姓名</p>
                    <p>{{info.fullName}}</p>
                </li>
                <!-- 下一期 -->
                <!-- <li class="flex">
                    <div class="box">
                        <p>工作状态(TA还没有加入考勤组)</p>
                        <p>今日未排班</p>
                    </div>
                    <div class="icon">
                        <i-icon type="enter" color="#999999" size="20" />
                    </div>
                </li> -->
            </ul>
            <ul class="uls">
                <li class="flex">
                    <div class="box" @click="getCopy(info.mobile)">
                        <p>手机</p>
                        <p>{{info.mobile}}</p>
                    </div>
                    <div class="icon" @click="getPhone">
                        <i-icon type="mobilephone_fill" color="#3399ff" size="20" />
                    </div>
                </li>
                <li class="flex">
                    <div class="box" @click="getCopy(info.emailAddress)">
                        <p>邮箱</p>
                        <p>{{info.emailAddress}}</p>
                    </div>
                    <div class="icon">
                        <i-icon type="mail" color="#3399ff" size="20" />
                    </div>
                </li>
            </ul>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <!-- <div class="imgWrap">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/05.3.1.Message.png" alt="">
                    </p>
                    <p>发消息</p>
                </div> -->
                 <div class="imgWrap" @click="getPhone">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/05.3.1.Call.png" alt="">
                    </p>
                    <p>呼叫</p>
                </div>
                 <div class="imgWrap" @click="getEmail">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/05.3.1.Mail.png" alt="">
                    </p>
                    <p>邮件</p>
                </div>
                 <!-- <div class="imgWrap">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/05.3.1.Share.png" alt="">
                    </p>
                    <p>分享</p>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
export default {
    data(){
        return {
            info:{},
            id:"",
            sessionkey:"",
            organizationName:"",
            hiddenphone: ""
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.organizationName = wx.getStorageSync('organizationName');
        this.id = options.id;
        this.hiddenphone = options.hiddenphone;
        this.getQueryInfo();
    },
    methods:{
        hidePhone(phone){
            var str = phone.substr(0,3)+"****"+phone.substr(7);
            return str;
        },
        ...mapMutations(['getListName']),
        getQueryInfo(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.userinfo.get",
                    SessionKey:this.sessionkey,
                    UserId:this.id
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data[0];
                if(this.info.fullName.length>2){
                    this.info.newFullName = this.info.fullName.substr(1);
                }else {
                    this.info.newFullName = this.info.fullName;
                }
                if(this.hiddenphone == true){
                    this.info.mobile = this.hidePhone(this.info.mobile)
                }
            })
        },
        getCopy(data){
            wx.setClipboardData({
                data: data,
                success (res) {
                    wx.getClipboardData({
                        success (res) {
                            console.log(res.data) // data
                        }
                    })
                }
            })
        },
        getPhone(){
            wx.makePhoneCall({
                phoneNumber: this.info.mobile //仅为示例，并非真实的电话号码
            })
        },
        getEmail(){
            let listName = [
                {
                    id:this.info.id,
                    FullName:this.info.fullName
                }
            ]
            this.getListName(listName);
            const url = '/pages/email/writeMail/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .header{
            background: #fff;
            p{
                width: 100px;
                height: 100px;
                line-height: 100px;
                text-align: center;
                background: #3399ff;
                border-radius: 50%;
                font-size: 30px;
                color: #fff;
                margin: 0 auto;
            }
            h3{
                text-align: center;
                font-size: 40rpx;
                font-weight: bold;
                padding: 10px 0;
            }
        }
        .center{
            padding-bottom: 100px;
            .uls{
                margin: 10px 0;
                padding: 0 30rpx;
                background: #fff;
                li{
                    padding: 20rpx 0; 
                    border-bottom: 1rpx solid #e2e4e3;
                    p:nth-child(1){
                        font-size: 12px;
                        color: #999999;
                    }
                    p:nth-child(2){
                        font-size: 28rpx;
                        color: #333333;
                    }
                }
                .flex{
                    display: flex;
                    justify-content: space-between;
                    p:nth-child(1){
                        font-size: 12px;
                        color: #999999;
                    }
                    p:nth-child(2){
                        font-size: 28rpx;
                        color: #333333;
                    }
                }
                .icon{
                    padding-top: 10rpx;
                }
                
                li:last-child{
                    border:none;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .box{
                display: flex;
                padding-bottom: 20rpx;
                // .imgWrap:nth-child(1) p{
                //     color: #999999;
                // }
                .imgWrap{
                    width: 50%;
                    p:nth-child(1){
                        width: 80rpx;
                        height: 80rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 10rpx auto;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    p{
                        font-size: 12px;
                        color: #3399ff;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>