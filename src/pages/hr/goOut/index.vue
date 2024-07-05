<template>
  <div class="wrap">
    <van-tabs :active="current" color="#3399ff" @change="onChange">
      <van-tab title="发起提交"></van-tab>
      <van-tab title="查看数据"></van-tab>
    </van-tabs>
    <div class="container" v-if="current==0">
      <div class="content">
        <div class="row">
          <p class="label">
            外出人员
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入外出人员'"
            />
          </p>
        </div>
        <div class="row">
          <p class="label">
            所属部门
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入申请部门'"
            />
          </p>
        </div>
        <picker
          @change="pickerStartTime"
          mode="multiSelector"
          :value="multiIndex"
          :range="newMultiArray"
        >
          <div class="row">
            <p class="label">
              开始时间
              <span>*</span>
            </p>
            <p class="name">
              <span>{{startTime}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <picker
          @change="pickerEndTime"
          mode="multiSelector"
          :value="endMultiIndex"
          :range="newMultiArray"
        >
          <div class="row">
            <p class="label">
              截止时间
              <span>*</span>
            </p>
            <p class="name">
              <span>{{endTime}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <div class="row">
          <p class="label">
            时长
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入时长'"
            />
          </p>
        </div>
      </div>
      <div class="leaveComment">
        <p>
          外出事由
          <span>*</span>
        </p>
        <div class="box">
          <textarea name id cols="30" rows="10"></textarea>
        </div>
      </div>
      <div class="imgContent">
        <div class="head" @click="handleSelPhoto">
          <p>图片</p>
          <p>
            <i class="iconfont icon-tupian"></i>
          </p>
        </div>
        <div class="cont" v-if="imgList!=''">
          <p class="imgWrap" v-for="(item,index) in imgList" :key="index">
            <img :src="item" alt />
            <span class="close" @click="getCloseImg(index)">
              <i-icon type="close" color="#fff" size="12" />
            </span>
          </p>
        </div>
      </div>
      <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
          <div class="btn">
              <van-button type="info" block @click="getSubmit">提交</van-button>
          </div>
      </div>
    </div>
    <div class="dataWrap" v-if="current==1">
      <div class="search">
        <van-search :value="value" placeholder="搜索标题、编号、正文内容" />
      </div>
      <div class="contentList">
        <div class="box_wrap">
          <div class="row">
            <p class="title">XX提交的请假</p>
            <div class="time">2020-10-10</div>
          </div>
          <p class="desc">请假类型：年假</p>
          <p class="desc">开始时间：2002-10-10 上午</p>
          <p class="desc">结束时间：2002-10-10 下午</p>
          <div class="tagFot">
            <p class="tag">
              <span>测试</span>
              由XX提交
            </p>
            <p class="status">XXX处理中</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTotal } from '@/utils/iDays';
export default {
  data() {
    return {
      leaveIdx: "",
      leaveList: [
        {
          id: "",
          name: "年假"
        },
        {
          id: "",
          name: "事假"
        },
        {
          id: "",
          name: "病假"
        },
        {
          id: "",
          name: "调休"
        },
        {
          id: "",
          name: "产假/公休"
        },
        {
          id: "",
          name: "陪产假"
        },
        {
          id: "",
          name: "婚假"
        },
        {
          id: "",
          name: "工伤假"
        },
        {
          id: "",
          name: "丧假"
        },
        {
          id: "",
          name: "哺乳假"
        },
        {
          id: "",
          name: "计生假"
        },
        {
          id: "",
          name: "探亲假"
        }
      ],
      multiIndex: [0, 0, 0, 0, 0],
      endMultiIndex: [0, 0, 0, 0, 0],
      startTime: "",
      endTime: "",
      imgList: [],
      address:"",
      current:0
    };
  },
  computed: {
    newMultiArray: () => {
      let array = [];
      const date = new Date();
      const years = [];
      const months = [];
      const days = [];
      const hours = [];
      const minutes = [];
      var d = new Date();
      var y = d.getFullYear();
      for (let i = y; i <= date.getFullYear() + 10; i++) {
        years.push("" + i + "年");
      }
      array.push(years);
      for (let i = 1; i <= 12; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        months.push("" + i + "月");
      }
      array.push(months);
      for (let i = 1; i <= 31; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        days.push("" + i + "日");
      }
      array.push(days);
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        hours.push("" + i + "时");
      }
      array.push(hours);
      for (let i = 0; i < 60; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minutes.push("" + i + "分");
      }
      array.push(minutes);
      return array;
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      let minute = date.getMinutes();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      if (minute >= 1 && minute <= 9) {
        minute = "0" + month;
      }
      var currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        minute;
      return currentdate;
    },
    isModelmes(){
      return wx.getStorageSync('isModelmes');
    },
    time(){
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth()+1;
      let day = date.getDate();
      let h = date.getHours();
      let min = date.getMinutes();
      let s = date.getSeconds();
      return `${y}-${m}-${day} ${h}:${min}:${s}`;
    }
  },
  onLoad(){
    this.getCurrent();
  },
  methods: {
    onChange(e){
      this.current = e.mp.detail.index;
    },
    getCurrent(){
        let date = new Date(this.time.replace(/-/g,'/'));
        let years = date.getFullYear();
        let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1;
        let d = date.getDate()<10?'0'+date.getDate():date.getDate();
        let hours = date.getHours()<10?'0'+date.getHours():date.getHours();
        let minutes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();

        const yIdx = this.newMultiArray[0].findIndex(item=>item==years+'年');
        const mIdx = this.newMultiArray[1].findIndex(item=>item==month+'月');
        const dIdx = this.newMultiArray[2].findIndex(item=>item==d+'日');
        const hIdx = this.newMultiArray[3].findIndex(item=>item==hours+'时');
        const minIdx = this.newMultiArray[4].findIndex(item=>item==minutes+'分');
        this.multiIndex[0] = yIdx;
        this.multiIndex[1] = mIdx;
        this.multiIndex[2] = dIdx;
        this.multiIndex[3] = hIdx;
        this.multiIndex[4] = minIdx;
        
        this.endMultiIndex[0] = yIdx;
        this.endMultiIndex[1] = mIdx;
        this.endMultiIndex[2] = dIdx;
        this.endMultiIndex[3] = hIdx;
        this.endMultiIndex[4] = minIdx;
    },
    pickerLeave(e) {
      this.leaveIdx = e.mp.detail.value;
    },
    pickerStartTime(e) {
      this.multiIndex = e.target.value;
      const index = this.multiIndex;
      const year = this.newMultiArray[0][index[0]];
      const month = this.newMultiArray[1][index[1]];
      const day = this.newMultiArray[2][index[2]];
      const hour = this.newMultiArray[3][index[3]];
      const minute = this.newMultiArray[4][index[4]];
      this.startTime =
        year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.startTime = this.RemoveChinese(this.startTime) + ":00";
    },
    pickerEndTime(e) {
      this.endMultiIndex = e.target.value;
      const index = this.endMultiIndex;
      const year = this.newMultiArray[0][index[0]];
      const month = this.newMultiArray[1][index[1]];
      const day = this.newMultiArray[2][index[2]];
      const hour = this.newMultiArray[3][index[3]];
      const minute = this.newMultiArray[4][index[4]];
      this.endTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.endTime = this.RemoveChinese(this.endTime) + ":00";
      let iDays = getTotal({
          startWorkTime: 9,
          endWorkTime: 18,
          beginAt: this.startTime,
          endAt: this.endTime,
          startFreeTime: 12,
          endFreeTime: 13.5,
          excludeFreeTime: true,
          excludeDates: []
        });
      console.log(iDays,'iDays');
    },
    // 正则去除汉字
    RemoveChinese(strValue) {
      if (strValue != null && strValue != "") {
        var reg = /[\u4e00-\u9fa5]/g;
        return strValue.replace(reg, "");
      } else return "";
    },
    // 打开本地图库
    handleSelPhoto() {
      wx.chooseImage({
        count: 9,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          console.log(res);
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          tempFilePaths.forEach(item => {
            this.imgList.push(item);
          });
          // wx.uploadFile({
          //     url: "http://112.126.75.65:10020/rest?method="+'file.attachfiles.upload'+'&SessionKey=' + '5d884846-1d19-449d-b4e2-1b5a83623a41'+'&pid='+this.uuid, //仅为示例，非真实的接口地址
          //     filePath: tempFilePaths[0],
          //     name: 'file',
          //     formData: {
          //         'user': 'test'
          //     },
          //     success (res){
          //         console.log(res);
          //         const data = res.data
          //         //do something
          //     }
          // })
        }
      });
    },
    getCloseImg(index){
      this.imgList.splice(index,1);
    },
    getChooseLocation(){
      let that = this;
      wx.chooseLocation({
          success:res=>{
            console.log(res);
            that.address = res.address;
          },fail(error){

          }
      })
    }
  }
};
</script>
<style lang="scss" scopod>
@import '../../../../static/css/icon.css';
.wrap {
    padding-bottom: 100px;
  .rowWrap {
    display: flex;
    justify-content: space-between;
    padding: 34rpx 33rpx;
    background: #fff;
    margin-top: 35rpx;
    .label {
      color: #666666;
      font-size: 32rpx;
      span {
        color: #ff6666;
      }
    }
    .name {
      span {
        font-size: 31rpx;
        color: #ababab;
      }
      span.active {
        color: #333333;
      }
    }
  }
  h3 {
    padding: 31rpx 33rpx;
    color: #3399ff;
    font-size: 26rpx;
  }
  .content {
    background: #fff;
    .row {
      display: flex;
      justify-content: space-between;
      padding: 34rpx 33rpx;
      background: #fff;
      border-bottom: 1rpx solid #e2e3e5;
      .label {
        color: #666666;
        font-size: 32rpx;
        span {
          color: #ff6666;
        }
      }
      .name {
        display: flex;
        align-items: center;
        span {
          font-size: 31rpx;
          color: #ababab;
        }
        span.active {
          color: #333333;
        }
        input {
          font-size: 31rpx;
          text-align: right;
          margin-right: 20rpx;
        }
      }
    }
    .rowBottom {
      padding: 20rpx 33rpx;
      // border-top: 2rpx solid #eaebeb;
      p {
        font-size: 26rpx;
        color: #ababab;
        span {
          color: #3399ff;
          margin-left: 10rpx;
        }
      }
    }
  }
  .leaveComment {
    padding: 34rpx 33rpx;
    background: #fff;
    margin: 35rpx 0;
    p {
      font-size: 32rpx;
      color: #666666;
      span {
        color: #ff6666;
      }
    }
    .box {
      textarea {
        height: 100rpx;
        font-size: 31rpx;
        color: #333333;
      }
    }
  }
  .imgContent {
    background: #fff;
    margin-bottom: 20rpx;
    .head {
      font-size: 28rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 33rpx;
      color: #666666;
      .iconfont {
        color: #3399ff;
      }
    }
    .cont {
      padding: 20rpx;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      // flex-direction: row;
      .imgWrap {
        width: 100rpx;
        height: 100rpx;
        position: relative;
        margin-right: 20rpx;
        margin-top: 10rpx;
        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
          border-radius: 7rpx;
        }
        // .close{
        //     position: absolute;
        //     top: -10rpx;
        //     right: -10rpx;
        // }
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
      }
    }
  }
  .footer{
        width: 100%;
        position: fixed;
        bottom: 20rpx;
        background: #fff;
        .btn{
            padding: 20rpx;
        }
    }
    .dataWrap{
    .contentList{
      padding: 0 20rpx;
      .box_wrap{
        width: 100%;
        height: auto;
        background: #fff;
        box-shadow: 0 2rpx 6rpx 0 rgba(0,0,0,.06);
        margin-top: 20rpx;
        padding: 25rpx 20rpx;
        border-radius: 10rpx;
        .row{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15rpx;
          .title{

          }
          .time{
            font-size: 20rpx;
            color: #ababab;
          }
        }
        .desc{
          font-size: 24rpx;
          color: #ababab;
        }
        .tagFot{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15rpx;
          .tag{
            display: flex;
            align-items: center;
            span{
              display: inline-block;
              width: 40rpx;
              height: 40rpx;
              line-height: 40rpx;
              text-align: center;
              background: #3399ff;
              color: #fff;
              font-size: 14rpx;
              margin-right: 10rpx;
            }
          }
          .status{
            color: #f09951;
          }
        }
      }
    }
  }
}
</style>