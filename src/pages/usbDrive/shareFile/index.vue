<template>
    <div class="wrap">
        <div class="search">
            <van-search :value="search" placeholder="搜索" @change="changeSearch" />
        </div>
        <div class="header">
            <div>
                <picker class="pickers" v-model="columnIdx" :range="column" @change="changeColumn">
                    <p>{{column[columnIdx]}}<i-icon type="unfold" /></p>
                </picker>
            </div>
            <div>
                <!-- <p>
                    <i class="iconfont icon-quanxuan icon" :class="{'active':electionShow==true}" @click="getSelectFile"></i>
                </p> -->
                <!-- <p>
                    <i class="iconfont icon-shaixuan icon" :class="{'active':electionShow==true}" @click="getScreen"></i>
                </p> -->
            </div>
        </div>
        <div class="center" v-if="!isTime">
            <!-- <div class="rows"  @click="getAddFolder">
                <p class="imgs">
                    <img :src="photoUrl+'02.3.3.New_folder.png'" alt="">
                </p>
                <p class="newFile">新建共享文件夹</p>
            </div> -->
            <div class="showBox" v-if="show">
                <p>企业内快速共享资料，不用重复发送</p>
            </div>
            <div v-for="(item,index) in folders" :key="index">
                <div class="content" v-if="!show">
                    <div class="radioWrap" v-if="electionShow">
                        <van-checkbox :value="checked" custom-class="radio" @change="onChange"></van-checkbox>
                    </div>
                    <div class="img" @click="getFlodersDetail(item)">
                        <p>
                            <img :src="photoUrl+'02.3.3.Shared_folder.png'" alt="">
                        </p>
                    </div>
                    <div class="cont">
                        <div @click="getFlodersDetail(item)">
                            <p class="title">{{item.name}}</p>
                            <!-- <p class="text">暂无文件  卫辉  归属  绍兴第二医院</p> -->
                            <p class="text">{{item.createdByName==item.modifiedByName?item.createdByName+' 创建':item.modifiedByName+' 更新'}}</p>
                        </div>
                        <p class="icon">
                            <i class="iconfont icon-gengduo" @click="item.privilege.canAdmin==true?getEditFile(item):toastNull()"></i>
                        </p>
                    </div>
                </div>
            </div>
            <div v-for="(item,index) in files" :key="index"  @click.stop="getPreviewImage(item)">
                <div class="content" v-if="!show">
                    <div class="radioWrap" v-if="electionShow">
                        <van-checkbox :value="checked" custom-class="radio" @change="onChange"></van-checkbox>
                    </div>
                    <div class="img">
                        <p>
                            <img v-if="item.fileExtension=='jpg'||item.fileExtension=='png'" :src="item.link" alt="">
                            <img v-else-if="item.fileExtension=='xls' || item.fileExtension=='xlsx'" :src="photoUrl+'xls.png'" alt="">
                            <img v-else-if="item.fileExtension=='doc' || item.fileExtension=='word' || item.fileExtension=='docx'" :src="photoUrl+'02.3.1.Word.png'" alt="">
                            <img v-else-if="item.fileExtension=='rar'" :src="photoUrl+'rar.png'" alt="">
                            <img v-else-if="item.fileExtension=='txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
                            <img v-else-if="item.fileExtension=='pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
                            <img v-else-if="item.fileExtension=='ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
                        </p>
                    </div>
                    <div class="cont">
                        <div>
                            <p class="title">{{item.name}}</p>
                            <!-- <p class="text">暂无文件  卫辉  归属  绍兴第二医院</p> -->
                        </div>
                        <p class="icon">
                            <i class="iconfont icon-gengduo" @click="item.privilege.canAdmin?getEditFile(item):toastNull()"></i>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="centerActive" v-if="isTime">
            <van-checkbox-group :value="result" @change="changeGroup">
                <div class="rowWrap">
                    <h3>文件夹</h3>
                    <div class="row" v-for="(item,index) in folders" :key="index">
                        <div class="radioWrap" v-if="electionShow">
                            <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
                        </div>
                        <div class="l" @click.stop="getFlodersDetail(item)">
                            <p>
                                <img :src="photoUrl+'Folder.png'" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <div class="text" @click.stop="getFlodersDetail(item)">
                                <p>{{item.name}}</p>
                                <p>{{item.createdOn}}</p>
                            </div>
                            <p class="icon" @click="item.privilege.canAdmin?getEditFile(item,'folders'):toastNull()">
                                <i class="iconfont icon-gengduo"></i>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="rowWrap" v-for="(item,index) in files" :key="index">
                    <h3>{{item.DateTypeName}}</h3>
                    <div class="row" v-for="(v,i) in item.FileList" :key="i">
                        <div class="radioWrap" v-if="electionShow">
                            <van-checkbox :name="v.id+v.str" custom-class="radio"></van-checkbox>
                        </div>
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
                                <p>{{v.name}}</p>
                                <p>{{v.createdOn}}</p>
                            </div>
                            <p class="icon" @click="getEditFile(v,'files')">
                                <i class="iconfont icon-gengduo"></i>
                            </p>
                        </div>
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
        <van-action-sheet z-index="10000" @close="handleClose" :round="false" safe-area-inset-bottom cancel-text="取消" @cancel="getEditCancel" :show="editSheet">
            <div class="editSheet">
                <div class="headers">
                    <div class="imgBox">
                        <img :src="photoUrl+'02.3.3.Shared_folder.png'" alt="">
                    </div>
                    <div class="textWrap">
                        <p>公共文件</p>
                        <p>卫辉  今天8:00</p>
                    </div>
                </div>
                <div class="content">
                    <p>发送文件夹地址</p>
                    <p @click="getAdmin">权限设置</p>
                    <p @click="getRename">重命名</p>
                    <p @click="getDeleteFile">删除</p>
                </div>
            </div>
        </van-action-sheet>

        <van-action-sheet z-index="10000" :round="false" safe-area-inset-bottom cancel-text="取消" @cancel="getCancel" :show="screenShow" title="筛选">
            <div class="sheetContent">
                <div class="box">
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
        <div class="footer" v-if="electionShow">
            <div class="operation">
                <p class="delete" :class="{'active':checked==true}">删除</p>
                <p class="move" :class="{'active':checked==true}">移动</p>
            </div>
        </div>
        <div class="clues-add-button" @click="getAddFolder">
            <van-icon name="plus" size="20px" />
        </div>
        <van-popup
            :show="pupupShow"
            :round="false"
            position="center"
            custom-style="width:80%;height: auto;border-radius:7rpx;"
            @close="onClosePupupShow"
        >
            <div class="popupWrap">
                <h3>
                    新建共享文件夹
                </h3>
                <div class="content">
                    <input type="text" class="inp" v-model="titleName">
                    <p class="default">归属：{{organizationName}}</p>
                </div>
                <div class="tips">
                    默认仅自己可见，通过“权限设置”可共享给他人
                </div>
                <div class="btn">
                    <p class="cancel" @click="onClosePupupShow">取消</p>
                    <p @click="getAddFolders">新建</p>
                </div>
            </div>
        </van-popup>
        <newFolder v-if="newShowPopup" :fileName="name" :fileId="id" :newSign="newSign" :str="str" @changeShow="changeShow" />
    </div>
</template>
<script>
import newFolder from '../../../components/newFolder';
import openFiles from '@/utils/openFiles';
export default {
    components:{
        newFolder
    },
    data(){
        return {
            value:"",
            search:"",
            columnIdx:0,
            column:['名称排序','时间排序'],
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
            name:"",
            screenShow:false,
            electionShow:false,
            checked:false,
            popupModal:false,
            editSheet:false,
            show:false,
            files:[],
            folders:[],
            fileObject:{},
            id:"",
            pupupShow:false,
            titleName:"",
            newShowPopup:false,
            newSign:1,
            str:"folders",
            sessionkey:"",
            sort:"Name",
            isTime:false,
            organizationName:"",
            srchType:"",
            Folderid:""
        }
    },
    onLoad(options){
        if(options.srchType=='share'){
            wx.setNavigationBarTitle({
                title: '共享文件'
            })
        }else {
            wx.setNavigationBarTitle({
                title: '单位文件'
            })
        }
        this.srchType = options.srchType;
        this.Folderid = options.id;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.organizationName = wx.getStorageSync('organizationName');
        this.getQuery();
    },
    computed:{
        photoUrl(){
            return this.$api.photo.url;
        }
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
        changeSearch(e){
            this.search = e.mp.detail;
            this.getQuery();
        },
        changeShow(isBook){
            this.newShowPopup = isBook;
            this.getQuery();
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.filesQuery,
                    SessionKey:this.sessionkey,
                    srchType:this.srchType,
                    sort:this.sort,
                    search:this.search,
                    Folderid:this.Folderid
                }
            }).then(res=>{
                console.log(res);
                if(this.sort=='Name'){        
                    this.fileObject = res;
                    this.files = res.files;
                    this.folders = res.folders;
                }else {
                    this.files = res.files;
                    this.folders = res.folders;
                    this.folders.forEach(item=>{
                        this.$set(item,'str',' folders');
                    })
                    this.files.forEach(item=>{
                        console.log(item,'---')
                        item.FileList.forEach(v=>{
                            this.$set(v,'str',' files');
                        })
                    })
                }
            })
        },
        changeColumn(e){
            this.columnIdx = e.mp.detail.value;
            if(this.columnIdx==0){
                this.sort = 'Name';
                this.isTime = false;
            }else {
                this.sort = 'Createdon'
                this.isTime = true;
            }
            this.getQuery();
        },
        onSelect(e){
            console.log(e);
            let id = e.mp.detail.id;
            if(id==2){
                let url = '/pages/usbDrive/newFolder/main';
                wx.navigateTo({url:url});
            }else if(id==1){
                this.popupModal = true;
            }
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
        // 选择文件
        getSelectFile(){
            this.electionShow = !this.electionShow;
            if(this.electionShow){
                wx.setNavigationBarTitle({
                    title: '已选择'
                })
            }
        },
        onChange(e){
            this.checked = e.mp.detail;
        },
        popupClose(){
            this.popupModal = false;
        },
        getOpenPhoto(){
            wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths
                }
            })
        },
        getEditFile(item){
            this.name = item.name;
            this.id = item.id;
            this.editSheet = true;
        },
        getEditCancel(){
            this.editSheet = false;
        },
        handleClose(){
            this.editSheet = false;
        },
        // 重命名
        getRename(){
            // const url = '/pages/usbDrive/newFolder/main?name='+this.name+'&sign='+'share'+'&id='+this.id;
            // wx.navigateTo({url:url});
            this.editSheet = false;
            this.newShowPopup = true;
        },
        getDeleteFile(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.directoryDel,
                    SessionKey:this.sessionkey,
                    Id:this.id
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
        getAddFolder(){
            this.pupupShow = true;
            // const url = '/pages/usbDrive/newFolder/main?sign='+'share';
            // wx.navigateTo({
            //     url:url
            // })
        },
        // 权限设置
        getAdmin(){
            const url = '/pages/usbDrive/attribute/main?id='+this.id;
            wx.navigateTo({url:url});
        },
        onClosePupupShow(){
            this.pupupShow = false;
            this.titleName = '';
        },
        // 新建文件夹
        getAddFolders(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.directoryCreate,
                    SessionKey:this.sessionkey,
                    Name:this.titleName,
                    ParentId:"10010000-0000-0000-0000-000000000003"
                }
            }).then(res=>{
                console.log(res);
                this.titleName = '';
                this.pupupShow = false;
                this.getQuery();
            })
        },
        getFlodersDetail(item){
            // const url = '/pages/usbDrive/shareFile/detail/main?Folderid='+item.id;
            const url = '/pages/usbDrive/myFile/main?id='+item.id+'&srchType='+this.srchType+'&shareFileName='+item.name+'&canAdmin='+item.privilege.canAdmin+'&canCreate='+item.privilege.canCreate;
            wx.navigateTo({url:url});
        },
        getPreviewImage(item){
            // this.isSwitch = true;
            const openImgs = JSON.stringify(this.openImgs);
            openFiles(item,openImgs);
            // let that = this;
            // wx.previewImage({
            //     current: url, // 当前显示图片的http链接
            //     urls: that.imgList// 需要预览的图片http链接列表
            // })
        },
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
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
        .rows{
            display: flex;
            background: #fff;
            padding: 0 20rpx;
            font-size: 28rpx;
            .imgs{
                width: 80rpx;
                height: 80rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 60%;
                    height: 60%;
                }
            }
            .newFile{
                line-height: 80rpx;
                margin-left: 20rpx;
            }
        }
        .showBox{
            width: 100%;
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28rpx;
            color: #999999;
        }
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
                    width: 83rpx;
                    height: 83rpx;
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
                    width: 500rpx;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    padding-bottom: 20rpx;
                    font-size: 32rpx;
                    color: #333333;
                }
                .text{
                    font-size: 24rpx;
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
    .centerActive{
        padding-bottom: 80px;
        .rowWrap{
            background: #fff;
            padding: 0 33rpx;
            border-top: 1rpx solid #e2e4e3;
            h3{
                color: #a3a3a3;
                font-size: 25rpx;
                padding: 25rpx 0;
            }
            .row{
                display: flex;
                .radioWrap{
                    .radio{
                        margin-top: 20rpx;
                        margin-right: 20rpx;
                    }
                }
                .l{
                    p{
                        width: 83rpx;
                        height: 83rpx;
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
                        p:nth-child(1){
                            font-size: 32rpx;
                            color: #333333;
                            width:300rpx; 
                            white-space:nowrap; 
                            overflow:hidden; 
                            text-overflow:ellipsis;
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
    .sheetContent{
        display: flex;
        justify-content: space-around;
        background: #f4f4f4;
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
            .delete.active{
                color: #ff6666;
            }
            .move.active{
                color: #3399ff;
            }
        }
    }
    .popupWrap{
        h3{
            color: #3399ff;
            font-size: 33rpx;
            text-align: center;
            padding: 25rpx 0;
            border-bottom: 2rpx solid #3399ff;
        }
        .content{
            padding: 34rpx 37rpx;
            .inp{
                background: #e4e4e4;
                border-radius: 12rpx;
                height: 93rpx;
                line-height: 93rpx;
                padding: 0 28rpx;
            }
            .default{
                height: 93rpx;
                line-height: 93rpx;
                margin: 17rpx 0;
                background: #e4e4e4;
                border-radius: 12rpx;
                color: #333333;
                padding: 0 28rpx;
            }
        }
        .tips{
            padding:0 37rpx 17rpx 37rpx;
            color: #333333;
            font-size: 26rpx;
        }
        .btn{
            display: flex;
            border-top: 1rpx solid #eaeeed;
            p{
                flex: 1;
                text-align: center;
                color: #3399ff;
                font-size: 28rpx;
                height: 104rpx;
                line-height: 104rpx;
                box-shadow: border-box;
            }
            .cancel{
                border-right: 1rpx solid #eaeeed;
            }
        }
    }
</style>