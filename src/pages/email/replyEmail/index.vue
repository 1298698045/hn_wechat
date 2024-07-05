<template>
  <div class="wrap">
    <div class="container">
      <div class="header">
        <div class="rowBtn">
          <p class="save" @click="getSendOut('0','save')">保存</p>
          <p class="send" @click="getSendOut('1')">发送</p>
        </div>
        <div class="boxWrap" @click="getaddShow">
          <div class="flex">
            <div class="cont">
              <span>收件人：</span>
              <span
                class="spans"
                v-if="nameList!=''"
                v-for="(item,index) in nameList"
                :key="index"
              >{{item.name}}</span>
              <i class="iconfont icon-quxiao2" v-if="nameList!=''" @click="getDeleteName"></i>
              <input
                type="text"
                :class="{'active':nameList!=''}"
                :value="name"
                :auto-focus="isFocus"
                @input="changeName"
              />
            </div>
          </div>
          <div class="icon_box">
            <i class="iconfont icon-tianjia1" v-if="addShow" @click.stop="getAddContacts"></i>
          </div>
        </div>
        <div class="showclass" v-if="isShow">
          <div class="rows" v-for="(item,index) in list" :key="index" @click="getSelect(item)">
            <div class="name">
              <p class="radius">{{item.name || ''}}</p>
            </div>
            <div class="cont">
              <p>{{item.FullName || ''}}</p>
              <p>{{item.TelPhone || ''}}</p>
            </div>
          </div>
        </div>
        <!-- <p class="clas" v-for="(item,index) in info.toUsers" :key="index">
          收件人：
          <span>{{item.name}}</span>
        </p> -->
        <p class="clas">抄送/密送，发件人：{{info.fromName}}</p>
        <!-- <p class="clas" >主题：<span class="bold">回复：{{info.subject}}</span>
                    
        </p>-->
        <div class="boxWraps">
          <div class="flex">
            <span class="label">主题：</span>
            <span class="bold">回复：{{info.subject}}</span>
          </div>
          <div class="input">
            <i class="iconfont icon-fujian" style="color:#999999;" @click="getFujian"></i>
          </div>
        </div>
      </div>
      <div class="boxText">
        <textarea name auto-focus="auto" v-model="mailBody" id cols="30" rows="10"></textarea>
      </div>
      <div class="content">
        <h3>-------------原始邮件-------------</h3>
        <div class="contBox">
          <p>
            发件人：
            <span>{{info.fromName}}</span>
          </p>
          <p>
            发送时间：
            <span>{{info.createdOn}}</span>
          </p>
          <p v-for="(item,index) in info.toUsers" :key="index">
            收件人：
            <span>{{item.name}}</span>
          </p>
          <p>
            主题：
            <span>回复：{{info.subject}}</span>
          </p>
        </div>
      </div>
      <!-- <h3>{{content}}</h3> -->
      <div class="wxParse">
        <wxParse :content="content" v-if="content!=''" />
      </div>
    </div>
    <div class="bottom" v-if="fileList!=''">
      <div class="boxWrap">
        <scroll-view scroll-x="true" style="display: flex;width: 100%">
          <div class="swiper-item" v-for="(item,index) in fileList" :key="index">
            <p class="imgs" @click="getPreviewImg(item,index)">
              <img v-if="item.fileExtension=='jpg'||item.fileExtension=='png'" :src="item.link" alt />
              <img v-if="item.fileExtension=='rar'" :src="photoUrl+'rar.png'" alt />
              <img v-if="item.fileExtension=='txt'" :src="photoUrl+'02.3.1.Txt.png'" alt />
              <img v-if="item.fileExtension=='pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt />
              <img v-if="item.fileExtension=='ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt />
              <img v-if="item.fileExtension=='word'" :src="photoUrl+'word.png'" alt />
              <!-- <img :src="item.link" alt=""> -->
              <i class="iconfont icon-quxiao2" @click="getDeleteFile(item,index)"></i>
            </p>
            <p class="text">023904.jpg</p>
            <p class="minText">6.42M</p>
          </div>
        </scroll-view>
      </div>
    </div>
    <!-- <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="row">
                <p>
                    <i class="iconfont icon-paizhao1"></i>
                    <i class="iconfont icon-tupian1" @click="getPhoto"></i>
                    <i class="iconfont icon-youpan1"></i>
                </p>
                <p class="sendout" @click="getSendOut('1')">发送</p>
            </div>
    </div>-->
    <van-action-sheet :show="sheetShow" cancel-text="取消" @close="onClose" @cancel="onClose">
      <div class="sheetWrap">
        <p @click="getUpan">优盘</p>
        <p @click="getphotograph">拍照</p>
        <p @click="getPhoto">从手机相册选择</p>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import wxParse from 'mpvue-wxparse';
import {mapState,mapMutations,mapGetters} from 'vuex';
export default {
    components:{
        wxParse
    },
    data(){
        return {
            emailId:"",
            info:"",
            fromName:"",
            ltags:"",
            content:"",
            mailBody:"",
            sessionkey:"",
            // EmailId:"",
            fileList:[],
            sheetShow:false,
            nameList:[],
            addShow:true,
            name:"",
            isShow:false,
            list:[],
            temp:[]
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        ...mapState({
            selectFiles:state=>{
                return state.usb.selectFiles;
            },
            selectListName:state=>{
                return state.mailList.selectListName
            }
        }),
        // ...mapGetters([
        //     'filterList'
        // ]),
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
        photoUrl(){
            return this.$api.photo.url;
        }
    },
    onShow(){
      debugger
        this.nameList =this.nameList.concat(this.selectListName);
        this.nameList = this.nameList.map(item=>({
            id:item.id,
            name:item.FullName
        }))
        this.nameList = this.unique(this.nameList);
        this.fileList = this.fileList.concat(this.selectFiles);
        if(this.fileList!=''){
            this.getSendOut('0').then(res=>{
                this.getUploadFile(this.EmailId);
            });
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.emailId = options.emailId;
        this.ltags = options.ltags;
        this.getQuery();
        this.contentDetail();
        this.getRespond();
    },
    onUnload(){
        this.getClear([]);
        this.clearFile([]);
    },
    methods:{
        getDeleteName(){
            let index = this.nameList.length-1;
            this.nameList.splice(index,1);
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
        getSelect(item){
            if(this.name!=''){
                this.temp.push({
                    name:item.FullName,
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
        ...mapMutations([
            'getSign',
            'getClear',
            'clearFile'
        ]),
        getAddContacts(){
            this.getSign('writeMail');
            const url = "/pages/publics/mailList/main";
            wx.navigateTo({url:url});
        },
        unique(arr) { // 根据唯一标识orderId来对数组进行过滤
　　　　　　const res = new Map();  //定义常量 res,值为一个Map对象实例
　　　　　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
　　　　　　return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1)) 
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
                    const name = item.FullName.substr(1);
                    item.name = name;
                    return item;
                })
            })
        },
        getFujian(){
            this.sheetShow = true;
        },
        onClose(){
            this.sheetShow = false;
        },
        getUpan(){
            this.sheetShow = false;
            const url = '/pages/uPan/main';
            wx.navigateTo({url:url});
        },
        getRespond(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.respond,
                    SessionKey:this.sessionkey,
                    id:this.emailId
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.infoGet,
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    ltags:this.ltags
                }
            }).then(res=>{
                this.info = res.data;
                this.nameList = res.data.toUsers;
                this.fromName = this.info.fromName.substr(1);
            })
        },
        contentDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.contentbody,
                    SessionKey:this.sessionkey,
                    id:this.emailId,
                    ltags:this.ltags
                }
            }).then(res=>{
                this.content = `<div>${res}</div>`;
            })
        },
        // 预览图片
        getPreviewImg(item,index){
            console.log(this.filesImgs,'123123')
            wx.previewImage({
                urls:this.filesImgs,
                current:item.link,
                success:res=>{
                    console.log(res,'success');
                }
            })
        },
        getDeleteFile(item,index){
            console.log(item);
            this.fileList.splice(index,1);
            if(item.id){
                this.delete(item.id);
            }
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
            'clearFile',
            'delete'
        ]),
        getPhoto(){
            this.sheetShow = false;
            this.getSendOut('0').then(()=>{
                let that = this;
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
                        let url = `${that.$api.upload.url}?method=${that.$api.email.upload}&SessionKey=${that.sessionkey}&pid=${that.EmailId}`;
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
        getSendOut(emailStatus,str){
            return new Promise((resolve,rejcet)=>{
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.email.send,
                        SessionKey:this.sessionkey,
                        subject:this.info.subject,
                        mailBody:this.mailBody,
                        // toUserids:this.UserId,
                        emailStatus:emailStatus,
                        priority:0,
                        attachfileids:"",
                        id:this.emailId
                    }
    
                }).then(res=>{
                    console.log(res);
                    if(emailStatus=='1'){
                        wx.showToast({
                            title:"发送成功",
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
                    }else if(emailStatus=='0'){
                        this.emailId = res.data[0].EmailId;
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
                    resolve();
                })
            })
        }
    }
}
</script>
<style lang="scss">
// @import '../../../../static/css/public.scss';
@import "../../../../static/css/emaiIcon.css";
page {
  background: #fff;
}
.wrap {
  .container {
    padding-bottom: 200px;
    .header {
      background: #fff;
      padding: 0 30rpx;
      .rowBtn {
        display: flex;
        justify-content: space-between;
        padding: 32rpx 0;
        border-bottom: 1rpx solid #ededed;
        .save {
          font-size: 34rpx;
          color: #3399ff;
        }
        .send {
          font-size: 34rpx;
          color: #999999;
        }
        .send.active {
          color: #3399ff;
        }
      }
      .boxWrap {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #e2e3e5;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .flex {
          font-size: 28rpx;
          color: #999999;
          display: flex;
          align-items: center;
          .cont {
            display: flex;
            flex-wrap: wrap;
            flex: 1;
            align-items: center;
            .spans {
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
          .label {
            font-size: 28rpx;
            color: #999999;
            float: left;
            width: 120rpx;
          }
          .inp {
            width: 500rpx;
            color: #333333;
          }
        }
        .icon_box {
          display: flex;
          align-items: center;
          i {
            color: #3399ff;
          }
        }
      }
      .showclass {
        background: #f7f7f7;
        height: 100vh;
        .rows {
          display: flex;
          padding: 20rpx 30rpx;
          .cont {
            flex: 1;
            margin-left: 20rpx;
            p:nth-child(1) {
              font-weight: bold;
            }
            p:nth-child(2) {
              font-size: 12px;
              color: #666666;
            }
          }
          .name{
            .radius{
                width: 80rpx;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 26rpx;
                color: #ffffff;
                border-radius: 50%;
                text-align: center;
                background: #3399ff;
            }
          }
        }
      }
      .clas {
        font-size: 28rpx;
        color: #999999;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #ededed;
        span {
          color: #666666;
        }
        .bold {
          color: #333333;
          font-weight: bold;
        }
      }
      .boxWraps {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #ededed;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        .label {
          font-size: 28rpx;
          color: #999999;
        }
        .bold {
          font-weight: bold;
          font-size: 32rpx;
        }
      }
      // p:last-child{
      //     border: none;
      // }
    }
    .boxText {
      padding: 20rpx 30rpx;
      background: #fff;
      textarea {
        width: 100%;
      }
    }
    .content {
      width: 100%;
      background: #fff;
      h3 {
        font-size: 10px;
        color: #333333;
        padding: 30rpx;
      }
      .contBox {
        width: 85%;
        margin: 0 auto;
        padding: 20rpx 30rpx;
        background: #f4f4f4;
        border-radius: 10px;
        p {
          font-size: 24rpx;
          color: #333333;
          font-weight: bold;
          span {
            font-weight: normal;
          }
        }
      }
    }
    h3 {
      padding: 30rpx;
    }
    .wxParse {
      padding: 30rpx;
    }
  }
  .bottom {
    width: 100%;
    position: fixed;
    bottom: 0;
    border-top: 1rpx solid #eceeed;
    overflow: hidden;
    .boxWrap {
      width: 100%;
      height: 220rpx;
      box-sizing: border-box;
      display: flex;
      white-space: nowrap;
      padding: 0 20rpx;
      .swiper-item {
        width: 146rpx;
        height: 146rpx;
        display: inline-block;
        // background: red;
        // margin-right: 10rpx;
        margin: 20rpx 26rpx 0 0;
        .imgs {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          img {
            width: 146rpx;
            height: 146rpx;
            border-radius: 12rpx;
          }
          i {
            position: absolute;
            top: -8rpx;
            right: -13rpx;
            color: #9c9c9c;
          }
        }
        .text {
          font-size: 10px;
          color: #333;
          text-align: center;
        }
        .minText {
          font-size: 8px;
          color: #666666;
          text-align: center;
        }
      }
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    border-top: 1rpx solid #eceeed;
    .row {
      display: flex;
      padding: 20rpx;
      justify-content: space-between;
      align-items: center;
      p:nth-child(1) {
        // .icon{
        //     margin-right: 40rpx;
        // }
        display: flex;
        width: 200rpx;
        justify-content: space-between;
        i {
          color: #3399ff;
          font-size: 20px;
        }
      }
      p:nth-child(2) {
        padding: 10rpx 30rpx;
        font-size: 28rpx;
        color: #fff;
        background: #3399ff;
        border-radius: 5rpx;
      }
    }
  }
  .sheetWrap {
    text-align: center;
    p {
      font-size: 36rpx;
      padding: 30rpx 0;
      color: #333333;
    }
    p:nth-child(2) {
      border-top: 1rpx solid #e2e3e5;
      border-bottom: 1rpx solid #e2e3e5;
    }
  }
}
</style>