<template>
  <div class="wrap">
    <div class="container">
        <div class="content">
            <div class="row" v-for="(item,index) in folders" :key="index" @click="getCopyFiles(item)">
                <div class="lBox">
                    <p>
                        <img :src="photoUrl+'Folder.png'" alt="">
                    </p>
                </div>
                <div class="rBox">
                    <h3 class="overflow">{{item.name}}</h3>
                    <p>{{item.createdOn}}</p>
                </div>
            </div>
            <div class="row" v-for="(item,index) in files" :key="index">
                <div class="lBox">
                    <p>
                        <img :src="item.fileExtension=='jpg'?item.link:photoUrl+'rar.png'" alt="">
                    </p>
                </div>
                <div class="rBox">
                    <h3 class="overflow">{{item.name}}</h3>
                    <p>{{item.createdOn}}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="box">
            <p @click="getAddNewFolders">新建文件夹</p>
            <p @click="getSubmit">移动到当前目录</p>
        </div>
    </div>
    <newFolder v-if="newShow" :ParentId="folderId" :newSign="newSign" @changeShow="changeShow" />
  </div>
</template>
<script>
import newFolder from '../../../../components/newFolder';
export default {
  components:{
    newFolder
  },
  data() {
    return {
      name: "",
      files: [],
      folders: [],
      imgList:[],
      copyFileId:"",
      folderId:"",
      strCode:"",
      moveId:"",
      newShow:false,
      newSign:0,
      sessionkey:""
    };
  },
  onLoad(options) {
    let sessionkey = wx.getStorageSync('sessionkey');
    this.sessionkey = sessionkey;
    this.name = options.name;
    this.folderId = options.id;
    this.strCode = options.str;
    this.moveId = options.moveId;
    wx.setNavigationBarTitle({
      title: this.name
    });
    this.getQuery();
  },
  computed:{
    photoUrl(){
      return this.$api.photo.url;
    }
  },
  methods: {
    changeShow(isBook){
      this.newShow = isBook;
      this.getQuery();
    },
    getAddNewFolders(){
      this.newShow = true;
    },
    getQuery() {
        this.$httpWX.get({
            url:this.$api.message.queryList,
            data:{
                method:this.$api.usb.filesQuery,
                SessionKey:this.sessionkey,
                folderid:this.folderId
            }
        }).then(res=>{
            console.log(res);
            this.files = res.files;
            this.files.forEach(item=>{
                if(item.fileExtension=='jpg'){
                    this.imgList.push(item.link);
                }
            })
            this.folders = res.folders;
        })
    },
    getSubmit(){
        this.$httpWX.get({
            url:this.$api.message.queryList,
            data:{
                method:this.$api.usb.directoryfileMove,
                SessionKey:this.sessionkey,
                Id:this.moveId,
                targetFolderId:this.folderId,
                ObjectTypeCode:this.strCode=="folders"?"100200":"100100"
            }
        }).then(res=>{
            console.log(res,'move')
            let that = this;
            wx.showToast({
                title:res.msg,
                icon:'success',
                duration:2000,
                success:res=>{
                    that.getQuery();
                }
            })
        })
    },
    // getCopyFiles(item){
    //   const url = '/pages/usbDrive/myFile/twoMoveFile/main?id='+item.id+'&name='+item.name;
    //   wx.navigateTo({url:url});
    // }
  }
};
</script>
<style lang="scss">
@import "../../../../../static/css/public.scss";
.wrap {
    .container{
        padding-bottom: 80px;
    }
  .content {
    .row {
      display: flex;
      background: #fff;
      padding: 0 30rpx;
      align-items: center;
      .lBox {
        padding: 20rpx 0;
        p {
          width: 80rpx;
          height: 80rpx;
          img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
          }
        }
      }
      .rBox {
        flex: 1;
        margin-left: 20rpx;
        border-bottom: 1rpx solid #f6f6f6;
        padding: 20rpx 0;
        h3 {
          font-size: 28rpx;
        }
        p {
          font-size: 12px;
          color: #999999;
        }
      }
    }
    .row:last-child .rBox {
      border: none;
    }
  }
  .footer{
        width: 100%;
        position: fixed;
        bottom: 20px;
        background: #fff;
        .box{
            display: flex;
            justify-content: space-between;
            padding: 31rpx;
            color: #3399ff;
            font-size: 29rpx;
        }
    }
}
</style>