<template>
    <div class="wrap">
        <div v-for="(item,index) in list" :key="index">
            <van-cell-group v-if="item.type=='S'||item.type=='E'||item.type=='N'||item.type=='H'" custom-class="cell">
                <van-field
                    :value="item.value"
                    :disabled="item.readonly"
                    custom-style="font-size:34rpx;color:#333333"
                    :required="item.required||item.require||false"
                    :label="item.label"
                    :placeholder="item.helpText"
                    input-align="right"
                    @change="function(val){changeInput(val,item)}"
                />
            </van-cell-group>
            <!-- 单选 -->
            <van-cell-group v-if="item.type=='RBL'" custom-class="cell">
                <div class="radioWrap">
                    <p class="label">{{item.label}}</p>
                    <van-radio-group :disabled="item.readonly" :value="item.value" @change="(e)=>{changeRadio(e,item,index)}">
                        <div class="radio">
                            <van-radio :name="v.value" custom-class="radio" v-for="(v,i) in currenData[item.id]" :key="i">
                                <p class="tag">{{v.label}}</p>
                            </van-radio>
                        </div>
                    </van-radio-group>
                </div>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='L'||item.type=='DT'||item.type=='LT'">
                <picker :disabled="item.readonly" @change="(val)=>{bindPickerChange(val,item)}" :value="item.index" range-key="label" :range="currenData[item.entityApiName].picklistFieldValues[item.id].values">
                    <van-field
                        :value="currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index]&&currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].label"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||item.require||false"
                        disabled
                        :label="item.label"
                        :placeholder="item.helpText"
                        input-align="right"
                        right-icon="arrow"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='D'">
                <picker :disabled="item.readonly" mode="date" :value="item.value" @change="function(val){bindDateChange(val,item)}">
                    <van-field
                        :value="item.value"
                        title-width="110px"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||item.require||false"
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='TP'">
                <picker mode="time" :value="time" @change="function(val){bindTimeChange(val,item)}">
                    <van-field
                        :value="item.value"
                        title-width="110px"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||item.require||false"
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='F'">
                <picker :disabled="item.readonly" class="picker" mode="multiSelector" :value="item.multiIndex" @change="((val)=>{bindMultiPickerChange(val,item)})"
                    :range="newMultiArrayList">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||item.require||false"
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='Year'">
                <picker :disabled="item.readonly" mode="date" :value="item.value" fields="year"  @change="((e)=>{bindYear(e,item)})">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||item.require||false"
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='Month'">
                <picker :disabled="item.readonly" mode="date" :value="item.value" fields="month"  @change="((e)=>{bindYMonth(e,item)})">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||item.require||false"
                        disabled
                        :label="item.label"
                        input-align="right"
                        right-icon="arrow"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='G'||item.type=='MC'">
                <div class="checkWrap">
                    <p class="label">
                        <span>{{item.required||item.require?'*':''}}</span>
                        {{item.label}}
                    </p>
                    <van-checkbox-group :disabled="item.readonly" :value="item.result" @change="((e)=>{changeCheckTag(e,item,index)})">
                        <div class="checkboxGroup">
                            <van-checkbox :name="v.value" v-for="(v,i) in currenData[item.id]" :key="i" custom-class="check" label-class="labels"  shape="square">
                                <p class="tag">{{v.label}}</p>
                            </van-checkbox>
                        </div>
                    </van-checkbox-group>
                </div>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='U'||item.type=='O'||item.type=='Y_MD'||item.type=='Y'">
                <van-cell custom-class="title" :required="item.required||item.require||false" value-class="cellValue" :title="item.label" is-link :value="item.value" @click="!item.readonly?getOpenModal(item,index):''" />
            </van-cell-group>
            <div class="switch" v-if="item.type=='H'">
                <p>
                    {{item.label}}
                </p>
                <p>
                    <van-switch :checked="item.value" @change="(val)=>{changeSwitch(val,item)}" size="24px" />
                </p>
            </div>
            <div class="row" v-if="item.type=='UCS'||item.type=='X'||item.type=='J'||item.type=='UC'">
                <p class="title">{{item.required||item.require?'*':''}}<span>{{item.label}}</span></p>
                <textarea :disabled="item.readonly" :v-model="item.value"
                 @input="function(val){changeText(val,item,index)}"
                  name="" id="" cols="30" rows="10" placeholder-class="placeholder" :placeholder="!item.readonly?item.helpText:''"></textarea>
            </div>
            <div class="parentWrap" v-if="item.type=='RelatedList'">
                <h3>{{item.label}}</h3>
                <div class="box" v-for="(self,idx) in item[item.id]" :key="idx">
                    <div class="title">
                        <span>
                            {{item.label}} ({{idx+1}})
                        </span>
                        <span class="del" v-if="idx!=0" @click="handleDelChild(item[item.id],self,idx)">
                            删除
                        </span>
                    </div>
                    <div class="rowBox" v-for="(v,i) in self" :key="i">
                        <van-cell-group v-if="v.type=='S'||v.type=='E'||v.type=='N'||v.type=='H'" custom-class="cell">
                            <van-field
                                :value="v.value"
                                custom-style="font-size:34rpx;color:#333333"
                                :required="v.required||false"
                                :label="v.label"
                                :placeholder="v.helpText"
                                input-align="right"
                                @change="function(e){changeInput(e,v,item[item.id],idx,item)}"
                            />
                        </van-cell-group>
                        <van-cell-group custom-class="cell" v-if="v.type=='L'||v.type=='DT'||v.type=='LT'">
                            <picker @change="(e)=>{bindPickerChange(e,v,item[item.id],idx,item)}" :value="v.index" range-key="label" :range="v.picklistFieldValues">
                                <van-field
                                    :value="v.picklistFieldValues[v.index] && v.picklistFieldValues[v.index].label"
                                    input-class="inp"
                                    custom-style="font-size:34rpx;color:#333333"
                                    :required="v.required||false"
                                    disabled
                                    :label="v.label"
                                    :placeholder="v.helpText"
                                    input-align="right"
                                    right-icon="arrow"
                                />
                                </picker>
                        </van-cell-group>
                        <van-cell-group custom-class="cell" v-if="v.type=='D'">
                            <picker :disabled="v.readonly" mode="date" :value="v.value" @change="function(e){bindDateChange(e,v,item[item.id],idx,item)}">
                                <van-field
                                    :value="v.value"
                                    title-width="110px"
                                    input-class="inp"
                                    custom-style="font-size:34rpx;color:#333333"
                                    :required="v.required||false"
                                    disabled
                                    :label="v.label"
                                    input-align="right"
                                    right-icon="arrow"
                                    :placeholder="v.helpText"
                                />
                            </picker>
                        </van-cell-group>
                        <van-cell-group custom-class="cell" v-if="v.type=='U'||v.type=='O'||v.type=='Y_MD'||v.type=='Y'">
                            <!-- value:list[index][item.id][idx][i].value -->
                            <van-cell value-class="cellValue" :required="v.required||false" :title="v.label" is-link :value="v.value.Name" @click="!v.readonly?getOpenModal(item,index,idx,v,i,item[item.id]):''" />
                        </van-cell-group>
                        <div class="row" v-if="v.type=='UC'">
                            <p class="title">
                                {{v.required||v.require?'*':''}}
                                <span>{{v.label}}</span></p>
                            <textarea :disabled="v.readonly" v-model="v.value" name="" id="" cols="30" rows="10" placeholder-class="placeholder" :placeholder="v.helpText"></textarea>
                        </div>
                    </div>
                </div>
                <p class="add_child" @click="handleAddChild(item)">
                    <span class="icon">
                        <van-icon name="plus" />
                    </span>
                    增加{{item.label}}
                </p>
            </div>
        </div>
        <!-- <div class="row">
            <p class="title">*<span>内容</span></p>
            <textarea v-model="content" name="" id="" cols="30" rows="10" placeholder-class="placeholder" placeholder="请输入"></textarea>
        </div> -->
        <div class="row">
            <p class="text">图片</p>
            <div class="content">
                <div class="box" v-for="(item,index) in imgList" :key="index">
                    <img :src="item" alt="">
                </div>
                <div class="box" @click="getChooseImage">
                    <i-icon type="add" size="40" color="#bec5c5" />
                </div>
            </div>
        </div>
        <!-- <div class="row">
            <p class="text">附件</p>
            <div class="content">
                <div class="box" v-for="(item,index) in imgList" :key="index">
                    <img :src="item" alt="">
                </div>
                <div class="box">
                    <i-icon type="add" size="40" color="#bec5c5" />
                </div>
            </div>
        </div> -->
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="btn">
                <van-button type="primary" color="#3399ff" block @click="getSubmit">提交</van-button>
            </div>
        </div>

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
                    <li @click="getPopupSel(item,index)" v-for="(item,index) in departList" :key="index">
                        <p>{{item.Name}}</p>
                        <p v-if="popupIdx==index">
                            <i-icon type="right" />
                        </p>
                    </li>
                </ul>
            </div>
        </van-popup>
        <!-- 同意弹框 -->
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
                        <p class="radius">{{createdByName}}</p>
                    </div>
                    <div>
                        <h3>{{createdByName}}提交的流程申请表</h3>
                        <p><span>标题：</span>{{processIdName}}</p>
                    </div>
                </div>  
                <div class="cont">
                    <div v-for="(item,index) in testLists" :key="index">
                        <h3>
                            <!-- <van-checkbox :name="item.TransitionId" :value="item.Selected" @change="(e)=>{changeAll(e,item)}">{{item.ToActivityName}}</van-checkbox> -->
                            <van-checkbox :disabled="HasMatched&&item.Selected?true:false" custom-class="checkbox" :name="item.TransitionId" :value="item.Selected" @change="(e)=>{changeAll(e,item,index)}">
                                {{item.ToActivityName}}
                            </van-checkbox>
                        </h3>
                        <div class="box">
                            <div class="row" v-for="(v,i) in item.ParticipantMember" :key="i">
                                <van-checkbox :name="v.UserId" :value="v.Selected" @change="(e)=>{changeItem(e,item,v)}">{{v.FullName}}/{{v.BusinessUnitIdName}}</van-checkbox>
                            </div>
                            <!-- <div class="row">
                                <van-checkbox :value="checked" @change="onChange">张丽萍(zlp001)/人事科/行政部</van-checkbox>
                                <p><i-icon type="close" size="20" color="#3399ff" /></p>
                            </div> -->
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
import list from '@/utils/test.js';
import {newMultiArray} from '@/utils/multiArray';
import { mockData,dataList,serachList,testList } from '@/utils/mock';
import { mapMutations, mapState } from 'vuex';
import { currentTime } from '../../../utils/currentTime';
import { message } from '@/utils/message';
export default {
    data(){
        return {
            title:"通用请示报告",
            index:0,
            level:['普通','紧急','加急'],
            content:"",
            imgList:[],
            ProcessId:"",
            sessionkey:"",
            fullName:"",
            list:[
            ],
            result:[],
            isShow:false,
            popupIdx:-1,
            checked:false,
            currenData:[],
            record:{},
            searchId:"",
            sObjectType:"",
            searchIdx:'',
            ProcessInstanceId:"",
            RuleLogId:"",
            listData:[],
            lksrch:"",
            agreeShow:false,
            params:{
                processId:"",
                parentRecord:{
                    id:"",
                    apiName: "",
                    objTypeCode: "",
                    fields:{}
                },
                // 子表
                relatedRecords:[],
                // 删除子表
                deleteRecords:[]
            },
            testLists:[],
            fromActivityId:"",
            createdByName:"",
            processIdName:"",
            SplitType:"",
            leaveType:"", // 假期类型
            Balance:"", // 假期余额
            startTime:"",
            endTime:"",
            HasMatched:false,
            departList: [],
            childIdx: '',
            childForIdx: '',
            rowI: ''
        }
    },
    computed:{
        yearNumber(){
            let year = new Date().getFullYear();
            return year;
        },
        UserId(){
            return wx.getStorageSync('userId');
        },
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        newMultiArrayList(){
            return newMultiArray();
        },
        // ToActivityId(){
        //     return wx.getStorageSync('ToActivityId');
        // },
        ...mapState({
            selectListName:state=>{
                console.log(state.mailList.selectListName);
                return state.mailList.selectListName;
            }
        }),
        processList(){
            let temp = [];
            // console.log(this.testLists,this.ToActivityId,'testListstestLists')
            let ToActivityId = wx.getStorageSync('ToActivityId');
            let index = this.testLists.findIndex(v=>v.ToActivityId===ToActivityId);
            if(this.selectListName!=''){
                this.selectListName.forEach(item=>{
                    // console.log(this.testLists[index],this.ToActivityId,'this.testLists[this.ToActivityId]');
                    this.testLists[index].ParticipantMember.push({
                        UserId:item.id,
                        FullName:item.FullName,
                        Selected:true,
                        BusinessUnitIdName:item.DeptName
                    })
                    this.testLists[index].ParticipantMember = this.unique(this.testLists[index].ParticipantMember);
                    this.testLists[index].Selected = true;
                })
            }
            temp = this.testLists;
            // console.log(temp,'temptemp')
            return temp;
        }
    },
    onUnload(){
        this.getClear([]);
        wx.removeStorageSync('EntityType');
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.getClear([]);
        // this.testLists = testList.listData;
        // console.log(mockData,dataList,testList,'mockData');
        // console.log(serachList,'serachList');
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.fullName = wx.getStorageSync('fullName');
        this.title = options.name;
        this.ProcessId = options.ProcessId;
        this.RuleLogId = options.RuleLogId;
        this.ProcessInstanceId = options.ProcessInstanceId;
        this.params.processId = options.ProcessId;
        this.params.parentRecord.id = options.ProcessInstanceId;
        this.createdByName = wx.getStorageSync('fullName');
        this.processIdName = options.name;
        // this.list = list.listData;
        // this.getLayoutQuery();
        // this.getQueryFrom();
        this.getLayoutData();
        wx.removeStorageSync('ToActivityId');
        // this.list = mockData;
        // this.currenData = dataList.actions[0].returnValue.masterRecord.picklistValuesMap;
        // this.record = dataList.actions[0].returnValue.masterRecord.record;
        // this.list.forEach(item=>{
        //     if(item.type=='L'){
        //         this.$set(item,'index',-1);
        //     }else{
        //         let date = '';
        //         this.$set(item,'value',date);
        //     }
        //     if(item.fields){
        //         item.fields.forEach(v=>{
        //             let date = '';
        //             this.$set(v,'value',date);
        //         })
        //     }
        // })
        // console.log(this.list,'----');
        // // this.dataList = dataList;
        // this.list.forEach(item=>{
        //     if(item.type=='T'){
        //         let multiIndex = this.getIndex(item.value);
        //         item.multiIndex = multiIndex;
        //     }
        // })
    },
    watch:{
        // currenData: {
        //     handler(newVal, oldVal){
        //         console.log(newVal,oldVal);
        //     },
        //     deep: true
        // }
    },
    methods:{
        ...mapMutations(['getClear']),
        // 增加子表
        handleAddChild(item){
            console.log(item,'item')
            item.fields.forEach(item=>{
                this.$set(item,'value','')
            })
            var list = JSON.parse(JSON.stringify(item.fields))
            for(var i=0;i<list.length;i++){
                this.$set(list[i],'value','')
                if(list[i].type=='DT'||list[i].type=='LT'||list[i].type=='L'){
                    list[i].picklistFieldValues = this.currenData[list[i].entityApiName].picklistFieldValues[list[i].id].values;
                }
            }
            console.log('list-list',list)
            item[item.id].push({
                ...list
            })
            console.log(item[item.id],'item[item.id]')
        },
        addForm(item){
            item.fields.forEach(v=>{
                this.$set(v,'value','');
            })
            this.$set(item,item.id,[[item.fields]])
        },
        // 删除子表
        handleDelChild(list,item,index){
            list.splice(index,1);
        },
        // 子表input赋值
        changeInputChild(e,item,list){
            console.log(e);
            console.log('item',item)
            item.value = e.mp.detail;
            console.log(list,'====')
        },
        changeText(e,v,i){
            console.log(e,v);
            this.list[i].value = e.mp.detail.value;
            this.params.parentRecord.fields[v.id] = e.mp.detail.value; //  传值
            // v.value = e.mp.detail.value;
        },
        unique(arr){
            for(let i = 0; i < arr.length; i++){
                for(let j = i + 1; j < arr.length; j++){
                    if(arr[i].UserId==arr[j].UserId){
                        arr.splice(j,1);
                        j--;
                    }
                }
            }
            return arr;
        },
        getQueryFrom(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.mobileform,
                    SessionKey:this.sessionkey,
                    ProcessId:this.ProcessId,
                }
            }).then(res=>{
                console.log(res);
                this.list = res.layout;
                this.list.forEach(item=>{
                    this.$set(item,'value','');
                    this.$set(item,'require',false);
                    this.$set(item,'index','');
                    if(item.type=='F'){
                        let multiIndex = this.getIndex(currentTime());
                        item.multiIndex = multiIndex;
                        console.log(multiIndex,'multiIndex');
                    }
                })
            })
        },
        getLayoutQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.layout,
                    SessionKey:this.sessionkey,
                    processId:this.ProcessId
                }
            }).then(res=>{
                console.log(res);
            })
        },
        getLayoutData(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.layoutData,
                    SessionKey:this.sessionkey,
                    processId:this.ProcessId,
                    ProcessInstanceId:this.ProcessInstanceId,
                    RuleLogId:this.RuleLogId
                }
            }).then(res=>{
                this.list = res.actions[0].returnValue.layoutItems;
                // this.currenData = res.actions[0].returnValue.masterRecord.picklistValuesMap;
                this.currenData = res.actions[0].returnValue.layoutPicklists;
                this.record = res.actions[0].returnValue.masterRecord.record;
                this.params.parentRecord.apiName = res.actions[0].returnValue.masterRecord.entityApiName;
                this.params.parentRecord.objTypeCode =  res.actions[0].returnValue.masterRecord.objectTypeCode;
                this.list.forEach(item=>{
                    this.$set(item,'value','');
                    this.$set(item,'index','');
                    if(item.type=='F'){
                        let multiIndex = this.getIndex(currentTime());
                        item.multiIndex = multiIndex;
                    }
                    if(item.type=='MC'){
                        this.$set(item,'result',[]);
                        console.log('MC',item);
                    }
                    if(!item.readonly){
                        var obj = item.id;
                        // console.log(obj,this.record[obj],' this.record[item.type]')
                        if(this.record[obj] instanceof Object){
                            if(item.type=='DT'){
                                item.value = this.record[obj].value
                                this.params.parentRecord.fields[item.id] = this.record[obj].value;
                            }else {
                                item.value = this.record[obj].Name;
                                this.params.parentRecord.fields[item.id] = {Id:this.record[obj].Id};
                            }
                        }
                        // if(obj=='UserId'){
                        //     item.value = this.record[obj].Name;
                        //     this.params.parentRecord.fields[item.id] = {Id:this.record[obj].Id};
                        // }else if(obj=='DeptId'){
                        //     item.value = this.record[obj].Name;
                        //     this.params.parentRecord.fields[item.id] = {Id:this.record[obj].Id};
                        // }
                        else {
                            item.value = this.record[obj];
                        }
                    }
                    if(item.type=='RelatedList'){
                        var list = JSON.parse(JSON.stringify(item.fields))
                        for(var i=0;i<list.length;i++){
                            this.$set(list[i],'value','')
                            if(list[i].type=='DT'||list[i].type=='LT'||list[i].type=='L'){
                                // this.list[] 
                                // item[item.id]
                                list[i].picklistFieldValues = this.currenData[list[i].entityApiName].picklistFieldValues[list[i].id].values;
                                // this.$set(this.currenData[list[i].entityApiName].picklistFieldValues[list[i].id],'list',this.currenData[list[i].entityApiName].picklistFieldValues[list[i].id].values)
                            }
                        }
                        this.$set(item,item.id,[{...list}]);
                    }
                })
                console.log('list:', this.list)
            })
        },
        getIndex(startTime){
            let date = new Date(startTime.replace(/-/g,'/'));
            let years = date.getFullYear();
            let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1;
            let d = date.getDate()<10?'0'+date.getDate():date.getDate();
            let hours = date.getHours()<10?'0'+date.getHours():date.getHours();
            let minutes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();

            const yIdx = this.newMultiArrayList[0].findIndex(item=>item==years+'年');
            const mIdx = this.newMultiArrayList[1].findIndex(item=>item==month+'月');
            const dIdx = this.newMultiArrayList[2].findIndex(item=>item==d+'日');
            const hIdx = this.newMultiArrayList[3].findIndex(item=>item==hours+'时');
            const minIdx = this.newMultiArrayList[4].findIndex(item=>item==minutes+'分');
            const arr = [yIdx,mIdx,dIdx,hIdx,minIdx];
            return arr;
        },
        changeInput(e,item,list=[],idx='',parentItme={}){
            console.log(e,item,list,idx,parentItme);
            item.value = e.mp.detail;
            // 子表input赋值
            if(list.length>0){
                this.params.relatedRecords[idx] = {
                    id: "",
                    apiName: parentItme.entityApiName,
                    objTypeCode: parentItme.sObjectType,
                    fields: {}
                }
                // console.log(1,parentItme,list[idx])
                for(let j in list[idx]){
                    // console.log('j',list[idx][j].id)
                    // console.log(this.params.relatedRecords[idx])
                    // if(list[idx][j].id == item.id){
                    this.params.relatedRecords[idx].fields[list[idx][j].id] = list[idx][j].value;
                    // }
                }
            }else {
                this.record[item.id] = item.value;
                this.params.parentRecord.fields[item.id]= item.value;
            }
            console.log('params',this.params)
            console.log('list=',list)
        },
        onChangeGroup(e){
            console.log(e,'123123123');
            this.result = e.mp.detail;
            this.params.parentRecord.fields[item.id] = this.result;
        },
        toggle(e){
            console.log(e);
            let { index } = e.mp.currentTarget.dataset;
        },
        noop() {},
        // 主子表情况下 item/index: 父级 childItem/i：当前

        getOpenModal(item,index,idx,childItem,i,list=[]){
            this.sObjectType = item.sObjectType;
            if(list.length>0){
                console.log(item,index,idx,childItem,list)
                this.childForIdx = idx;
                this.rowI = i;
                this.sObjectType = childItem.sObjectType;
            }
            this.lksrch = '';
            this.popupIdx = -1;
            this.searchId = item.id;
            this.searchIdx = index;
            this.getLookup().then(res=>{
                // item.temp = res.listData;
                this.departList = res.listData;
                // console.log(item.temp,'00000')
                // console.log(this.list[index]);
                this.isShow = true;
            });
        },
        handleChange(e){
            this.lksrch = e.mp.detail;
            this.getLookup().then(res=>{
                this.list[this.searchIdx].temp = res.listData;
            });
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
            // console.log(item,this.searchId,this.childForIdx);
            this.popupIdx = index;
            if(this.childForIdx!==""&&this.childForIdx>=0){
                var parentItme = this.list[this.searchIdx];
                var list = this.list[this.searchIdx][this.searchId][this.childForIdx];
                console.log('list',list,'===')
                // debugger
                // if(!this.params.relatedRecords[this.childForIdx]){
                //     this.params.relatedRecords[this.childForIdx] = {
                //         id: "",
                //         apiName: parentItme.entityApiName,
                //         objTypeCode: parentItme.sObjectType,
                //         fields: {}
                //     }
                // }
                
                // debugger
                this.list[this.searchIdx][this.searchId][this.childForIdx][this.rowI].value = {
                    Id: item.ID,
                    Name: item.Name
                };
                // for(let j in list){
                    // debugger
                    // this.params.relatedRecords[this.childForIdx].fields[ this.list[this.searchIdx][this.searchId][this.childForIdx][this.rowI].id] = {
                    //     Id: item.ID
                    // }
                    // if(list[j]==list.id){
                        // this.$set(this.params.relatedRecords[this.childForIdx].fields,[list[j].id],{
                        //     Id: item.ID
                        // })
                    // }
                    // this.params.relatedRecords[this.childForIdx].fields[list[this.childForIdx][this.rowI].id] = {
                    //     Id: item.ID
                    // }
                // }
                console.log('params=',this.params)
                console.log(this.list,'list:::::::::')
                
            }else {
                this.record[this.searchId] = item;
                this.list[this.searchIdx].value = item.Name;
                this.params.parentRecord.fields[this.searchId] = {Id:item.ID};
            }
            this.childForIdx = "";
            this.searchId = "";
            this.childForIdx = "";
            this.rowI = "";
            this.isShow = false;
        },
        changeSwitch(e,item){
            item.value = e.mp.detail;
            this.params.parentRecord.fields[item.id] = e.mp.detail;
        },
        bindDateChange(e,item,list=[],idx='',parentItme={}){
            console.log(e,item,list,idx,parentItme);
            item.value = e.mp.detail.value;
            if(list.length>0){

            }else {
                this.record[item.id] = item.value;
                this.params.parentRecord.fields[item.id] = item.value;
            }
        },
        // mm:ss 时间选择
        bindTimeChange(e,item){
            item.value = e.mp.detail.value;
            this.record[item.id] = item.value;
            this.params.parentRecord.fields[item.id] = item.value;
        },
        bindMultiPickerChange(v,item){
            item.multiIndex = v.mp.detail.value;
            item.value = this.getCurrentTime(item.multiIndex);
            this.params.parentRecord.fields[item.id] = item.value;
            if(item.id=='StartTime'){
                this.startTime = item.value;
            }else if(item.id=='EndTime'){
                this.endTime = item.value;
            }
            let EntityType = wx.getStorageSync('EntityType');
            if(EntityType==30022){
                this.getBalance();
            }
        },
        bindYear(e,item){
            console.log(e,item);
            item.value = e.mp.detail.value;
            this.record[item.id] = item.value;
            this.params.parentRecord.fields[item.id] = item.value;
        },
        bindYMonth(e,item){
            item.value = e.mp.detail.value;
            this.record[item.id] = item.value;
            this.params.parentRecord.fields[item.id] = item.value;
        },
        getCurrentTime(index){
            const year = this.newMultiArrayList[ 0 ][ index[ 0 ] ];
            const month = this.newMultiArrayList[ 1 ][ index[ 1 ] ];
            const day = this.newMultiArrayList[ 2 ][ index[ 2 ] ];
            const hour = this.newMultiArrayList[ 3 ][ index[ 3 ] ];
            const minute = this.newMultiArrayList[ 4 ][ index[ 4 ] ];
            let time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            time = this.RemoveChinese(time);
            return time;
        },
        RemoveChinese(strValue) {  
            if(strValue!= null && strValue != ""){  
                var reg = /[\u4e00-\u9fa5]/g;  
                return strValue.replace(reg, "");  
            }else  {
                return "";  
            }
        },
        changeCheckTag(e,item,index){
            console.log(e,item);
            item.result = e.mp.detail;
            this.list[index].result = e.mp.detail;
            item.value = e.mp.detail.join(',');
            this.params.parentRecord.fields[item.id] = item.value;
        },
        changeRadio(e,item,index){
            item.value = e.mp.detail;
            this.list[index].value = e.mp.detail;
            this.params.parentRecord.fields[item.id] = item.value;
        },
        // 请假单独提交处理
        leaveSave(){
            // 对象代码 
            let EntityType = wx.getStorageSync('EntityType');
            if(EntityType==30022){
                if(!this.isBalanceLimit || this.isBalanceLimit&&this.Balance>0){

                }else {
                    wx.showToast({
                        title:`假期余额不足`,
                        icon:"success",
                        duration:2000
                    })
                    throw new Error('End');
                }
            }
        },
        getSubmit(){
            this.params.relatedRecords = [];
            this.list.forEach(item=>{
                if(item.type=='RelatedList'){
                    item[item.id].forEach(v=>{
                        // console.log(Object.values(v),'v')
                        // console.log('v',v)
                        const isBook = Object.values(v).every(self=>!self.required && (self.value=='' || self.value == null));
                        if(!isBook){
                            this.params.relatedRecords.push({
                                id: "",
                                apiName: item.entityApiName,
                                objTypeCode: item.sObjectType,
                                arr: Object.values(v)
                            });
                        }
                    })
                }
            })
            let result = [];
            this.params.relatedRecords.forEach((self,index)=>{
                // console.log(self)
                result.push({id:self.id,apiName:self.apiName,objTypeCode:self.objTypeCode,fields:{}})
                self.arr.forEach(item=>{
                    if(item.type=='U' || item.type=='O'){
                        result[index].fields[item.id] = {
                            Id: item.value.Id
                        };
                    }else {
                        result[index].fields[item.id] = item.value;
                    }
                })
            })
            this.params.relatedRecords = result;
            console.log(this.params,'====');
            this.leaveSave();
            let isBook = false;
            let idx = this.list.length;
            // this.agreeShow = true;
            try{
                this.list.forEach((item,index)=>{
                    if(index+1==idx){
                        let isBook = true;
                    }
                    if((item.value==null || item.value=='') && item.readonly==false && (item.require==true||item.required==true)){
                        wx.showToast({
                            title:`请输入${item.label}`,
                            icon:"success",
                            duration:2000
                        })
                        throw '';
                        // throw new Error('End');
                    }
                    
                })
                this.list.forEach(item=>{
                    if(item.type=='RelatedList'){
                        item[item.id].forEach(v=>{
                            for(let i in v){
                                console.log(v[i],'i')
                                if(v[i].required && v[i].value==''){
                                    wx.showToast({
                                        title:v[i].helpText,
                                        icon:"success",
                                        duration:2000
                                    })
                                    throw '';
                                }
                            }
                        })
                    }
                })
                this.agreeShow = true;
                const data = {
                    actions:[]
                };
                data.actions.push({
                    params:this.params
                });
                console.log('list:', this.list)
                console.log('data:', data)
                this.$httpWX.post({
                    url:this.$api.message.queryList+'?method='+this.$api.approval.saverecord,
                    data:{
                        SessionKey:this.sessionkey,
                        message:JSON.stringify(data)
                    }
                }).then(res=>{
                    console.log(res);
                    this.getStepQuery();
                })
                
            }catch(e){
                console.log(e);
            }
        },
        onCloseAgree(){
            this.agreeShow = false;
        },
        bindPickerChange(e,item,list=[],idx='',parentItme={}){
            console.log(e,item,list,idx,parentItme);
            // debugger
            item.index = e.mp.detail.value;
            item.value = this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].value;
            this.$set(item,'value',this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].value)
            let mapArr = this.currenData[item.entityApiName].picklistFieldMap;
            // console.log(mapArr,'mapArr', item.id)
            mapArr.forEach(self=>{
                // console.log(self.DependentName,'self.DependentName')
                if(self.DependentName!=item.id){
                    const controllerIndex = this.currenData[item.entityApiName].picklistFieldValues[self.DependentName].controllerValues[item.value];
                    // console.log(controllerIndex,'controllerIndex', this.currenData)
                    if(controllerIndex!=undefined){
                        const arr = this.currenData[item.entityApiName].picklistFieldValues[self.DependentName].values.filter(f=>{
                            return f.validFor.includes(controllerIndex)
                        })
                        // this.currenData[item.entityApiName].picklistFieldValues[self.DependentName].values = arr;
                        Object.values(list[idx]).find((val)=>{
                            return val.id == self.DependentName
                        }).picklistFieldValues = arr
                        Object.values(list[idx]).find((val)=>{
                            return val.id == self.DependentName
                        }).index = '';
                        // console.log(this.currenData,'currenData')
                    }
                }
            })
            if(list.length>0){
                this.params.relatedRecords[idx] = {
                    id: "",
                    apiName: parentItme.entityApiName,
                    objTypeCode: parentItme.sObjectType,
                    fields: {}
                }
                item.value = item.picklistFieldValues[item.index].value;
                for(let j in list[idx]){
                    this.params.relatedRecords[idx].fields[list[idx][j].id] = list[idx][j].value;
                }
            }else { 
                this.record[item.id] = this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].value;
                this.params.parentRecord.fields[item.id] = item.value;
            }
            console.log('params',this.params)
            console.log('list=',list)
            let EntityType = wx.getStorageSync('EntityType');
            if(EntityType==30022){
                this.leaveType = item.value;
                this.getBalance(item.value);
            }
        },
        // 假期余额
        getBalance(leaveType){
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
                    const index =  this.list.findIndex((item)=>item.id=='BalanceAmount');
                    this.list[index].value = this.Balance;
                    this.params.parentRecord.fields.BalanceAmount = this.Balance;
                }
                // if(res.rows!=''){
                //     this.Balance = res.rows[0].Balance;
                //     const index =  this.list.findIndex((item)=>item.id=='BalanceAmount');
                //     this.list[index].value = this.Balance;
                // }
            })
        },
        getChooseImage(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    console.log(res);
                    // tempFilePath可以作为img标签的src属性显示图片
                    
                    const tempFilePaths = res.tempFilePaths;
                    that.imgList = tempFilePaths;
                    let url = `${that.$api.upload.url}?method=${that.$api.approval.upload}&SessionKey=${that.sessionkey}&pid=${that.ProcessInstanceId}&objTypeCode=${'122'}`
                    wx.uploadFile({
                        url:url,
                        // url: "https://oawx.hnca.org.cn/rest?method="+'flow.files.upload'+'&SessionKey=' + that.sessionkey+'&pid='+that.ProcessId+'&objTypeCode='+'122',
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
            })
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
                console.log(res);
                this.testLists = res.transitions;
                this.fromActivityId = res.fromActivityId;
                this.SplitType = res.SplitType;
                this.HasMatched = res.HasMatched; // 校验是否可以选择其他节点 true不可
            })
        },
        changeAll(e,item){
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
            // item.Selected = item.ParticipantMember.every(one=>one.Selected==true);
        },
        getAddPeople(item){
            wx.setStorageSync('ToActivityId',item.ToActivityId)
            const url = '/pages/publics/mailList/main?sign='+'process';
            wx.navigateTo({url:url});
        },
        onCloseAgree(){
            this.agreeShow = false;
        },
        getSubmitStep(){
            let temp = [];
            let isBook = this.testLists.some(d=>d.Selected);
            if(isBook){
                this.testLists.forEach((item,index)=>{
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
                                // title:"人员不能为空",
                                title:`${item.ToActivityName}人员不能为空`,
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
                                processInstanceId:this.ProcessInstanceId,
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
                        let status = res.actions[0].state;
                        if(status=='SUCCESS'){
                            message.toast({
                                title:"提交成功",
                                delta: 2
                            })
                        }
                    })
            }else {
                wx.showToast({
                        title:"人员不能为空",
                        icon:'none',
                        duration:2000
                    })
            }

            
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding-bottom: 100px;
        .parentWrap{
            width: 100%;
            height: auto;
            background: #fff;
            margin: 30rpx 0;
            // padding: 30rpx 0;
            h3{
                font-weight: bold;
                text-align: center;
                padding: 20rpx 0
            }
            .add_child{
                display: flex;
                justify-content: center;
                align-items: center;
                color: #3399ff;
                line-height: 80rpx;
                .icon{
                    padding-right: 20rpx;
                }
            }
            .box{
                .title{
                    padding: 20rpx 30rpx;
                    box-sizing: border-box;
                    background: #f4f4f4;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .del{
                        color: #3399ff;
                    }
                }
            }
            .cell{
                margin-top: 0;
            }
        }
        .value-class {
            flex: none !important;
        }
        .cell{
            margin-top: 24rpx;
            .title{
                font-size: 34rpx;
            }
            .cellValue{
                color: #333333;
            }
            .inp{
                color: #333333;
                font-size: 34rpx;
            }
            .box{
                width: 100%;
                background: #fff;
                padding: 30rpx;
                textarea{
                    width: 100%;
                    // color: #999999;
                }
            }
            .checkWrap{
                background: #fff;
                padding: 30rpx;
                .label{
                    span{
                        color:  #ff6666;
                    }
                }
                .check{
                    padding: 10rpx 0;
                    .tag{
                        width: 500rpx;
                    }
                }
            }
            .radioWrap{
                background: #fff;
                padding: 30rpx;
                display: flex;
                justify-content: space-between;
                .radio{
                    padding: 10rpx 0;
                    display: flex;
                    .tag{
                        margin-right: 20rpx;
                    }
                }
            }
        }
        .switch{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 33rpx;
            background: #fff;
            margin-top: 24rpx;
        }
        .row{
            margin-top: 24rpx;
            background: #fff;
            padding:15rpx;
            .title{
                color: #ff6666;
                span{
                    font-size: 34rpx;
                    color: #333333;
                    margin-left: 5rpx;
                }
            }
            .text{
                font-size: 34rpx;
                color: #333333;
                margin-left: 10rpx;
            }
            textarea{
                width: 90%;
                height: 150rpx;
                padding: 10rpx;
            }
            .placeholder{
                font-size: 34rpx;
                color: #a3a5a7;
            }
            .content{
                display: flex;
                padding: 20rpx 10rpx;
                .box{
                    width: 96rpx;
                    height: 96rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #f7f7f7;
                    margin-right: 10rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
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
            .btn{
                padding: 24rpx;
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
                .radius{
                    width: 83rpx;
                    height: 83rpx;
                    line-height: 83rpx;
                    text-align: center;
                    border-radius: 50%;
                    font-size: 26rpx;
                    color: #fff;
                    background: #3399ff;
                }
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
                z-index: 999;
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
    }
</style>