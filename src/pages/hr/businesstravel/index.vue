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
            出差人员
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
            所属部门
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              v-model="DepName"
              :disabled="true"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入申请部门'"
            />
          </p>
        </div>
        <picker @change="pickerLeave" :value="postIdx" range-key="label" :range="postList">
          <div class="row">
            <p class="label">
              岗位类别
              <span>*</span>
            </p>
            <p class="name">
              <span
                :class="postList[postIdx]?'active':''"
              >{{postList[postIdx]?postList[postIdx].label:'请选择'}}</span>
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
              开始时间
              <span>*</span>
            </p>
            <p class="name">
              <span :class="{'active':startTime!=''}">{{startTime}}</span>
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
              <span :class="{'active':endTime!=''}">{{endTime}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <div class="row">
          <p class="label">
            出差时长
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入出差时长'"
              v-model="iDays"
            />
          </p>
        </div>
        <div class="row" @click="getChooseLocation">
          <p class="label">
            地点
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              disabled
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              placeholder="到达地点"
              v-model="address"
            />
            <i-icon type="coordinates" color="#999999" size="20" />
          </p>
        </div>
        <picker @change="pickerCategory" :value="categoryIdx" :range="categoryList">
          <div class="row">
            <p class="label">
              类别
              <span>*</span>
            </p>
            <p class="name">
              <span
                :class="categoryList[categoryIdx]?'active':''"
              >{{categoryList[categoryIdx]?categoryList[categoryIdx]:'请选择'}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <div class="leaveComment leaveReason">
          <p>
            原因
            <span>*</span>
          </p>
          <div class="box">
            <textarea name id cols="30" rows="10" v-model="LeaveReason"></textarea>
          </div>
        </div>
        <div class="row" @click="getOpenModal">
          <p class="label">
            科室工作临时负责人
            <span>*</span>
          </p>
          <p class="name">
            <input
              disabled
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入科室工作临时负责人'"
              v-model="WorkAgentName"
            />
          </p>
        </div>
        <picker @change="pickerPayTheWay" :value="payTheWayIdx" :range="payTheWay">
          <div class="row">
            <p class="label">
              所需经费支付途径
              <span>*</span>
            </p>
            <p class="name">
              <span
                :class="payTheWay[payTheWayIdx]?'active':''"
              >{{payTheWay[payTheWayIdx]?payTheWay[payTheWayIdx]:'请选择'}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <div class="row">
          <p class="label">
            专项经费名称
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入专项经费名称'"
              v-model="ProjectName"
            />
          </p>
        </div>
        <picker @change="pickerPaymentWay" :value="paymentWayIdx" :range="paymentWay">
          <div class="row">
            <p class="label">
              付款方式
              <span>*</span>
            </p>
            <p class="name">
              <span
                :class="paymentWay[paymentWayIdx]?'active':''"
              >{{paymentWay[paymentWayIdx]?paymentWay[paymentWayIdx]:'请选择付款方式'}}</span>
              <i-icon type="enter" color="#cccccc" />
            </p>
          </div>
        </picker>
        <div class="row">
          <p class="label">
            金额
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入金额'"
              v-model="Amount"
            />
          </p>
        </div>
        <div class="row">
          <p class="label">
            付款信息
            <span>*</span>
          </p>
          <p class="name">
            <input
              type="text"
              placeholder-style="text-align:right;color: #ababab;"
              selection-end="-1"
              :placeholder="'请输入付款信息'"
              v-model="PaymentNotes"
            />
          </p>
        </div>
      </div>
      <div class="leaveComment">
        <p>
          备注
          <span>*</span>
        </p>
        <div class="box">
          <textarea name id cols="30" rows="10" v-model="Remark"></textarea>
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
      <ProcessModal ref="refProcess" :processId="ProcessId" :processIdName="processIdName"
     :RuleLogId="RuleLogId" :ProcessInstanceId="ProcessInstanceId" :describe="BEZ" />
     <van-popup
          :show="isShow"
          position="bottom"
          custom-style="width:100%;height: 80vh;"
          z-index="99999"
          @close="onClosePopup"
      >
          <div class="popupWrap">
              <van-search :value="lksrch" placeholder="请输入搜索关键词" @change="handleChange" />
              <ul class="uls">
                  <li @click="getPopupSel(item,index)" v-for="(item,index) in listData" :key="index">
                      <p>{{item.Name}}</p>
                      <p v-if="popupIdx==index">
                          <i-icon type="right" />
                      </p>
                  </li>
              </ul>
          </div>
      </van-popup>
    </div>
    <div class="dataWrap" v-if="current==1">
      <ShowData :objectType="30036" ref="child" />
    </div>
  </div>
</template>
<script>
import { getTotal } from '@/utils/iDays';
import ProcessModal from '@/components/approval/processModal';
import ShowData from '@/components/showData';
import { message } from '@/utils/message';
export default {
  components:{
    ProcessModal,
    ShowData
  },
  data() {
    return {
      multiIndex: [0, 0, 0, 0, 0],
      endMultiIndex: [0, 0, 0, 0, 0],
      startTime: "",
      endTime: "",
      iDays:"",
      imgList: [],
      address:"",
      current:0,
      postList:[],
      postIdx:'',
      Postcategory:"", // 岗位类别
      latitude:"",
      longitude:"",
      categoryList:['进修','会议/培训/学术交流','其他'],
      categoryIdx:"",
      payTheWay:['专项经费','医院自由资金','其他'],
      payTheWayIdx:"",
      paymentWay:['转账','支票','现金（限1000元以下）','不需要支付','仅需要报销差旅费'], // 付款方式
      paymentWayIdx:"",
      PaymentMethod:"",
      ProcessId:"794d3c36-b19e-435c-8af0-2c1d52d3c5cd",
      processIdName:"",
      RuleLogId:"",
      ProcessInstanceId:"",
      WorkCategory:"", // 类别
      ProjectName:"",
      Amount:"",
      PaymentNotes:"",
      Remark:"",
      LeaveReason:"",
      FundSource:"",
      WorkAgentName:"",
      WorkAgentId:"",
      isShow:false,
      lksrch:"",
      sObjectType:8,
      listData:[]
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
    UserId(){
      return wx.getStorageSync('userId');
    },
    DeptId(){
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
    this.queryType();
  },
  methods: {
    queryType(){
      this.$httpWX.get({
        url:this.$api.message.queryList,
        data:{
          SessionKey:this.sessionkey,
          method:this.$api.public.leaveQuery,
          objectTypeCode:30036,
          name:"Postcategory"
        }
      }).then(res=>{
        this.postList = res;
      })
    },
    getOpenModal(){
        this.lksrch = '';
        this.popupIdx = -1;
        this.getLookup().then(res=>{
            this.isShow = true;
        });
    },
    handleChange(e){
        this.lksrch = e.mp.detail;
        this.getLookup();
    },
    getLookup(){
        return new Promise((resolve,reject)=>{
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.lookup,
                    SessionKey:this.sessionkey,
                    lktp:this.sObjectType,
                    lksrch:this.lksrch
                }
            }).then(res=>{
                this.listData = res.listData;
                resolve(res);
            })
        })
    },
    onClosePopup(){
        this.isShow = false;
    },
    getPopupSel(item,index){
        this.popupIdx = index;
        this.WorkAgentId = item.ID;
        this.WorkAgentName = item.Name;
        this.isShow = false;
    },
    // 创建实例
    async getCreateExample(){
      let dataParams = {
          params:{
              recordRep:{
                  fields:{
                      ProcessId:this.ProcessId,
                      Name:'出差审批单'+wx.getStorageSync('businessUnitName') + ' ' + wx.getStorageSync('fullName'),
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
      if(this.Postcategory==""){
        message.toast({
          title: '岗位类别不能为空',
          delta: 0
        })
        return false;
      }else if(this.startTime==""){
        message.toast({
          title: '开始时间不能为空',
          delta: 0
        })
        return false;
      }else if(this.endTime==""){
        message.toast({
          title: '截止时间不能为空',
          delta: 0
        })
        return false;
      }else if(this.address==""){
        message.toast({
          title: '出差地点不能为空',
          delta: 0
        })
        return false;
      }else if(this.WorkCategory==""){
        message.toast({
          title: '类别不能为空',
          delta: 0
        })
        return false;
      }else if(this.LeaveReason==""){
        message.toast({
          title: '原因不能为空',
          delta: 0
        })
        return false;
      }else if(this.LeaveReason==""){
        message.toast({
          title: '科室工作临时负责人不能为空',
          delta: 0
        })
        return false;
      }else if(this.FundSource==""){
        message.toast({
          title: '所需经费支付途径不能为空',
          delta: 0
        })
        return false;
      }else if(this.PaymentMethod==""){
        message.toast({
          title: '付款方式不能为空',
          delta: 0
        })
        return false;
      }else if(this.Amount==""){
        message.toast({
          title: '金额不能为空',
          delta: 0
        })
        return false;
      }else if(this.PaymentNotes==""){
        message.toast({
          title: '付款信息不能为空',
          delta: 0
        })
        return false;
      }else if(this.Remark==""){
        message.toast({
          title: '备注不能为空',
          delta: 0
        })
        return false;
      }else {
        this.getCreateExample().then(res=>{
          let obj = {
                actions:[
                  {
                    params:{
                      processId:this.ProcessId,
                      ruleLogId:this.RuleLogId,
                      parentRecord:{
                        id:this.ProcessInstanceId,
                        objTypeCode:30036,
                        fields:{
                          ApplyUserId:{
                            Id:this.UserId
                          },
                          DeptId:{
                            Id:this.DeptId
                          },
                          Postcategory:this.Postcategory,
                          StartTime:this.startTime,
                          EndTime:this.endTime,
                          LeaveDuration:this.iDays,
                          Location:this.address,
                          WorkCategory:this.WorkCategory,
                          LeaveReason:this.LeaveReason,
                          FundSource:this.FundSource,
                          ProjectName:this.ProjectName,
                          PaymentMethod:this.PaymentMethod,
                          Amount:this.Amount,
                          PaymentNotes:this.PaymentNotes,
                          Remark:this.Remark,
                          WorkAgentId:{
                            Id:this.WorkAgentId
                          }
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
              })
        })
      }
    },
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
    // 岗位类别
    pickerLeave(e) {
      this.postIdx = e.mp.detail.value;
      this.Postcategory = this.postList[this.postIdx].value;
    },
    // 类别
    pickerCategory(e){
      this.categoryIdx = e.mp.detail.value;
      this.WorkCategory = this.categoryList[this.categoryIdx];
    },
    // 所需经费支付途径
    pickerPayTheWay(e){
      this.payTheWayIdx = e.mp.detail.value;
      this.FundSource = this.payTheWay[this.payTheWayIdx];
    },
    // 付款方式
    pickerPaymentWay(e){
      this.paymentWayIdx = e.mp.detail.value;
      this.PaymentMethod = this.paymentWay[this.paymentWayIdx];
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
        this.iDays = iDays;
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
            that.address = res.address;
            that.latitude = res.latitude;
            that.longitude = res.longitude;
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
    padding-bottom: 100px;
    .navTabs{
      border-bottom: 1rpx solid #e2e3e5;
    }
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
  .leaveReason{
    margin: 0 !important;
    border-bottom: 1rpx solid #e2e3e5;
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
    .popupWrap{
        .uls{
            li{
                padding: 33rpx ;
                color: #333333;
                font-size: 28rpx;
                display: flex;
                justify-content: space-between;
            }
        }
    }
}
</style>