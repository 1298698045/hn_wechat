<template>
    <div class="wrap_w">
        <div v-for="(item,index) in list" :key="index">
            <van-cell-group v-if="item.type=='S'||item.type=='E'||item.type=='N'||item.type=='H'" custom-class="cell">
                <van-field
                    :value="item.value"
                    input-class="inpClass"
                    custom-style="font-size:34rpx;color:#333333"
                    :required="item.required||false"
                    :label="item.label"
                    :placeholder="item.helpText"
                    input-align="right"
                    @change="function(val){changeInput(val,item)}"
                    :disabled="item.privilegeDepth<8"
                />
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='L'||item.type=='DT'||item.type=='LT'">
                <picker :disabled="item.privilegeDepth<8" @change="(val)=>{bindPickerChange(val,item)}" :value="item.index" range-key="label" :range="currenData[item.entityApiName].picklistFieldValues[item.id].values">
                    <van-field
                        :value="currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index]&&currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].label"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||false"
                        :disabled="disabled"
                        :label="item.label"
                        :placeholder="item.helpText"
                        :right-icon="item.privilegeDepth!=8&&item.privilegeDepth!=16?'':'arrow'"
                        input-align="right"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='D'">
                <picker :disabled="item.privilegeDepth<8" mode="date" :value="item.value" @change="function(val){bindDateChange(val,item)}">
                    <van-field
                        :value="item.value"
                        title-width="110px"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||false"
                        :disabled="disabled"
                        :label="item.label"
                        input-align="right"
                        :right-icon="item.privilegeDepth<8?'':'arrow'"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='TP'">
                <picker mode="time" :disabled="item.privilegeDepth<8" :value="time" @change="function(val){bindTimeChange(val,item)}">
                    <van-field
                        :value="item.value"
                        title-width="110px"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||item.require||false"
                         :disabled="disabled"
                        :label="item.label"
                        input-align="right"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='F'">
                <picker :disabled="item.privilegeDepth<8" class="picker" mode="multiSelector" :value="item.multiIndex" @change="((val)=>{bindMultiPickerChange(val,item)})"
                    :range="newMultiArrayList">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||false"
                        :disabled="disabled"
                        :label="item.label"
                        input-align="right"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='Year'">
                <picker :disabled="item.privilegeDepth<8" mode="date" :value="item.value" fields="year"  @change="((e)=>{bindYear(e,item)})">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||false"
                        :disabled="disabled"
                        :label="item.label"
                        input-align="right"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='Month'">
                <picker :disabled="item.privilegeDepth<8" mode="date" :value="item.value" fields="month"  @change="((e)=>{bindYMonth(e,item)})">
                    <van-field
                        :value="item.value"
                        input-class="inp"
                        custom-style="font-size:34rpx;color:#333333"
                        :required="item.required||false"
                        :disabled="disabled"
                        :label="item.label"
                        input-align="right"
                        :placeholder="item.helpText"
                    />
                </picker>
            </van-cell-group>
            <van-cell-group custom-class="cell" v-if="item.type=='G'||item.type=='MC'">
                <div class="checkWrap">
                    <p class="label">{{item.label}}</p>
                    <van-checkbox-group :disabled="item.privilegeDepth<8" :value="item.result" @change="((e)=>{changeCheckTag(e,item,index)})">
                        <div class="checkboxGroup">
                            <van-checkbox :name="v.value" v-for="(v,i) in currenData[item.id]" :key="i" custom-class="check" label-class="labels"  shape="square">
                                <p class="tag">{{v.label}}</p>
                            </van-checkbox>
                        </div>
                    </van-checkbox-group>
                </div>
            </van-cell-group>
            <van-cell-group v-if="item.type=='RBL'" custom-class="cell">
                <div class="radioWrap">
                    <p class="label">{{item.label}}</p>
                    <van-radio-group :disabled="item.privilegeDepth<8" :value="item.value" @change="(e)=>{changeRadio(e,item,index)}">
                        <div class="radio">
                            <van-radio :name="v.value" custom-class="radio" v-for="(v,i) in currenData[item.id]" :key="i">
                                <p class="tag">{{v.label}}</p>
                            </van-radio>
                        </div>
                    </van-radio-group>
                </div>
            </van-cell-group>
            <van-cell-group :disabled="item.privilegeDepth<8" custom-class="cell" v-if="item.type=='U'||item.type=='O'||item.type=='Y_MD'||item.type=='Y'">
                <van-cell :required="item.required||false" value-class="cellValue" title-style="font-size:34rpx;" :title="item.label" :is-link="false" :value="item.value" @click="!disabled?getOpenModal(item,index):''" />
            </van-cell-group>
            <div class="switch" v-if="item.type=='H'||item.type=='MC'">
                <p>
                    {{item.label}}
                </p>
                <p>
                    <van-switch :disabled="item.privilegeDepth<8" :checked="item.value" @change="(val)=>{changeSwitch(val,item)}" size="24px" />
                </p>
            </div>
            <!-- J -->
            <div class="row" v-if="item.type=='J'">
                <div class="title">
                    <span>{{item.label}}</span>
                </div>
                <textarea :disabled="item.privilegeDepth<8" :value="item.value"
                :auto-height="true"
                cols="100"
                rows="10"
                maxlength="100000"
                 @input="(e)=>{changeTextArea(e,item)}" placeholder-class="placeholder" :placeholder="!item.readonly?'请输入':''"></textarea>
            </div>
            <!-- 意见 -->
            <div class="row" v-if="item.type=='UCS'||item.type=='X'||item.type=='UC'">
                <div class="title">
                    <span>{{item.label}}</span>
                    <van-dropdown-menu z-index="9999" v-if="!item.readonly&&current=='tab2'&&item.privilegeDepth>=8">
                        <van-dropdown-item :value="value1" :options="option1" @change="(e)=>{changeDropDown(e,item)}" />
                    </van-dropdown-menu>
                </div>
                <div class="list_textarea" v-if="item.item && item.item.length>0">
                    <div v-for="(v,idx) in item.item" :key="idx">
                        <!-- <p class="imgs">
                            <img :src="photoUrl+v.SignUrl" alt="">
                        </p> --> 
                        <p>
                             {{v.Comment}}
                        </p>
                        <p>
                          [  {{v.UserName||''}} ({{v.DeptName}}) {{v.CreateTime}}  ]
                        </p>
                    </div>
                </div>
                <textarea v-if="!item.readonly&&current=='tab2'&&item.privilegeDepth>=8" :disabled="item.privilegeDepth<8" :value="item.value"
                :auto-height="true"
                cols="100"
                rows="10"
                maxlength="100000"
                 @input="(e)=>{changeTextArea(e,item)}" placeholder-class="placeholder" :placeholder="!item.readonly?'请输入':''"></textarea>
            </div>
            <!-- <div class="parentWrap" v-if="item.type=='RelatedList'">
                <h3>{{item.label}}</h3>
                <div class="box" v-for="(self,idx) in item[item.id]" :key="idx">
                    <div class="title">
                        <span>
                            {{item.label}} ({{idx+1}})
                        </span>
                        <span v-if="item.deleteAdmin==1" class="del" @click="handleDelChild(item[item.id],self,idx,item)">
                            删除
                        </span>
                    </div>
                    <div class="rowBox" v-for="(v,i) in self.arr" :key="i">
                        <van-cell-group v-if="v.type=='S'||v.type=='E'||v.type=='N'||v.type=='H'" custom-class="cell">
                            <van-field
                                :disabled="v.privilegeDepth<8"
                                :value="v.value"
                                custom-style="font-size:34rpx;color:#333333"
                                input-class="inp"
                                :required="v.required||false"
                                :label="v.label"
                                :placeholder="v.helpText"
                                input-align="right"
                                @change="function(e){changeInput(e,v,item[item.id])}"
                            />
                        </van-cell-group>
                        <van-cell-group custom-class="cell" v-if="v.type=='L'||v.type=='DT'||v.type=='LT'">
                            <picker :disabled="v.privilegeDepth<8" @change="(val)=>{bindPickerChange(val,v,item[item.id],idx)}" :value="v.index" range-key="label" :range="v.picklistFieldValues || []">
                                <van-field
                                    :value="v.picklistFieldValues && v.picklistFieldValues[v.index] && v.picklistFieldValues[v.index].label"
                                    input-class="inp"
                                    custom-style="font-size:34rpx;color:#333333"
                                    :required="v.require||false"
                                    disabled
                                    :label="v.label"
                                    :placeholder="v.helpText"
                                    input-align="right"
                                    :right-icon="v.privilegeDepth<8?'':'arrow'"
                                />
                                </picker>
                        </van-cell-group>
                        <van-cell-group custom-class="cell" v-if="v.type=='D'">
                            <picker :disabled="v.privilegeDepth<8" mode="date" :value="v.value" @change="function(val){bindDateChange(val,v,item[item.id])}">
                                <van-field
                                    :value="v.value"
                                    title-width="110px"
                                    input-class="inp"
                                    custom-style="font-size:34rpx;color:#333333"
                                    :required="v.required||false"
                                    disabled
                                    :label="v.label"
                                    input-align="right"
                                    :right-icon="v.privilegeDepth<8?'':'arrow'"
                                    :placeholder="v.helpText"
                                />
                            </picker>
                        </van-cell-group>
                        <van-cell-group :disabled="v.privilegeDepth<8" custom-class="cell" v-if="v.type=='U'||v.type=='O'||v.type=='Y_MD'||v.type=='Y'">
                            <van-cell value-class="cellValue" :required="v.required||false" :title="v.label" is-link :value="v.value.Name" @click="!v.readonly?getOpenModal(item,index,idx,v,i,item[item.id]):''" />
                        </van-cell-group>
                        <div class="row" v-if="v.type=='UC'">
                            <p class="title">
                                {{v.required||v.require?'*':''}}
                                <span>{{v.label}}</span></p>
                            <textarea :disabled="v.privilegeDepth<8" v-model="v.value" name="" id="" cols="30" rows="10" placeholder-class="placeholder" :placeholder="v.helpText"></textarea>
                        </div>
                    </div>
                </div>
                <p class="add_child" v-if="item.addAdmin==1" @click="handleAddChild(item)">
                    <span class="icon">
                        <van-icon name="plus" />
                    </span>
                    增加{{item.label}}
                </p>
            </div> -->
            <div class="relatedWrap" v-if="item.type=='RelatedList'">
                <div class="related_label">{{item.label}}</div>
                <div class="table">
                    <div class="tr tr_head">
                        <div class="th minWidth100">序号</div>
                        <div class="th" v-for="(thItem,thIdx) in item.fields" :key="thIdx">{{thItem.label}}</div>
                    </div>
                    <div class="tbody">
                        <div class="tr tr_cont" v-for="(self,idx) in item.formChildList" :key="idx" @click="handleOpenEditChild(item,self)">
                            <div class="td minWidth100">{{idx+1}}</div>
                            <div class="td white" v-for="(thItem,thIdx) in item.fields" :key="thIdx">
                                <span v-if="thItem.type=='L'||thItem.type=='DT'||thItem.type=='LT'">{{self[thItem.id].label}}</span>
                                <span v-else-if="thItem.type=='U'||thItem.type=='O'||thItem.type=='Y_MD'||thItem.type=='Y'">{{self[thItem.id].Name}}</span>
                                <span v-else>{{self[thItem.id]}}</span>
                            </div>
                            <!-- <div class="td" v-for="(v,key,i) in self" :key="i">{{self[key]}}</div> -->
                        </div>
                    </div>
                </div>
                <p class="add_child" v-if="!item.readonly" @click="!item.readonly && handleOpenChild(item)">
                    <span class="icon">
                        <van-icon name="plus" />
                    </span>
                    增加{{item.label}}
                </p>
                <van-popup :show="item['is'+item.entityApiName]" @close="closeChild(item)" 
                    position="bottom" custom-style="width:100%;height: 80vh;background:#f1f1f1;"
                    z-index="99999">
                    <div class="formWrap">
                        <div class="rowItem" v-for="(row,rowIdx) in item.fields" :key="rowIdx">
                            <van-cell-group custom-class="cell" v-if="row.type=='S'||row.type=='E'||row.type=='N'||row.type=='H'">
                                <van-field
                                    :value="row.value"
                                    custom-style="font-size:34rpx;color:#333333"
                                    :required="row.required||false"
                                    :label="row.label"
                                    :placeholder="row.helpText"
                                    input-align="right"
                                    @change="function(e){changeChildInput(e,row)}"
                                />
                            </van-cell-group>
                            <van-cell-group custom-class="cell" v-if="row.type=='L'||row.type=='DT'||row.type=='LT'">
                                <picker @change="(e)=>{changeChildPicker(e,row,item)}" :value="row.index" range-key="label" :range="row.picklistFieldValues">
                                    <van-field
                                        :value="row.picklistFieldValues[row.index] && row.picklistFieldValues[row.index].label"
                                        input-class="inp"
                                        custom-style="font-size:34rpx;color:#333333"
                                        :required="row.required||false"
                                        disabled
                                        :label="row.label"
                                        :placeholder="row.helpText"
                                        input-align="right"
                                        right-icon="arrow"
                                    />
                                    </picker>
                            </van-cell-group>
                            <van-cell-group custom-class="cell" v-if="row.type=='D'">
                                <picker :disabled="row.readonly" mode="date" :value="row.value" @change="(e)=>{changeChildDate(e,row,item)}">
                                    <van-field
                                        :value="row.value"
                                        title-width="110px"
                                        input-class="inp"
                                        custom-style="font-size:34rpx;color:#333333"
                                        :required="row.required||false"
                                        disabled
                                        :label="row.label"
                                        input-align="right"
                                        right-icon="arrow"
                                        :placeholder="row.helpText"
                                    />
                                </picker>
                            </van-cell-group>
                            <van-cell-group custom-class="cell" v-if="row.type=='U'||row.type=='O'||row.type=='Y_MD'||row.type=='Y'">
                                <van-cell value-class="cellValue" :required="row.required||false" :title="row.label" is-link :value="row.value && row.value.Name"
                                @click="!row.readonly?handleOpenChildOpen(item,row,index,rowIdx):''"/>
                            </van-cell-group>
                        </div>
                    </div>
                    <div class="footChild">
                        <van-button type="default" custom-class="btn" @click="closeChild(item)">取消</van-button>
                        <van-button type="default" color="red" custom-class="btn" v-if="item.isEdit&&!item.readonly" @click="handleDeleteChild(item)">删除</van-button>
                        <van-button type="info" v-if="!item.readonly" custom-class="btn primary" @click="handleSaveChild(item)">保存</van-button>
                    </div>
                </van-popup>
            </div>
        </div>
        <button class="saveButton" @click="getAgree" v-if="stateCode==0">提交</button>
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
                    <!-- list[searchIdx]?list[searchIdx].temp:'' -->
                    <li @click="getPopupSel(item,index)" v-for="(item,index) in departList" :key="index">
                        <p>{{item.Name}}</p>
                        <p v-if="popupIdx==index">
                            <i-icon type="right" />
                        </p>
                    </li>
                </ul>
            </div>
        </van-popup>
    </div>
</template>
<script>
import list from '@/utils/test.js';
import {newMultiArray} from '@/utils/multiArray';
import { mockData,dataList,serachList,testList } from '@/utils/mock';
export default {
    name:"FormList",
    props:['ProcessId','ProcessInstanceId','RuleLogId','current','stateCode','jurisdiction'],
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
            currenData:{},
            record:{},
            searchId:"",
            sObjectType:"",
            searchIdx:'',
            ProcessInstanceId:"",
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
            disabled:true,
            fields:{},
            option1: [
                {text:'请选择常用意见',value:0},
                { text: '同意', value: 1 },
                { text: '不同意', value: 2 },
                { text: '复核完毕，请提交正式纸质版，等待签订', value: 3 },
                { text: '提交院领导或科技处的批复意见', value: 4 },
            ],
            value1:0,
            photoUrl:"",
            departList: [], // 选人/部门
            childIdx: '',
            childForIdx: '',
            rowI: '',
            relatedListRecords: {} // 子表集合
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        newMultiArrayList(){
            return newMultiArray();
        },
    },
    onLoad(){
        this.photoUrl = this.$api.photo.url;
        this.testLists = testList.listData;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.params.processId = this.ProcessId;
        // this.getQueryFrom();
        this.$nextTick(()=>{
            this.getLayoutData();
        })
    },
    methods:{
        // 删除子表
        handleDeleteChild(item){
            console.log(item)
            if(item.isEdit){
                if(item.editId){
                    this.$httpWX.post({
                        url: this.$api.message.queryList,
                        data:{
                            method: this.$api.task.delete,
                            SessionKey: this.sessionkey,
                            objTypeCode: item.sObjectType,
                            id: item.editId
                        }
                    }).then(res=>{
                        console.log(res);
                        item.formChildList.splice(item.editIndex,1);
                    })
                }else {
                    item.formChildList.splice(item.editIndex,1);
                }
                item['is'+item.entityApiName] = false;
            }
            this.$forceUpdate();
        },
        // 保存子表数据
        handleSaveChild(item){
            console.log('item',item);
            var row = {};
            var fields = JSON.parse(JSON.stringify(item.fields));
            fields.forEach(v=>{
                row[v.id] = v.value
            })
            console.log(row);
            if(item.isEdit){
                console.log("editId",item.editId)
                console.log("formChildList",item.formChildList)
                var index = item.formChildList.findIndex(v=>v.ValueId==item.editId);
                var rowData = item.formChildList.find(v=>v.ValueId==item.editId);
                for(var key in rowData){
                    if(key in row){
                        rowData[key] = row[key];
                    }
                }
                item.formChildList[index] = rowData;
            }else {
                item.formChildList.push(row);
            }
            // 清空保存之后弹窗的数据
            item.fields.forEach(v=>{
                v.value = "";
                v.index = "";
            })
            // console.log(item);
            item['is'+item.entityApiName] = false;
            item.isEdit = false;
            item.editId = "";
        },
        handleOpenEditChild(item,row){
            console.log("row",row);
            item.fields.forEach(v=>{
                if(v.type=='L'||v.type=='DT'||v.type=='LT'){
                    console.log('v',v,item,row[v.id]);
                    v.value = row[v.id];
                    var index = v.picklistFieldValues.findIndex(n=>n.value == row[v.id].value);
                    v.index = index;
                }else {
                    v.value = row[v.id];
                }
            })

            item['is'+item.entityApiName] = true;
            item.isEdit = true;
            item.editId = row.ValueId;
            this.$forceUpdate();
        },
        handleOpenChild(item){
            item['is'+item.entityApiName] = true;
            this.$forceUpdate();
        },
        closeChild(item){
            item['is'+item.entityApiName] = false;
            this.$forceUpdate();
        },
        // 子表弹窗-input
        changeChildInput(e,row){
            row.value = e.mp.detail;
        },
        changeChildPicker(e,row,item){
            console.log('e',e,row,item);
            row.index = e.mp.detail.value;
            var obj = row.picklistFieldValues[row.index];
            row.value = {
                value: obj.value,
                label: obj.label
            }
            this.$forceUpdate();
        },
        changeChildDate(e,row,item){
            console.log(e,row,item);
            row.value = e.mp.detail.value;
            this.$forceUpdate();
        },
        filterEntityApiName(item){
            let TableRights = this.jurisdiction.TableRights;
            for(let key in TableRights){
                if(key.indexOf(item.entityApiName)!=-1&&key.indexOf('delete')!=-1){
                    var deleteAdmin = TableRights[key];
                    var del = {
                        deleteAdmin:deleteAdmin
                    }
                }else if(key.indexOf(item.entityApiName)!=-1&&key.indexOf('add')!=-1){
                    var addAdmin = TableRights[key];
                    var add = {
                        addAdmin:addAdmin
                    }
                }
            }
            return {...del,...add}
        },
        handleAddChild(item){
            console.log(item,'item')
            item.fields.forEach(item=>{
                this.$set(item,'value','')
            })
            var list = JSON.parse(JSON.stringify(item.fields))
            console.log('list-list',list)
            debugger
            item[item.id].push({
                arr:{...list}
            })
            console.log(item[item.id],'item[item.id]')
        },
        // 删除子表
        handleDelChild(list,item,index,parentItem){
            console.log(list,item,index,parentItem)
            if(item.entitieId){
                this.params.deleteRecords.push({
                    id: item.entitieId,
                    objTypeCode: item.entitieObjectTypeCode
                })
            }
            list.splice(index,1);
            console.log(this.params.deleteRecords,'已删除的子表')
        },
        changeTextArea(e,item){
            item.value = e.mp.detail.value;
            this.fields[item.id] = item.value;
        },
        changeDropDown(e,item){
            console.log(e,item)
            let index = e.mp.detail;
            if(index!=0){
                item.value = this.option1[index].text;
                this.$set(item,'value', item.value)
                this.fields[item.id] = item.value;
                this.params.parentRecord.fields[item.id] = item.value;
            }
        },
        getAgree(){
            this.$parent.getAgree();
        },
        // 完成 提交表单
        getSubmitComplete(){
            this.params.relatedRecords = [];
            // ###修改前
            // this.list.forEach(item=>{
            //     if(item.type=='RelatedList'){
            //         if(item[item.id]){
            //             console.log(item,'item,item')
            //             item[item.id].forEach(v=>{
            //                 const isBook = Object.values(v.arr).every(self=>!self.required && (self.value=='' || self.value == null));
            //                 console.log(isBook,'=======')
            //                 if(!isBook){
            //                     this.params.relatedRecords.push({
            //                         id: v.entitieId || '',
            //                         apiName: item.entityApiName || '',
            //                         objTypeCode: item.sObjectType || '',
            //                         arr: Object.values(v.arr) || ''
            //                     })
            //                 }
            //             })
            //         }
            //     }
            // })
            // let result = [];
            // this.params.relatedRecords.forEach((self,index)=>{
            //     console.log('self', self)
            //     result.push({id:self.id,apiName:self.apiName,objTypeCode:self.objTypeCode,fields:{}})
            //     self.arr.forEach(item=>{
            //         if(item.type=='U' || item.type=='O'){
            //             result[index].fields[item.id] = {
            //                 Id: item.value.Id
            //             };
            //         }else {
            //             result[index].fields[item.id] = item.value;
            //         }
            //     })
            // })
            // this.params.relatedRecords = result;
            // ###
            console.log('params:',this.params)
            console.log('list',this.list)
            var result = [];
            var list = JSON.parse(JSON.stringify(this.list));
            list.forEach(item=>{
                if(item.type=='RelatedList'){
                    item.formChildList.forEach(row=>{
                        item.fields.forEach(v=>{
                            if(v.type=='L'||v.type=='DT'||v.type=='LT'){
                                row[v.id] = row[v.id].value
                            }
                        })
                        result.push({
                            id: row.ValueId || '',
                            apiName: item.entityApiName,
                            objTypeCode: item.sObjectType,
                            fields: row
                        })
                    })
                }
            })
            console.log("result",result)
            this.params.relatedRecords = result;
            let idx = this.list.length;
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
                    if(item[item.id]){
                        item[item.id].forEach(v=>{
                            for(let i in v.arr){
                                console.log( v.arr[i],'i')
                                if( v.arr[i].required &&  v.arr[i].value==''){
                                    wx.showToast({
                                        title: v.arr[i].helpText,
                                        icon:"success",
                                        duration:2000
                                    })
                                    throw '';
                                }
                            }
                        })
                    }
                }
            })
            const obj = {
                actions:[
                    {
                        params:this.params
                    }
                ]
            }
            debugger
            this.$httpWX.post({
              url:this.$api.message.queryList+'?method='+this.$api.approval.saverecord,
                data:{
                    SessionKey:this.sessionkey,
                    message:JSON.stringify(obj)
                }
            }).then(res=>{
                console.log('编辑保存',res)
                // this.getLayoutData();
            })
        },
        // 同意保存表单
        getSaverecord(){
            let obj = {
            actions:[
              {
                params:{
                  processId:this.ProcessId,
                  ruleLogId:this.RuleLogId,
                  parentRecord:{
                    id:this.ProcessInstanceId,
                    fields:this.fields
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
              
          })
        },
        getQueryFrom(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.approval.mobileform,
                    SessionKey:this.sessionkey,
                    ProcessId:this.ProcessId
                }
            }).then(res=>{
                console.log(res);
                this.list = res.layout;
                this.list.forEach(item=>{
                    this.$set(item,'value','');
                    this.$set(item,'require',false);
                    if(item.type=='L'){
                        this.$set(item,'index','');
                    }
                })
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
                    RuleLogId: this.RuleLogId
                }
            }).then(res=>{
                console.log(res);
                this.list = res.actions[0].returnValue.layoutItems;
                this.list.forEach(item=>{
                    this.$set(item,'value','');
                    this.$set(item,'require',false);
                    if(item.type=='L'){
                        this.$set(item,'index','');
                    }
                })
                this.currenData = res.actions[0].returnValue.layoutPicklists;
                this.record = res.actions[0].returnValue.masterRecord.record;
                this.relatedListRecords = res.actions[0].returnValue.relatedListRecords;
                this.params.parentRecord.apiName = res.actions[0].returnValue.masterRecord.entityApiName;
                this.params.parentRecord.objTypeCode =  res.actions[0].returnValue.masterRecord.objectTypeCode;
                // 编辑id
                this.params.parentRecord.id = res.actions[0].returnValue.masterRecord.record.ValueId;
                this.list.forEach(item=>{
                    if( this.record[item.name] instanceof Object){
                        console.log(item.name,'name')
                        item.value = this.record[item.name].Name;
                        this.fields[item.id] = this.record[item.name].Name;
                        if(this.record[item.name].value){
                            this.params.parentRecord.fields[item.id] = this.record[item.name].value;
                        }else {
                            this.params.parentRecord.fields[item.id] = '';
                        }
                        if(item.type=='UCS'||item.type=='UC'){
                            // item.value = this.record[item.id].comments!=''?this.record[item.id].comments[0].Comment:'';
                            // this.fields[item.id] = this.record[item.id].comments!=''?this.record[item.id].comments[0].Comment:'';
                            item.item = this.record[item.id].comments;
                        }else if(item.type=='U'||item.type=='O'){
                            this.fields[item.id] = {
                                Id: this.record[item.name].Id
                            }
                            this.params.parentRecord.fields[item.id] = {
                                Id: this.record[item.name].Id
                            }
                        }else if(item.type=='L'||item.type=='DT'||item.type=='LT'){
                            if(this.record[item.name]!=''){
                                console.log(item,'123123213')
                                item.index = this.currenData[item.entityApiName].picklistFieldValues[item.id].values.findIndex(v=>v.value==this.record[item.name].value);
                                console.log(this.fields,'fields')
                                // console.log('this.currenData[item.entityApiName].picklistFieldValues[item.id][item.index].label',this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].label)
                                if(item.index>-1){
                                    this.fields[item.id] = {
                                        label: this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].label,
                                        value:this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].value
                                    };
                                    item.value = this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].value
                                }
                            }else {
                                item.index = '';
                            }
                        }
                    }else if(item.type == 'MC'){
                        item.result = this.record[item.name].split(',');
                        this.fields[item.id] = this.record[item.name];
                    } else {
                        if(item.type!='RelatedList'){
                            item.value = this.record[item.name];
                            this.fields[item.id] = this.record[item.name];
                            this.params.parentRecord.fields[item.id] = this.record[item.name]
                        }
                    }
                    // // 包含子表的
                    // if(item.type=='RelatedList'){
                    //     var jurisdiction = this.filterEntityApiName(item)
                    //     if(Object.keys(jurisdiction).length>0){
                    //         for(let key in jurisdiction){
                    //             this.$set(item,key,jurisdiction[key])
                    //         }
                    //     }

                    //     // this.$set(item,s.filed,s[s.filed])
                    //     // var list = JSON.parse(JSON.stringify(item.fields))
                    //     // for(var i=0;i<list.length;i++){
                    //     //     this.$set(list[i],'value','')
                    //     // }
                    //     // this.$set(item,item.id,[{...list}]);
                    //     // item.fields.forEach(v=>{
                    //     //     this.$set(v,'value','')
                    //     //     if(v.type=='L'||v.type=='DT'||v.type=='LT'){

                    //     //     }
                    //     // })
                    //     var list = JSON.parse(JSON.stringify(item.fields))
                    //     for(var i=0;i<list.length;i++){
                    //         this.$set(list[i],'value','')
                    //         if(list[i].type=='DT'||list[i].type=='LT'||list[i].type=='L'){
                    //             list[i].picklistFieldValues = this.currenData[list[i].entityApiName].picklistFieldValues[list[i].id].values;
                    //         }
                    //     }
                    //     for(let i = 0; i < item.fields.length; i++){
                    //         let result = []
                    //         var childLength = this.relatedListRecords[item.entityApiName].entities.length;
                    //         for(let j = 0; j < childLength; j++){
                    //             var list = JSON.parse(JSON.stringify(list))
                    //             result.push({arr:{...list}})
                    //         }
                    //         this.$set(item,item.id,result);
                    //     }
                    //     item[item.id].forEach((p,kindex)=>{
                    //         let k = p.arr;
                    //         for(let l in k) {
                    //             console.log(k[l],'===')
                    //             const entitieitem = this.relatedListRecords[item.entityApiName].entities[kindex]
                    //             const value = entitieitem.fields[k[l].id]
                    //             const entitieId = entitieitem.id;
                    //             console.log(entitieitem,'entitieitem')
                    //             this.$set(item[item.id][kindex],'entitieId',entitieId)
                    //             this.$set(item[item.id][kindex],'entitieObjectTypeCode',this.relatedListRecords[item.entityApiName].objectTypeCode)
                    //             if(k[l].type=='DT'||k[l].type=='LT'||k[l].type=='L'){
                    //                 if(value.value){
                    //                     let rowIdx = this.currenData[k[l].entityApiName].picklistFieldValues[k[l].id].values.findIndex(a=>a.value==value.value);
                    //                     let val = this.currenData[k[l].entityApiName].picklistFieldValues[k[l].id].values[rowIdx].value;
                    //                     this.$set(k[l],'value',val)
                    //                     this.$set(k[l],'index',rowIdx)
                    //                     let mapArr = this.currenData[k[l].entityApiName].picklistFieldMap;
                    //                     // console.log(mapArr,'maparr', kindex)
                    //                     const ControllerName = mapArr[kindex].ControllerName;
                    //                     // console.log('ControllerName', ControllerName, k[l].id)
                    //                     // 获取到联动的父级
                    //                     if(k[l].id==ControllerName){
                    //                         var prevVal = k[l].value;
                    //                     }
                    //                     if(ControllerName!=k[l].id){
                    //                         console.log('k[l].value',k[l].value, prevVal)
                    //                         const controllerIndex = this.currenData[k[l].entityApiName].picklistFieldValues[k[l].id].controllerValues[prevVal];
                    //                         console.log(controllerIndex,'controllerIndex')
                    //                         if(controllerIndex!=undefined){
                    //                             const arr = this.currenData[k[l].entityApiName].picklistFieldValues[k[l].id].values.filter(f=>{
                    //                                 return f.validFor.includes(controllerIndex)
                    //                             })
                    //                             this.$set(k[l],'picklistFieldValues',arr)
                    //                             rowIdx = k[l].picklistFieldValues.findIndex(a=>a.value==value.value);
                    //                             this.$set(k[l],'index',rowIdx)
                    //                         }
                    //                     }
                                        
                    //                 }
                    //             }else if(k[l].type=='U'||k[l].type=='O'){
                    //                 this.$set(k[l],'value',value)
                    //             }else{
                    //               this.$set(k[l],'value',value)
                    //             }
                    //             // this.relatedListRecords[item.entityApiName].entities.forEach(z=>{
                    //             //     console.log('k[l].id',k[l].id)
                    //             //     if(k[l].id in z.fields){
                    //             //         console.log('99999999999999',z.fields[k[l].id])
                    //             //         this.$set(k[l],'value',z.fields[k[l].id])
                    //             //         l.value = z.fields[k[l].id];
                    //             //         if(k[l].type=='DT'){
                    //             //             // debugger
                    //             //             console.log('this.currenData[k[l].entityApiName].picklistFieldValues[k[l].id].values',this.currenData[k[l].entityApiName].picklistFieldValues[k[l].id].values)
                    //             //            let rowIdx = this.currenData[k[l].entityApiName].picklistFieldValues[k[l].id].values.findIndex(a=>a.value==z.fields[k[l].id].value);
                    //             //            let val = this.currenData[k[l].entityApiName].picklistFieldValues[k[l].id].values[rowIdx].value;
                    //             //            k[l].value = val;
                    //             //            this.$set(k[l],'value',val)
                    //             //            this.$set(k[l],'index',rowIdx)
                    //             //         }
                    //             //     }
                    //             // })
                    //         }
                    //     })
                    // }
                    if(item.type=='RelatedList'){
                        console.log(item.type,item.fields)
                        this.$set(item,['is'+item.entityApiName], false);
                        var formChildList = [];
                        this.relatedListRecords[item.entityApiName].entities.forEach(l=>{
                            formChildList.push(l.fields)
                        });
                        this.$set(item,'formChildList',formChildList)
                        item.fields.forEach(v=>{
                            this.$set(v,'value','');
                            this.$set(v,'index','');
                            if(v.type=='L'||v.type=='DT'||v.type=='LT'){
                                var picklistFieldValues = [];
                                picklistFieldValues = this.currenData[item.entityApiName].picklistFieldValues[v.id].values;
                                // console.log("picklistFieldValues",picklistFieldValues)
                                this.$set(v,'picklistFieldValues',picklistFieldValues);
                            }
                        })
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
                console.log('this.list:', this.list)
                console.log('this.params:', this.params)
            })
        },
        getOpenModal(item,index,idx,v,i,list=[]){
            this.sObjectType = item.sObjectType;
            if(list.length>0){
                console.log(item,index,idx,v,i,list)
                this.childIdx = idx;
                this.childForIdx = idx;
                this.rowI = i;
                this.sObjectType = v.sObjectType;
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
        getPopupSel(item,index){
            this.popupIdx = index;
            if(this.childIdx>=0){
                this.list[this.searchIdx][this.searchId][this.childForIdx].arr[this.rowI].value = {
                    Id: item.ID,
                    Name: item.Name
                };
            }else {
                this.record[this.searchId] = item;
                this.list[this.searchIdx].value = item.Name;
                this.params.parentRecord.fields[this.searchId] = {Id:item.ID};
            }
            this.isShow = false;
        },
        onClosePopup(){
            this.isShow =  false;
        },
        changeInput(val,item,list=[]){
            // 子表input赋值
            if(list.length>0){
                
            }else {
                this.record[item.id] = item.value;
                this.params.parentRecord.fields[item.id]= item.value;
            }
            item.value =  val.mp.detail;
            console.log(val,item,list);
            // console.log(this.record)
        },
        // 子表input赋值
        changeInputChild(e,item,list){
            console.log('item',e,item)
            item.value = e.mp.detail;
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
                changeSwitch(e,item){
            console.log(e,item);
            item.value = e.mp.detail;
            this.params.parentRecord.fields[item.id] = e.mp.detail;
        },
        bindPickerChange(e,item,list=[],idx){
            item.index = e.mp.detail.value;
            item.value = this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].value;
            this.$set(item,'value',this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].value)
            let mapArr = this.currenData[item.entityApiName].picklistFieldMap;
            mapArr.forEach(self=>{
                if(self.DependentName!=item.id){
                    const controllerIndex = this.currenData[item.entityApiName].picklistFieldValues[self.DependentName].controllerValues[item.value];
                    if(controllerIndex!=undefined){
                        const arr = this.currenData[item.entityApiName].picklistFieldValues[self.DependentName].values.filter(f=>{
                            return f.validFor.includes(controllerIndex)
                        })
                        Object.values(list[idx].arr).find((k)=>{
                            return k.id == self.DependentName
                        }).picklistFieldValues = arr
                        Object.values(list[idx].arr).find((k)=>{
                            return k.id == self.DependentName
                        }).value = '';
                        Object.values(list[idx].arr).find((k)=>{
                            return k.id == self.DependentName
                        }).index = '';
                    }
                }
            })
            if(list.length>0){

            }else {
                this.record[item.id] = this.currenData[item.entityApiName].picklistFieldValues[item.id].values[item.index].value;
                this.params.parentRecord.fields[item.id] = item.value;
            }
            console.log(item,'item',this.list)
        },
        bindDateChange(v,item,list=[]){
            item.value = v.mp.detail.value;
            if(list.length>0){

            }else {
                this.record[item.id] = item.value;
                this.params.parentRecord.fields[item.id] = item.value;

            }
        },
        bindMultiPickerChange(v,item){
            item.multiIndex = v.mp.detail.value;
            item.value = this.getCurrentTime(item.multiIndex);
            this.params.parentRecord.fields[item.id] = item.value;
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
        changeCheckTag(e,item){
            console.log(e,item);
            item.result = e.mp.detail;
        }
    }
}
</script>
<style lang="scss">
.minWidth100{
    min-width: 100rpx !important;
    max-width: 100rpx !important;
}
.table{
    width: 100%;
    margin: 20rpx 0;
    overflow-x: auto;
    /*display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: nowrap;*/
    .tr{
        display: flex;
        height: 80rpx;
        flex-wrap: nowrap;
        justify-content: flex-start;
        .th{
            /*width: 200rpx;*/
            flex: 1;
            min-width: 200rpx;
            font-size: 24rpx;
            border-right: 1px solid #dadada;
            text-align: center;
            line-height: 80rpx;
            background: #e2e3e5;
            border-bottom: 1px solid #dadada;
        }
        .td{
            /*width: 200rpx;*/
            flex: 1;
            min-width: 200rpx;
            font-size: 24rpx;
            border-right: 1px solid #dadada;
            text-align: center;
            line-height: 80rpx;
            background: #f4f4f4;
            border-bottom: 1px solid #dadada;
        }
        .td.white{
            background: #fff;
        }
    }
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
.footChild{
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .btn{
        flex: 1;
    }
}
.van-cell__title{
    font-size: 34rpx!important;
}
    .wrap_w{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .inpClass{
            color: #333333;
        }
        .parentWrap{
            width: 100%;
            height: auto;
            background: #fff;
            margin: 30rpx 0;
            // padding: 30rpx 0;
            .rowBox{
                .inp{
                    color: #333333 !important;
                }
            }
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
        .relatedWrap{
            width: 100%;
            height: auto;
            background: #fff;
            margin: 30rpx 0;
            padding: 20rpx;
            box-sizing: border-box;
            .related_label{

            }
            
            
        }
        .value-class {
            flex: none !important;
        }
        .cell{
            margin-top: 24rpx;
            .cellValue{
                font-size: 34rpx;
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
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 20rpx;
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
                width: 100%;
                min-height: 150rpx;
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
            .list_textarea{
                min-height: 100rpx;
                padding-bottom: 20rpx;
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
                .box{
                    display:flex;
                    justify-content: center;
                    p{
                        width: 33.3%;
                        text-align: center;
                        color: #3399ff;
                        padding: 20rpx;
                        border-right: 1rpx solid #f2f2f2;
                    }
                }

            }
        }
    }
    .saveButton{
        background: #3399ff;
        color: #fff;
        width: 80%;
        margin-top: 50rpx;
    }
</style>