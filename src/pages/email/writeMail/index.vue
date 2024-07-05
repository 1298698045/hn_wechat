<template>
    <div class="wrap">
        <div class="center">
            <div class="header">
                <div class="rowBtn">
                    <p class="save" :class="{'active':nameList!=''}" @click="nameList!=''&&getSendOut('0','save')">保存</p>
                    <p class="send" :class="{'active':nameList!=''}"  @click="nameList!=''&&getSendOut('1')">发送</p>
                </div>
                <div class="boxWrap" @click="getaddShow">
                    <div class="flex">
                        <div class="cont">
                            <span>收件人：</span>
                            <span class="spans" v-if="nameList!=''" v-for="(item,index) in nameList" :key="index">{{item.FullName}}</span>
                            <span style="display:inline-block;margin-top: 10rpx;" v-if="nameList!=''" @click="getDeleteName">
                                <i class="iconfont icon-quxiao2"></i>
                            </span>
                            <input type="text" style="margin-top: 10rpx;" :class="{'active':nameList!=''}" :value="name" :auto-focus="isFocus"  @input="changeName">
                        </div>
                    </div>
                    <div class="icon_box">
                        <i class="iconfont icon-tianjia1"  v-if="addShow" @click.stop="getAddContacts"></i>
                    </div>
                </div>
                <!-- <div class="boxWrap" v-if="nameCC==''" @click="getaddShow">
                    <div class="flex" :class="{'active':nameList!=''}">
                        <div class="label">收件人：</div>
                        <div class="cont">
                            <span class="spans" v-if="nameList!=''" v-for="(item,index) in nameList" :key="index">{{item.FullName}}</span>
                            <i class="iconfont icon-quxiao2"  v-if="nameList!=''" @click="getDeleteName"></i>
                            <input type="text" :class="{'active':nameList!=''}" :value="name" :auto-focus="isFocus"  @input="changeName">
                        </div>
                    </div>
                    <div class="icon_box">
                        <i class="iconfont icon-tianjia1"  v-if="addShow" @click.stop="getAddContacts"></i>
                    </div>
                </div> -->
                <div class="boxWrap" v-if="name==''"  @click="getaddTwoShow">
                    <div class="flex">
                        <!-- <div class="label">抄送人：</div> -->
                        <div class="cont">
                            <span>抄送人：</span>
                            <span class="spans" v-if="nameListCC!=''" v-for="(item,index) in nameListCC" :key="index">{{item.FullName}}</span>
                            <span style="display:inline-block;margin-top: 10rpx;" v-if="nameListCC!=''" @click.stop="getDeleteNameCC">
                                <i class="iconfont icon-quxiao2"></i>
                            </span>
                            <input type="text" :class="{'active':nameListCC!=''}" :value="nameCC" @input="changeCC">
                        </div>
                    </div>
                    <div class="icon_box">
                        <i class="iconfont icon-tianjia1"  v-if="addTwoShow" @click="getAddCC"></i>
                    </div>
                </div>
                <!-- <div class="rowWrap" v-if="!isShow">
                    <p>抄送/密送，发件人：</p>
                    <p class="col">zhanglp@fenghuang.com</p>
                </div> -->
                <div class="boxWrap"  v-if="name==''&&nameCC==''">
                    <div class="flex">
                        <span class="label">主题：</span>
                        <input class="inp" type="text" v-model="subject" >
                    </div>
                    <div class="input">
                        <i class="iconfont icon-fujian" style="color:#999999;" @click="getFujian"></i>
                    </div>
                </div>
            </div>
            <div class="showclass" v-if="isShow&&name!=''||isShow&&nameCC!=''">
                <div class="rows" v-for="(item,index) in list" :key="index" @click="getSelect(item)">
                    <div class="name">
                        <p class="radius">{{item.name}}</p>
                    </div>
                    <div class="cont">
                        <p>{{item.FullName || ''}}</p>
                        <p>{{item.TelPhone || ''}}</p>
                    </div>
                </div>
            </div>
            <div class="content" v-if="!isShow">
                <textarea class="textarea" placeholder-class="placeholder" :auto-height="true" v-model="mailBody" name="" id="" cols="100" rows="10" maxlength="100000" placeholder="输入正文..."></textarea>
            </div>
        </div>
        <div class="bottom" v-if="!isShow&&fileList!=''">
            <div class="boxWrap">
            <scroll-view scroll-x="true" style="display: flex;width: 100%">
                <div class="swiper-item" v-for="(item,index) in fileList" :key="index">
                    <p class="imgs" @click="getPreviewImg(item,index)">
                        <img v-if="item.fileExtension=='jpg'||item.fileExtension=='png'" :src="item.link" alt="">
                        <img v-else-if="item.fileExtension=='xls' || item.fileExtension=='xlsx'" :src="photoUrl+'xls.png'" alt="">
                        <img v-else-if="item.fileExtension=='doc' || item.fileExtension=='word' || item.fileExtension=='docx'" :src="photoUrl+'02.3.1.Word.png'" alt="">
                        <img v-else-if="item.fileExtension=='rar'" :src="photoUrl+'rar.png'" alt="">
                        <img v-else-if="item.fileExtension=='txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
                        <img v-else-if="item.fileExtension=='pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
                        <img v-else-if="item.fileExtension=='ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
                        <!-- <img :src="item.link" alt=""> -->
                        <i class="iconfont icon-quxiao2" @click="getDeleteFile(item,index)"></i>
                    </p>
                    <p class="text">{{item.name}}</p>
                    <!-- <p class="minText">6.42M</p> -->
                </div>
            </scroll-view>
            </div>
        </div>
        <!-- <div class="footer" v-if="!isShow" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="row">
                <div>
                    <p class="imgs">
                        <img src="https://oawx.hnca.org.cn/img/wechat/02.4.1.Photograph.png" alt="">
                    </p>
                    <i class="iconfont icon-tupian1"  @click="getPhoto"></i>
                    <p class="imgs" @click="getUpan">
                        <img src="https://oawx.hnca.org.cn/img/wechat/02.4.1.File.png" alt="">
                    </p>
                </div>
                <p class="btn" @click="getSendOut('1')">发送</p>
            </div>
        </div> -->
        <van-action-sheet
            :show="sheetShow"
            cancel-text="取消"
            @close="onClose"
            @cancel="onClose"
        >
            <div class="sheetWrap">
                <p  @click="getUpan">文件管理</p>
                <p @click="getphotograph">拍照</p>
                <p @click="getPhoto">从手机相册选择</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import {mapState,mapMutations,mapGetters} from 'vuex';
import { message } from '@/utils/message';
import openFiles from '@/utils/openFiles';
export default {
    data(){
        return {
            isShow:false,
            list:[],
            name:"",
            UserId:"",
            mailBody:"",
            subject:"",
            fileList:[],
            isFocus:false,
            nameList:[],
            temp:[],
            emailStatus:1,
            sendBatchId:"",
            sessionkey:"",
            nameCC:"",
            nameListCC:[],
            EmailId:"",
            tempCC:[],
            addShow:true,
            addTwoShow:false,
            sheetShow:false,
            isRefresh: true // 是否刷新，为了控制打开图片以及其他附件之后重新刷新问题
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        ...mapState({
            selectListName:state=>{
                return state.mailList.selectListName
            },
            selectFiles:state=>{
                return state.usb.selectFiles;
            },
            selectListNameCC:state=>{
                return state.mailList.selectListNameCC
            }
        }),
        ...mapGetters([
            'filterList'
        ]),
        fileids(){
            let temp = [];
            this.fileList.forEach(item=>{
                if(item.id){
                    temp.push(item.id);
                }
            })
            return temp.join(',');
        },
        filesImgs(){
            let temp = [];
            this.fileList.forEach(item=>{
                if(item.link){
                    temp.push(item.link);
                }
            })
            return temp;
        },
        ccUserIds(){
            let temp = [];
            this.nameListCC.forEach(item=>{
                temp.push(item.id);
            })
            return temp;
        },
        ccUserNames(){
            let temp = [];
            this.nameListCC.forEach(item=>{
                temp.push(item.FullName);
            })
            return temp;
        },
        photoUrl(){
            return this.$api.photo.url;
        }
    },
    onShow(){
        // console.log(this.filterList,'filterList');
        // console.log(this.selectListName,'selectListName');
        if(this.isRefresh){
            this.nameList =this.nameList.concat(this.selectListName);
            console.log(this.nameList,'namelist');
            this.nameList = this.nameList.map(item=>({
                id:item.id,
                FullName:item.FullName
            }))
            this.nameList = this.unique(this.nameList);
            this.fileList = this.fileList.concat(this.selectFiles);
            this.nameListCC = this.nameListCC.concat(this.selectListNameCC).map(item=>({
                id:item.id,
                FullName:item.FullName
            }))
            this.nameListCC = this.unique(this.nameListCC);
            console.log('filelist:', this.fileList)
            if(this.fileList!=''){
                this.getSendOut('0').then(res=>{
                    this.getUploadFile(this.EmailId);
                });
            }
            this.isRefresh = true;
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.isFocus = true;
        // this.sendDraft();
    },
    onUnload(){
        this.getClear([]);
        this.clearFile([]);
    },
    methods:{
        getFujian(){
            this.sheetShow = true;
        },
        onClose(){
            this.sheetShow = false;
        },
        getaddShow(){
            this.addTwoShow = false;
            this.addShow = true;
        },
        getaddTwoShow(){
            this.addShow = false;
            this.addTwoShow = true;
        },
        // 预览图片
        getPreviewImg(item,index){
            // console.log(this.filesImgs,'123123')
            // wx.previewImage({
            //     urls:this.filesImgs,
            //     current:item.link,
            //     success:res=>{
            //         console.log(res,'success');
            //     }
            // })
            this.isRefresh = false;
            const openImgs = JSON.stringify(this.filesImgs);
            openFiles(item,openImgs);
        },
        sendDraft(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.send,
                    SessionKey:this.sessionkey,
                    emailStatus:0
                }
            }).then(res=>{
                console.log(res);
                this.EmailId = res.data[0].EmailId;
            })
        },
        // 选择来自优盘的文件作为附件 id：草稿id
        getUploadFile(id){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.addusbfile,
                    SessionKey:this.sessionkey,
                    mailid:id,
                    fileids:this.fileids
                }
            }).then(res=>{
                console.log(res);
            })
        },
        ...mapMutations([
            'getSign',
            'getSingleDelete',
            'getClear',
            'delete',
            'getSingleDeleteCC',
            'clearFile' // 清空附件
        ]),
        getUpan(){
            this.sheetShow = false;
            const url = '/pages/uPan/main';
            wx.navigateTo({url:url});
        },
        queryAll(name){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.mailList.queryAll,
                    SessionKey:this.sessionkey,
                    search:name
                }
            }).then(res=>{
                this.list = res.listData;
                this.list.map(item=>{
                    if(item.FullName.length>2){
                        item.name = item.FullName.substr(1);
                    }else {
                        item.name = item.FullName;
                    }
                    return item;
                })
            })
        },
        unique(arr) { // 根据唯一标识orderId来对数组进行过滤
    　　　　　　const res = new Map();  //定义常量 res,值为一个Map对象实例
    　　　　　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
    　　　　　　return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1)) 
        }, 
        getDeleteName(){
            let index =  this.nameList.length-1;
            let id = this.nameList[index].id;
            this.nameList.splice(index,1);
            this.getSingleDelete(id);
            
        },
        getDeleteNameCC(){
            let index = this.nameListCC.length-1;
            let id = this.nameListCC[index].id;
            this.nameListCC.splice(index,1);
            this.getSingleDeleteCC(id);
        },
        getSelect(item){
            this.temp = [];
            this.tempCC = [];
            if(this.name!=''){
                this.temp.push({
                    FullName:item.FullName,
                    id:item.ValueId
                })
                this.nameList = this.nameList.concat(this.temp);
                this.nameList = this.unique(this.nameList);
                this.name = '';                
            }else {
                this.tempCC.push({
                    FullName:item.FullName,
                    id:item.ValueId
                })
                this.nameListCC = this.nameListCC.concat(this.tempCC);
                this.nameListCC = this.unique(this.nameListCC);
                this.nameCC = '';
            }
            this.isShow = false;
            
        },
        changeName(e){
            console.log(e);
            this.name = e.mp.detail.value;
             if(this.name){
                this.isShow = true;
            }else {
                this.isShow = false;
            }
            this.queryAll(this.name);
        },
        changeCC(e){
            this.nameCC = e.mp.detail.value;
             if(this.nameCC){
                this.isShow = true;
            }else {
                this.isShow = false;
            }
            this.queryAll(this.nameCC);
        },
        changeSubject(e){
            this.subject = e.mp.detail;
        },
        getAddContacts(){
            // const url = "/pages/publics/contacts/main";
            this.getSign('writeMail');
            const url = "/pages/publics/mailList/main";
            wx.navigateTo({url:url});
        },
        getAddCC(){
            const url = '/pages/publics/mailList/main?cc='+'cc';
            wx.navigateTo({url:url});
        },
        // 拍照
        getphotograph(){
            this.sheetShow = false;
            this.getSendOut('0').then(()=>{
                let that = this;
                wx.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['camera'],
                    success (res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        const tempFilePaths = res.tempFilePaths;
                        for(var i=0;i<tempFilePaths.length;i++){
                            that.fileList.push({
                                link:tempFilePaths[i],
                                fileExtension:'png'
                            });
                        }
                        console.log(that.selectFiles,that.fileList,'selectFiles');
                        that.fileList = that.fileList.concat(that.selectFiles);
                        let Files = that.fileList.join(',');
                        console.log(Files,'Files');
                        let url = `${that.$api.upload.url}?method=${that.$api.email.upload}&SessionKey=${that.sessionkey}&pid=${that.sendBatchId}`;
                        for (var i = 0; i < tempFilePaths.length;i++){
                            wx.uploadFile({
                                url: url,
                                filePath: tempFilePaths[i],
                                name: 'file',
                                formData: {
                                    'user': 'test'
                                },
                                success (res){
                                    // debugger
                                    console.log(res);
                                    const data = res.data
                                    //do something
                                }
                            })
                        }
                    }
                })
            })
        },
        getPhoto(){
            this.sheetShow = false;
            this.getSendOut('0').then(()=>{
                let that = this;
                console.log(that.sendBatchId);
                wx.chooseImage({
                    count: 9,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success (res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        const tempFilePaths = res.tempFilePaths;
                        console.log(tempFilePaths,'路径');
                        // that.fileList = [];
                        for(var i=0;i<tempFilePaths.length;i++){
                            that.fileList.push({
                                link:tempFilePaths[i],
                                fileExtension:'png'
                            });
                        }
                        console.log(that.selectFiles,that.fileList,'selectFiles');
                        that.fileList = that.fileList.concat(that.selectFiles);
                        let Files = that.fileList.join(',');
                        console.log(Files,'Files');
                        let url = `${that.$api.upload.url}?method=${that.$api.email.upload}&SessionKey=${that.sessionkey}&pid=${that.sendBatchId}`;
                        for (var i = 0; i < tempFilePaths.length;i++){
                            wx.uploadFile({
                                url:url,
                                // url: "https://oawx.hnca.org.cn/rest?method="+'email.attachfiles.upload'+'&SessionKey=' + that.sessionkey+'&pid='+that.sendBatchId,
                                filePath: tempFilePaths[i],
                                name: 'file',
                                formData: {
                                    'user': 'test'
                                },
                                success (res){
                                    // debugger
                                    console.log(res);
                                    const data = res.data
                                    //do something
                                }
                            })
                        }
                    }
                })
            })
        },
        getDeleteFile(item,index){
            console.log(item);
            this.fileList.splice(index,1);
            if(item.id){
                this.delete(item.id);
            }
        },
        getSendOut(emailStatus,str){
            let toUserids = [];
            this.nameList.forEach(item=>{
                toUserids.push(item.id);
            })
            this.UserId = toUserids.join(',');
            return new Promise((reslove,reject)=>{
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.email.send,
                        SessionKey:this.sessionkey,
                        subject:this.subject,
                        mailBody:this.mailBody,
                        toUserids:this.UserId,
                        emailStatus:emailStatus,
                        priority:0,
                        attachfileids:"",
                        id:this.EmailId,
                        ccUserIds:this.ccUserIds.join(','),
                        ccUserNames:this.ccUserNames.join(',')
                    }
    
                }).then(res=>{
                    if(emailStatus=='1'){
                        if(res.status==1){
                            message.toast({
                                title:'发送成功',
                                delta: 1,
                                success(){

                                }
                            })
                        }else {
                            wx.showToast({
                                title:"发送失败",
                                icon:"none",
                                duration:2000
                            })
                        }
                    }else if(emailStatus=='0'){
                        this.EmailId = res.data[0].EmailId;
                        this.sendBatchId = res.data[0].sendBatchId;
                        if(str=='save'){
                            wx.showToast({
                                title:"保存草稿成功",
                                icon:"success",
                                duration:2000,
                                success:res=>{
                                    setTimeout(()=>{
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    },1000)
                                }
                            })
                        }
                    }
                    reslove();
                })
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss'; 
    @import '../../../../static/css/emaiIcon.css';
    page{
        background: #fff;
    }
    .radius{
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 12px;
        border-radius: 50%;
        text-align: center;
        background: #3399ff;
        color: #fff;
    }
    .wrap{
        .center{
            width: 100%;
            .header{
                .rowBtn{
                    display: flex;
                    justify-content: space-between;
                    padding: 32rpx 33rpx;
                    border-bottom: 1rpx solid #e2e3e5;
                    .save{
                        font-size: 34rpx;
                        color: #999999;
                    }
                    .save.avtive{
                        color: #3399ff;
                    }
                    .send{
                        font-size: 34rpx;
                        color: #999999;
                    }
                    .send.active{
                        color: #3399ff;
                    }
                }
                .boxWrap{
                    padding: 20rpx 33rpx;
                    border-bottom: 1rpx solid #e2e3e5;
                    overflow: hidden;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .flex{
                        font-size: 28rpx;
                        color: #999999;
                        display: flex;
                        align-items: center;
                        .cont{
                            display: flex;
                            flex-wrap: wrap;
                            flex: 1;
                            align-items: center;
                            .spans{
                                display: inline-block;
                                background: #e6f2fe;
                                padding: 0 15rpx;
                                color: #3399ff;
                                font-size: 26rpx;
                                margin-right: 10rpx;
                                border-radius: 2rpx;
                                line-height: 46rpx;
                                margin-top: 10rpx;
                            }
                        }
                        .label{
                            font-size: 28rpx;
                            color: #999999;
                            float: left;
                            width: 120rpx;
                        }
                        .inp{
                            width: 500rpx;
                            color: #333333;
                        }
                        
                    }
                    .icon_box{
                        display: flex;
                        align-items: center;
                        i{
                            color: #3399ff;
                        }
                    }
                }
                .box{
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 2rpx solid #ededed;
                    .inp{
                        color: #999999;
                        // background: #f6f6f6;
                        // width: 100rpx;
                        // text-align: center;
                        // border-radius: 5rpx;
                        // font-size: 26rpx;
                    }
                    .inpzt{
                        font-size: #333333;
                        font-weight: bold;
                    }
                    .icon{
                        margin-right: 30rpx;
                    }
                }
                .rowWrap{
                    display: flex;
                    padding: 20rpx 30rpx;
                    border-bottom: 1rpx solid #ededed;
                }
            }
            .showclass{
                background: #f7f7f7;
                height: 100vh;
            }
            .rows{
                display: flex;
                padding: 20rpx 30rpx;
                .cont{
                    flex: 1;
                    margin-left: 20rpx;
                    p:nth-child(1){
                        font-weight: bold;
                    }
                    p:nth-child(2){
                        font-size: 12px;
                        color: #666666;
                    }
                }
            }
            .rowWrap{
                display: flex;
                padding: 20rpx 30rpx;
                border-bottom: 1rpx solid #ededed;
                p{
                    font-size: 28rpx;
                    color: #999999;
                }
                .col{
                    flex: 1;
                }
            }
            .content{
                padding: 20rpx 30rpx;
                .textarea{
                    width: 100%;
                    font-size: 32rpx;
                }
                .placeholder{
                    font-size: 32rpx;
                    color: #cccccc;
                }
            }
        }
        .bottom{
            width: 100%;
            position: fixed;
            bottom: 60px;
            border-top: 1rpx solid #eceeed;
            overflow: hidden;
            .boxWrap{
                    width: 100%;
                    height: 220rpx;
                    box-sizing: border-box;
                    display: flex;
                    white-space: nowrap;
                    padding: 0 20rpx;
                    .swiper-item{
                        width: 146rpx;
                        height: 146rpx;
                        display: inline-block;
                        // background: red;
                        // margin-right: 10rpx;
                        margin: 20rpx 26rpx 0 0;
                        .imgs{
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: relative;
                            img{
                                width: 146rpx;
                                height: 146rpx;
                                border-radius: 12rpx;
                            }
                            i{
                                position: absolute;
                                top: -8rpx;
                                right: -13rpx;
                                color: #9c9c9c;

                            }
                        }
                        .text{
                            font-size: 10px;
                            color: #333;
                            text-align: center;
                            width: 100%;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        .minText{
                            font-size: 8px;
                            color: #666666;
                            text-align: center;
                        }
                    }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            border-top: 1rpx solid #eceeed;
            .row{
                display: flex;
                padding: 20rpx;
                justify-content: space-between;
                align-items: center;
                div{
                    display: flex;
                    .imgs{
                        width: 49rpx;
                        height: 49rpx;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    i{
                        font-size: 20px;
                        color: #3399ff;
                        margin: 0 30px;
                    }
                }
                .btn{
                    font-size: 28rpx;
                    color: #fff;
                    background: #3399ff;
                    border-radius: 7rpx;
                    width: 110rpx;
                    height: 72rpx;
                    text-align: center;
                    line-height: 72rpx;
                }
            }
        }
        .sheetWrap{
            text-align: center;
            p{
                font-size: 36rpx;
                padding: 30rpx 0;
                color:#333333;
            }
            p:nth-child(2){
                border-top: 1rpx solid #e2e3e5;
                border-bottom: 1rpx solid #e2e3e5;
            }
        }
    }
</style>