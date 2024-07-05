<template>
  <div class="wrap">
    <div class="navTabs">
      <van-tabs :active="current" color="#3399ff" @change="onChange">
        <van-tab title="发起提交"></van-tab>
        <van-tab title="查看数据"></van-tab>
      </van-tabs>
    </div>
    <div class="container" v-if="current==0">
        <picker @change="pickerLeave" :value="leaveIdx" range-key="label" :range="leaveList">
          <div class="rowWrap">
            <p class="label">
              请假类型
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
        <!-- <h3>假期余额</h3> -->
        <div class="content">
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
                <span style="color:#333">{{startTime}}</span>
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
                结束时间
                <span>*</span>
              </p>
              <p class="name">
                <span style="color:#333">{{endTime}}</span>
                <i-icon type="enter" color="#cccccc" />
              </p>
            </div>
          </picker>
          <div class="row">
            <p class="label">
              时长(天)
              <span>*</span>
            </p>
            <p class="name">
              <input
                v-model="LeaveDuration"
                type="text"
                placeholder-style="text-align:right;color: #ababab;"
                selection-end="-1"
                placeholder="请输入时长"
              />
            </p>
          </div>
          <div class="row">
            <p class="label">
              假期余额
              <span></span>
            </p>
            <p class="name">
              <input
                v-if="leaveIdx!=''"
                v-model="Balance"
                :disabled="true"
                type="text"
                placeholder-style="text-align:right;color: #ababab;"
                selection-end="-1"
                placeholder="请输入时长"
              />
            </p>
          </div>
          <div class="rowBottom">
            <p>
              根据排班自动计算时长
              <span>查看明细</span>
            </p>
          </div>
        </div>
        <div class="leaveComment">
          <p>
            请假事由
            <span>*</span>
          </p>
          <div class="box">
            <textarea v-model="Description" name id cols="30" rows="10"></textarea>
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
                <van-button type="info" block @click="getSave">提交</van-button>
            </div>
        </div>
        <ProcessModal ref="refProcess" :processId="ProcessId" :processIdName="processIdName"
     :RuleLogId="RuleLogId" :ProcessInstanceId="ProcessInstanceId" :describe="BEZ" />
    </div>
    <!-- 查看数据 -->
    <div class="dataWrap" v-if="current==1">
      <ShowData :objectType="30022" ref="child"  />
    </div>
    <!-- 审批人 -->
    <div class="approved">
      
    </div>
  </div>
</template>
<script>
import { getTotal } from '@/utils/iDays';
import {mapState,mapMutations} from 'vuex';
import ProcessModal from '@/components/approval/processModal';
import ShowData from '@/components/showData';
export default {
  components:{
    ShowData,
    ProcessModal
  },
  data() {
    return {
      leaveIdx: "",
      leaveList:[{label:"事假",value:"1"},{label:"病假",value:"2"},{label:"产假",value:"3"},
      {label:"婚假",value:"4"},{label:"探亲假",value:"5"},{label:"年假",value:"6"},
      {label:"公伤假",value:"7"},{label:"丧假",value:"8"},{label:"人流假",value:"13"},
      {label:"补休",value:"17"},{label:"计生假",value:"18"},{label:"本地外出",value:"27"},
      {label:"外地出差",value:"28"}],
      multiIndex: [0, 0, 0, 0, 0],
      endMultiIndex: [0, 0, 0, 0, 0],
      startTime: "",
      endTime: "",
      imgList: [],
      createdByName:"测试",
      ProcessId:"2442350c-257f-446d-9a44-28a31bfb6ccb",
      processIdName:"",
      current:0,
      ProcessInstanceId:'',
      leaveType:'', // 请假类型
      RuleLogId:'',
      ToActivityId:'',
      fromActivityId:'',
      Balance:0, // 假期余额
      searchValue:'',
      list:[],
      pageNumber:1,
      pageSize:10,
      isPage:false,
      LeaveDuration:"",
      isBalanceLimit:false // 判断是否需要校验余额
    };
  },
  computed: {
    sessionkey(){
      return wx.getStorageSync('sessionkey');
    },
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
    ...mapState({
        selectListName:state=>{
            return state.mailList.selectListName;
        }
    }),
    UserId(){
      return wx.getStorageSync('userId');
    },
    DeptId(){
      return wx.getStorageSync('businessUnitId');
    },
    yearNumber(){
      let year = new Date().getFullYear();
      return year;
    }
  },
  onUnload(){
        this.getClear([]);
    },
  onLoad(){
    Object.assign(this.$data,this.$options.data());
    this.getCurrent();
    this.queryLeave();
  },
  onShow(){
    this.ToActivityId = wx.getStorageSync('ToActivityId');
  },
  methods: {
    unique(arr){
      const res = new Map();
      return arr.filter((item)=>!res.has(item.UserId)&&res.set(item.UserId,1));
    },
    changeSearch(e){
      this.searchValue = e.mp.detail;
      this.getQuery();
    },
    // 假期余额
    getBalance(){
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          method:'attendance.holidayaccount.balance.get',
          SessionKey:this.sessionkey,
          yearNumber:this.yearNumber,
          EmployeeId:this.UserId,
          leaveTypeCode:this.leaveType,
          startTime:this.startTime,
          endTime:this.endTime
        }
      }).then(res=>{
        if(res!=''){
          this.isBalanceLimit = res.isBalanceLimit;
          this.Balance = res.balanceAmount;
        }
      })
    },
    ...mapMutations(['getClear']),
    queryLeave(){
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          SessionKey:this.sessionkey,
          method:this.$api.public.leaveQuery,
          objectTypeCode:30022,
          name:"LeaveType"
        }
      }).then(res=>{
        this.leaveList = res;
      })
    },
    onChange(e){
      this.current = e.mp.detail.index;
    },
    // 创建实例
    async getCreateExample(){
      let dataParams = {
          params:{
              recordRep:{
                  fields:{
                      ProcessId:this.ProcessId,
                      Name:'请假审批单'+wx.getStorageSync('businessUnitName') + ' ' + wx.getStorageSync('fullName'),
                      Deadline:1,
                      Priority:0,
                      Description:this.Description
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
    // 保存表单
    getSave(){
      if(!this.isBalanceLimit||(this.isBalanceLimit&&this.Balance>0)){
        if(this.leaveType==''){
          wx.showToast({
            title:"请假类型不能为空",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.startTime==''){
          wx.showToast({
            title:"开始时间不能为空",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.endTime==''){
          wx.showToast({
            title:"结束时间不能为空",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.LeaveDuration==''){
          wx.showToast({
            title:"时长不能为空",
            icon:"none",
            duration:2000
          })
          return false;
        }else if(this.Description==''){
          wx.showToast({
            title:"请假事由不能为空",
            icon:"none",
            duration:2000
          })
          return false;
        }else {
          this.getCreateExample().then(res=>{
            let obj = {
              actions:[
                {
                  params:{
                    processId:this.processId,
                    ruleLogId:this.RuleLogId,
                    parentRecord:{
                      id:this.ProcessInstanceId,
                      objTypeCode:30022,
                      fields:{
                        UserId:{
                          Id:this.UserId
                        },
                        DeptId:{
                          Id:this.DeptId
                        },
                        LeaveType:this.leaveType,
                        StartTime:this.startTime,
                        EndTime:this.endTime,
                        LeaveDuration:this.LeaveDuration,
                        Description:this.Description,
                        // Location:""
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
                // this.agreeShow = true;
                // this.getStepQuery();
                console.log(res,this.$refs.refProcess)
                this.$refs.refProcess.agreeShow = true;
                this.$refs.refProcess.getStepQuery();
            })
          })
        }
      }else {
        wx.showToast({
          title:'假期余额不足',
          icon:'success',
          duration:2000
        })
      }
    },
    getStepQuery(){
        this.$httpWX.get({
            url:this.$api.message.queryList,
            data:{
                method:this.$api.approval.stepList,
                SessionKey:this.sessionkey,
                RuleLogId:this.RuleLogId,
                ProcessInstanceId:this.ProcessInstanceId
            }
        }).then(res=>{
            this.stepList = res.transitions;
            this.fromActivityId = res.fromActivityId;
        })
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
      this.leaveType = this.leaveList[this.leaveIdx].value;
      this.getBalance();
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
      this.getBalance();
      // this.LeaveDuration = iDays;
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
      let that = this;
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
          let url = `${that.$api.upload.url}?method=${that.$api.approval.upload}&SessionKey=${that.sessionkey}&pid=${that.ProcessInstanceId}&objTypeCode=${'122'}`
            wx.uploadFile({
                url:url,
                filePath: tempFilePaths[0],
                name: 'file',
                formData: {
                    'user': 'test'
                },
                success (res){
                    console.log(res);
                    const data = res.data
                }
            })
          }
      });
    },
    getCloseImg(index){
      this.imgList.splice(index,1);
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
      if(this.$refs.child.isPage){
        this.$refs.child.pageNumber++;
        this.$refs.child.getQuery();
      }
    }
};
</script>
<style lang="scss" scopod>
@import "../../../../static/css/public.scss";
@import "../../../../static/css/icon.css";
.wrap {
  .navTabs{
    border-bottom: 1rpx solid #e2e3e5;
  }
  .rowWrap {
    display: flex;
    justify-content: space-between;
    padding: 34rpx 33rpx;
    background: #fff;
    margin-top: 35rpx;
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
  .agreeWrap {
    position: relative;
    background: #f2f2f2;
    .header {
      display: flex;
      padding: 30rpx;
      border-bottom: 1rpx solid #e2e4e3;
      width: 100%;
      background: #fff;
      // position: fixed;
      div:nth-child(2) {
        margin-left: 20rpx;
        .h3 {
          font-size: 28rpx;
          font-weight: bold;
        }
        p {
          font-size: 12px;
          color: #333333;
          margin-top: 10rpx;
          span {
            color: #666666;
          }
        }
      }
    }
    .cont {
      width: 100%;
      // position: absolute;
      // top: 70px;
      height: 400px;
      overflow: scroll;
      padding-bottom: 50px;
      h3 {
        background: #f2f2f2;
        font-size: 12px;
        color: #999999;
        padding: 20rpx;
        .checkbox {
          display: flex !important;
          align-items: center !important;
        }
        .slot {
          width: 28rpx;
          height: 28rpx;
          border: 2rpx solid #3399ff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          p {
            width: 13rpx;
            height: 13rpx;
            background: #3399ff;
            border-radius: 50%;
          }
        }
        .default {
          width: 28rpx;
          height: 28rpx;
          border: 2rpx solid #c8c9cc;
          border-radius: 50%;
        }
      }
      .box {
        padding: 20rpx;
        background: #fff;
        .row {
          padding: 20rpx 0;
          font-size: 28rpx;
          border-bottom: 1rpx solid #e2e4e3;
          color: #333333;
          display: flex;
          justify-content: space-between;
        }
        .rows {
          padding: 10rpx 0 0 0;
          font-size: 28rpx;
          color: #333333;
          display: flex;
          justify-content: center;
          .add {
            // text-align: center;
            color: #3399ff;
            span {
              margin-top: 10rpx;
              display: inline-block;
            }
          }
        }
      }
      .popupRow {
        .row {
          padding: 20rpx;
          color: #999999;
          font-size: 12px;
          background: #f2f2f2;
          display: flex;
          justify-content: space-between;
          p:nth-child(2) {
            span:nth-child(1) {
              display: inline-block;
              background: #3399ff;
              border-top-left-radius: 10rpx;
              border-bottom-left-radius: 10rpx;
              padding: 10rpx 20rpx;
              color: #fff;
            }
            span:nth-child(2) {
              display: inline-block;
              background: #fff;
              border-top-right-radius: 10rpx;
              border-bottom-right-radius: 10rpx;
              padding: 10rpx 20rpx;
              color: #3399ff;
              border: 1rpx solid #3399ff;
              box-sizing: border-box;
              border-left: none;
            }
          }
        }
        .text {
          padding: 20rpx;
          background: #fff;
          font-size: 12px;
          color: #333333;
        }
      }
      .textarea {
        padding: 20rpx;
        background: #fff;
        margin-top: 20rpx;
        p {
          font-size: 28rpx;
          font-weight: bold;
        }
        textarea {
          height: 80px;
        }
      }
    }
    .fot {
      width: 100%;
      position: fixed;
      bottom: 0;
      background: #fff;
      border-top: 1rpx solid #e2e3e5;
      z-index: 9999;
      .box {
        display: flex;
        justify-content: center;
        p {
          width: 50%;
          text-align: center;
          color: #3399ff;
          padding: 20rpx;
          border-right: 1rpx solid #f2f2f2;
        }
        p:last-child {
          background: #3399ff;
          color: #ffffff;
        }
      }
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 20rpx;
    background: #fff;
    z-index: 9!important;
    .btn {
      padding: 20rpx;
    }
  }
  .dataWrap{
    padding-bottom: 20rpx;
  }
}
</style>