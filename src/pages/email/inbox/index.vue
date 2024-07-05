<template>
    <div class="wrap">
         <div class="nav" v-if="!show">
            <p>
                <van-search :value="value" placeholder="搜索邮件" @click="changeSearch" />
            </p>
            <!-- <p @click="getEdit" v-if="!show">编辑</p> -->
            <!-- <p @click="getAllSelect" v-if="show&&result==''">全选</p> -->
            <!-- <p @click="getCancel" v-if="show">取消</p> -->
        </div>
        <div class="header" v-if="!show">
            <div class="text" @click="getUnreadEmail" :style="{'color':(isUnread?'#3399ff':'')}">
                <i class="iconfont icon-weiduyoujian"></i>
                未读邮件
            </div>
            <div class="text" @click="getEdit">
                <i class="iconfont icon-youjianguanli"></i>
                邮件管理
            </div>
        </div>
        <div class="headRow"  v-if="show">
            <p @click="getAllSelect" v-if="resultTotal<list.length">全选</p>
            <p @click="getCancelAll" v-if="resultTotal==list.length">取消全选</p>
            <p @click="getCompletely">完成</p>
        </div>
        <div class="center">
            <van-checkbox-group :value="result" @change="changeCheckbox">
                <div class="content" v-for="(item,index) in list " :key="index">
                    <div class="checkWrap" v-if="show">
                        <van-checkbox custom-class="check" :name="item.emailId"></van-checkbox>
                    </div>
                    <div class="left">
                        <p class="radius">{{item.name}}</p>
                    </div>
                    <div class="right"  @click="getDetail(item)">
                        <div>
                            <p>
                                <span class="dian" v-if="!item.isRead"></span>
                                <span class="name" :class="{'active':!item.isRead}">
                                    {{item.fromName}}
                                </span>
                                <i class="iconfont icon-fujian" v-if="item.attachCount>0"></i>
                                <!-- <i-icon type="accessory" color="#fc6464" v-if="item.attachCount>0" />     -->
                            </p>
                            <p>{{item.subject?item.subject:'无主题'}}</p>
                            <p>{{item.content?item.content:'此邮件没有文字内容'}}</p>
                        </div>
                        <div>
                            <p>
                                <i-icon type="collection_fill" color="#ecd464" v-if="item.starEmail=='1'" />
                                {{item.time}}</p>
                            <!-- <span>{{item.attachCount}}</span> -->
                        </div>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="footer" v-if="show"  :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box" v-if="ltags=='draft'">
                <p @click="resultTotal>0?deleteEmail():''" class="del" :class="result!=''?'active':''">删除</p>
            </div>
            <div class="box" v-else-if="ltags=='deleted'">
                <p class="clear" :class="result!=''?'active':''" v-if="result==''" @click="getClearEmail">清空</p>
                <p class="clear" :class="result!=''?'active':''" v-else-if="resultTotal>0" @click="resultTotal>0?getThoroughDel():''">
                    彻底删除
                </p>
                <p @click="resultTotal>0?getMove:''" class="color" :class="result!=''?'active':''">移动</p>
                <p class="color" :class="result!=''?'active':''" @click="resultTotal>0?signEmail(''):''">
                    {{resultTotal>0&&!isReadBook?'标为已读':'标为未读'}}
                </p>
                <p class="color" :class="result!=''?'active':''" @click="resultTotal>0?getStar():''">
                    {{!isStar?'添加星标':'取消星标'}}
                </p>
            </div>
            <div class="box" v-else>
                <!-- <p @click="getAllSelect" v-if="result==''">全选</p>
                <p @click="getCancelAll" v-if="result!=''">取消全选</p> -->
                <p @click="signEmailAll"  v-if="result==''">全标已读</p>
                <p v-else @click="resultTotal>0?signEmail(''):''">
                    {{resultTotal==1&&!isReadBook?'标为已读':'标为未读'}}
                </p>
                <p class="color" :class="result!=''?'active':''" @click="resultTotal>0?getStar():''">
                    {{!isStar?'添加星标':'取消星标'}}
                </p>
                <!-- <p @click="getSign"  v-if="result!=''">标记邮件</p> -->
                <p @click="resultTotal>0?getMove:''" v-if="ltags!='star'" class="color" :class="result!=''?'active':''">移动</p>
                <p @click="resultTotal>0?deleteEmail():''" class="del" :class="result!=''?'active':''">删除</p>
                <!-- <p @click="getRejection">拒收</p> -->
            </div>
        </div>
        <div class="clues-add-button" v-if="!showWrite" @click="onCluesAddBtnClick">
            <van-icon name="plus" size="20px" />
        </div>
        <van-action-sheet
            :show="showSheet"
            :round="false"
            :actions="actions"
            cancel-text="取消"
            @close="onClose"
            @select="onSelect"
            @cancel="onCancel"
            z-index="99999"
        />
        <van-action-sheet
            :show="showAll"
            :round="true"
            cancel-text="取消"
            @close="onCloseAll"
            @select="onSelect"
            @cancel="onCloseAll"
            z-index="99999"
        >   
            <div class="sheet">
                <p>将此文件夹中的邮件全部标记为已读？</p>
                <p @click="signEmail(1)">全部标为已读</p>
            </div>
        </van-action-sheet>
        <!-- <van-popup
        :show="showAll"
        position="center"
        custom-style="width:80%;height: auto;border-radius:7rpx;"
        @close="onClosePopup"
        >
            <div class="popup">
                <h3>
                    全部标记已读
                </h3>
                <p>将本文件夹下的未读邮件全部标为已读状态？</p>
                <div>
                    <span @click="onClosePopup">取消</span>
                    <span>确定</span>
                </div>
            </div>
        </van-popup> -->
        <van-action-sheet
            :show="showWrite"
            :actions="actionsWrite"
            :round="false"
            cancel-text="取消"
            @close="onWriteClose"
            @cancel="onWriteCancel"
            @select="onWriteSelect"
            z-index="99999"
        >
        </van-action-sheet>
    </div>
</template>
<script>
import {getDate} from '@/utils/changeDate.js';
export default {
    data(){
        return {
            result:[],
            show:false,
            list:[],
            pageNumber:1,
            pageSize:25,
            isPage:false,
            emailId:"",
            name:"",
            ltags:"",
            showSheet:false,
            actions: [
                {
                    name:"星标"
                },
                {
                    name: '标为未读',
                    color:"#3399ff"
                },
                {
                    name: '标为已读',
                    color:"#3399ff"
                }
            ],
            signNum:1,
            showAll:false,
            actionsWrite: [
                {
                    id:1,
                    name: '写邮件',
                    color:"#3399ff"
                },
                {
                    id:2,
                    name: '写群邮件',
                    color:"#3399ff"
                }
            ],
            showWrite:false,
            sessionkey:"",
            folderId:"",
            isUnread:false
        }
    },
    computed:{
        isRead(){
            return this.isUnread==false?1:0
        },
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        resultTotal(){
            return this.result.length;
        },
        emailIdList(){
            let temp = [];
            this.list.forEach(item=>{
                temp.push(item.emailId);
            })
            return temp;
        },
        isReadBook(){
            let temp = [];
            let boolean = false;
            this.result.forEach(item=>{
                const row = this.list.find(v=>v.emailId===item);
                temp.push(row.isRead);
            })
            console.log(temp,'----')
            if(temp!=''){
                boolean = temp.every(a=>a==true);
            }
            console.log(boolean);
            return boolean;
        },
        isStar(){
            let temp = [];
            let boolean = false;
            this.result.forEach(item=>{
                const row = this.list.find(v=>v.emailId===item);
                temp.push(row.starEmail);
            })
            if(temp!=''){
                boolean = temp.every(a=>a==1);
            }
            console.log(boolean,'=======')
            return boolean;
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.name = options.name;
        this.ltags = options.ltags;
        this.folderId = options.folderId;
        wx.setNavigationBarTitle({
            title: this.name
        })
        this.getQuery();
    },
    onShow(){
        this.getQuery();
    },
    methods:{
        getUnreadEmail(){
            this.isUnread = !this.isUnread;
            this.getQuery();
        },
        changeSearch(){
            const url = '/pages/email/searchEmail/main';
            wx.navigateTo({url:url});
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.basicinfoSearch,
                    SessionKey:this.sessionkey,
                    ltags:this.ltags,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize,
                    folderId:this.folderId,
                    isRead:this.isRead       
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.map(item=>{
                    const time = getDate(item.createdOn.replace(/-/g,'/'));
                    if(item.fromName.length>=3){
                        const name = item.fromName.substr(1);
                        item.name = name;
                    }else {
                        item.name = item.fromName;
                    }
                    item.time = time;
                    return item;
                })
                console.log(this.list);
            })
        },
        getStarQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.starList,
                    SessionKey:this.sessionkey,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize                 
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.map(item=>{
                    const time = getDate(item.createdOn.replace(/-/g,'/'));
                    if(item.fromName.length>=3){
                        const name = item.fromName.substr(1);
                        item.name = name;
                    }else {
                        item.name = item.fromName;
                    }
                    item.time = time;
                    return item;
                })
            })
        },
        changeCheckbox(e){
            this.result = e.mp.detail;
            this.emailId = this.result.join(',');
        },
        // 全标已读
        signEmailAll(){
            this.showAll = true;
            // this.signNum = 1;
            // this.signEmail();
        },
        onCloseAll(){
            this.showAll = false;
        },
        // 标记已读未读
        signEmail(sign){
            let emailId = '';
            let isRead = false;
            if(!this.isReadBook){
                this.signNum = 1;
                isRead = true;
            }else {
                this.signNum = 0;
                isRead = false;
            }
            if(sign==1){
                emailId = this.emailIdList.join(',');
            }else {
                emailId = this.emailId;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.readMark,
                    SessionKey:this.sessionkey,
                    ids:emailId,
                    isRead:isRead
                    // action:this.signNum
                }
            }).then(res=>{
                console.log(res);
                this.getQuery();
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.emailId = "";
                        that.show = false;
                        that.showAll = false;
                    }
                })
            })
        },
        // 添加/取消星标
        getStar(){
            let action = '';
            if(!this.isStar){
                action = 1;
            }else {
                action = 0;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.starMark,
                    SessionKey:this.sessionkey,
                    Id:this.emailId,
                    IsStar:action
                }
            }).then(res=>{
                this.getQuery();
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.emailId = "";
                        that.show = false;
                    }
                })
            })
        },
        // 已删除-彻底删除
        getThoroughDel(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.thoroughDel,
                    SessionKey:this.sessionkey,
                    ids:this.emailId,
                    ltags:this.ltags
                }
            }).then(res=>{
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.emailId = "";
                        that.show = false;
                        setTimeout(()=>{
                            that.getQuery();
                        },1000)
                    }
                })
            })
        },
        // 删除邮件
        deleteEmail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.mailboxDel,
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    mailbox:this.ltags
                }
            }).then(res=>{
                console.log(res);
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.emailId = "";
                        that.show = false;
                        setTimeout(()=>{
                            that.getQuery();
                        },1000)
                    }
                })
            })
        },
        getEdit(){
            this.show = !this.show;
        },
        getAllSelect(){
            this.result = [];
            this.list.forEach(item=>{
                this.result.push(item.emailId);
            })
            this.emailId = this.result.join(',');
        },
        getCancel(){
            this.result = [];
            this.show = false;
        },
        getCancelAll(){
            this.result = [];
        },
        getCompletely(){
            this.result = [];
            this.emailId = "";
            this.show = false;
        },
        getDetail(item){
            const url = '/pages/email/detail/main?emailId='+item.emailId+'&ltags='+this.ltags;
            wx.navigateTo({url:url});
        },
        getMove(){
            const url = '/pages/email/moveEmail/main';
            wx.navigateTo({url:url});
        },
        getRejection(){
            wx.showModal({
                title: '提示',
                content: '拒收后，你将不再收到来自卫辉的邮件。',
                confirmText:'确定拒收',
                success (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        },
        onCluesAddBtnClick(){
            this.showWrite = true;
            // const url = '/pages/email/writeMail/main';
            // wx.navigateTo({
            //     url:url
            // })
        },
        onWriteSelect(e){
            let id = e.mp.detail.id;
            if(id==1){
                const url = "/pages/email/writeMail/main";
                wx.navigateTo({url:url});
            }else if(id==2){
                const url = "/pages/email/group/main";
                wx.navigateTo({url:url});
            }
        },
        onWriteClose(){
            this.showWrite = false;
        },
        onWriteCancel(){
            this.showWrite = false;
        },
        onClose(){
            this.showSheet = false;
        },
        onCancel(){
            this.showSheet = false;
        },
        onSelect(e){
            console.log(e);
            let name = e.mp.detail.name;
            if(name=='标为未读'){
                this.signNum = 0;
            }else if(name=='标为已读'){
                this.signNum = 1;
            }
            this.signEmail();
        },
        // 标记邮件
        getSign(){
            this.showSheet = true;
        },
        onClosePopup(){
            this.showAll = false;
        },
        // 清空
        getClearEmail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.clear,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.emailId = "";
                        that.show = false;
                        setTimeout(()=>{
                            that.getQuery();
                        },1000)
                    }
                })
            })
        }
    },
    onPullDownRefresh(){
        this.pageNumber = 1;
        this.getQuery();
        wx.stopPullDownRefresh();
    },
    onReachBottom(){

    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    @import '../../../../static/css/emaiIcon.css';
    page{
        background: #fff;
    }
    .wrap{
        margin-bottom: 100px;
        .nav{
            width: 100%;
            background: #fff;
            .van-search__content{
                border-radius: 38rpx!important;
            }
            // display: flex;
            // p:nth-child(1){
            //     width: 85%;
            // }
            // p:nth-child(2){
            //     width: 15%;
            //     color: #3399ff;
            //     font-size: 28rpx;
            //     text-align: center;
            //     margin-top: 15px;
            // }
        }
        .header{
            display: flex;
            background: #fff;
            border-top: 1rpx solid #e2e3e5;
            padding: 20rpx 0;
            .text{
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 27rpx;
                color: #333333;
                i{
                    margin-right: 20rpx;
                }
            }
            .text:first-child{
                border-right: 1rpx solid #eaeeed;
            }
        }
        .headRow{
            display: flex;
            justify-content: space-between;
            background: #fff;
            padding: 32rpx 33rpx;
            border-bottom: 1rpx solid #e2e3e5;
            p:nth-child(1){
                font-size: 34rpx;
                color: #333333; 
            }
            p:nth-child(2){
                font-size: 34rpx;
                color: #3399ff;
            }
        }
        .center{
            background: #fff;
            padding: 20rpx ;
            // padding-bottom: 100rpx;
            .content:last-child .right{
                border:none;
            }
            .content{
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                .checkWrap{
                    width: 30px;
                }
                .left{
    
                }
                .right{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    margin-left: 20rpx;
                    padding:20rpx 0;
                    border-bottom: 1rpx solid #eaeeed;
                    div:nth-child(1){
                        p:nth-child(1){
                            display: flex;
                            align-items: center;
                            .dian{
                                width: 14rpx;
                                height: 14rpx;
                                border-radius: 50%;
                                background: #fc6464;
                                display: inline-block;
                                margin-right: 10rpx;
                            }
                            .name{
                                font-size: 32rpx;
                                color: #333333;
                            }
                            .name.active{
                                font-weight: bold;
                            }
                            i{
                                color: #ec746c;
                            }
                        }
                        p:nth-child(2){
                            font-size: 28rpx;
                            color: #333333;
                            padding: 5rpx 0;
                        }
                        p:nth-child(3){
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                    div:nth-child(2){
                        overflow: hidden;
                        p:nth-child(1){
                            font-size: 24rpx;
                            color: #999999;
                            text-align: right;
                        }
                        span:nth-child(2){
                            font-size: 10px;
                            color: #333;
                            text-align: center;
                            background: #eceeed;
                            width: 31rpx;
	                        height: 33rpx;
                            display: inline-block;
                            float: right;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            background: #fff;
            position: fixed;
            bottom: 0;
            border-top: 1rpx solid #bfc1c2;
            .box{
                display: flex;
                padding: 30rpx 20rpx;
                justify-content: space-around;
                p{
                    font-size: 29rpx;
                    color: #3399ff;
                }
                // p:nth-child(4){
                //     color: #ff6666;
                // }
                .clear{
                    color: #ff6666;
                }
                .color{
                    opacity: .5;
                }
                .color.active{
                    opacity: 1;
                }
                .del{
                    color: #ff6666;
                    opacity: .5;
                }
                .del.active{
                    opacity: 1;
                }
            }
        }
        .popup{
            padding: 20rpx 30rpx;
            h3{
                font-size: 23rpx;
                color: #999999;
            }
            p{
                font-size: 33rpx;
                color: #333333;
                padding: 30rpx 0;
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
        .sheet{
            width: 100%;
            text-align: center;
            p:nth-child(1){
                font-size: 25rpx;
                color: #999999;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #e2e3e5;
            }
            p:nth-child(2){
                font-size: 36rpx;
                color: #333333;
                padding: 30rpx 0;
            }
        }
    }
</style>