<template>
  <div class="wrap">
    <div class="center">
      <div class="header">
        <div class="rowBtn">
          <p class="save" @click="getSendOut('0','save')">保存</p>
          <p class="send" :class="{'active':nameList!=''}" @click="nameList!=''?getSendOut('1'):''">发送</p>
        </div>
        <!-- <div class="box">
          <div class="flex">
            <span class="label">群组：</span>
            <span
              class="spans"
              v-if="nameList!=''"
              v-for="(item,index) in nameList"
              :key="index"
            >{{item.name}}</span>
            <i class="iconfont icon-quxiao1" v-if="nameList!=''" @click="getDeleteName"></i>
          </div>
          <div class="input">
            <input type="text" :value="name" :auto-focus="true" @input="changeName" />
            <i class="iconfont icon-tianjia1" v-if="name==''" @click="getAddContacts"></i>
          </div>
        </div> -->
        <div class="boxWrap">
          <div class="flex">
            <div class="cont">
              <span>群组：</span>
              <span
                class="spans"
                v-if="nameList!=''"
                v-for="(item,index) in nameList"
                :key="index"
              >{{item.name}}</span>
              <i class="iconfont icon-quxiao2" v-if="nameList!=''" @click="getDeleteName"></i>
              <input type="text" :value="name" :auto-focus="isFocus" @input="changeName" />
            </div>
          </div>
          <div class="icon_box">
            <i class="iconfont icon-tianjia1" @click.stop="getAddContacts"></i>
          </div>
        </div>
        <div class="theme" v-if="!isShow">
          <van-field
            custom-style="color:#999;"
            input-class="inp"
            title-width="50px"
            label="主题："
            :value="subject"
            :border="false"
            @change="changeSubject"
          />
          <i class="iconfont icon-fujian" @click="getEnclosure"></i>
        </div>
      </div>
      <div v-if="isShow">
        <div class="rows" v-for="(item,index) in list" :key="index" @click="getSelect(item)">
          <div class="name">
            <p class="radius">{{item.quantity}}</p>
          </div>
          <div class="cont">
            <p>{{item.value}}</p>
            <p>{{item.quantity}}人</p>
          </div>
        </div>
      </div>
      <div class="content" v-if="!isShow">
        <textarea
          class="textarea"
          placeholder-class="placeholder"
          v-model="mailBody"
          placeholder="输入正文..."
          name
          id
          :auto-height="true"
          cols="100"
          rows="10"
          maxlength="100000"
        ></textarea>
      </div>
    </div>
    <div class="bottom">
      <div class="boxWrap">
        <scroll-view scroll-x="true" style="display: flex;width: 100%">
          <div class="swiper-item" v-for="(item,index) in fileList" :key="index">
            <p class="imgs">
              <img :src="item.link" alt />
              <i class="iconfont icon-quxiao2" @click="getDeleteFile(item,index)"></i>
            </p>
            <p class="text">023904.jpg</p>
            <p class="minText">6.42M</p>
          </div>
        </scroll-view>
      </div>
    </div>
    <!-- <div class="footer">
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
import {mapState, mapMutations} from 'vuex';
export default {
    data(){
        return {
            isFocus:false,
            isShow:false,
            name:"",
            subject:"",
            mailBody:"",
            list:[
            ],
            fileList:[],
            temp:[],
            nameList:[],
            sessionkey:"",
            sheetShow:false,
            EmailId:""
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        this.clearGroup([]);
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.isFocus = true;
        this.getQuery();
    },
    computed:{
        ...mapState({
            groupList:state=>{
                console.log(state.mailList.groupList);
                return state.mailList.groupList
            },
            selectFiles:state=>{
                return state.usb.selectFiles;
            }
        }),
        fileids(){
            let temp = [];
            this.fileList.forEach(item=>{
                if(item.id){
                    temp.push(item.id);
                }
            })
            return temp.join(',');
        },
        pathUrl(){
            return this.$api.pathUrl
        }
    },
    onShow(){
        this.nameList = this.groupList;
        this.fileList = this.fileList.concat(this.selectFiles);
        if(this.fileList!=''){
            this.getSendOut('0').then(res=>{
                this.getUploadFile(this.EmailId);
            });
        }
    },
    onUnload(){
        this.clearGroup([]);
    },
    methods:{
        ...mapMutations([
            'getDelGroup',
            'clearGroup',
            'delete'
        ]),
        // 附件
        getEnclosure(){
            this.sheetShow = true;
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
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.email.contactSearch,
                    SessionKey:this.sessionkey,
                    tag:this.name,
                    IsGroup:true
                }
            }).then(res=>{
                this.list = res;
            })
        },
        changeSubject(e){
            this.subject = e.mp.detail;
        },
        changeName(e){
            this.name = e.mp.detail.value;
            let length = this.name.length;
            if(length>=2){
                this.getQuery();
                this.isShow = true;
            }
            if(this.name == ''){
                this.isShow = false;
            }
        },
        getSelect(item){
            let groupId = item.key;
            let name = item.value;
            this.temp.push({
                groupId:groupId,
                name:name
            })
            this.nameList = this.unique(this.temp);
            this.isShow = false;
            this.name = '';
        },
        unique(arr) { // 根据唯一标识orderId来对数组进行过滤
    　　　　　　const res = new Map();  //定义常量 res,值为一个Map对象实例
    　　　　　　//返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
    　　　　　　return arr.filter((arr) => !res.has(arr.groupId) && res.set(arr.groupId, 1)) 
        },
        getDeleteName(){
            let index = this.nameList.length-1;
            this.nameList.splice(index,1);
            this.getDelGroup(this.nameList[index].id);
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
        getAddContacts(){
            const url = "/pages/publics/pubGroup/main";
            wx.navigateTo({url:url});
        },
        getSendOut(emailStatus,str){
            let toGroupIds = [];
            this.nameList.forEach(item=>{
                toGroupIds.push(item.id);
            })
            toGroupIds = toGroupIds.join(',');
            return new Promise((resolve,reject)=>{
                this.$httpWX.post({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.email.send,
                        SessionKey:this.sessionkey,
                        subject:this.subject,
                        mailBody:this.mailBody,
                        toGroupIds:toGroupIds,
                        priority:0,
                        emailStatus:emailStatus,
                        id:this.EmailId
                    }
                }).then(res=>{
                    console.log(res);
                    if(emailStatus==0){
                        this.EmailId = res.data[0].EmailId;
                        if(str=='save'){
                            wx.showToast({
                                title:"保存草稿成功",
                                icon:"none",
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
                    }else {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                    resolve();
                    
                })
            })
        },
        getUpan(){
            this.sheetShow = false;
            const url = '/pages/uPan/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
@import "../../../../static/css/public.scss";
@import "../../../../static/css/emaiIcon.css";
page {
  background: #fff;
}
.wrap {
  .center {
    width: 100%;
    padding-bottom: 80px;
    .header {
      .rowBtn {
        display: flex;
        justify-content: space-between;
        padding: 32rpx 33rpx;
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
      .box {
        padding: 10rpx 33rpx;
        border-bottom: 1rpx solid #ededed;
        overflow: hidden;
        .flex {
          float: left;
          font-size: 28rpx;
          color: #999999;
          display: flex;
          align-items: center;
          .label {
          }
          .spans {
            display: inline-block;
            background: #f6f6f6;
            padding: 10rpx 15rpx;
            color: #666666;
            font-size: 26rpx;
            margin-right: 10rpx;
            border-radius: 2rpx;
          }
        }
        .input {
          display: flex;
          align-items: center;
          input {
            flex: 1;
          }
          i {
            color: #3399ff;
          }
        }
      }
      .boxWrap {
        padding: 20rpx 33rpx;
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
      .theme {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2rpx solid #ededed;
        padding-right: 30rpx;
      }
    }
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
    }
    .rowWrap {
      display: flex;
      padding: 20rpx 30rpx;
      border-bottom: 1rpx solid #ededed;
      p {
        font-size: 28rpx;
        color: #999999;
      }
      .col {
        flex: 1;
      }
    }
    .content {
      padding: 20rpx 30rpx;
      .textarea {
        width: 100%;
        font-size: 32rpx;
      }
      .placeholder {
        font-size: 32rpx;
        color: #cccccc;
      }
    }
  }
  .bottom {
    width: 100%;
    position: fixed;
    bottom: 60px;
    // border-top: 1rpx solid #eceeed;
    overflow: hidden;
    .boxWrap {
      width: 100%;
      height: 220rpx;
      box-sizing: border-box;
      display: flex;
      white-space: nowrap;
      padding: 0 20rpx;
      .swiper-item {
        width: 162rpx;
        height: 162rpx;
        display: inline-block;
        // background: red;
        // margin-right: 10rpx;
        margin: 10rpx 10rpx 10rpx 0;
        .imgs {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          img {
            width: 90%;
            height: 150rpx;
          }
          i {
            position: absolute;
            top: -5rpx;
            right: -5rpx;
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
    background: #fff;
    .row {
      display: flex;
      padding: 20rpx;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        .imgs {
          width: 49rpx;
          height: 49rpx;
          img {
            width: 100%;
            height: 100%;
          }
        }
        i {
          font-size: 20px;
          color: #3399ff;
          margin: 0 30px;
        }
      }
      .btn {
        font-size: 28rpx;
        color: #fff;
        background: #3399ff;
        border-radius: 7rpx;
        width: 110rpx;
        height: 67rpx;
        text-align: center;
        line-height: 67rpx;
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