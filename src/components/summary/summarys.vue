<template>
    <div class="wrap">
        <div class="contentWrap" v-if="MeetingSummary!=null">
            <div class="rowContent">
                <div class="rowT"  @click="getSummaryDetail">
                    <div class="l">
                        <p>{{MeetingSummary.CreatedByName}}</p>
                    </div>
                    <div class="r">
                        <p>{{MeetingSummary.CreatedByName}}</p>
                        <p>{{MeetingSummary.BusinessUnitIdName}}</p>
                    </div>
                </div>
                <p class="title">
                    {{MeetingSummary.CreatedByName}}
                </p>
                <div class="cont">
                    {{MeetingSummary.MeetingSummary}}
                </div>
                <div class="files" v-for="(item,index) in files" :key="index">
                    <div class="l">
                        <img :src="item.link" alt="">
                    </div>
                    <div class="r">
                        <p>{{item.name}}</p>
                        <p>31.2MB</p>
                    </div>
                </div>
                <div class="more">
                    <p>
                        {{MeetingSummary.CreatedOn}}
                    </p>
                    <p @click="getMore" v-if="isEdit">
                        <i-icon type="more" color="#666666" size="20" />
                    </p>
                </div>
            </div>
        </div>
        <van-action-sheet
            :show="isShow"
            :round="false"
            :actions="actions"
            cancel-text="取消"
            @cancel="onClose"
            @close="onClose"
            @select="onSelect"
            z-index="99999"
        />
        <van-action-sheet
            :show="moreShow"
            :round="false"
            :actions="moreActions"
            cancel-text="取消"
            @cancel="onCloseMore"
            @close="onCloseMore"
            @select="onSelectMore"
            z-index="99999"
        />
        <div class="footer" @click="getAddSummary">
            <p v-if="current=='tab3'">
                添加纪要
            </p>
            <p v-if="current=='tab4'">添加议题</p>
        </div>
    </div>
</template>
<script>
import { message } from '@/utils/message';
export default {
    name:"Summarys",
    props:['name','Meetingid','current','detailInfo','isEdit'],
    data(){
        return {
            isShow:false,
            actions: [
                {
                    name: '撤回',
                },
                {
                    name: '修改',
                },
                {
                    name: '删除'
                }
            ],
            moreShow:false,
            moreActions: [
                {
                    name: '新建纪要',
                },
                {
                    name: '指派协作人',
                },
                {
                    name: '上传文件'
                }
            ],
            sessionkey:"",
            // TopicsShow:false,
            MeetingSummary:"",
            files:[]
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
        this.getFileQuery();
    },
    onShow(){
        this.getQuery();        
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.summary.get",
                    SessionKey:this.sessionkey,
                    Meetingid:this.Meetingid
                }
            }).then(res=>{
                this.MeetingSummary = res.data;
            })
        },
        getFileQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.attachfiles.getlist",
                    SessionKey:this.sessionkey,
                    pid:this.Meetingid,
                    ObjTypeCode:5004
                }
            }).then(res=>{
                this.files = res.listData;
            })
        },
        getMore(){
            this.isShow = true;
        },
        onClose(){
            this.isShow = false;
        },
        onSelect(e){
            console.log(e);
            let name = e.mp.detail.name;
            if(name=='删除'){
                this.getDelete();
            }else if(name=='修改'){
                const url = '/pages/meeting/newSummary/main?content='+this.MeetingSummary.MeetingSummary+'&current='+this.current+'&Meetingid='+this.Meetingid;
                wx.navigateTo({url:url});
            }
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.info.delete",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:5004,
                    Id:this.Meetingid
                }
            }).then(res=>{
                let that = this;
                if(res.status==1){
                    message.toast({
                        title:res.msg,
                        delta: 0,
                        success(){
                            that.getQuery();
                        }
                    })
                }else {
                    wx.showToast({
                        title:'删除失败',
                        icon:"success",
                        duration:2000
                    })
                }
                
            })
        },
        getAddSummary(){
            if(this.current=='tab3'){
                this.moreActions[0].name = '新建纪要';
            }else {
                this.moreActions[0].name = '新建议题';
            }
            this.moreShow = true;
        },
        onCloseMore(){
            this.moreShow = false;
        },
        onSelectMore(e){
            let name = e.mp.detail.name;
            if(name=='新建纪要'){
                const url = '/pages/meeting/newSummary/main?name='+this.name+'&Meetingid='+this.Meetingid+'&current='+this.current;                
                wx.navigateTo({url:url});
            }else if(name=='上传文件'){
                this.getUploadPhoto();
            }else if(name=='新建议题'){
                const url = '/pages/meeting/newSummary/main?name='+this.name+'&Meetingid='+this.Meetingid+'&current='+this.current;
                wx.navigateTo({url:url});
            }
        },
        getUploadPhoto(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    wx.uploadFile({
                        url: "https://oawx.hnca.org.cn/rest?method="+'file.attachfiles.upload'+'&SessionKey='+that.sessionkey+'&pid='+that.Meetingid+'&objTypeCode='+'5004', //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            console.log(res);
                        }
                    })
                }
            })
        },
        getSummaryDetail(){
            let detailInfo = {};
            detailInfo.name = this.detailInfo.name;
            detailInfo.owningUserName = this.detailInfo.owningUserName;
            detailInfo.id = this.detailInfo.valueId;
            detailInfo.createdByName = this.detailInfo.createdByName;
            detailInfo.MeetingSummary = this.MeetingSummary;
            detailInfo = JSON.stringify(detailInfo);
            const url = '/pages/meeting/summaryDetail/main?detailInfo='+detailInfo;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss" scoped>
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .contentWrap{
            padding: 0 24rpx; 
            .rowContent{
                background: #fff;
                border-radius: 23rpx;
                margin: 24rpx 0;
                padding: 33rpx;
                .rowT{
                    display: flex;
                    align-items: center;
                    .l{
                        p{
                            width: 72rpx;
                            height: 72rpx;
                            line-height: 72rpx;
                            text-align: center;
                            background: #3399ff;
                            color: #fff;
                            font-size: 26rpx;
                            border-radius: 50%;
                        }
                    }
                    .r{
                        flex: 1;
                        margin-left: 25rpx;
                        p:nth-child(1){
                            font-size: 32rpx;
                            color: #333333;
                        }
                        p:nth-child(2){
                            font-size: 26rpx;
                            color: #999999;
                        }
                    }
                }
                .title{
                    font-size: 34rpx;
                    color: #333333;
                    font-weight: bold;
                    margin: 30rpx 0;
                }
                .cont{
                    font-size: 34rpx;
                    color: #333333;
                    // margin-bottom: 50rpx;
                }
                .files{
                    padding: 19rpx;
                    border: 1rpx solid #e7e8ea;
                    display: flex;
                    align-items: center;
                    margin: 10rpx 0;
                    .l{
                        width: 108rpx;
                        height: 108rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                    }
                    .r{
                        margin-left: 25rpx;
                        p:nth-child(1){
                            width: 300rpx;
                            font-size: 28rpx;
                            color: #333333;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            padding-bottom: 20rpx;
                        }
                        p:nth-child(2){
                            font-size: 24rpx;
                            color: #7e8184;
                        }
                    }
                }
                .more{
                    display: flex;
                    justify-content: space-between;
                    p{
                        font-size: 24rpx;
                        color: #a1a5aa;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            p{
                text-align: center;
                font-size: 34rpx;
                color: #3399ff;
                padding: 30rpx 0;
            }
        }
    }
</style>