<template>
    <div>
        <van-popup
            :show="agreeShow"
            position="bottom"
            custom-style="width:100%;height: auto;"
            @close="onCloseAgree"
            z-index="99999"
            overlay-style="background: #333;opacity: .5;">
            <div class="agreeWrap">
                <div class="header">
                    <div>
                        <p class="radius">{{fullName}}</p>
                    </div>
                    <div>
                        <p class="h3">{{fullName}}提交的流程申请表</p>
                        <p><span>标题：</span>{{processIdName}}</p>
                    </div>
                </div>  
                <div class="cont">
                    <div v-for="(item,index) in stepList" :key="index">
                        <h3>
                            <van-checkbox :disabled="HasMatched&&item.Selected?true:false"  custom-class="checkbox" :name="item.TransitionId" :value="item.Selected" @change="(e)=>{changeAll(e,item,index)}">
                                {{item.ToActivityName}}
                            </van-checkbox>
                        </h3>
                        <div class="box">
                            <div class="row" v-for="(v,i) in item.ParticipantMember" :key="i">
                                <van-checkbox :name="v.UserId" :value="v.Selected" @change="(e)=>{changeItem(e,item,v)}">{{v.FullName}}/{{v.BusinessUnitIdName}}</van-checkbox>
                            </div>
                            <div class="rows">
                                <p class="add" @click="getAddPeople(item)">
                                    <i-icon type="add" size="30" color="#3399ff" />
                                    <span>
                                        添加办理人员
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="popupRow">
                        <div class="row">
                            <p>通知</p>
                            <p>
                                <span>应用内</span>
                                <span>&nbsp;短信</span>
                            </p>
                        </div>
                        <div class="text">
                            流程事务:{{processIdName}}，请您查阅！
                        </div>
                    </div>  
                    <div class="textarea">
                        <p>留言</p>
                        <textarea v-model="description" name="" placeholder="请输入内容" id="" cols="30" rows="10"></textarea>
                    </div>
                </div>
                <div class="fot" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
                    <div class="box">
                        <p @click="onCloseAgree">取消</p>
                        <p @click="getSubmitStep">提交</p>  
                    </div>
                </div> 
            </div>
        </van-popup>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
    name: 'ProcessModal',
    props:['processId','processIdName','describe','RuleLogId','ProcessInstanceId'],
    data(){
        return {
            agreeShow:false,
            stepList:[],
            RuleLogId:"",
            ProcessInstanceId:"",
            fromActivityId:[],
            HasMatched:false
        }
    },
    watch:{
        RuleLogId: {
            deep: true,
            handler: function(newVal, oldVal) {
                this.$nextTick(() => {
                    this.RuleLogId = newVal;
                });
            }
        },
        ProcessInstanceId:{
            deep: true,
            handler: function(newVal, oldVal) {
                this.$nextTick(() => {
                    this.ProcessInstanceId = newVal;
                });
            }
        }
    },
    computed:{
        fullName(){
            return wx.getStorageSync('fullName');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        ...mapState({
            selectListName:state=>{
                return state.mailList.selectListName;
            }
        }),
        processList(){
            let temp = [];
            let ToActivityId = wx.getStorageSync('ToActivityId');
            let index = this.stepList.findIndex(v=>v.ToActivityId===ToActivityId);
            if(this.selectListName!=''){
                this.selectListName.forEach(item=>{
                    this.stepList[index].ParticipantMember.push({
                        UserId:item.id,
                        FullName:item.FullName,
                        Selected:true,
                        BusinessUnitIdName:item.DeptName
                    })
                    this.stepList[index].ParticipantMember = this.getUnique(this.stepList[index].ParticipantMember);
                    console.log(this.stepList[index].ParticipantMember,'this.stepList[index].ParticipantMember')
                    this.stepList[index].Selected = true;
                })
            }
            temp = this.stepList;
            return temp;
        },
        UserId(){
            return wx.getStorageSync('userId');
        },
        DeptId(){
            return wx.getStorageSync('businessUnitId');
        }
    },
    onLoad(){
        // this.$nextTick(()=>{
        //     this.getStepQuery();
        // })
    },
    methods:{
        ...mapMutations(['getClear']),
        getUnique(arr){
            const res = new Map();
            return arr.filter((item)=>!res.has(item.UserId)&&res.set(item.UserId,1));
        },
        unique(arr){
            for(var i=0;i<arr.length;i++){
                for(var j=i+1; j < arr.length; j++){
                    if(arr[i].UserId==arr[j].UserId){
                        arr.splice(j,1);
                        j--;
                    }
                }
            }
            return arr;
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
                this.HasMatched = res.HasMatched; // 校验是否可以选择其他节点 true不可
            })
        },
        getAddPeople(item){
            wx.setStorageSync('ToActivityId',item.ToActivityId)
            const url = '/pages/publics/mailList/main?sign='+'process';
            wx.navigateTo({url:url});
        },
        changeAll(e,item){
            if(this.HasMatched){
                wx.showToast({
                    title:'不能选择当前节点',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else{
                item.Selected = e.mp.detail;
                item.ParticipantMember.forEach(v=>{
                    v.Selected = item.Selected;
                })
            }
        },
        onCloseAgree(){
            this.agreeShow = false;
            this.getClear([]);
        },
        changeItem(e,item,v){
            v.Selected = e.mp.detail;
            console.log(item.ParticipantMember.every(one=>one.Selected==true))
            for(let i=0;i<item.ParticipantMember.length;i++){
                if(item.ParticipantMember[i].Selected){
                    item.Selected = true;
                    break;
                }else {
                    item.Selected = false;
                }
            }
        },
        getSubmitStep(){
            for(let k=0;k<this.stepList.length;k++){
                if(this.stepList[k].Selected){
                    let isBook = this.stepList[k].ParticipantMember.some(d=>d.Selected);
                    if(isBook){
                        break;
                    }else{
                        wx.showToast({
                            // title:"请添加办理人员",
                            title:`${this.stepList[k].ToActivityName}人员不能为空`,
                            icon:"none",
                            duration:2000
                        })
                        return false;
                    }
                }else{
                    if(k==this.stepList.length-1){
                        wx.showToast({
                            title:"请添加办理人员",
                            icon:"none",
                            duration:2000
                        })
                        return false;
                    }
                }
            }
            const data = {
                actions:[]
            };
            let temp = [];
            // console.log(this.stepList,'202')
            for(let i=0;i<this.stepList.length;i++){
                for(let j=0; j<this.stepList[i].ParticipantMember.length;j++){
                    if(this.stepList[i].ParticipantMember[j].Selected){
                        temp.push(this.stepList[i].ParticipantMember[j].UserId);
                    }
                }
            }
            // console.log(this.stepList,'210')
            // console.log(temp,'211')
            let transitions = this.stepList.map(item=>({
                toActivityId: item.ToActivityId,
                transitionId: item.TransitionId,
                participators: item.ParticipantMember.filter(v=>v.Selected).map(ele=>{return ele.UserId})
            }))
            // console.log(transitions);
            // return false;
            data.actions.push({
                params:{
                    processId: this.processId,
                    name: this.processIdName,
                    processInstanceId: this.ProcessInstanceId,
                    ruleLogId: this.RuleLogId,
                    fromActivityId: this.fromActivityId,
                    description: this.describe,
                    transitions: transitions
                }
            });
            this.$httpWX.post({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.accept,
                    SessionKey:this.sessionkey,
                    message:JSON.stringify(data)
                }
            }).then(res=>{
                this.agreeShow = false;
                let status = res.actions[0].state;
                let that = this;
                if(status=='SUCCESS'){
                    wx.showToast({
                        title: "提交成功",
                        icon:"success",
                        duration:2000,
                        success:res=>{
                            setTimeout(() => {
                                that.getClear([]);
                                that.$parent.current = 1;
                                // that.$parent.getQuery();
                                // wx.navigateBack({
                                //     delta: 1
                                // })
                            }, 1000);
                        }
                    })
                }
            })
        },
    }
}
</script>
<style lang="scss">
    .agreeWrap {
    position: relative;
    background: #f2f2f2;
    .header {
      display: flex;
      padding: 30rpx;
      border-bottom: 1rpx solid #e2e4e3;
      width: 100%;
      background: #fff;
      .radius {
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 24rpx;
        border-radius: 50%;
        text-align: center;
        background: #3399ff;
        color: #fff;
      }
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
</style>