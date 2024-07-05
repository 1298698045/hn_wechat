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
                        姓名
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
                        身份证号
                        <span>*</span>
                    </p>
                    <p class="name">
                        <input
                            type="Number"
                            placeholder-style="text-align:right;color: #ababab;"
                            selection-end="-1"
                            :placeholder="'请输入身份证号'"
                            v-model="IDNumber"
                        />
                    </p>
                </div>
                <picker @change="pickerCategory" :value="CategoryNameIdx" range-key="label" :range="CategoryList">
                    <div class="row">
                        <p class="label">
                            人员类别
                            <span>*</span>
                        </p>
                        <p class="name">
                            <span
                                :class="CategoryList[CategoryNameIdx]?'active':''"
                            >{{CategoryList[CategoryNameIdx]?CategoryList[CategoryNameIdx].label:'请选择'}}</span>
                            <i-icon type="enter" color="#cccccc" />
                        </p>
                    </div>
                </picker>
                <picker @change="pickerPost" :value="postIdx" range-key="label" :range="postList">
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
                <div class="row">
                    <p class="label">
                        现职务
                        <span>*</span>
                    </p>
                    <p class="name">
                        <input
                            type="text"
                            placeholder-style="text-align:right;color: #ababab;"
                            selection-end="-1"
                            :placeholder="'请输入人员类别'"
                            v-model="XianZaiZhiwu"
                        />
                    </p>
                </div>
                <div class="row">
                    <p class="label">
                        现职称
                        <span>*</span>
                    </p>
                    <p class="name">
                        <input
                            type="text"
                            placeholder-style="text-align:right;color: #ababab;"
                            selection-end="-1"
                            :placeholder="'请输入人员类别'"
                            v-model="FromProfessionTitle"
                        />
                    </p>
                </div>
                <div class="row" @click="getOpenModal({obj:'FromDept',sObjectType:10})">
                    <p class="label">
                        调出科室
                        <span>*</span>
                    </p>
                    <p class="name">
                        <input
                        disabled
                        type="text"
                        placeholder-style="text-align:right;color: #ababab;"
                        selection-end="-1"
                        :placeholder="'请选择部门'"
                        v-model="FromDept.Name"
                        />
                    </p>
                </div>
                <div class="row" @click="getOpenModal({obj:'QHSZ',sObjectType:8})">
                    <p class="label">
                        调出科室-护士长
                    </p>
                    <p class="name">
                        <input
                        disabled
                        type="text"
                        placeholder-style="text-align:right;color: #ababab;"
                        selection-end="-1"
                        :placeholder="'请选择员工'"
                        v-model="QHSZ.Name"
                        />
                    </p>
                </div>
                <div class="row" @click="getOpenModal({obj:'ManagerOfFromDept',sObjectType:8})">
                    <p class="label">
                        调出科室-科主任
                    </p>
                    <p class="name">
                        <input
                        disabled
                        type="text"
                        placeholder-style="text-align:right;color: #ababab;"
                        selection-end="-1"
                        :placeholder="'请选择员工'"
                        v-model="ManagerOfFromDept.Name"
                        />
                    </p>
                </div>
                <div class="row" @click="getOpenModal({obj:'ToDept',sObjectType:10})">
                    <p class="label">
                        调入科室
                        <span>*</span>
                    </p>
                    <p class="name">
                        <input
                        disabled
                        type="text"
                        placeholder-style="text-align:right;color: #ababab;"
                        selection-end="-1"
                        :placeholder="'请选择部门'"
                        v-model="ToDept.Name"
                        />
                    </p>
                </div>
                <div class="row" @click="getOpenModal({obj:'XHSZ',sObjectType:8})">
                    <p class="label">
                        调入科室-护士长
                    </p>
                    <p class="name">
                        <input
                        disabled
                        type="text"
                        placeholder-style="text-align:right;color: #ababab;"
                        selection-end="-1"
                        :placeholder="'请选择员工'"
                        v-model="XHSZ.Name"
                        />
                    </p>
                </div>
                <div class="row" @click="getOpenModal({obj:'ManagerOfToDept',sObjectType:8})">
                    <p class="label">
                        调入科室-科主任
                    </p>
                    <p class="name">
                        <input
                        disabled
                        type="text"
                        placeholder-style="text-align:right;color: #ababab;"
                        selection-end="-1"
                        :placeholder="'请选择员工'"
                        v-model="ManagerOfToDept.Name"
                        />
                    </p>
                </div>
                <picker mode="date" :value="TransferDate" @change="bindDateChange">
                    <div class="row">
                        <p class="label">
                            拟调用时间
                            <span>*</span>
                        </p>
                        <p class="name">
                            <input
                                type="text"
                                :disabled="true"
                                placeholder-style="text-align:right;color: #ababab;"
                                selection-end="-1"
                                placeholder="请选择拟调用时间"
                                v-model="TransferDate"
                            />
                        </p>
                    </div>
                </picker>
                <div class="row">
                    <p class="label">
                        入后职称
                        <span>*</span>
                    </p>
                    <p class="name">
                        <input
                            type="text"
                            placeholder-style="text-align:right;color: #ababab;"
                            selection-end="-1"
                            :placeholder="'请输入入后职称'"
                            v-model="ToProfessionTitle"
                        />
                    </p>
                </div>
                <div class="row">
                    <p class="label">
                        入后职务
                        <span>*</span>
                    </p>
                    <p class="name">
                        <input
                            type="text"
                            placeholder-style="text-align:right;color: #ababab;"
                            selection-end="-1"
                            :placeholder="'请输入入后职务'"
                            v-model="RuHouZhWu"
                        />
                    </p>
                </div>
                <div class="leaveComment">
                    <p>
                        原因
                        <span>*</span>
                    </p>
                    <div class="box">
                        <textarea name id cols="30" rows="10" v-model="Description"></textarea>
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
            <ShowData :objectType="30027" ref="child" />
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
    data(){
        return {
            IDNumber:"",
            multiIndex: [0, 0, 0, 0, 0],
            endMultiIndex: [0, 0, 0, 0, 0],
            startTime: "",
            endTime: "",
            current:0,
            postList:[],
            postIdx:"",
            Postcategory:"",
            CategoryList:[],
            CategoryNameIdx:"",
            CategoryName:"",
            TransferDate:"",
            XianZaiZhiwu:"",
            FromProfessionTitle:"",
            ToProfessionTitle:"",
            RuHouZhWu:"",
            reason:"",
            Remark:"",
            FromDept:{
                Name:"",
                Id:""
            },
            QHSZ:{
                Name:"",
                Id:""
            },
            ManagerOfFromDept:{
                Name:"",
                Id:""
            },
            ToDept:{
                Name:"",
                Id:""
            },
            XHSZ:{
                Name:"",
                Id:""
            },
            ManagerOfToDept:{
                Name:"",
                Id:""
            },
            isShow:false,
            lksrch:"",
            popupIdx:"",
            listData:[],
            sObjectType:8, // 8员工10部门
            paramsObj:"",
            ProcessId:"7e62b3ba-471f-40bf-ab7f-2be0c568e157",
            ProcessInstanceId:"",
            RuleLogId:"",
            processIdName:""
        }
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
        this.queryType();
        this.queryTypeTwo();
    },
    methods:{
        queryType(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:this.$api.public.leaveQuery,
                    objectTypeCode:30027,
                    name:"Postcategory"
                }
            }).then(res=>{
                this.postList = res;
            })
        },
        queryTypeTwo(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:this.$api.public.leaveQuery,
                    objectTypeCode:30027,
                    name:"CategoryName"
                }
            }).then(res=>{
                this.CategoryList = res;
            })
        },
        getOpenModal(obj){
            this.lksrch = '';
            this.popupIdx = -1;
            this.sObjectType = obj.sObjectType;
            this.paramsObj = obj.obj;
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
            this[this.paramsObj].Name = item.Name;
            this[this.paramsObj].Id = item.ID;
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
            if(this.IDNumber==""){
                wx.showToast({
                    title:"身份证号不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.CategoryName==""){
                wx.showToast({
                    title:"人员类别不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.Postcategory==""){
                wx.showToast({
                    title:"岗位类别不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.XianZaiZhiwu==""){
                wx.showToast({
                    title:"现职务不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.FromProfessionTitle==""){
                wx.showToast({
                    title:"现职称不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.FromDept.Id==""){
                wx.showToast({
                    title:"调出科室不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.ToDept.Id==""){
                wx.showToast({
                    title:"调入科室不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.TransferDate==""){
                wx.showToast({
                    title:"拟调用时间不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.ToProfessionTitle==""){
                wx.showToast({
                    title:"入后职称不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.RuHouZhWu==""){
                wx.showToast({
                    title:"入后职务不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.Description==""){
                wx.showToast({
                    title:"原因不能为空",
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
                                    processId:this.ProcessId,
                                    ruleLogId:this.RuleLogId,
                                    parentRecord:{
                                        id:this.ProcessInstanceId,
                                        objTypeCode:30027,
                                        fields:{
                                            Swnqing:{
                                                Id:this.UserId
                                            },
                                            IDNumber:this.IDNumber,
                                            CategoryName:this.CategoryName,
                                            Postcategory:this.Postcategory,
                                            XianZaiZhiwu:this.XianZaiZhiwu,
                                            FromProfessionTitle:this.FromProfessionTitle,
                                            FromDept:{
                                                Id:this.FromDept.Id
                                            },
                                            QHSZ:{
                                                Id:this.QHSZ.Id
                                            },
                                            ManagerOfFromDept:{
                                                Id:this.ManagerOfFromDept.Id
                                            },
                                            ToDept:{
                                                Id:this.ToDept.Id
                                            },
                                            XHSZ:{
                                                Id:this.XHSZ.Id
                                            },
                                            ManagerOfToDept:{
                                                Id:this.ManagerOfToDept.Id
                                            },
                                            TransferDate:this.TransferDate,
                                            ToProfessionTitle:this.ToProfessionTitle,
                                            RuHouZhWu:this.RuHouZhWu,
                                            Description:this.Description
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
        pickerCategory(e){
            this.CategoryNameIdx = e.mp.detail.value;
            this.CategoryName = this.CategoryList[this.CategoryNameIdx].value;
        },
        pickerPost(e){
            this.postIdx = e.mp.detail.value;
            this.Postcategory = this.postList[this.postIdx].value;
        },
        onChange(e){
            this.current = e.mp.detail.index;
        },
        bindDateChange(e){
            this.TransferDate = e.mp.detail.value;
        }
    }
}
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
    border-bottom: 1rpx solid #e2e3e5;
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