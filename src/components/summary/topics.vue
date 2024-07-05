<template>
    <div class="wrap">
        <div class="contentWrap">
            <div class="rowContent" v-for="(item,index) in list" :key="index">
                <div class="rowT"  @click="getSummaryDetail">
                    <div class="l">
                        <p>{{item.owningUserName}}</p>
                    </div>
                    <div class="r">
                        <p>{{item.owningUserName}}</p>
                        <p>{{item.owningBusinessUnitName}}</p>
                    </div>
                </div>
                <p class="title">
                    <!-- {{item.description}} -->
                </p>
                <div class="cont">
                    {{item.description}}
                </div>
                <div class="more">
                    <p>
                        {{item.modifiedOn}}
                    </p>
                    <p @click="getMore(item)" v-if="isEdit">
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
            <p>添加议题</p>
        </div>
    </div>
</template>
<script>
import { message } from '@/utils/message';
export default {
    name:"Topics",
    props:['name','Meetingid','current','isEdit'],
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
                    name: '新建议题',
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
            list:[],
            id:"",
            description:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getTopicsQuery();
    },
    onShow(){
        this.getTopicsQuery();
    },
    methods:{
        // 议题列表
        getTopicsQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"meeting.items.getlist",
                    SessionKey:this.sessionkey,
                    id:this.Meetingid
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        getMore(item){
            console.log(item);
            this.id = item.meetingItemId;
            this.description = item.description;
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
                const url = '/pages/meeting/newSummary/main?itemId='+this.id+'&content='+this.description+'&Meetingid='+this.Meetingid+'&name='+this.name;
                wx.navigateTo({url:url});
            }
        },
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.info.delete",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:5001,
                    Id:this.id
                }
            }).then(res=>{
                console.log(res);
                var that = this;
                if(res.status==1){
                    message.toast({
                        title:res.msg,
                        delta: 0,
                        success(){
                            setTimeout(() => {
                                that.getTopicsQuery();
                            }, 500);
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
        },
        getAddSummary(){
            this.moreShow = true;
        },
        onCloseMore(){
            this.moreShow = false;
        },
        onSelectMore(e){
            let name = e.mp.detail.name;
            if(name=='新建议题'){
                const url = '/pages/meeting/newSummary/main?name='+this.name+'&Meetingid='+this.Meetingid+'&current='+this.current;
                wx.navigateTo({url:url});
            }else if(name=='上传文件'){
                this.getUploadPhoto();
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
            const url = '/pages/meeting/summaryDetail/main';
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
        padding-bottom: 100px;
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
                    margin-bottom: 50rpx;
                    word-break: break-all;
                    
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