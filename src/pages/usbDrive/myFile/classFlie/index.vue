<template>
    <div class="wrap">
        <div class="nav">
            “我的文件”中的所有文档
        </div>
        <div class="center">
            <div class="nullWrap" v-if="files==''">
                <div class="box">
                    <p><img :src="imgUrl+'02.1-1Affair.png'" alt=""></p>
                    <p>暂无文件</p>
                </div>
            </div>
            <div>
                <div class="rowWrap" v-for="(item,index) in files" :key="index">
                    <h3>{{item.DateTypeName}}</h3>
                    <div class="row" v-for="(v,i) in item.FileList" :key="i">
                        <div class="l" @click.stop="getPreviewImage(v)">
                            <p>
                                <img v-if="v.fileExtension=='jpg'||v.fileExtension=='png'" :src="v.link" alt="">
                                <img v-else-if="v.fileExtension=='xls' || v.fileExtension=='xlsx'" :src="photoUrl+'xls.png'" alt="">
                                <img v-else-if="v.fileExtension=='doc' || v.fileExtension=='word' || v.fileExtension=='docx'" :src="photoUrl+'02.3.1.Word.png'" alt="">
                                <img v-else-if="v.fileExtension=='rar'" :src="photoUrl+'rar.png'" alt="">
                                <img v-else-if="v.fileExtension=='txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
                                <img v-else-if="v.fileExtension=='pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
                                <img v-else-if="v.fileExtension=='ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <div class="text" @click.stop="getPreviewImage(v)">
                                <p>{{v.name}}.{{v.fileExtension}}</p>
                                <p>{{v.createdOn}}</p>
                            </div>
                            <p class="icon" @click.stop="v.Privilege.canAdmin?getEditFile(v,'files'):toastNull()">
                                <i class="iconfont icon-gengduo"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-action-sheet z-index="10000" @close="getEditClose" :round="false" safe-area-inset-bottom cancel-text="取消" @cancel="getEditCancel" :show="editSheet">
            <div class="editSheet">
                <div class="headers">
                    <div class="imgBox">
                        <img :src="imgUrl+'Folder.png'" alt="">
                    </div>
                    <div class="textWrap">
                        <p class="overflow">{{fileName}}</p>
                        <p>{{createdByName}}  {{createdOn}}</p>
                    </div>
                </div>
                <div class="content">
                    <p v-if="str=='files'">发送给联系人</p>
                    <p v-if="str=='files'">发邮件</p>
                    <p @click="getObtainLink">获取分享链接</p>
                    <p @click="getRename">重命名</p>
                    <p @click="getMoveFile">移动到</p>
                    <p v-if="str=='files'" @click="getCopy">复制到</p>
                    <p @click="deleteFile">删除</p>
                </div>
            </div>
        </van-action-sheet>
        <newFolder v-if="newShow" :ParentId="ParentId" :str="str" :newSign="newSign" :fileId="fileId" :fileName="fileName" @changeShow="changeShow" />
    </div>
</template>
<script>
import newFolder from '../../../../components/newFolder';
import openFiles from '@/utils/openFiles';
export default {
    components:{
        newFolder
    },
    data(){
        return {
            fileType:"",
            list:[],
            files:[],
            str:"",
            fileName:"",
            fileId:"",
            createdByName:"",
            createdOn:"",
            editSheet:false,
            newShow:false,
            sessionkey:"",
            srchType: "",
            folderId:"10010000-0000-0000-0000-000000000001"
        }
    },
    computed:{
        imgUrl(){
            return this.$api.photo.url;
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.fileType = options.fileType;
        this.srchType = options.srchType;
        this.folderId = options.folderId;
        this.getQuery();
    },
    methods:{
        toastNull(){
            wx.showToast({
                title:'无权限',
                icon:'none',
                duration: 2000,
                success:res=>{

                }
            })
        },
        getPreviewImage(item){
            console.log(item)
            const openImgs = JSON.stringify([item.link]);
            openFiles(item,openImgs);
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.filesQuery,
                    SessionKey:this.sessionkey,
                    srchType:this.srchType,
                    Sort:"Createdon",
                    // ParentId:this.folderId,
                    folderId: this.folderId,
                    fileType:this.fileType
                }
            }).then(res=>{
                console.log(res);
                this.files = res.files;
                this.files.forEach(item=>{
                    item.FileList.forEach(v=>{
                        let imgUrl = '';
                        if(v.fileExtension=='png'||v.fileExtension=='jpg'){
                            imgUrl = v.link;
                            this.$set(v,'imgUrl',imgUrl);
                        }else if(v.fileExtension=='doc'){
                            imgUrl = this.imgUrl+'02.3.1.Word.png';
                            this.$set(v,'imgUrl',imgUrl);
                        }else if(v.fileExtension=='rar'){
                            imgUrl = this.imgUrl+'rar.png';
                            this.$set(v,'imgUrl',imgUrl);
                        }else if(v.fileExtension=='pdf'){
                            imgUrl = this.imgUrl+'02.3.1.Pdf.png';
                            this.$set(v,'imgUrl',imgUrl);
                        }else if(v.fileExtension=='ppt'){
                            imgUrl = this.imgUrl+'02.3.1.PPT.png';
                            this.$set(v,'imgUrl',imgUrl);
                        }else if(v.fileExtension='txt'){
                            imgUrl = this.imgUrl+'02.3.1.Txt.png';
                            this.$set(v,'imgUrl',imgUrl);
                        }
                    })
                })
            })
        },
        getEditFile(item,str){
            this.str = str;
            this.fileName = item.name;
            this.fileId = item.id;
            console.log(this.fileId);
            this.createdByName = item.createdByName;
            this.createdOn = item.createdOn;
            this.editSheet = true;
        },
        getEditCancel(){
            this.editSheet = false;
        },
        getEditClose(){
            this.editSheet = false;
        },
        // 重命名
        getRename(){
            this.editSheet = false;
            this.newSign = 1;
            this.newShow = true;
        },
        changeShow(isBook){
            this.newShow = isBook;
            this.files = [];
            this.getQuery();
        },
        // 复制到
        getCopy(){
            const url = '/pages/usbDrive/copyUsb/main?fileId='+this.fileId;
            wx.navigateTo({
                url:url
            })
            this.editSheet = false;
        },
        // 移动到
        getMoveFile(){
            const url = '/pages/usbDrive/myFile/moveFile/main?fileId='+this.fileId+'&fileName='+this.fileName+'&str='+this.str;
            wx.navigateTo({url:url});
            this.editSheet = false;
        },
        deleteFile(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.fileDel,
                    SessionKey:this.sessionkey,
                    Id:this.fileId
                }
            }).then(res=>{
                console.log(res);
                let that = this;
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000,
                    success:res=>{
                        setTimeout(()=>{
                            that.editSheet = false;
                            that.getQuery();
                        },1000)
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../../static/css/public.scss';
    .wrap{
        .nav{
            padding: 33rpx 0;
            text-align: center;
            font-size: 28rpx;
            color: #999999;
        }
        .center{
            height: auto;
            .nullWrap{
                display: flex;
                justify-content: center;
                height: 100vh;
                background: #fff;
                .box{
                    margin-top: 20%;
                    p:nth-child(1){
                        width: 156rpx;
                        height: 156rp;
                        img{
                            width: 156rpx;
                            height: 156rpx;
                        }
                    }
                    p:nth-child(2){
                        font-size: 32rpx;
                        color: #999999;
                        text-align: center;
                        margin-top: 20rpx;
                    }
                }
            }
            .rowWrap{
            background: #fff;
            padding: 0 33rpx;
            border-top: 1rpx solid #e2e4e3;
            border-bottom: 1rpx solid #e2e4e3;
            h3{
                color: #a3a3a3;
                font-size: 25rpx;
                padding: 25rpx 0;
            }
            .row{
                display: flex;
                padding: 10rpx 0;
                .l{
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .r{
                    flex: 1;
                    overflow: hidden;
                    margin-left: 25rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 25rpx;
                    .text{
                        width: 500rpx;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: normal;
                        p:nth-child(1){
                            font-size: 32rpx;
                            color: #333333;
                        }
                        p:nth-child(2){
                            font-size: 24rpx;
                            color: #999999;
                        }
                    }
                }
            }

        }
        }
        .editSheet{
        width: 100%;
        overflow: hidden;
        .headers{
            padding: 30rpx;
            border-bottom: 1rpx solid #e2e4e3;
            display: flex;
            .imgBox{
                width: 60rpx;
                height: 60rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .textWrap{
                margin-left: 20rpx;
                p:nth-child(1){
                    font-size: 28rpx;
                }
                p:nth-child(2){
                    font-size: 12px;
                    color: #999999;
                }
            }
        }
        .content{
            padding:0 30rpx;
            p{
                font-size: 28rpx;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #e2e4e3;
            }
            p:last-child{
                border:none;
            }
        }
    }
    }
</style>