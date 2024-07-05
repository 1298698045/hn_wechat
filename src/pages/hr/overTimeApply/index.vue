<template>
  <div class="wrap">
    <div class="navTabs">
      <van-tabs :active="current" color="#3399ff" @change="onChange">
        <van-tab title="发起提交"></van-tab>
        <van-tab title="查看数据"></van-tab>
      </van-tabs>
    </div>
    <div class="container" v-if="current==0">
      <div class="content">
        <div class="row">
          <p class="label">
            申请人
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              :disabled="true"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入申请人姓名'"
              v-model="userName"
            />
          </p>
        </div>
        <div class="row">
          <p class="label">
            所在部门
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              :disabled="true"
              v-model="DepName"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入申请部门'"
            />
          </p>
        </div>
        <picker
          @change="pickerApplyTime"
          mode="multiSelector"
          :value="multiIndex"
          :range="newMultiArray"
        >
          <div class="row">
            <p class="label">
              申请时间
              <span>*</span>
            </p>
            <p class="name">
              <span>{{applyTime}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <picker @change="pickerLeave" :value="leaveIdx" range-key="label" :range="leaveList">
          <div class="rowWrap">
            <p class="label">
              加班类型
              <span>*</span>
            </p>
            <p class="name">
              <span
                :class="leaveList[leaveIdx]?'active':''"
              >{{leaveList[leaveIdx]?leaveList[leaveIdx].label:'请选择'}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <picker
          @change="pickerStartTime"
          mode="multiSelector"
          :value="multiIndex"
          :range="newMultiArray"
        >
          <div class="row">
            <p class="label">
              加班开始时间
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
              加班结束时间
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
            加班时长
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              placeholder="请输加班时长"
              v-model="iDays"
            />
          </p>
        </div>
        <div class="row">
          <p class="label">
            加班地点
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              placeholder="请输入目的地"
              v-model="address"
            />
            <i-icon type="coordinates" color="#999999" size="20" @click="getChooseLocation" />
          </p>
        </div>
        <!-- <div class="rowBottom">
          <p>
            根据排班自动计算时长
            <span>查看明细</span>
          </p>
        </div> -->
      </div>
      <div class="leaveComment">
        <p>
          加班事由
          <span>*</span>
        </p>
        <div class="box">
          <textarea name id cols="30" rows="10" v-model="describe"></textarea>
        </div>
      </div>
      <div class="imgContent" v-if="false">
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
      <ProcessModal ref="refProcess" :processId="ProcessId" :processIdName="processIdName"
     :RuleLogId="RuleLogId" :ProcessInstanceId="ProcessInstanceId" :describe="describe" />
    </div>
    <div class="dataWrap" v-if="current==1">
      <ShowData :objectType="30037" ref="child" />
    </div>
  </div>
</template>
<script>
import { getTotal } from '@/utils/iDays';
import ProcessModal from '@/components/approval/processModal';
import ShowData from '@/components/showData';
export default {
  components:{
    ProcessModal,
    ShowData
  },
  data() {
    return {
      leaveIdx: "",
      leaveList: [],
      ApplyMultiIndex:[0,0,0,0,0],
      multiIndex: [0, 0, 0, 0, 0],
      endMultiIndex: [0, 0, 0, 0, 0],
      startTime: "",
      endTime: "",
      imgList: [],
      address:"",
      applyTime:"",
      ProcessId:"78760cdc-81dd-41e5-85a3-9cb70dbf7d7b",
      ProcessInstanceId:'',
      RuleLogId:'',
      OvertimeType:'',
      iDays:'',
      isShow:false,
      processIdName:"",
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
    },
    userName(){
      return wx.getStorageSync('fullName');
    },
    userId(){
      return wx.getStorageSync('userId');
    },
    DepId(){
      return wx.getStorageSync('businessUnitId');
    },
    DepName(){
      return wx.getStorageSync('businessUnitName');
    },
    sessionkey(){
      return wx.getStorageSync('sessionkey');
    }
    
  },
  onLoad(){
    Object.assign(this.$data,this.$options.data());
    this.getCurrent();
    this.defaultTime();
    this.queryType();
  },
  methods: {
    onChange(e){
      this.current = e.mp.detail.index;
    },
    queryType(){
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          SessionKey:this.sessionkey,
          method:this.$api.public.leaveQuery,
          objectTypeCode:30037,
          name:"OvertimeType"
        }
      }).then(res=>{
        this.leaveList = res;
      })
    },
    // 创建实例
    async getCreateExample(){
      let dataParams = {
          params:{
              recordRep:{
                  fields:{
                      ProcessId:this.ProcessId,
                      Name:'加班审批单'+wx.getStorageSync('businessUnitName') + ' ' + wx.getStorageSync('fullName'),
                      Deadline:1,
                      Priority:0
                  }
              }
          }
      }
      const ret = await this.$httpWX.post({
          url:this.$api.message.queryList+'?method='+this.$api.approval.create,
          method:this.$api.approval.create,
          data:{
              SessionKey:this.sessionkey,
              message:JSON.stringify(dataParams)
          }
      }).then(res=>{
          if(res.actions[0].state=='SUCCESS'){
              this.ProcessInstanceId = res.actions[0].returnValue.ProcessInstanceId;
              this.RuleLogId = res.actions[0].returnValue.RuleLogId;
              this.processIdName = res.actions[0].returnValue.Name;
          }
      })
      return ret;
    },
    getSubmit(){
      this.getCreateExample().then(res=>{
        let obj = {
            actions:[
              {
                params:{
                  processId:this.ProcessId,
                  ruleLogId:this.RuleLogId,
                  parentRecord:{
                    id:this.ProcessInstanceId,
                    objTypeCode:30037,
                    fields:{
                      EmployeeId:{
                        Id:this.userId
                      },
                      BusinessUnitId:{
                        Id:this.DepId
                      },
                      StartTime:this.startTime,
                      EndTime:this.endTime,
                      OverTimeHours:this.iDays,
                      OvertimeType:this.OvertimeType,
                      Location:this.address
                    }
                  }
                }
              }
            ]
          }
          this.$httpWX.post({
              url:this.$api.message.queryList+'?method='+this.$api.approval.saverecord,
              data:{
                  SessionKey:this.sessionkey,
                  message:JSON.stringify(obj)
              }
          }).then(res=>{
            this.$refs.refProcess.agreeShow = true;
            this.$refs.refProcess.getStepQuery();
            // this.getStepQuery();
          })
      })
    },
    defaultTime(){
      this.applyTime = this.RemoveChinese(this.time);
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
      this.OvertimeType = this.leaveList[this.leaveIdx].value;
    },
    pickerApplyTime(e){
      this.ApplyMultiIndex = e.target.value;
      const index = this.multiIndex;
      const year = this.newMultiArray[0][index[0]];
      const month = this.newMultiArray[1][index[1]];
      const day = this.newMultiArray[2][index[2]];
      const hour = this.newMultiArray[3][index[3]];
      const minute = this.newMultiArray[4][index[4]];
      let applyTime =
        year + "-" + month + "-" + day + " " + hour + ":" + minute;
      this.applyTime = this.RemoveChinese(applyTime) + ":00";
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
      this.iDays = iDays;
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
  },
  // 下拉刷新
  onPullDownRefresh() {
    if(this.current==1){
      this.$refs.child.pageNumber = 1;
      this.$refs.child.getQuery();
    }
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.current==1){
      if(this.$refs.child.isPage){
        this.$refs.child.pageNumber++;
        this.$refs.child.getQuery();
      }
    }
  }
};
</script>
<style lang="scss" scopod>
@import '../../../../static/css/icon.css';
.wrap {
  .rowWrap {
    display: flex;
    justify-content: space-between;
    padding: 34rpx 33rpx;
    background: #fff;
    // margin-top: 35rpx;
    border-bottom: 1rpx solid #e2e3e5;
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
          color: #333333;
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
    padding-bottom: 20rpx;
  }
}
</style>