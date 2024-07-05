<template>
    <div class="wrap">
        <div class="title">
            <textarea class="textarea" v-model="name" name="" id="" cols="30" rows="10"></textarea>
        </div>
        <div class="boxWrap">
            <p class="icon">
                <i class="iconfont icon-richeng"></i>
            </p>
            <p class="cont">
                <textarea :auto-height="true"
                maxlength="100000" v-model="MeetingSummary" name="" id="" cols="100" rows="10" :placeholder="current=='tab2'?'输入任务内容':'输入会议内容'"></textarea>
            </p>
        </div>
        <div class="enclosure">
            <p>
                <i class="iconfont icon-fujian"></i>
            </p>
            <p>附件</p>
            <p>
                <i-icon type="add" color="#3399ff" />
            </p>
        </div>
        <!-- <div class="contacts">
            <div class="row" @click="getOrganizer">
                <div class="l">
                    <i class="iconfont icon-zuzhiren"></i>
                </div>
                <div class="r">
                    <p>
                        <span class="avatar">{{organizer.FullName}}</span>
                        <span class="name">{{organizer.FullName}}</span>
                        <span class="tag">审批人</span>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="l">
                    <i class="iconfont icon-canyuren-copy"></i>
                </div>
                <div class="cont">
                    发送张丽萍等30人
                </div>
                <div class="right">
                    <i-icon type="enter" color="#666666" size="20" />
                </div>
            </div>
        </div> -->
        <div class="footer">
            <div class="box">
                <van-button type="primary" color="#3399ff" @click="getSubmit" block>完成</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { message } from '@/utils/message'
export default {
    data(){
        return {
            title:"放射安全性和骨密度测量的质量保证会议",
            content:"",
            name:"",
            MeetingSummary:"",
            sessionkey:"",
            Meetingid:"",
            current:"",
            detailInfo:"",
            id:""
        }
    },
    computed:{
        ...mapState({
            organizer:state=>{
                return state.mailList.organizer
            }
        })
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        console.log('123213', options)
        this.MeetingSummary = options.content;
        let title = '';
        this.current = options.current;
        if(options.current=='tab3'){
            title = '新建纪要';
        }else if(options.current=='tab4'){
            title = '新建议题';
        }else {
            title = '新建任务'
        }
        wx.setNavigationBarTitle({
            title: title
        })
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.name = options.name;
        this.Meetingid = options.Meetingid;
        if(options.itemId){
            this.id = options.itemId;
        }
        if(options.ActivityId){
            this.id = options.ActivityId;
        }
    },
    methods:{
        // 组织人
        getOrganizer(){
            const url = '/pages/publics/organizer/main';
            wx.navigateTo({url:url});
        },
        getSubmit(){
            if(this.current=='tab3'){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"meeting.summary.save",
                        SessionKey:this.sessionkey,
                        Meetingid:this.Meetingid,
                        MeetingSummary:this.MeetingSummary
                    }
                }).then(res=>{
                    if(res.status==1){
                        message.toast( {
                            title:'创建成功',
                            delta: 1,
                            success() {
    
                            },
                        });
                    }else {
                        message.toast( {
                            title:'创建失败',
                            delta: 1,
                            success() {
    
                            },
                        });
                    }
                })
            }else if(this.current == 'tab4'){
                if(this.id){
                    this.$httpWX.get({
                        url:this.$api.message.queryList,
                        data:{
                            method:"meeting.item.update",
                            SessionKey:this.sessionkey,
                            meetingId:this.Meetingid,
                            description:this.MeetingSummary,
                            name:this.name,
                            itemId:this.id
                        }
                    }).then(res=>{
                        console.log(res);
                        if(res.status==1){
                            wx.showToast({
                                title:res.msg,
                                icon:"success",
                                duration:2000
                            })
                        }
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 1
                            })
                        },1000)
                    })
                }else {
                    this.$httpWX.get({
                        url:this.$api.message.queryList,
                        data:{
                            method:"meeting.item.add",
                            SessionKey:this.sessionkey,
                            meetingId:this.Meetingid,
                            description:this.MeetingSummary,
                            name:this.name
                        }
                    }).then(res=>{
                        console.log(res);
                        if(res.status==1){
                            wx.showToast({
                                title:res.msg,
                                icon:"success",
                                duration:2000
                            })
                        }
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta: 1
                            })
                        },1000)
                    })
                }
            }else {
                // 新建任务
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method: this.$api.meeting.taskcreate,
                        SessionKey: this.sessionkey,
                        RegardingObjectId:this.Meetingid,
                        description:this.MeetingSummary,
                        name:this.name,
                        id: this.id
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.status==1){
                        wx.showToast({
                            title:res.msg,
                            icon:"success",
                            duration:2000
                        })
                    }
                    setTimeout(()=>{
                        wx.navigateBack({
                            delta: 1
                        })
                    },1000)
                })
            }
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/schedule.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .title{
            background: #fff;
            padding: 0 33rpx;
            margin: 20rpx 0;
            .textarea{
                width: 100%;
                height: 100rpx;
                padding: 33rpx 0;
                overflow: hidden;
                font-weight: bold;
                color: #333333;
                font-size: 33rpx;
            }
        }
        .boxWrap{
            display: flex;
            padding: 33rpx;
            background: #fff;
            margin-top: 35rpx;
            .icon{
                margin-top: 10rpx;
            }
            .cont{
                flex: 1;
                width: 100%;
                margin-left: 20rpx;
                textarea{
                    width: 100%;
                    min-height: 100rpx;
                }
            }
        }
        .enclosure{
            display: flex;
            padding: 33rpx;
            background: #fff;
            margin-top: 35rpx;
            align-items: center;
            p:nth-child(2){
                flex: 1;
                margin-left: 25rpx;
                font-size: 34rpx;
                color: #333333;
            }
            p:nth-child(3){
                width: 28rpx;
                height: 28rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                border:1rpx solid #3399ff;
            }
        }
        .contacts{
            margin-top: 35rpx;
            .row{
                display: flex;
                align-items: center;
                padding: 33rpx;
                background: #fff;
                .r{
                    flex: 1;
                    margin-left: 25rpx;
                    display: flex;
                    p{
                        display: flex;
                        align-items: center;
                        margin-right: 20rpx;
                        .avatar{
                            display: inline-block;
                            width: 50rpx;
                            height: 50rpx;
                            line-height: 50rpx;
                            text-align: center;
                            color: #fff;
                            font-size: 20rpx;
                            background: #3399ff;
                            border-radius: 50%;
                        }
                        .name{
                            font-size: 34rpx;
                            color: #333333;
                            margin: 0 10rpx;
                        }
                        .tag{
                            display: inline-block;
                            width: 68rpx;
                            height: 32rpx;
                            line-height: 32rpx;
                            text-align: center;
                            font-size: 20rpx;
                            color: #3399ff;
                            background: #e8f1fc;
                            border-radius: 5rpx;
                        }
                    }
                }
                .cont{
                    flex: 1;
                    margin-left: 25rpx;
                    font-size: 34rpx;
                    color: #333333;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .box{
                padding: 24rpx;
            }
        }
    }
</style>