<template>
    <div class="wrap">
        <div class="nav">
            <i-tabs :current="current" @change="changeTabs">
                <i-tab key="tab1" title="表单"></i-tab>
                <i-tab key="tab2" title="文件"></i-tab>
                <i-tab key="tab3" title="流程"></i-tab>
                <i-tab key="tab4" title="关联"></i-tab>
                <i-tab key="tab5" title="讨论"></i-tab>
            </i-tabs>
        </div>
        <!-- <div class="rowWrap padding margin" v-if="current=='tab1'">
            <p>查看TA的历史记录</p>
            <p><i-icon type="enter" size="20" color="#cccccc" /></p>
        </div> -->
        <!-- jurisdiction 权限 -->
        <FormList ref="refChild" v-if="current=='tab1'" :current="statusCurrent" :ProcessId="processId" :ProcessInstanceId="processInstanceId"
         :RuleLogId="RuleLogId" :stateCode="stateCode" :jurisdiction="jurisdiction" />
        <!-- 表单 -->
        <!-- <div class="center margin padding"  v-if="current=='tab1'">
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="pactive"></p>
               </div>
               <div class="center">
                   <p>崔曼  发起申请</p>
               </div>
               <div class="time">
                   <p>05:22 11:10</p>
               </div>
           </div>
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="pactive"></p>
               </div>
               <div class="center">
                   <p>崔曼  <span>审批中</span></p>
               </div>
               <div class="time">
                   <p> 已等待7分钟</p>
               </div>
           </div>
           <div class="steps">
               <div class="step">
                   <p class="radius">崔曼</p>
                   <p class="admin">主管理员</p>
               </div>
               <div class="center">
                   <p>崔曼  <span>审批中</span></p>
               </div>
               <div class="time">
                   <p> 已等待7分钟</p>
               </div>
           </div>
        </div> -->
        <!-- 文件 -->
        <File v-if="current=='tab2'" :instanceId="instanceId" :processInstanceId="processInstanceId" :draft="draft"></File>
        <!-- 流程 -->
        <process v-if="current=='tab3'" :processInstanceId="processInstanceId" />
        <!-- 关联 -->
        <relation ref="child" :instanceId="instanceId" v-if="current=='tab4'" :draft="draft"></relation>
        <!-- 评论 -->
        <div class="comment" v-if="current=='tab5'">
            <div class="cont" v-for="(item,index) in commentList" :key="index" @click="getOpenDel(item)">
                <div class="lBox">
                    <p class="radius">{{item.CreatedByName}}</p>
                </div>
                <div class="rBox">
                    <div class="text">
                        <p class="name">{{item.CreatedByName}} {{item.BusinessUnitName}}</p>
                        <p class="comment">{{item.Comment}}</p>
                        <p class="time">{{item.CreatedOn}}</p>
                    </div>
                </div>
            </div>
            <div class="fixed" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
                <div class="box">
                    <p>
                        <input class="inp" v-model="commentVal" placeholder="请输入评论内容" type="text">
                    </p>
                    <!-- <p>
                        <i-icon type="emoji" size="30" />
                    </p> -->
                    <p class="send" @click="comment">
                        <span :class="{'active':commentVal!=''}">发送</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="footer" v-if="current!='tab5'&&sign!='off'" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="bottoms" v-if="isStatus">
                <div class="icon">
                    <div @click="getCirculation('W')">
                        <p>
                            <i class="iconfont icon-zhuanjiao"></i>
                        </p>
                        <p>委托</p>
                    </div>
                    <div @click="getCirculation('C')">
                        <p>
                            <i class="iconfont icon-chuanyue2"></i>
                        </p>
                        <p>传阅</p>
                    </div>
                    <div @click="handleRedo" v-if="statusCurrent=='tab3'">
                        <p>
                            <i class="iconfont icon-chuanyue2"></i>
                        </p>
                        <p>重办</p>
                    </div>
                    <div @click="getDetailMore">
                        <p>
                            <i class="iconfont icon-gengduo1"></i>
                        </p>
                        <p>更多</p>
                    </div>
                </div>
                <div class="btn" v-if="statusCurrent=='tab2'&&sign!='btnOff'">
                    <p @click="getRefuse">拒绝</p>
                    <p @click="getAgree">同意</p>
                </div>
            </div>
             <!-- {{item.stateCode==1?'审批中':item.stateCode==3?'已通过':item.stateCode==5?'已拒绝'
             :item.stateCode==4?'已撤销':item.stateCode==0?'草稿':item.stateCode==2?'挂起':''}} -->
            <div class="bottom_wrap" v-if="!isStatus&&statusCurrent=='tab1'">
                <div class="icon_box" @click="getUrging" v-if="stateCode==1">
                    <p>
                        <i class="iconfont icon-cuiban2"></i>
                    </p>
                    <p class="text">催办</p>
                </div>
                <div class="icon_box" @click="getRevoke" v-if="stateCode==1">
                    <p>
                        <i class="iconfont icon-chehui"></i>
                    </p>
                    <p class="text">撤销</p>
                </div>
                <div class="icon_box" @click="getCirculation('C')" v-if="stateCode!=0">
                    <p>
                        <i class="iconfont icon-chuanyue2"></i>
                    </p>
                    <p class="text">传阅</p>
                </div>
                <!-- <div class="icon_box">
                    <p>
                        <i class="iconfont icon-gengduo1"></i>
                    </p>
                    <p class="text">更多</p>
                </div> -->
            </div>
        </div>
        <!-- 拒绝弹框 -->
        <van-popup
            :show="refuseShow"
            position="center"
            custom-style="width:80%;height: auto;border-radius:10rpx;"
            overlay-style="background: #333;opacity: .5;"
            @close="onCloseRefuse">
            <div class="popup">
                <h3>拒绝意见</h3>
                <div class="text">
                    <textarea v-model="description" class="textarea" placeholder="请输入留言" name="" id="" cols="30" rows="10"></textarea>
                </div>
                <p @click="getReject">退回上一步</p>
                <p class="back" @click="getTostarter" v-if="jurisdiction?jurisdiction.HasFlowBackStart:''">退回发起人</p>
                <p @click="getTostep" v-if="jurisdiction?jurisdiction.HasFlowBack:''">退回指定节点</p>
            </div>
        </van-popup>
        <!-- 同意弹框 -->
        <van-popup
            :show="agreeShow"
            position="bottom"
            z-index="9999"
            custom-style="width:100%;height: auto;"
            @close="onCloseAgree"
            overlay-style="background: #333;opacity: .5;">
            <div class="agreeWrap">
                <div class="header">
                    <div>
                        <p class="radius">{{createdByName}}</p>
                    </div>
                    <div>
                        <h3>{{createdByName}}提交的流程申请表</h3>
                        <p><span>标题：</span>{{processIdName}}</p>
                    </div>
                </div>  
                <div class="cont">
                    <div v-for="(item,index) in stepList" :key="index">
                        <h3>
                            <!-- <van-checkbox use-icon-slot custom-class="checkbox" :name="item.TransitionId" :value="item.Selected" @change="(e)=>{changeAll(e,item)}">
                                
                                {{item.ToActivityName}}
                                <div class="slot" slot="icon" v-if="item.Selected">
                                    <p></p>
                                </div>
                                <div class="default" slot="icon" v-else></div>
                            </van-checkbox> -->
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
                            流程事务: {{processIdName}} ，请您查阅！
                            <!-- [ 05 绍兴第二医院医共体分院招标关于采购事项的审批单 信息中心 崔曼 ]，请您查阅！ -->
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
                        <!-- <p>上一环节</p> -->
                        <p @click="getSubmit">提交</p>  
                    </div>
                </div> 
            </div>
        </van-popup>
        <van-action-sheet
            :show=" sheetShow "
            :round="false"
            z-index="999"
            cancel-text="取消"
            :actions="actions"
            @close="onCloseSheet"
            @cancel="onCloseSheet"
        >
            <div class="sheetWrap">
                <!-- <p class="row" @click="getEntrust">委托</p> -->
                <p class="row" @click="getJump" v-if="jurisdiction?jurisdiction.HasFlowJump&&statusCurrent=='tab2':''">跳转</p>
                <p class="row" @click="getCirculation('JQ')" v-if="jurisdiction?jurisdiction.InsertApprove&&(statusCurrent=='tab2'||statusCurrent=='tab3'):''">加签</p>
                <p class="row" @click="getEndProcess" v-if="jurisdiction?jurisdiction.HasFlowFinish&&statusCurrent=='tab2':''">结束</p>
            </div>
        </van-action-sheet>
        <Urging :urgingShow="urgingShow" :processInstanceId="processInstanceId" />
        <van-action-sheet
            :show="delShow"
            cancel-text="取消"
            :actions="delActions"
            @close="onClosedel"
            @cancel="onClosedel"
            @select="onSelectdel"
        />
    </div>
</template>
<script>
import relation from '../../../components/relation';
import File from '../../../components/file';
import process from '@/components/process';
import { mapMutations, mapState } from 'vuex';
import FormList from '@/components/approval/formList';
import Urging from '@/components/instance/urging';
import {message} from '@/utils/message.js'
export default {
    components:{
        relation,
        File,
        process,
        FormList,
        Urging
    },
    data(){
        return {
            current:'tab1',
            refuseShow:false,
            agreeShow:false,
            checked:false,
            commentList:[],
            commentVal:"",
            sessionkey:"",
            processInstanceId:"",
            name:"",
            sheetShow:false,
            formList:[],
            id:"",
            urgingShow:false,
            delShow:false,
            delActions: [
                {
                    name: '复制',
                },
                {
                    name: '删除',
                }
            ],
            CommentId:"",
            commentText:"",
            processId:"",
            sign:"",
            RuleLogId:"",
            stepList:[],
            ToActivityId:"",
            createdByName:"",
            fromActivityId:"",
            isStatus:true, 
            stateCode:'',
            statusCurrent:"",
            jurisdiction:"", // 权限
            SplitType:'',
            processIdName:'',
            isFinal:false,
            draft:false, // 我发起-草稿状态
            HasMatched:false
        }
    },
    computed:{
        ...mapState({
            instanceId:state=>{
                return state.user.instanceId
            },
            selectListName:state=>{
                return state.mailList.selectListName;
            }
        }),
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        // ToActivityId(){
        //     return wx.getStorageSync('ToActivityId');
        // },
        processList(){
            let temp = [];
            // console.log(this.stepList,this.ToActivityId,'========')
            let index = this.stepList.findIndex(v=>v.ToActivityId===this.ToActivityId);
            // console.log(index,'index')
            if(this.selectListName!=''&&!wx.getStorageSync('forward')){
                this.selectListName.forEach(item=>{
                    // console.log(this.stepList[index],this.ToActivityId,'this.stepList[this.ToActivityId]');
                    this.stepList[index].ParticipantMember.push({
                        UserId:item.id,
                        FullName:item.FullName,
                        Selected:true,
                        BusinessUnitIdName:item.DeptName
                    })
                    this.stepList[index].Selected = true;
                })
            }
            temp = this.stepList;
            console.log(temp,'temptemp')
            return temp;
        }
    },
    onUnload(){
        this.getClear([]);
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        console.log(options);
        let sessionkey = wx.getStorageSync('sessionkey');
        // 2:待审批 3：已审批 4:传阅 1：我发起
        if(options.current){
            this.statusCurrent = options.current;
            this.isStatus = options.current=='tab2'||options.current=='tab3'?true:false;
            this.stateCode = options.stateCode;
        }
        this.sessionkey = sessionkey;
        this.name = options.name;
        this.processInstanceId = options.processInstanceId;
        this.draft = options.draft;
        this.id = options.id;
        this.processId = options.processId;
        this.sign = options.sign;
        console.log(options.RuleLogId,'RuleLogId')
        this.RuleLogId = options.RuleLogId;
        this.createdByName = options.createdByName;
        this.processIdName = options.processIdName;
        this.ToActivityId = options.toActivityId;
        this.fromActivityId = options.fromActivityId;
        if(options.toActivityId!=undefined){
            this.getJurisdiction();
        }
        this.getQuery();
        this.getCommentQuery();
        // this.getQueryFrom();
        wx.removeStorageSync('forward');
    },
    onShow(){
        this.ToActivityId = wx.getStorageSync('ToActivityId') || this.ToActivityId;
        const pages = getCurrentPages();
        const currPage = pages[pages.length-1];
        // console.log(currPage,'currPage')
        if(currPage.options.id!=undefined){
            this.id = currPage.options.id;
            this.processInstanceId = currPage.options.processInstanceId;
            this.name = currPage.options.name;
            this.updateInstanceId(this.processInstanceId);
        }else {
            currPage.id = this.id;
            currPage.processInstanceId = this.processInstanceId;
            currPage.name = this.name;
        }
        this.getQuery();
        console.log(this.id,this.processInstanceId,)
        if(wx.getStorageSync('forward')){
            this.getForward();
        }
    },
    methods:{
        // 按钮权限接口
        getJurisdiction(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:this.$api.instance.steppri,
                    processId:this.processId,
                    stepId:this.ToActivityId
                }
            }).then(res=>{
                this.jurisdiction = res.Right;
                // this.jurisdiction.TableRights.RL__FN_OutBuissnessBaoxiao_detail1_add = 2;
            })
        },
        getForward(){
            let temp = this.selectListName.map(item=>item.id);
            let obj = {
                actions:[
                    {
                        params:{
                            processId:this.processId,
                            processInstanceId:this.processInstanceId,
                            ruleLogId:this.RuleLogId,
                            participators:temp
                        }
                    }
                ]
            }
            this.$httpWX.post({
                url:this.$api.message.queryList+'?method='+this.$api.instance.forward,
                data:{
                    SessionKey:this.sessionkey,
                    message:JSON.stringify(obj)
                }
            }).then(res=>{
                console.log(res);
                wx.removeStorageSync('forward');
            })
        },
        changeAll(e,item,index){
            if(this.HasMatched){
                wx.showToast({
                    title:'不能选择当前节点',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else {
                item.Selected = e.mp.detail;
                // item.ParticipantMember.forEach(v=>{
                //     v.Selected = item.Selected;
                // })
                if (!item.Selected) {
                    item.ParticipantMember.forEach(v=>{
                        v.Selected = false;
                    })
                    if (this.SplitType == 'or') {
                        if (item.Selected) {
                            item.ParticipantMember.forEach((v, idx) => {
                                if (idx != index) {
                                    v.Selected = false;
                                }
                            })
                        }
                    }
                }
            }
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
        getAddPeople(item){
            wx.setStorageSync('ToActivityId',item.ToActivityId)
            const url = '/pages/publics/mailList/main?sign='+'process';
            wx.navigateTo({url:url});
        },
        finish(){
            let obj = {
                actions:[
                    {
                        params:{
                            processId:this.processId,
                            processInstanceId:this.processInstanceId,
                            ruleLogId:this.RuleLogId,
                            participators:"",
                            fromActivityId:this.ToActivityId
                        }
                    }
                ]
            }
            this.$httpWX.post({
                url:this.$api.message.queryList+'?method='+this.$api.approval.finish,
                data:{
                    SessionKey:this.sessionkey,
                    message:JSON.stringify(obj)
                }
            }).then(res=>{
                console.log(res);
                this.sheetShow = false;
                wx.navigateBack({
                    delta:1
                })
            })
        },
        // 结束
        getEndProcess(){
            let that = this;
            wx.showModal({
                content: '确定要结束当前事务吗？',
                success (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        that.finish();
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            
        },
        // 退回到发起人
        getTostarter(){
            let obj = {
                actions:[
                    {
                        params:{
                            processId:this.processId,
                            name:this.title,
                            processInstanceId:this.processInstanceId,
                            ruleLogId:this.RuleLogId,
                            fromActivityId:this.ToActivityId,
                            description:this.description
                        }
                    }
                ]
            }
            this.$httpWX.post({
                url:this.$api.message.queryList+'?method='+this.$api.approval.tostarter,
                data:{
                    SessionKey:this.sessionkey,
                    message:JSON.stringify(obj)
                }
            }).then(res=>{
                console.log(res);
                wx.navigateBack({
                    delta:1
                })
            })
        },
        // 拒绝
        getReject(){
            let obj = {
                actions:[
                    {
                        params:{
                            processId:this.processId,
                            name:this.title,
                            processInstanceId:this.processInstanceId,
                            ruleLogId:this.RuleLogId,
                            fromActivityId:this.ToActivityId,
                            description:this.description
                        }
                    }
                ]
            }
            this.$httpWX.post({
                url:this.$api.message.queryList+'?method='+this.$api.approval.refuse,
                data:{
                    SessionKey:this.sessionkey,
                    message:JSON.stringify(obj)
                }
            }).then(res=>{
                console.log(res);
                wx.navigateBack({
                    delta:1
                })
            })
        },
        // 退回到指定节点
        getTostep(){
            this.sheetShow = false;
            const url = '/pages/todoBusiness/jump/main?processId='+this.processId+'&processInstanceId='+this.processInstanceId
            +'&ToActivityId='+this.ToActivityId+'&RuleLogId='+this.RuleLogId+'&sign='+'1';
            wx.navigateTo({
                url:url
            })
        },
        // 同意-提交
        getSubmit(){
            let temp = [];
            if(!this.isFinal){
                let isBook = this.stepList.some(d=>d.Selected);
                if(isBook){
                    this.stepList.forEach((item,index)=>{
                        if(item.Selected){
                            temp.push({
                                toActivityId:item.ToActivityId,
                                transitionId:item.TransitionId,
                                participators:[]
                            })
                            let is = item.ParticipantMember.some(c=>c.Selected);
                            if(is){
                                for(let i=0; i<item.ParticipantMember.length;i++){
                                    if(item.ParticipantMember[i].Selected){
                                        temp[temp.length-1].participators.push(item.ParticipantMember[i].UserId);
                                    }
                                }
                            }else {
                                wx.showToast({
                                    title:"人员不能为空",
                                    icon:'none',
                                    duration:2000
                                })
                                throw Error('error');
                            }
                        }
                    })
                    for(let i=0;i<temp.length;i++){
                        if(temp[i].participators==''){
                            temp.splice(i,1)
                        }
                    }
                    let obj = {
                        actions:[
                            {
                                params:{
                                    processId:this.processId,
                                    name:this.title,
                                    processInstanceId:this.processInstanceId,
                                    ruleLogId:this.RuleLogId,
                                    fromActivityId:this.fromActivityId,
                                    description:this.description,
                                    transitions:temp
                                }
                            }
                        ]
                    }
                    console.log(obj,temp,'obj');
                    this.$httpWX.post({
                        url:this.$api.message.queryList+'?method='+this.$api.approval.accept,
                        data:{
                            SessionKey:this.sessionkey,
                            message:JSON.stringify(obj)
                        }
                    }).then(res=>{
                        console.log(res);
                        wx.navigateBack({
                            delta:1
                        })
                    })
                }else {
                    wx.showToast({
                        title:"人员不能为空",
                        icon:'none',
                        duration:2000
                    })
                }
            }else {
                this.stepList.forEach((item,index)=>{
                    if(item.Selected){
                        temp.push({
                            toActivityId:item.ToActivityId,
                            transitionId:item.TransitionId,
                            participators:[]
                        })
                    }
                })
                let obj = {
                    actions:[
                        {
                            params:{
                                processId:this.processId,
                                name:this.title,
                                processInstanceId:this.processInstanceId,
                                ruleLogId:this.RuleLogId,
                                fromActivityId:this.fromActivityId,
                                description:this.description,
                                transitions:temp
                            }
                        }
                    ]
                }
                this.$httpWX.post({
                    url:this.$api.message.queryList+'?method='+this.$api.approval.accept,
                    data:{
                        SessionKey:this.sessionkey,
                        message:JSON.stringify(obj)
                    }
                }).then(res=>{
                    console.log(res);
                    wx.navigateBack({
                        delta:1
                    })
                })
            }
        },
        ...mapMutations(['updateInstanceId','getClear']),
        getQueryFrom(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.mobileform,
                    SessionKey:this.sessionkey,
                    ProcessId:this.processId,
                    ProcessInstanceId:this.processInstanceId
                }
            }).then(res=>{
                console.log(res);
                this.formList = res.layout;
                this.formList.forEach(item=>{
                    this.$set(item,'value','');
                    this.$set(item,'require',false);
                    this.$set(item,'index','');
                })
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.instance.get",
                    SessionKey:this.sessionkey,
                    processInstanceId:this.processInstanceId,
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getDetailMore(){
            this.sheetShow = true;
        },
        onCloseSheet(){
            this.sheetShow = false;
        },
        // 跳转
        getJump(){
            this.sheetShow = false;
            const url = '/pages/todoBusiness/jump/main?processId='+this.processId+'&processInstanceId='+this.processInstanceId
            +'&ToActivityId='+this.ToActivityId+'&RuleLogId='+this.RuleLogId;
            wx.navigateTo({
                url:url
            })
        },
        // 传阅
        getCirculation(sign){
            this.sheetShow = false;
            const url = '/pages/todoBusiness/circulate/main?name='+this.name+'&ruleLogId='+this.RuleLogId
            +'&processId='+this.processId+'&processInstanceId='+this.processInstanceId+'&sign='+sign+'&ToActivityId='+this.ToActivityId+'&fromActivityId='+this.fromActivityId;
            wx.navigateTo({url:url});
        },
        // 重办
        handleRedo(){
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data:{
                    method: this.$api.instance.redo,
                    SessionKey: this.sessionkey,
                    ruleLogId: this.RuleLogId,
                    processInstanceId: this.processInstanceId
                }
            }).then(res=>{
                if(res.status!==1){
                    message.toast({
                        title: res.msg,
                        success:success=>{

                        }
                    })
                }else {
                    this.getQuery();
                }
            })
        },
        // 评论列表
        getCommentQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"object.comments.getlist",
                    SessionKey:this.sessionkey,
                    id:this.instanceId,
                }
            }).then(res=>{
                console.log(res);
               this.commentList = res.listData;
            })
        },
        comment(){
            if(this.commentVal!=''){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:"object.comment.add",
                        SessionKey:this.sessionkey,
                        objectid:this.instanceId,
                        comments:this.commentVal
                    }
                }).then(res=>{
                    console.log(res);
                    this.commentVal = "";
                    this.getCommentQuery();
    
                })
            }
        },
        changeTabs(e){
            this.current = e.mp.detail.key;
        },
        // 拒绝
        getRefuse(){
            this.refuseShow = true;
        },
        onCloseRefuse(){
            this.refuseShow = false;
        },
        async getAgree(){
            // 保存表单
            await this.$refs.refChild.getSubmitComplete();
            // console.log(this.$refs.child.$emit);
            // this.$refs.child.$emit('childMethod','hello');
            this.agreeShow = true;
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.stepList,
                    SessionKey:this.sessionkey,
                    RuleLogId:this.RuleLogId,
                    ProcessInstanceId:this.processInstanceId
                }
            }).then(res=>{
                console.log(res);
                this.stepList = res.transitions;
                this.SplitType = res.SplitType;
                this.isFinal = res.isFinal;
                this.fromActivityId = res.fromActivityId;
                this.HasMatched = res.HasMatched;
            })

        },
        onCloseAgree(){
            this.agreeShow = false;
            this.getClear([]);
        },
        // 委托
        getEntrust(){
            wx.setStorageSync('forward',true)
            const url = '/pages/publics/mailList/main';
            wx.navigateTo({url:url});
        },
        entrust(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.refuse,
                    SessionKey:this.sessionkey,
                    message:{
                        ProcessId:this.processId,
                        ProcessInstanceId:this.processInstanceId,
                        objectTypeCode:"",
                        ruleLogId:"",
                        fromActivityId:"",
                        transitions:""
                    }
                }
            }).then(res=>{
                console.log(res);
            })
        },
        // 催办
        getUrging(){
            this.urgingShow = true;
        },
        // 撤销
        getRevoke(){
            let that = this;
            wx.showModal({
                content: '你确定要撤销申请吗？',
                success : res=> {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        that.revoke();
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        },
        revoke(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.instance.cancelsubmit,
                    SessionKey:this.sessionkey,
                    processInstanceId:this.processInstanceId
                }
            }).then(res=>{
                console.log(res);
                wx.navigateBack({
                    delta:1
                })
            })
        },
        // 评论删除
        getOpenDel(item){
            this.CommentId = item.CommentId;
            this.commentText = item.Comment;
            this.delShow = true;
        },
        onClosedel(){
            this.delShow = false;
        },
        onSelectdel(e){
            console.log(e);
            let {name} = e.mp.detail;
            if(name=='复制'){
                wx.setClipboardData({
                    data: this.commentText,
                    success (res) {
                        wx.getClipboardData({
                            success (res) {
                                console.log(res.data) // data
                            }
                        })
                    }
                })
            }else if(name=='删除'){
                this.commentDelete();
            }
        },
        commentDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.public.delete,
                    SessionKey:this.sessionkey,
                    Id:this.CommentId,
                    ObjTypeCode:123
                }
            }).then(res=>{
                console.log(res);
                this.getCommentQuery();
                this.delShow = false;
            })
        }
    }
}
</script>
<style scoped lang="scss">
    @import '../../../../static/css/approval.css';
    @import '../../../../static/css/public.scss';
    @import '../../../../static/css/schedule.css';
    .wrap{
        padding-bottom: 100px!important;
        .rowWrap{
            background: #fff;
            font-size: 28rpx;
            color: #666666;
            display: flex;
            justify-content: space-between;
        }
        .center{
            background: #fff;
            .steps:last-child .step .pactive{
                width: 0;
                height: 0;
                border: none;
            }
            .steps{
                display: flex;
                .step{
                    p:nth-child(1){
                        width: 60rpx;
                        height: 60rpx;
                        line-height: 60rpx;
                        font-size: 10px;
                    }
                    .pactive{
                        width: 10px;
                        height: 50rpx;
                        border-right:1px dashed #cccccc ;
                        margin-left: 8rpx;
                    }
                    .admin{
                        background: #e4f5ff;
                        padding: 5rpx;
                        color: #3399ff;
                        font-size: 8px;
                    }
                }
                .center{
                    flex: 1;
                    font-size: 12px;
                    line-height: 60rpx;
                    color: #666666;
                    margin-left: 10px;
                    p{
                        span{
                            color: #d49746;
                        }
                    }
                }
                .time{
                    font-size: 12px;
                    line-height: 60rpx;
                    color: #666666;
                }
            }
        }
        .comment{
            width: 100%;
            .cont:last-child .rBox{
                border: none;
            }
            .cont{
                background: #fff;
                display: flex;
                padding: 0 30rpx ;
                .lBox{
                    width: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20rpx 0;
                    .radius{
                        width: 80rpx;
                        height: 80rpx;
                        line-height: 80rpx;
                        font-size: 26rpx;
                    }
                }
                .rBox{
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1rpx solid #f6f6f6;
                    padding: 20rpx 0;
                    .text{
                        .name{
                            font-size: 28rpx;
                            color: #3399ff;
                        }
                        .comment{
                            font-size: 35rpx;
                            color: #333333;
                            padding: 10rpx 0;
                        }
                        .time{
                            color: #bbbbbb;
                            font-size: 24rpx;
                        }
                    }
                }
            }
            .fixed{
                width: 100%;
                position: fixed;
                bottom: 20px;
                background: #fff;
                // padding: 20rpx;
                .box{
                    display: flex;
                    justify-content: space-between;
                    padding: 20rpx;
                    p:nth-child(1){
                        width: 80%;
                        .inp{
                            background: #eceeed;
                            border-radius: 10rpx;
                            height: 35px;
                            padding-left: 10rpx;
                        }
                    }
                    .send{
                        span{
                            display: inline-block;
                            width: 130rpx;
                            height: 35px;
                            line-height: 35px;
                            text-align: center;
                            color: #ffffff;
                            background: #3399ff;
                            border-radius: 10rpx;
                            font-size: 28rpx;
                            opacity: .5;
                        }
                        span.active{
                            opacity: 1;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 999;
            .bottom_wrap{
                display: flex;
                padding: 19rpx 0rpx;
                justify-content: space-between;
                .icon_box{
                    width: 187rpx;
                    text-align: center;
                    p{
                        font-size: 12px;
                        .iconfont{
                            font-size: 20px;
                            color: #646464;
                        }
                    }
                    .text{
                        margin-top: 14rpx;
                    }
                }
            }
            .bottoms{
                display: flex;
                padding: 19rpx 30rpx;
                justify-content: center;
                align-items: center;
                .icon{
                    width: 50%;
                    display: flex;
                    justify-content: space-around;
                    div{
                        // margin-right: 30px;
                        p{
                            font-size: 20rpx;
                            color: #666666;
                            display: flex;
                            justify-content: center;
                            .iconfont{
                                font-size: 20px;
                                color: #646464;
                            }
                        }
                    }
                }
                .btn{
                    width: 50%;
                    display: flex;
                    p{
                        width: 80px;
                        height: 35px;
                        line-height: 35px;
                        text-align: center;
                        background: #3399ff;
                        font-size: 32rpx;
                        color: #fff;
                    }
                    p:nth-child(1){
                        color: #3399ff;
                        background: #fff;
                        border:1px solid #cccccc;
                        border-right: none;
                    }
                }
            }
        }
        .popup{
            padding-bottom: 10px;
            h3{
                font-size: 30rpx;
                color: #3399ff;
                border-bottom: 2rpx solid #3399ff;
                text-align: center;
                padding: 20rpx 0;
            }
            .text{
                .textarea{
                    background: #e4e4e4;
                    height: 80px;
                    padding: 10px;
                    border-radius: 10rpx;
                    width: 85%;
                    margin: 20px auto;
                }
            }
            p{
                width: 90%;
                height: 40px;
                line-height: 40px;
                font-size: 28rpx;
                border-radius: 10rpx;
                margin: 0 auto;
                background: #fff;
                color: #3399ff;
                text-align: center;
                border:1rpx solid #cccccc;
                margin-bottom: 10px;
            }
            .back{
                color: #fff;
                background: #3399ff;
                border: none;
                // margin: 10px auto;
            }
        }
        .agreeWrap{
            position: relative;
            background: #f2f2f2;
            .header{
                display: flex;
                padding: 30rpx;
                border-bottom: 1rpx solid #e2e4e3;
                width: 100%;
                background: #fff;
                // position: fixed;
                div:nth-child(2){
                    margin-left: 20rpx;
                    h3{
                        font-size: 28rpx;
                        font-weight:bold;
                    }
                    p{
                        font-size: 12px;
                        color: #333333;
                        margin-top: 10rpx;
                        span{
                            color: #666666;
                        }
                    }
                }
            }
            .cont{
                width: 100%;
                // position: absolute;
                // top: 70px;
                height: 400px;
                overflow: scroll;
                padding-bottom: 50px;
                h3{
                    background: #f2f2f2;
                    font-size: 12px;
                    color: #999999;
                    padding: 20rpx;
                    .checkbox{
                        display: flex !important;
                        align-items: center !important;
                    }
                    .slot{
                        width: 28rpx;
                        height: 28rpx;
                        border: 2rpx solid #3399ff;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        p{
                            width: 13rpx;
                            height: 13rpx;
                            background: #3399ff;
                            border-radius: 50%;
                        }
                    }
                    .default{
                        width: 28rpx;
                        height: 28rpx;
                        border: 2rpx solid #c8c9cc;
                        border-radius: 50%;
                    }
                }
                .box{
                    padding: 20rpx;
                    background: #fff;
                    .row{
                        padding: 20rpx 0;
                        font-size: 28rpx;
                        border-bottom: 1rpx solid #e2e4e3;
                        color: #333333;
                        display: flex;
                        justify-content: space-between;
                    }
                    .rows{
                        padding: 10rpx 0 0 0;
                        font-size: 28rpx;
                        color: #333333;
                        display: flex;
                        justify-content: center;
                        .add{
                            // text-align: center;
                            color: #3399ff;
                            span{
                                margin-top: 10rpx;
                                display: inline-block;
                            }
                        }
                    }
                }
                .popupRow{
                    .row{
                        padding: 20rpx;
                        color: #999999;
                        font-size: 12px;
                        background: #f2f2f2;
                        display: flex;
                        justify-content: space-between;
                        p:nth-child(2){
                            span:nth-child(1){
                                display: inline-block;
                                background: #3399ff;
                                border-top-left-radius: 10rpx;
                                border-bottom-left-radius: 10rpx;
                                padding: 10rpx 20rpx;
                                color: #fff;
                            }
                            span:nth-child(2){
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
                    .text{
                        padding: 20rpx;
                        background: #fff;
                        font-size: 12px;
                        color: #333333;
                    }
                }
                .textarea{
                    padding: 20rpx;
                    background: #fff;
                    margin-top: 20rpx ;
                    p{
                        font-size: 28rpx;
                        font-weight: bold;
                    }
                    textarea{
                        height: 80px;
                    }
                }
            }
            .fot{
                width: 100%;
                position: fixed;
                bottom: 0;
                background: #fff;
                border-top: 1rpx solid #e2e3e5;
                z-index: 99999;
                .box{
                    display:flex;
                    justify-content: center;
                    p{
                        width: 50%;
                        text-align: center;
                        color: #3399ff;
                        padding: 20rpx;
                        border-right: 1rpx solid #f2f2f2;
                    }
                    p:last-child{
                        background: #3399ff;
                        color: #ffffff;
                    }
                }

            }
        }
        .sheetWrap{
            width: 100%;
            .title{
                text-align: center;
                font-size: 22rpx;
                color: #999999;
                padding: 13rpx 0;
            }
            .row{
                text-align: center;
                padding: 26rpx 0;
                font-size: 33rpx;
                color: #3399ff;
                border-top: 1rpx solid #eceeed
            }
        }
    }
</style>