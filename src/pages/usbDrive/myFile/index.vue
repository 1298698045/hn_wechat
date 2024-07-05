<template>
    <div class="wrap">
        <div class="nav" v-if="srchType=='share'">
            <p class="publicfile">{{shareFileName}}</p>
            <p class="jurisdiction">权限设置：{{organizationName||'暂无'}}</p>
        </div>
        <div class="search">
            <van-search :value="search" placeholder="搜索" @change="changeSearch" />
        </div>
        <div class="header">
            <h3 v-if="electionShow">
                <span v-if="resultTotal>0">已选择 {{resultTotal}} 项</span>
                <span v-else>选择以下文件</span>
            </h3>
            <div v-if="!electionShow">
                <picker class="pickers" v-model="columnIdx" :range="column" @change="changeColumn">
                    <p>{{column[columnIdx]}}<i-icon type="unfold" /></p>
                </picker>
            </div>
            <div v-if="!electionShow">
                <p>
                    <i class="iconfont icon-quanxuan icon" :class="{'active':electionShow==true}" @click="getSelectFile"></i>
                </p>
                <p>
                    <i class="iconfont icon-shaixuan icon" :class="{'active':electionShow==true}" @click="getScreen"></i>
                </p>
            </div>
        </div>
        
        <div class="center" v-if="!isTime">
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
                            <i class="iconfont icon-gengduo" @click="item.privilege.canAdmin?getEditFile(item,'folders'):toastNull()"></i>
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
                            <i class="iconfont icon-gengduo" @click.stop="item.privilege.canAdmin?getEditFile(item,'files'):toastNull()"></i>
                        </p>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="centerActive" v-if="isTime">
            <van-checkbox-group :value="result" @change="changeGroup">
                <div class="rowWrap">
                    <h3>文件夹</h3>
                    <div class="row" v-for="(item,index) in folders" :key="index">
                        <div class="radioWrap" v-if="electionShow">
                            <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
                        </div>
                        <div class="l" @click.stop="getOpenFolder(item)">
                            <p>
                                <img :src="photoUrl+'Folder.png'" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <div class="text" @click.stop="getOpenFolder(item)">
                                <p>{{item.name}}</p>
                                <p>{{item.createdOn}}</p>
                            </div>
                            <p class="icon" @click.stop="item.privilege.canAdmin?getEditFile(item,'folders'):toastNull()">
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
                            <p class="icon" @click.stop="v.privilege.canAdmin?getEditFile(v,'files'):toastNull()">
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
                    <p @click="getMoveFile">移动到</p>
                    <p v-if="str=='files'" @click="getCopy">复制到</p>
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
        <div class="clues-add-button" v-if="!showSheet&&!electionShow&&(canAdmin||canCreate)" @click="onCluesAddBtnClick">
            <van-icon name="plus" size="20px" />
        </div>
        <div class="footer" v-if="electionShow" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="operation">
                <p class="cancel" @click="getCancelAll">取消</p>
                <p class="all" @click="getSelectAll" v-if="resultTotal<listLength">全选</p>
                <p class="all" v-if="resultTotal==listLength" @click="getAllCancel">取消全选</p>
                <p class="move" :class="{'active':result!=''}">移动</p>
                <p class="delete" @click="getDeleteFile" :class="{'active':result!=''}">删除</p>
            </div>
        </div>
        <!-- 新建文件夹弹框 -->
        <newFolder v-if="newShow" :ParentId="ParentId" :str="str" :newSign="newSign" :fileId="fileId" :fileName="fileName" @changeShow="changeShow" />
    </div>
</template>
<script>
import newFolder from '../../../components/newFolder';
import { mapMutations } from 'vuex';
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
            srchType:"",
            ParentId:"10010000-0000-0000-0000-000000000001",
            shareFileName:"",
            sessionkey:"",
            paramsList:[],
            openImgs:[], // 所有图片
            listLength:"",
            isSwitch:false,
            canAdmin: false, // 根据上一层文件夹的权限控制文件权限
            canCreate: false
        }
    },
    computed:{
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
    onShow(){
        if(!this.isSwitch){
            this.files = [];
            this.folders = [];
            const pages = getCurrentPages();
            const currPage = pages[pages.length-1]
            console.log(pages,currPage.options.id,'--');
            // debugger
            if(currPage.options.id!==undefined){
                this.ParentId = currPage.options.id;
            }else {
                currPage.ParentId = this.ParentId;
            }
            this.getQuery();
        }

    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.srchType = options.srchType;
        console.log('srchType:', this.srchType);
        this.canAdmin = options.canAdmin == 'false' ? false : options.canAdmin == 'true' ? true : false;
        this.canCreate = options.canCreate == 'false' ? false : options.canCreate == 'true' ? true : false;
        console.log('canAdmin:', this.canAdmin, typeof this.canAdmin)
        console.log('canCreate', this.canCreate, typeof this.canCreate)
        const type = {
            'my':'我的文件',
            'share': '共享文件',
            'org': '单位文件',
            'project': '项目文件'
        }
        let title = type[this.srchType]
        // let title = this.srchType == 'my' ? '我的文件' : this.srchType == 'share' ? '共享文件' : this.srchType == 'org' ? '单位文件' : '我的文件'
        wx.setNavigationBarTitle({
            title: title
        })
        // if(this.srchType=='my'){
        //     // this.ParentId = "10010000-0000-0000-0000-000000000001";
        //     this.ParentId = options.id;
        // }else if(this.srchType=='share'){
        //     this.ParentId = options.Folderid;
        //     this.shareFileName = options.shareFileName;
        // }
        // this.getQuery();
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
        ...mapMutations([
            'handleFiles'
        ]),
        // 发邮件
        getSendEmail(){
            this.handleFiles(this.paramsList);
            const url = '/pages/email/writeMail/main';
            wx.navigateTo({url:url});
        },
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
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.filesQuery,
                    SessionKey:this.sessionkey,
                    srchType:this.srchType,
                    sort:this.sort,
                    Folderid:this.ParentId,
                    search:this.search
                }
            }).then(res=>{
                console.log(res);
                this.files = res.files;
                this.folders = res.folders;
                this.listLength = res.files.length+res.folders.length;
                if(this.sort=='Name'){
                    this.files.forEach(item=>{
                        // console.log(this.conver(item.fileSize),'fileSize')
                        const conver = this.conver(item.fileSize);
                        this.$set(item,'conver',conver)
                        this.$set(item,'str',' files');
                        const isToday = this.isToday(item.createdOn);
                        this.$set(item,'isToday',isToday);
                        if(item.fileExtension=='jpg'){
                            this.imgList.push(item.link)
                        }
                    })
                    this.folders.forEach(item=>{
                        const isToday = this.isToday(item.createdOn);
                        this.$set(item,'isToday',isToday);
                        this.$set(item,'str',' folders');
                    })
                }else {
                    this.folders.forEach(item=>{
                        const isToday = this.isToday(item.createdOn);
                        this.$set(item,'isToday',isToday);
                        this.$set(item,'str',' folders');
                    })
                    this.files.forEach(item=>{
                        console.log(item,'---')
                        const isToday = this.isToday(item.createdOn);
                        this.$set(item,'isToday',isToday);
                        const conver = this.conver(item.fileSize);
                        this.$set(item,'conver',conver)
                        item.FileList.forEach(v=>{
                            this.$set(v,'str',' files');
                        })
                    })
                    console.log(this.files,'123132123');
                }
                this.files.forEach(item=>{
                    if(item.fileExtension=='png'||item.fileExtension=='jpg'){
                        this.openImgs.push(item.link);
                    }
                })
            })
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
            console.log(e);
            this.result = e.mp.detail;
            this.resultId = e.mp.detail;
            // this.result.map(item=>{
            //     console.log(item.split(' '));
            //     let result = item.split(' ');
            //     let id = result[0];
            //     this.sign = result[1];
            //     this.resultId.push(id);
            // })
            // console.log(this.resultId);
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
        getDeleteFile(){
            console.log(this.result,'result');
            // return;
            let method = '';
            let that = this;
            let temp = [];
            for(var i=0; i < this.result.length; i++){
                let result = this.result[i].split(' ');
                let id = result[0];
                let str = result[1];
                let IsFolder = '';
                if(str=='folders'){
                    IsFolder = true;
                }else {
                    IsFolder = false;
                }
                temp.push({
                    id:id,
                    IsFolder:IsFolder
                })
            }
            temp = JSON.stringify(temp);
            console.log(temp,'temp');
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.batchDelete,
                    SessionKey:this.sessionkey,
                    files:temp
                }
            }).then(res=>{
                wx.showToast({
                    title:"删除成功",
                    icon:"success",
                    duration:2000,
                    success:res=>{
                        that.result = [];
                        that.resultId = [];
                        that.electionShow = false;
                        that.getQuery();
                    }
                })
            })


            // for(var i=0; i < this.result.length;i++){
            //     console.log(this.result[i],'1233');
            //     let result = this.result[i].split(' ');
            //     let id = result[0];
            //     let str = result[1];
            //     if(str=='files'){
            //         method = 'file.delete'
            //     }else if(str=='folders'){
            //         method = 'file.directory.delete';
            //     }
            //     var name  = 'str'+i;
            //     name =  new Promise((resolve,reject)=>{     
            //         that.$httpWX.get({
            //                 url:that.$api.message.queryList,
            //                 data:{
            //                     method:method,
            //                     SessionKey:"5af66c21-6974-4251-bb0c-b3f4f7e0f416",
            //                     Id:id
            //                 }
            //             }).then(res=>{
            //                 console.log(res);
            //                 resolve(res);
            //             })
            //     })  
            //   Promise.all([name]).then((result)=>{
            //     //   debugger
            //       that.result = [];
            //       that.resultId = [];
            //       that.electionShow = false;
            //       that.getQuery();
            //   }).catch((error)=>{

            //   })

            // }
        },
        deleteFileQuery(){

        },
        changeColumn(e){
            this.columnIdx = e.mp.detail.value;
            if(this.columnIdx==0){
                this.sort = 'Name'
                this.isTime = false;
            }else if(this.columnIdx==1){
                this.sort = 'Createdon';
                this.isTime = true;
            }
            this.getQuery();
        },
        onCluesAddBtnClick(){
            this.showSheet = true;
        },
        onSelect(e){
            console.log(e);
            let id = e.mp.detail.id;
            if(id==2){
                // let url = '/pages/usbDrive/newFolder/main';
                // wx.navigateTo({url:url});
                this.newSign = 0;
                this.fileName = '';
                this.fileId = '';
                this.newShow = true;
            }else if(id==1){
                // this.popupModal = true;
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
        // 选择文件
        getSelectFile(){
            this.electionShow = !this.electionShow;
            // this.isTime = false;
            if(this.electionShow){
                wx.setNavigationBarTitle({
                    title: '已选择'
                })
            }else {
                wx.setNavigationBarTitle({
                    title: '我的文件'
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
            const url = '/pages/usbDrive/myFile/main?id='+item.id+'&name='+item.name+'&srchType='+this.srchType+'&canAdmin='+item.privilege.canAdmin+'&canCreate='+item.privilege.canCreate;
            wx.navigateTo({
                url:url
            })
        },
        // 获取分享链接
        getObtainLink(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.directory.get",
                    SessionKey:this.sessionkey,
                    Id:this.fileId    
                }
            }).then(res=>{
                console.log(res);
            })
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
        getRouterClass(item){
            const url = '/pages/usbDrive/myFile/classFlie/main?fileType='+item+'&srchType='+this.srchType+'&folderId='+this.ParentId;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    page{
        background: #fff;
    }
    .nav {
        background: #fff;
        padding: 31rpx 33rpx;
        .publicfile {
            font-size: 32rpx;
            color: #333333;
        }
        .jurisdiction {
            font-size: 24rpx;
            color: #3399ff;
        }
    }
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
</style>