<template>
    <div class="file_task">
        <div class="search">
            <van-search :value="search" placeholder="搜索" @change="changeSearch" />
        </div>
        <div class="center">
            <van-checkbox-group :value="result" @change="changeGroup" @click.stop>
            <!-- folders -->
                <div class="content" :class="electionShow?'contentActive':''" v-for="(item,index) in folders" :key="index">
                    <div class="radioWrap" v-if="electionShow">
                        <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
                    </div>
                    <div class="img">
                        <p  @click="getOpenFolder(item)">
                            <img :src="photoUrl+'Folder.png'" alt="">
                        </p>
                    </div>
                    <div class="cont">
                        <div  @click="getOpenFolder(item)">
                            <p class="title">{{item.name}}</p>
                            <p class="text">{{!item.isToday?item.createdOn:'今日'}}</p>
                        </div>
                        <p class="icon">
                            <i class="iconfont icon-gengduo" @click="item.Privilege.canAdmin?getEditFile(item,'folders'):toastNull()"></i>
                        </p>
                    </div>
                </div>
                <!-- files -->
                <div class="content" :class="electionShow?'contentActive':''" v-for="(item,index) in files" :key="index"  @click.stop="getPreviewImage(item)">
                    <div class="radioWrap" v-if="electionShow">
                        <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
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
                            <p class="title information-title">{{item.name}}.{{item.fileExtension}}</p>
                            <p class="text">{{!item.isToday?item.createdOn:'今日'}}&nbsp;&nbsp;{{item.conver}}</p>
                        </div>
                        <p class="icon">
                            <i class="iconfont icon-gengduo" @click.stop="item.Privilege.canAdmin?getEditFile(item,'files'):toastNull()"></i>
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
                    <p @click="getRename">重命名</p>
                    <p @click="deleteFile">删除</p>
                </div>
            </div>
        </van-action-sheet>

        <van-action-sheet z-index="10000" :round="false" safe-area-inset-bottom cancel-text="取消" @close="getClose" @cancel="getCancel" :show="screenShow">
            <div class="titleSheet">
                <p>筛选</p>
            </div>
            <div class="sheetContent">
                <div class="box" @click="getRouterClass('file')">
                    <p>
                        <img :src="photoUrl+'Folders.png'" alt="">
                    </p>
                    <p>文档</p>
                </div>
                <div class="box" @click="getRouterClass('rar')">
                    <p>
                        <img :src="photoUrl+'rar.png'" alt="">
                    </p>
                    <p>压缩包</p>
                </div>
                <div class="box" @click="getRouterClass('img')">
                    <p>
                        <img :src="photoUrl+'Image.png'" alt="">
                    </p>
                    <p>图片</p>
                </div>
                <div class="box" @click="getRouterClass('other')">
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
        <div class="clues-add-button" @click="onCluesAddBtnClick">
            <van-icon name="plus" size="20px" />
        </div>
        <!-- 新建文件夹弹框 -->
        <newFolder v-if="newShow" :ParentId="ParentId" :str="str" :newSign="newSign" :fileId="fileId" :fileName="fileName" @changeShow="changeShow" />
    </div>
</template>
<script>
import openFiles from '@/utils/openFiles';
import newFolder from '../../components/newFolder.vue';
export default {
  name: 'fileTask',
  props: ['sessionkey','projectId'],
  components:{
      newFolder
  },
  data() {
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
            name:"我的图片",
            screenShow:false,
            electionShow:false,
            checked:false,
            popupModal:false,
            editSheet:false,
            result:[],
            files:[],
            folders:[],
            resultId:[],
            sign:"",
            sort:"Name",
            fileName:"",
            fileId:"",
            createdByName:"",
            createdOn:"",
            str:"",
            isTime:false,
            imgList:[],
            newShow:false,
            srchType:"project",
            // ParentId:"10010000-0000-0000-0000-000000000001",
            shareFileName:"",
            sessionkey:"",
            paramsList:[],
            openImgs:[], // 所有图片
            listLength:"",
            isSwitch:false,
            canAdmin: false, // 根据上一层文件夹的权限控制文件权限
            canCreate: false
    };
  },
  computed:{
    // ParentId(){
    //     return this.projectId
    // },
    isModelmes(){
        return wx.getStorageSync('isModelmes');
    },
    resultTotal(){
        return this.resultId.length;
    },
    photoUrl(){
        return this.$api.photo.url;
    },
    organizationName(){
        return wx.getStorageSync('organizationName');
    }
  },
  watch:{
    projectId:{
        handler(newVal, oldVal) {
            this.ParentId = newVal;
            this.getQuery();
        },
        immediate: true
    }  
  },
  onLoad() {
  },
  methods: {
    changeSearch(e){
        console.log(e);
        this.search = e.mp.detail;
        this.getQuery();
    },
    changeShow(isBook){
        this.newShow = isBook;
        this.files = [];
        this.folders = [];
        this.getQuery();
    },
    getQuery() {
      this.$httpWX
        .get({
          url: this.$api.message.queryList,
          data: {
            method: this.$api.usb.filesQuery,
            SessionKey: this.sessionkey,
            sort: this.sort,
            Folderid: this.ParentId,
            search: this.search,
          },
        })
        .then((res) => {
          console.log(res);
          this.files = res.files;
          this.folders = res.folders;
          this.listLength = res.files.length + res.folders.length;
          if (this.sort == "Name") {
            this.files.forEach((item) => {
              const conver = this.conver(item.fileSize);
              this.$set(item, "conver", conver);
              this.$set(item, "str", " files");
              const isToday = this.isToday(item.createdOn);
              this.$set(item, "isToday", isToday);
              if (item.fileExtension == "jpg") {
                this.imgList.push(item.link);
              }
            });
            this.folders.forEach((item) => {
              const isToday = this.isToday(item.createdOn);
              this.$set(item, "isToday", isToday);
              this.$set(item, "str", " folders");
            });
          } else {
            this.folders.forEach((item) => {
              const isToday = this.isToday(item.createdOn);
              this.$set(item, "isToday", isToday);
              this.$set(item, "str", " folders");
            });
            this.files.forEach((item) => {
              const isToday = this.isToday(item.createdOn);
              this.$set(item, "isToday", isToday);
              const conver = this.conver(item.fileSize);
              this.$set(item, "conver", conver);
              item.FileList.forEach((v) => {
                this.$set(v, "str", " files");
              });
            });
          }
          this.files.forEach((item) => {
            if (item.fileExtension == "png" || item.fileExtension == "jpg") {
              this.openImgs.push(item.link);
            }
          });
        });
    },
    isToday(str){
        var d = new Date(str.replace(/-/g,"/"));
        var todaysDate = new Date();
        if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
            return true;
        } else {
            return false;
        }
    },
    // 文件大小字节换算
    conver(limit){  
        var size = "";  
        if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
            size = limit.toFixed(2) + "B";    
        }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
            size = (limit / 1024).toFixed(2) + "KB";              
        }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
            size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
        }else{ //其他转化成GB  
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
        }  
            
        var sizestr = size + "";   
        var len = sizestr.indexOf("\.");  
        var dec = sizestr.substr(len + 1, 2);  
        if(dec == "00"){//当小数点后为00时 去掉小数部分  
            return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
        }  
        return sizestr;  
    },
    changeGroup(e){
        this.result = e.mp.detail;
        this.resultId = e.mp.detail;
    },
    getSelectAll(){
        this.result = [];
        this.resultId = [];
        let list = [];
        if(!this.isTime){
            list = [...this.files,...this.folders];
        }else {
            let temp = [];
            this.files.forEach(item=>{
                temp = temp.concat(item.FileList);
                list = [...temp,...this.folders];
            })
        }
        list.forEach(item=>{
            this.result.push(item.id+item.str);;
        })
        this.result.map(item=>{
            let result = item.split(' ');
            let id = result[0];
            this.sign = result[1];
            this.resultId.push(id);
            console.log('全选',this.resultId);
        })
    },
    getAllCancel(){
        this.resultId = [];
        this.result = [];
    },
    getCancelAll(){
        this.result = [];
        this.resultId = [];
        this.electionShow = false;
        wx.setNavigationBarTitle({
            title: '我的文件'
        })
    },
    onCluesAddBtnClick(){
        this.showSheet = true;
    },
    onSelect(e){
        console.log(e);
        let id = e.mp.detail.id;
        if(id==2){
            this.newSign = 0;
            this.fileName = '';
            this.fileId = '';
            this.newShow = true;
        }else if(id==1){
            this.getOpenPhoto();
        }
    },
    onClose(){
        this.showSheet = false;
    },
    getScreen(){
        this.screenShow = true;
        this.isTime = false;
    },
    getCancel(){
        this.screenShow = false;
    },
    getClose(){
        this.screenShow = false;
    },
    popupClose(){
        this.popupModal = false;
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
                let url = `${that.$api.upload.url}?method=${that.$api.usb.upload}&SessionKey=${that.sessionkey}&folderid=${that.ParentId}`;
                wx.uploadFile({
                    url:url,
                    // url: "https://oawx.hnca.org.cn/rest?method="+'file.upload.create'+'&SessionKey='+that.sessionkey, //仅为示例，非真实的接口地址
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
    getEditFile(item,str){
        this.str = str;
        this.fileName = item.name;
        this.fileId = item.id;
        console.log(this.fileId);
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
        // const url = '/pages/usbDrive/newFolder/main?name='+this.fileName+'&id='+this.fileId+'&sign='+'rename';
        // wx.navigateTo({url:url});
    },
    // 删除单个文件
    deleteFile(){
        let method = '';
        if(this.str=='folders'){
            method = 'file.directory.delete'
        }else {
            method = 'file.delete'
        }
        this.$httpWX.get({
            url:this.$api.message.queryList,
            data:{
                method:method,
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
        const url = '/pages/usbDrive/myFile/main?id='+item.id+'&name='+item.name+'&srchType='+this.srchType+'&canAdmin='+item.Privilege.canAdmin+'&canCreate='+item.Privilege.canCreate;
        wx.navigateTo({
            url:url
        })
    },
    getPreviewImage(item){
        const openImgs = JSON.stringify(this.openImgs);
        openFiles(item,openImgs);
    },
  },
};
</script>
<style lang="scss">
    @import ' ../../static/css/public.scss';
    .file_task{
        .search{
            background: #fff;
        }
        .header{
            padding: 33rpx;
            background: #fff;
            font-size: 24rpx;
            color: #3399ff;
            display: flex;
            justify-content: space-between;
            h3{
                font-size: 26rpx;
                color: #999999;
            }
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
        .center{
            padding-bottom: 120rpx;
            .content.contentActive{
                padding:0 33rpx;
            }
            .content{
                background: #fff;
                display: flex;
                padding: 0 33rpx 0 0;
    
                .radioWrap{
                    .radio{
                        margin-top: 20px;
                    }
                }
                .img{
                    padding:20rpx 0;
                    margin-left: 33rpx;
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
                        width: 200px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow:ellipsis;
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
            z-index: 999;
            .operation{
                display: flex;
                justify-content: space-between;
                color: #cccccc;
                background: #fff;
                height: 104rpx;
                line-height: 104rpx;
                font-size: 29rpx;
                padding: 0 30rpx;
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
    }
</style>