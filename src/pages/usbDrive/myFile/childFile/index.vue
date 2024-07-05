<template>
    <div class="wrap">
        <div class="search">
            <van-search :value="value" placeholder="搜索" />
        </div>
        <div class="header">
            <div>
                <picker class="pickers" v-model="columnIdx" :range="column" @change="changeColumn">
                    <p>{{column[columnIdx]}}<i-icon type="unfold" /></p>
                </picker>
            </div>
            <div>
                <p>
                    <i class="iconfont icon-quanxuan icon" :class="{'active':electionShow==true}" @click="getSelectFile"></i>
                </p>
                <p>
                    <i class="iconfont icon-shaixuan icon" :class="{'active':electionShow==true}" @click="getScreen"></i>
                </p>
            </div>
        </div>
        
        <div class="center">
            <van-checkbox-group :value="result" @change="changeGroup">
            <!-- folders -->
                <div class="content" @click="getOpen" v-for="(item,index) in folders" :key="index">
                    <div class="radioWrap" v-if="electionShow">
                        <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
                    </div>
                    <div class="img">
                        <p>
                            <img :src="photoUrl+'Folder.png'" alt="">
                        </p>
                    </div>
                    <div class="cont" @click="getOpenFolder(item)">
                        <div>
                            <p class="title">{{item.name}}</p>
                            <p class="text">{{item.createdOn}}</p>
                        </div>
                        <p class="icon">
                            <i class="iconfont icon-gengduo" @click.stop="getEditFile(item,'folders')"></i>
                        </p>
                    </div>
                </div>
                <!-- files -->
                <div class="content" v-for="(item,index) in files" :key="index"  @click="getPreviewImage(item)">
                    <div class="radioWrap" v-if="electionShow">
                        <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
                    </div>
                    <div class="img">
                        <p>
                            <!-- <img :src="item.fileExtension=='jpg'?item.link:'https://oawx.hnca.org.cn/img/wechat/rar.png'" alt=""> -->
                            <img v-if="item.fileExtension=='jpg'||item.fileExtension=='png'" :src="item.link" alt="">
                            <img v-if="item.fileExtension=='rar'" :src="photoUrl+'rar.png'" alt="">
                            <img v-if="item.fileExtension=='txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
                            <img v-if="item.fileExtension=='pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
                            <img v-if="item.fileExtension=='ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
                            <img v-if="item.fileExtension=='word'" :src="photoUrl+'word.png'" alt="">
                        </p>
                    </div>
                    <div class="cont">
                        <div>
                            <p class="title information-title">{{item.name}}.{{item.fileExtension}}</p>
                            <p class="text">{{item.createdOn}}</p>
                        </div>
                        <p class="icon">
                            <i class="iconfont icon-gengduo" @click.stop="getEditFile(item,'files')"></i>
                        </p>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <van-action-sheet
            :show="showSheet"
            :actions="actions"
            @close="onClose"
            @select="onSelect"
            :round="false"
        />
        <!-- 编辑文件 -->
        <van-action-sheet z-index="10000" @close="getEditClose" :round="false" safe-area-inset-bottom cancel-text="取消" @cancel="getEditCancel" :show="editSheet">
            <div class="editSheet">
                <div class="headers">
                    <div class="imgBox">
                        <img :src="photoUrl+'Folder.png'" alt="">
                    </div>
                    <div class="textWrap">
                        <p class="overflow">{{fileName}}</p>
                        <p>{{createdByName}}  {{createdOn}}</p>
                    </div>
                </div>
                <div class="content">
                    <p v-if="str=='files'">发送给联系人</p>
                    <p v-if="str=='files'" @click="getSendEmail">发邮件</p>
                    <p @click="getObtainLink">获取分享链接</p>
                    <p @click="getRename">重命名</p>
                    <p>移动到</p>
                    <p v-if="str=='files'" @click="getCopy">复制到</p>
                    <p @click="deleteFile">删除</p>
                </div>
            </div>
        </van-action-sheet>

        <!-- 筛选 -->
        <van-action-sheet z-index="10000" :round="false" safe-area-inset-bottom cancel-text="取消" @close="getClose" @cancel="getCancel" :show="screenShow">
            <div class="titleSheet">
                <p>筛选</p>
            </div>
            <div class="sheetContent">
                <div class="box" @click="getRouterClass">
                    <p>
                        <img :src="photoUrl+'Folders.png'" alt="">
                    </p>
                    <p>文档</p>
                </div>
                <div class="box">
                    <p>
                        <img :src="photoUrl+'rar.png'" alt="">
                    </p>
                    <p>压缩包</p>
                </div>
                <div class="box">
                    <p>
                        <img :src="photoUrl+'Image.png'" alt="">
                    </p>
                    <p>图片</p>
                </div>
                <div class="box">
                    <p>
                        <img :src="photoUrl+'Other.png'" alt="">
                    </p>
                    <p>其他</p>
                </div>
            </div>
        </van-action-sheet>

        <van-popup :show="popupModal" custom-style="width:80%;height: 20%;border-radius:10rpx;" @close="popupClose">
            <div class="popup">
                <p>上传文件</p>
                <p @click="getOpenPhoto">照片</p>
                <p>手机文件</p>
            </div>
        </van-popup>

        <!-- <i-divider content="没有更多了"></i-divider> -->
        <div class="clues-add-button" v-if="!showSheet" @click="onCluesAddBtnClick">
            <van-icon name="plus" size="20px" />
        </div>
        <div class="footer" v-if="electionShow">
            <div class="operation">
                <p class="cancel" @click="getCancelAll">取消</p>
                <p class="all" @click="getSelectAll">全选</p>
                <p class="move" :class="{'active':result!=''}">移动</p>
                <p class="delete" @click="getDeleteFile" :class="{'active':result!=''}">删除</p>
            </div>
        </div>
        <newFolder v-if="newShow" :ParentId="id" :str="str" :newSign="newSign" :fileId="fileId" :fileName="fileName" @changeShow="changeShow" />
    </div>
</template>
<script>
import newFolder from '../../../../components/newFolder';
import openFiles from '@/utils/openFiles';
import { mapMutations } from 'vuex';
export default {
    components:{
        newFolder
    },
    data(){
        return {
            id:"",
            name:"",
            files:[],
            folders:[],
            fileName:"",
            createdByName:"",
            createdOn:"",
            value:"",
            columnIdx:0,
            column:['时间排序','名称排序'],
            showSheet:false,
            actions: [
                {
                    id:1,
                    name: '上传文件'
                },
                {
                    id:2,
                    name: '新建文件'
                }
            ],
            screenShow:false,
            electionShow:false,
            checked:false,
            popupModal:false,
            editSheet:false,
            imgList:[],
            str:"",
            fileId:"",
            editSheet:false,
            newShow:false,
            sessionkey:"",
            paramsList:[]
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.id = options.id;
        this.name = options.name;
        wx.setNavigationBarTitle({
            title: this.name
        })
        this.getQuery();
    },
    computed:{
        photoUrl(){
            return this.$api.photo.url;
        }
    },
    methods:{
        changeShow(isBook){
            this.newShow = isBook;
            this.files = [];
            this.folders = [];
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.filesQuery,
                    SessionKey:this.sessionkey,
                    folderid:this.id
                }
            }).then(res=>{
                console.log(res);
                this.files = res.files;
                this.files.forEach(item=>{
                    if(item.fileExtension=='jpg'||item.fileExtension=='png'){
                        this.imgList.push(item.link);
                    }
                })
                this.folders = res.folders;
            })
        },
        onCluesAddBtnClick(){
            this.showSheet = true;
        },
        onClose(){
            this.showSheet = false;
        },
        getScreen(){
            this.screenShow = true;
        },
        getCancel(){
            this.screenShow = false;
        },
        popupClose(){
            this.popupModal = false;
        },
        getEditCancel(){
            this.editSheet = false;
        },
        getEditClose(){
            this.editSheet = false;
        },
        getEditFile(item,str){
            this.str = str;
            this.fileName = item.name;
            this.fileId = item.id;
            this.createdByName = item.createdByName;
            this.createdOn = item.createdOn;
            this.paramsList.push({
                id:item.id,
                name:item.name,
                link:item.link,
                fileExtension:item.fileExtension
            })
            this.editSheet = true;
        },
        ...mapMutations([
            'handleFiles'
        ]),
        getSendEmail(){
            this.handleFiles(this.paramsList);
            const url = '/pages/email/writeMail/main';
            wx.navigateTo({url:url});
        },
        onSelect(e){
            let id = e.mp.detail.id;
            if(id==2){
                this.newSign = 0;
                this.fileName = '';
                this.fileId = '';
                this.showSheet = false;
                this.newShow = true;
                // let url = '/pages/usbDrive/newFolder/main?id='+this.id+'&sign='+'child';
                // wx.navigateTo({url:url});
            }else if(id==1){
                this.popupModal = true;
            }
        },
        // 重命名
        getRename(){
            this.editSheet = false;
            this.newSign = 1;
            this.newShow = true;
        },
        getOpenPhoto(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    let url = `${that.$api.upload.url}?method=${that.$api.usb.upload}&SessionKey=${that.sessionkey}&folderid=${that.id}`;
                    wx.uploadFile({
                        url:url,
                        // url: "https://oawx.hnca.org.cn/rest?method="+'file.upload.create'+'&SessionKey='+that.sessionkey+'&folderid='+that.id, //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            that.popupModal = false;
                            that.getQuery();
                            
                            const data = res.data
                            //do something
                        }
                    })
                }
            })
        },
        // 图片预览
        getPreviewImage(item){
            const openImgs = JSON.stringify(this.imgList);
            openFiles(item,openImgs);
            // let fs = wx.getFileSystemManager(); 
            // let url = item.link;
            // if(item.fileExtension=='jpg'){
            //     let that = this;
            //     wx.previewImage({
            //         current: item.link, // 当前显示图片的http链接
            //         urls: that.imgList// 需要预览的图片http链接列表
            //     })
            // }else {
            //     wx.downloadFile({
            //         url: url, 
            //         success (res) {
            //             if (res.statusCode === 200) {
            //                 debugger
            //                 var filePath = res.tempFilePath;
            //             }
            //             wx.openDocument({
            //                 filePath: filePath,
            //                 success: function (res) {
            //                     debugger
            //                     console.log('打开文档成功')
            //                 }
            //             })
            //         }
            //     })
            // }
        },
        getClose(){
            this.screenShow = false;
        },
        // 删除单个文件
        deleteFile(){
            let method = '';
            if(this.str=='folders'){
                method = this.$api.usb.directoryDel;
            }else if(this.str=='files'){
                method = this.$api.usb.fileDel;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: method,
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
        },
        getOpenFolder(item){
            const url = '/pages/usbDrive/myFile/childFile/main?id='+item.id+'&name='+item.name;
            wx.navigateTo({
                url:url
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../../static/css/public.scss';
    .search{
        background: #fff;
    }
    .header{
        padding: 20rpx;
        background: #fff;
        font-size: 24rpx;
        color: #3399ff;
        display: flex;
        justify-content: space-between;
        div:nth-child(2){
            display: flex;
            .icon.active{
                color: #a4a4a4;
            }
            p:nth-child(1){
                margin-right: 20px;
            }
        }
    }
    .center{
        .content{
            background: #fff;
            display: flex;
            padding:0 20rpx;
            .radioWrap{
                .radio{
                    margin-top: 20px;
                }
            }
            .img{
                padding:20rpx 0;
                margin-left: 10px;
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
            .cont{
                margin-left: 15px;
                flex: 1;
                display: flex;
                justify-content: space-between;
                border-bottom: 1rpx solid #f6f6f6;
                padding:20rpx 0;
                .title{
                    width: 200px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow:ellipsis;
                }
                .text{
                    font-size: 12px;
                    color: #999999;
                }
                .icon{
                    .iconfont{
                        margin-top: 20rpx;
                        color: #a4a4a4;
                        font-size: 20px;
                    }
                }
            }
        }
    }
    .clues-add-button {
        position: fixed;
        right: 20px;
        bottom: 40px;
        background: #049bfb;
        width: 48px;
        height: 48px;
        line-height: 48px;
        z-index: 1002;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0rpx 5rpx 12rpx 0rpx rgba(0, 0, 0, 0.3);
        i{
            font-size: 35rpx;
        }
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 20px;
    }
    .popup{
        padding: 20px;
        p{
            font-size: 28rpx;
        }
        p:nth-child(1){
            color: #999999;
            font-size: 12px;
        }
        p:nth-child(2){
            margin: 15px 0;
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
    .titleSheet{
        background: #f8f8f8;
        padding: 30rpx 0;
        text-align: center;
        color: #666666;
        font-size: 26rpx;
    }
    .sheetContent{
        display: flex;
        justify-content: space-around;
        background: #f8f8f8;
        padding: 30rpx 0;
        .box{
            p:nth-child(1){
                width: 120rpx;
                height: 120rpx;
                background: #fff;
                border-radius: 10rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 80%;
                    height: 80%;
                    align-items: center;
                }
            }
            p:nth-child(2){
                font-size: 12px;
                text-align: center;
            }
        }
    }
    .footer{
        position: fixed;
        bottom: 20px;
        .operation{
            display: flex;
            justify-content: space-between;
            font-size: 28rpx;
            color: #cccccc;
            background: #fff;
            padding: 20rpx;
            .cancel,.all{
                color: #3399ff
            }
            .delete.active{
                color: #ff6666;
            }
            .move.active{
                color: #3399ff;
            }
        }
    }
</style>