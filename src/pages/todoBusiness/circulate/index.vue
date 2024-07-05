<template>
  <div class="wrap">
    <div class="contWrap padding">
      <textarea
        class="textarea"
        v-model="message"
        placeholder="点击输入文字..."
        name
        id
        cols="30"
        rows="10"
      ></textarea>
    </div>
    <!-- <div class="row padding" @click="getAddContacts">
            <p>接收人</p>
            <p><i-icon type="add" size="20" color="#3399ff" /></p>
    </div>-->
    <div class="content">
      <div class="heads" @click="getAddContacts">
        <p>
          {{sign=='W'?'代理人':sign=='JQ'?'办理人':'接收人'}}
          </p>
        <p>
          <span class="people">{{selectListName.length}}人</span>
          <van-icon name="add-o" color="#3399ff" size="20" />
        </p>
      </div>
      <div class="cont" v-if="selectListName.length>0">
        <div class="avatar" v-for="(item,index) in selectListName" :key="index" >
            <p class="canvas">{{item.FullName}}</p>
            <p class="name">{{item.FullName}}</p>
            <span class="close" @click="getDelete(item)">
                <i-icon type="close" color="#fff" size="12" />
            </span>
        </div>
        <!-- <div class="avatar">
          <p class="canvas">李楠</p>
          <p class="name">李楠</p>
          <van-icon name="close" custom-class="icon" size="20" @click="getCloseImg(index)" />
        </div>
        <div class="avatar">
          <p class="canvas">李楠</p>
          <p class="name">李楠</p>
          <van-icon name="close" custom-class="icon" size="20" @click="getCloseImg(index)" />
        </div> -->
      </div>
    </div>
    <div class="footer">
      <div class="box">
        <!-- <van-button custom-class="btn l" plain hairline type="primary">取消</van-button> -->
        <van-button custom-class="btn r" plain hairline type="info" @click="getSubmit">确定</van-button>
      </div>
    </div>
    <van-notify id="van-notify" />
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import Notify from "../../../../static/vant/notify/notify";
export default {
  data() {
    return {
      message: "",
      name: "",
      sessionkey: "",
      id:"",
      sign:"",
      ruleLogId:"",
      processId:"",
      processInstanceId:"",
      ToActivityId:"",
      fromActivityId:""
    };
  },
  computed: {
    ...mapState({
      instanceId: state => {
        return state.user.instanceId;
      },
      selectListName:state=>{
          return state.mailList.selectListName
      },
      selectId:state=>{
          return state.mailList.selectId
      }
    })
  },
  onUnload(){
    this.getClear([]);
  },
  onLoad(options) {
    Object.assign(this.$data, this.$options.data());
    let sessionkey = wx.getStorageSync("sessionkey");
    this.sessionkey = sessionkey;
    this.name = options.name;
    this.id = options.processInstanceId;
    this.sign = options.sign;
    this.ruleLogId = options.ruleLogId;
    this.processInstanceId = options.processInstanceId;
    this.processId = options.processId;
    this.ToActivityId = options.ToActivityId;
    this.fromActivityId = options.fromActivityId;
    if(options.sign=='W'){
      wx.setNavigationBarTitle({
        title: '委托'
      })
    }else if(options.sign=='JQ'){
      wx.setNavigationBarTitle({
        title: '加签'
      })
    }
    else {
      wx.setNavigationBarTitle({
        title: '传阅'
      })
    }
  },
  methods: {
      ...mapMutations([
          'getSingleDelete',
          'getClear'
      ]),
    getForward(){
      let temp = this.selectListName.map(item=>item.id);
      let obj = {
        actions:[
          {
            params:{
              processId:this.processId,
              processInstanceId:this.processInstanceId,
              FromActivityId:this.ToActivityId,
              participators:temp.join(','),
              description:this.message
            }
          }
        ]
      }
      this.$httpWX.post({
            url:this.$api.message.queryList+'?method='+this.$api.instance.entrust,
            data:{
                SessionKey:this.sessionkey,
                message:JSON.stringify(obj)
            }
        }).then(res=>{
            console.log(res);
        })
    },
    // 加签
    getAddparticipator(){
      let temp = this.selectListName.map(item=>item.id);
      let obj = {
        actions:[
          {
            params:{
              processId:this.processId,
              processInstanceId:this.processInstanceId,
              ruleLogId:this.ruleLogId,
              participators:temp,
              fromActivityId:this.fromActivityId,
              description:this.message,
              toActivityId:this.ToActivityId
            }
          }
        ]
      }
      this.$httpWX.post({
        url:this.$api.message.queryList+'?method='+this.$api.instance.addparticipator,
        data:{
          SessionKey:this.sessionkey,
          message:JSON.stringify(obj)
        }
      }).then(res=>{
        console.log(res);
      })
    },
    getSubmit() {
      if(this.sign=='W'){
        this.getForward();
      }else if(this.sign=='JQ'){
        this.getAddparticipator();
      }else{
        this.$httpWX
          .get({
            url: this.$api.message.queryList,
            data: {
              method: "flow.instance.notfiyread",
              SessionKey: this.sessionkey,
              processInstanceId: this.id,
              instanceName: this.name,
              Message: this.message,
              members: this.selectListName.map(item=>item.id).join(',')
            }
          })
          .then(res => {
            // Notify({ type: "primary", message: res.msg });
            this.message = "";
            
          });
      }
      wx.navigateBack({
        delta: 1
      })
    },
    getAddContacts() {
      const url = "/pages/publics/mailList/main";
      wx.navigateTo({ url: url });
    },
    getDelete(item){
        this.getSingleDelete(item.id);
    }
  }
};
</script>
<style lang="scss">
@import "../../../../static/css/public.scss";
.wrap {
  .contWrap {
    background: #fff;
    .textarea {
      width: 100%;
      height: 100px;
      overflow: hidden;
    }
  }
  .content {
    background: #fff;
    margin-top: 20rpx;
    .heads {
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 33rpx;
      color: #666666;
      p:nth-child(2) {
        display: flex;
        align-items: center;
        .people {
          font-size: 31rpx;
          color: #ababab;
          margin-right: 22rpx;
        }
        .round {
          width: 38rpx;
          height: 38rpx;
          line-height: 38rpx;
          text-align: center;
          border-radius: 50%;
          border: 2rpx solid #3399ff;
        }
      }
    }
    .head {
      font-size: 28rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 33rpx;
      color: #666666;
      p:nth-child(2) {
        display: flex;
        align-items: center;
        .people {
          font-size: 31rpx;
          color: #ababab;
          margin-right: 22rpx;
        }
        .round {
          width: 38rpx;
          height: 38rpx;
          line-height: 38rpx;
          text-align: center;
          border-radius: 50%;
          border: 2rpx solid #3399ff;
        }
      }
    }
    .cont {
      padding: 20rpx;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      flex-direction: row;
      .imgWrap {
        width: 100rpx;
        height: 100rpx;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 7rpx;
        }
        .close {
          display: inline-block;
          width: 33rpx;
          height: 33rpx;
          line-height: 33rpx;
          text-align: center;
          background: #9c9c9c;
          position: absolute;
          top: -10rpx;
          right: -10rpx;
          border-radius: 50%;
          opacity: 0.8;
        }
        .img {
          position: absolute;
          top: -10rpx;
          right: -10rpx;
        }
      }
      .avatar {
        width: 50px;
        text-align: center;
        font-size: 28rpx;
        position: relative;
        margin-right: 20rpx;
        .canvas {
          width: 75rpx;
          height: 75rpx;
          line-height: 75rpx;
          border-radius: 50%;
          background: #3399ff;
          font-size: 21rpx;
          text-align: center;
          color: #fff;
          margin: 0 auto;
        }
        .name {
          margin-top: 10rpx;
          font-size: 24rpx;
        }
        .close {
          display: inline-block;
          width: 33rpx;
          height: 33rpx;
          line-height: 33rpx;
          text-align: center;
          background: #9c9c9c;
          position: absolute;
          top: 0;
          right: 0;
          border-radius: 50%;
          opacity: 0.8;
        }
        .icon {
          position: absolute;
          top: 0;
          right: 0;
          color: #9c9c9c;
        }
      }
    }
  }
  .footer {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    .box {
      display: flex;
      justify-content: center;
      padding: 20rpx;
      .btn {
        width: 320px;
      }
      .l {
        background: #f3f3f3;
        color: #333333;
        border: 1rpx solid #dadcdb !important;
      }
      .r {
        background: #3399ff;
        color: #fff;
      }
    }
  }
}
</style>