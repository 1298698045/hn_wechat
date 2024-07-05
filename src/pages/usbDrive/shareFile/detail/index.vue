<template>
  <div class="wrap">
    <div class="nav">
      <p class="publicfile">公共文件</p>
      <p class="jurisdiction">权限设置：绍兴第二医院</p>
    </div>
    <div class="search">
      <van-search :value="value" placeholder="搜索" />
    </div>
    <div class="header">
      <h3 v-if="electionShow">选择一下文件</h3>
      <div v-if="!electionShow">
        <picker class="pickers" v-model="columnIdx" :range="column" @change="changeColumn">
          <p>
            {{column[columnIdx]}}
            <i-icon type="unfold" />
          </p>
        </picker>
      </div>
      <div v-if="!electionShow">
        <p>
          <i
            class="iconfont icon-quanxuan icon"
            :class="{'active':electionShow==true}"
            @click="getSelectFile"
          ></i>
        </p>
        <p>
          <i
            class="iconfont icon-shaixuan icon"
            :class="{'active':electionShow==true}"
            @click="getScreen"
          ></i>
        </p>
      </div>
    </div>
    <div class="center">
      <van-checkbox-group :value="result" @change="changeGroup">
        <!-- folders -->
        <div
          class="content"
          :class="electionShow?'contentActive':''"
          @click="getOpen"
          v-for="(item,index) in folders"
          :key="index"
        >
          <div class="radioWrap" v-if="electionShow">
            <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
          </div>
          <div class="img">
            <p @click="getOpenFolder(item)">
              <img :src="photoUrl+'Folder.png'" alt />
            </p>
          </div>
          <div class="cont">
            <div @click="getOpenFolder(item)">
              <p class="title">{{item.name}}</p>
              <p class="text">{{item.createdOn}}</p>
            </div>
            <p class="icon">
              <i class="iconfont icon-gengduo" @click="getEditFile(item,'folders')"></i>
            </p>
          </div>
        </div>
        <!-- files -->
        <div
          class="content"
          :class="electionShow?'contentActive':''"
          v-for="(item,index) in files"
          :key="index"
        >
          <div class="radioWrap" v-if="electionShow">
            <van-checkbox :name="item.id+item.str" custom-class="radio"></van-checkbox>
          </div>
          <div class="img">
            <p @click="getPreviewImage(item.link)">
              <img :src="item.fileExtension=='jpg'?item.link:photoUrl+'rar.png'" alt />
            </p>
          </div>
          <div class="cont">
            <div>
              <p class="title information-title">{{item.name}}.{{item.fileExtension}}</p>
              <p class="text">{{item.createdOn}}</p>
            </div>
            <p class="icon">
              <i class="iconfont icon-gengduo" @click="getEditFile(item,'files')"></i>
            </p>
          </div>
        </div>
      </van-checkbox-group>
    </div>
    <div class="clues-add-button" v-if="!showSheet&&!electionShow" @click="onCluesAddBtnClick">+</div>
    <div class="footer" v-if="electionShow">
        <div class="operation">
            <p class="cancel" @click="getCancelAll">取消</p>
            <p class="all" @click="getSelectAll" v-if="resultId==''">全选</p>
            <p class="all" v-if="resultId!=''" @click="getAllCancel">取消全选</p>
            <p class="move" :class="{'active':result!=''}">移动</p>
            <p class="delete" @click="getDeleteFile" :class="{'active':result!=''}">删除</p>
        </div>
    </div>
    <newFolder
      v-if="newShow"
      :ParentId="Folderid"
      :str="str"
      :newSign="newSign"
      @changeShow="changeShow"
    />
    <van-action-sheet
      :show="showSheet"
      :actions="actions"
      @close="onClose"
      @select="onSelect"
      :round="false"
    />
    <!-- 编辑文件 -->
    <van-action-sheet
      z-index="10000"
      @close="getEditClose"
      :round="false"
      safe-area-inset-bottom
      cancel-text="取消"
      @cancel="getEditCancel"
      :show="editSheet"
    >
      <div class="editSheet">
        <div class="headers">
          <div class="imgBox">
            <img :src="photoUrl+'Folder.png'" alt />
          </div>
          <div class="textWrap">
            <p class="overflow">{{fileName}}</p>
            <p>{{createdByName}} {{createdOn}}</p>
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
  </div>
</template>
<script>
import newFolder from "../../../../components/newFolder";
export default {
  components: {
    newFolder
  },
  data() {
    return {
      columnIdx: 0,
      column: ["名称排序", "时间排序"],
      actions: [
        {
          id: 1,
          name: "上传文件"
        },
        {
          id: 2,
          name: "新建文件"
        }
      ],
      sort: "Name",
      showSheet: false,
      electionShow: false,
      Folderid: "",
      newShow: false,
      files: [],
      folders: [],
      str: "",
      fileId: "",
      fileName: "",
      createdByName: "",
      createdOn: "",
      editSheet: false,
      sessionkey:""
    };
  },
  onLoad(options) {
    let sessionkey = wx.getStorageSync('sessionkey');
    this.sessionkey = sessionkey;
    this.Folderid = options.Folderid;
    this.getQuery();
  },
  computed:{
    photoUrl(){
      return this.$api.photo.url;
    }
  },
  methods: {
    changeShow(isBook) {
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
            method: "file.files.search",
            SessionKey: this.sessionkey,
            srchType: "share",
            sort: this.sort,
            Folderid: this.Folderid
          }
        })
        .then(res => {
          this.files = res.files;
          this.folders = res.folders;
          this.files.forEach(item => {
            this.$set(item, "str", " files");
            if (item.fileExtension == "jpg") {
              this.imgList.push(item.link);
            }
          });
          this.folders.forEach(item => {
            this.$set(item, "str", " folders");
          });
        });
    },
    onCluesAddBtnClick() {
      this.showSheet = true;
    },
    onClose() {
      this.showSheet = false;
    },
    onSelect(e) {
      let id = e.mp.detail.id;
      if (id == 2) {
        this.str = "folders";
        this.newSign = 0;
        this.fileName = "";
        this.fileId = "";
        this.newShow = true;
      } else if (id == 1) {
        // this.getOpenPhoto();
      }
    },
    changeColumn(e) {
      this.columnIdx = e.mp.detail.value;
      if (this.columnIdx == 0) {
        this.sort = "Name";
        // this.isTime = false;
      } else if (this.columnIdx == 1) {
        this.sort = "Createdon";
        // this.isTime = true;
      }
      this.getQuery();
    },
    // 选择文件
    getSelectFile() {
      this.electionShow = !this.electionShow;
      if (this.electionShow) {
        wx.setNavigationBarTitle({
          title: "已选择"
        });
      } else {
        wx.setNavigationBarTitle({
          title: "我的文件"
        });
      }
    },
    getEditFile(item, str) {
      this.str = str;
      this.fileName = item.name;
      this.createdByName = item.createdByName;
      this.createdOn = item.createdOn;
      this.editSheet = true;
    },
    getEditClose(){
        this.editSheet = false;
    },
    getEditCancel(){
        this.editSheet = false;
    }
  }
};
</script>
<style lang="scss">
@import "../../../../../static/css/public.scss";
.wrap {
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
  .header {
    padding: 33rpx;
    background: #fff;
    font-size: 24rpx;
    color: #3399ff;
    display: flex;
    justify-content: space-between;
    h3 {
      font-size: 26rpx;
      color: #999999;
    }
    div:nth-child(2) {
      display: flex;
      .icon.active {
        color: #a4a4a4;
      }
      p:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
  .center {
    padding-bottom: 120rpx;
    .content.contentActive {
      padding: 0 33rpx;
    }
    .content {
      background: #fff;
      display: flex;
      padding: 0 33rpx 0 0;

      .radioWrap {
        .radio {
          margin-top: 20px;
        }
      }
      .img {
        padding: 20rpx 0;
        margin-left: 33rpx;
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
      .cont {
        margin-left: 15px;
        flex: 1;
        display: flex;
        justify-content: space-between;
        border-bottom: 1rpx solid #f6f6f6;
        padding: 20rpx 0;
        .title {
          width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .text {
          font-size: 12px;
          color: #999999;
        }
        .icon {
          .iconfont {
            margin-top: 20rpx;
            color: #a4a4a4;
            font-size: 20px;
          }
        }
      }
    }
  }
  .editSheet {
    width: 100%;
    overflow: hidden;
    .headers {
      padding: 30rpx;
      border-bottom: 1rpx solid #e2e4e3;
      display: flex;
      .imgBox {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .textWrap {
        margin-left: 20rpx;
        p:nth-child(1) {
          font-size: 28rpx;
        }
        p:nth-child(2) {
          font-size: 12px;
          color: #999999;
        }
      }
    }
    .content {
      padding: 0 30rpx;
      p {
        font-size: 28rpx;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #e2e4e3;
      }
      p:last-child {
        border: none;
      }
    }
  }
   .footer{
       width: 100%;
        position: fixed;
        bottom: 20px;
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