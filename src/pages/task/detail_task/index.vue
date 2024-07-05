<template>
    <div class="wrapper">
        <div class="bd">
            <div class="header">
                <div class="IssueType">
                    <img :src="detail.IssueType && detail.IssueType.iconUrl" alt="">
                </div>
                <span class="subject">{{detail.Subject || ''}}</span>
                <!-- <van-checkbox @change="handleChangeStatus" v-model="checked" shape="square">
                </van-checkbox> -->
            </div>
            <div class="center">
                <div class="form">
                    <picker :value="StateCodeIdx" range-key="name" :range="statusList" @change="pickerStatus">
                        <div class="row">
                            <div class="left">
                                <i class="iconfont icon-zhuangtai"></i>
                            </div>
                            <div class="cen" >
                                状态： <span class="status" :class="statusStyle[statusId-1]">{{detail.StateCode && detail.StateCode.name || ''}}</span> 
                            </div>
                            <div class="right">
                                <van-icon name="arrow" />
                            </div>
                        </div>
                    </picker>
                    <div class="row" @click="queryUsers">
                        <div class="left">
                            <i class="iconfont icon-canyuren"></i>
                        </div>
                        <div class="cen">
                            {{detail.CreatedBy && detail.CreatedBy.Name || '设置执行者'}}
                        </div>
                        <div class="right">
                            <van-icon name="arrow" />
                        </div>
                    </div>
                    <picker class="picker" mode="date" :value="detail.ScheduledStart"  @change="pickerStartTime">
                        <div class="row">
                            <div class="left">
                                <i class="iconfont icon-kaishi1"></i>
                            </div>
                            <div class="cen" >
                                {{detail.ScheduledStart || ''}} 开始
                            </div>
                            <div class="right">
                                <van-icon name="arrow" />
                            </div>
                        </div>
                    </picker>
                    <picker class="picker" mode="date" :value="detail.ScheduledEnd"  @change="pickerEndTime">
                        <div class="row">
                            <div class="left">
                                <i class="iconfont icon-jiezhi"></i>
                            </div>
                            <div class="cen">
                                {{detail.ScheduledEnd || ''}} 截止
                            </div>
                            <div class="right">
                                <van-icon name="arrow" />
                            </div>
                        </div>
                    </picker>
                    <picker :value="projectIdx" range-key="Name" :range="projectList" @change="pickerProject">
                        <div class="row">
                            <div class="left" v-if="projectList[projectIdx]">
                                <img :src="pathUrl+projectList[projectIdx].AvatarUrl" alt="">
                            </div>
                            <div class="cen">
                                {{projectList[projectIdx] && projectList[projectIdx].Name}} · {{detail.StateCode && detail.StateCode.name || ''}}
                            </div>
                            <div class="right">
                                <van-icon name="arrow" />
                            </div>
                        </div>
                    </picker>
                    <div class="row" @click="handleOpenDesc">
                        <div class="left">
                            <i class="iconfont icon-beizhu"></i>
                        </div>
                        <div class="cen">
                            <rich-text type="text" :nodes="detail.Description"></rich-text>
                        </div>
                        <div class="right">
                            <van-icon name="arrow" color="#fff" />
                        </div>
                    </div>
                    <div class="row" @click="handleOpenLevel">
                        <div class="left" v-if="detail.PriorityCode">
                            <img :src="imgUrl+detail.PriorityCode.iconUrl" alt="">
                        </div>
                        <div class="cen">
                            {{detail.PriorityCode && detail.PriorityCode.name || ''}}
                        </div>
                        <div class="right">
                            <van-icon name="arrow" />
                        </div>
                    </div>
                    <div class="children_task">
                        <div class="row child" v-for="(item,index) in childTaskList" :key="index" @click="handleDetail(item)">
                            <div class="left">
                                <i class="iconfont icon-zirenwu"></i>
                            </div>
                            <div class="cen">
                                {{item.Subject || ''}} {{item.OwningUser.displayName || '未指派'}}
                            </div>
                            <div class="right" @click="handleMore('childTask',item)">
                                <van-icon name="ellipsis" />
                            </div>
                        </div>
                        <div class="row" @click="handleAddChildTask">
                            <div class="left">
                                <i class="iconfont icon-zirenwu"></i>
                            </div>
                            <div class="cen" style="color:#3399ff">
                                添加子任务
                            </div>
                            <div class="right">
                                <van-icon name="arrow" color="#fff" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="upload">
            <div class="files">
                <div class="file" v-for="(item,index) in files" :key="index"  @click="handlePreviewFile(item)" >
                    <div class="l_img">
                        <!-- <img :src="item.link" alt=""> -->
                        <dImg :item="item" />
                    </div>
                    <p class="name">{{item.name}}</p>
                    <p class="size">{{item.new_size}}</p>
                </div>
            </div>
            <div class="row" @click="handleOpenFile">
                <div class="left">
                    <i class="iconfont icon-tianjiafujian"></i>
                </div>
                <div class="cen">
                    添加附件
                </div>
            </div>
        </div>
        <div class="list_wrap">
            <i-tabs :current="current" @change="handleChangeTab">
                <i-tab key="tab1" title="历史记录"></i-tab>
                <i-tab key="tab2" title="评论"></i-tab>
            </i-tabs>    
            <div class="history" v-if="current=='tab1'">
                <div class="cell">
                    <div class="icon">
                        <i class="iconfont icon-canyuren"></i>
                    </div>
                    <div class="right_info">
                        <p class="name">
                            <span>测试</span>
                            创建了任务
                        </p>
                        <p class="time">
                            2020-02-02 18:18
                        </p>
                    </div>
                </div>
            </div>
            <div class="comment" v-if="current=='tab2'">
                <div class="content" v-for="(item,index) in commentList" :key="index">
                    <div class="row">
                        <p>{{item.commentItem.createdBy.name}}</p>
                    </div>
                    <div class="row">
                        <p class="name">{{item.commentItem.createdBy.name}}</p>
                        <!-- <p class="dept">{{item.BusinessUnitName}}</p> -->
                        <!-- <p class="cont">{{item.body}}</p> -->
                        <p class="cont">
                            <rich-text type="text" :nodes="item.commentItem.body"></rich-text>
                        </p>
                        <p class="info"><span>{{item.commentItem.time}}</span></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="inpWrap" :style="{'height':height+'px'}" catchtouchmove="true" v-if="overlayShow">
            <div class="top" @click="getCloseOver">

            </div>
            <div class="bottom" :style="{'bottom':keyboardHeight+'px'}">
                <div class="box">
                    <textarea class="textarea" v-model="comment" fixed="true"  confirm-hold="true"  @blur="getBlur" :adjust-position="false" :show-confirm-bar="false" cursor-spacing='140' placeholder="我来说两句..." :auto-focus="true" name="" id="" maxlength="500" cols="30" rows="10"></textarea>
                    <div class="total">
                        <p>
                            {{contentSize}}/{{total}}
                        </p>
                        <p @click="getSendout" :class="{active:comment!=''}">
                            发送
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <p class="btn" @click="hanleOpenComment">
                    <van-icon name="comment-o" color="#3399ff" size="20" />
                    评论
                </p>
                <button class="btn" open-type="share" size="mini">
                    <van-icon name="share"  color="#3399ff" size="20" />
                    分享
                </button>
                <p class="btn" @click="handleMore('task')">
                    <van-icon name="ellipsis" color="#3399ff" size="20" />
                    更多
                </p>
            </div>
        </div>
        <van-popup
            :show="isShow"
            position="bottom"
            custom-style="width:100%;height: 80vh;background:#f4f4f4;"
            z-index="99999"
            @close="onClosePopup"
        >
            <div class="popupWrap">
                <van-search :value="lksrch" placeholder="请输入搜索关键词" @change="handleChangeSearch" />
                <ul class="uls">
                    <li @click="getPopupSel(item,index)" v-for="(item,index) in userList" :key="index">
                        <p>{{item.Name}}</p>
                        <p v-if="popupIdx==index">
                            <i-icon type="right" />
                        </p>
                    </li>
                </ul>
            </div>
        </van-popup>
        <van-popup
            :show="isPriority"
            position="bottom"
            z-index="99999"
            @close="closePriority"
            custom-style="width:100%;height: auto;"
        >
            <div class="popupWrap">
                <div class="head">
                    <p class="close" @click="closePriority">
                        关闭
                    </p>
                    <p class="title">
                        优先级
                    </p>
                </div>
                <div class="bd">
                    <div class="row" v-for="(item,index) in levels" :key="index">
                        <div class="color">
                            <img :src="imgUrl+item.iconUrl" alt="">
                        </div>
                        <div class="r_level" @click="handleSelectLevel(item,index)">
                            {{item.name}}
                            <div class="icon" v-if="levelIdx===index">
                                <van-icon name="success" color="#3399ff" size="20" />
                            </div>
                            <div class="icon" v-else>
                                <van-icon name="success" color="#fff" size="20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
        <!-- 操作 -->
        <van-action-sheet
            @select="handleSelect"
            :show="isSheet"
            :actions="actions"
            cancel-text="取消"
            close-on-click-action
            @close="onCancelSheet"
            @cancel="onCancelSheet"
        />
        <van-action-sheet
            @select="handleSelectFile"
            :show="isFileSheet"
            :actions="fileActions"
            cancel-text="取消"
            close-on-click-action
            @close="closeFileSheet"
            @cancel="closeFileSheet"
        />
        <van-action-sheet
            @select="handleSelectFileMore"
            :show="isFileMore"
            :actions="fileMoreActions"
            cancel-text="取消"
            close-on-click-action
            @close="closeFileMore"
            @cancel="closeFileMore"
        />
        <!-- 备注 -->
        <van-popup :show="isDesc" position="bottom">
            <div class="message_popup">
                <div class="head">
                    <p class="l_text" @click="closeDesc">关闭</p>
                    <p class="title">备注</p>
                    <p class="r_text" @click="handleDescComplete">完成</p>
                </div>
                <div class="cont">
                    <textarea :style="{height:height-100+'px'}" placeholder="输入备注" v-model="desc" maxlength="-1"></textarea>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import {newMultiArray} from '@/utils/multiArray';
import {message} from '@/utils/message.js';
import dImg from '@/components/d_img.vue';
import getOpenFiles from '@/utils/openFiles';
export default {
    components:{
        dImg
    },
    data() {
        return {
            checked: false,
            id: '',
            height:"",
            overlayShow:false,
            keyboardHeight:"",
            comment: "",
            total:500,
            detail: {
            },
            userList: [],
            isShow: false,
            popupIdx: -1,
            isPriority: false,
            levels: [],
            levelIdx: '',
            listData: [],
            multiIndex:[0, 0, 0, 0, 0],
            params:{
                recordRep:{
                    objTypeCode: 4200,
                    fields:{
                        ActivityTypeCode: 4212
                    },
                    id: ""
                },
            },
            current: "tab1",
            commentList: [],
            RegardingObjectId: "",
            pageNumber: 1,
            pageSize: 10,
            isSheet: false,
            actions: [
                { name: '删除' }
            ],
            isDesc: false,
            desc: '',
            files: [],
            fileActions: [
                {
                    name: '上传图片'
                },
                {
                    name: '上传会话文件'
                }
            ],
            isFileSheet:false,
            statusList: [],
            StateCodeIdx: '',
            isFileMore: false,
            fileMoreActions:[
                {
                    name: '预览'
                },
                {
                    name: '删除'
                }
            ],
            fileDetail: {}, // 预览的文件
            CommentType: 2,
            projectId: '',
            childTaskList: [],
            tag: 'task',
            childrenId: '',
            projectIdx: '',
            projectList:[],
            statusStyle: [
                'status1style',
                'status2style',
                'status3style',
                'status4style',
                'status5style',
                'status6style'
            ],
            statusId: ''
        }
    },
    computed:{
        contentSize(){
            return this.comment.length || 0;
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        isModelmes(){
            return  wx.getStorageSync('isModelmes');
        },
        imgUrl(){
            // return "https://oawx.hnca.org.cn/static/img";
            return "";
        },
        newMultiArrayList(){
            return newMultiArray();
        },
        pathUrl(){
            // return "https://oawx.hnca.org.cn";
            return "";
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.id = options.id;
        this.params.recordRep.id = this.id;
        this.projectId = options.projectId;
        this.height = wx.getSystemInfoSync().windowHeight;
        // this.getDetail().then(res=>{
        //     this.getChildTaskList();
        // });
        // this.getFilesList();
        // this.queryCommentList();
    },
    onShow(){
        const pages = getCurrentPages();
        const currPage = pages[pages.length-1]
        if(currPage.options.id != undefined){
            this.id = currPage.options.id;
        }else {
            currPage.id = this.id;
        }
        wx.onKeyboardHeightChange(res => { //监听键盘高度变化
            console.log(res.height,'res');
            this.keyboardHeight = res.height;
        })
        this.getDetail().then(res=>{
            this.getChildTaskList();
        });
        this.getProjectList();
        this.getFilesList();
        this.queryCommentList();

    },
    watch:{
        detail:{
            handler(newVal,oldVal){
                console.log(newVal,oldVal)
                this.detail.CreatedBy = newVal.CreatedBy;
            },
            deep: true
        }
    },
    methods:{
        getProjectList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.projectAll,
                    SessionKey: this.sessionkey
                }
            }).then(res=>{
                this.projectList = res.rows;
                this.projectIdx = this.projectList.findIndex(item=>item.ProjectId==this.projectId);
            })
        },
        pickerProject(e){
            this.projectIdx = e.mp.detail.value;
            this.projectId = this.projectList[this.projectIdx].ProjectId;
            this.getSaveData('RegardingObjectId',{
                Id: this.projectId,
                Name: this.projectList[this.projectIdx].Name
            })
        },
       async getDetail(){
        let response
         await this.$httpWX.get({
              url:this.$api.message.queryList,
              data:{
                  method: this.$api.task.detail,
                  SessionKey: this.sessionkey,
                  objTypeCode: 4200,
                  id: this.id
              }
          }).then(res=>{
              this.listData = res.data.fields;
              this.listData.forEach(item=>{
                if(item.key=='CreatedBy'){
                    this.detail[item.key] = {
                        Id: item.content.id,
                        Name: item.content.displayName
                    };
                }else if(item.key=='PriorityCode'){
                    this.detail[item.key] = {
                        name:item.content.name,
                        id:item.content.id,
                        iconUrl: item.content.iconUrl
                    };
                    this.levels = item.priorities.nodes;
                }else if(item.key=='RegardingObjectId'){
                    this.RegardingObjectId = item.content;
                }else if(item.key=='StateCode'){
                    this.detail[item.key] = {
                        name:item.content.name,
                        id:item.content.id
                    };
                    this.statusList = item.statuss.nodes;
                    this.StateCodeIdx = item.statuss.nodes.findIndex(v=>v.statusId==item.content.id)
                    this.statusId = this.statusList[this.StateCodeIdx].statusCategoryId || '';
                }else if(item.key=='IssueType'){
                    this.detail[item.key] = {
                        iconUrl: this.imgUrl+item.content.iconUrl,
                        name: item.content.name
                    }
                }else{
                    this.$set(this.detail,item.key,item.content)
                }
                if(item.key=='Description'){
                    this.desc = item.content;
                }
              })
              response = res;
          })
          return response;
        },
        getChildTaskList(){
            // var filterQuery = "\nStatusCategoryId\tneq\t3"
            let params = {
                actions: [
                    {
                        params: {
                            projectId: this.RegardingObjectId,
                            parent: this.id,
                            // filterQuery: filterQuery,
                            sort: '',
                            order: ''
                        }
                    }
                ]
            }
            this.$httpWX.get({
                url: this.$api.message.queryList,
                data:{
                    method:this.$api.task.childrenTask,
                    SessionKey: this.sessionkey,
                    message: JSON.stringify(params)
                }
            }).then(res=>{
                console.log('123123213', res.data.list.nodes);
                this.childTaskList = res.data.list.nodes;
                this.childTaskList.forEach(item=>{
                    item.fields.forEach(v=>{
                        if(v.fieldKey=='Subject'){
                            this.$set(item,v.fieldKey,v.textValue)
                        }else if(v.fieldKey=='OwningUser'){
                            this.$set(item,v.fieldKey,v.userValue)
                        }
                    })
                })
                console.log(this.childTaskList,'childrenTask')
            })
        },
        handleChangeTab(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab2'){
                this.CommentType = 1;
            }else {
                this.CommentType = 2;
            }
            this.queryCommentList();
        },
        queryCommentList(){
            var filterQuery ='CommentType\teq\t'+this.CommentType
            var params = {
                actions: [
                    {
                        params: {
                            filterQuery: filterQuery,
                            type:this.CommentType,
                            regardingObjectId: this.id,
                            sort: "up",
                            entityType: "10C",
                            pageNumber: this.pageNumber,
                            pageSize: this.pageSize
                        }
                    }
                ]
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.commentList,
                    SessionKey: this.sessionkey,
                    message: JSON.stringify(params)
                }
            }).then(res=>{
                if(this.CommentType==1){
                    this.commentList = res.actions[0].returnValue.Data;
                    this.commentList.forEach(item=>{
                        if(item.commentItem.createdOn){
                            var time = item.commentItem.createdOn.replace(/T/g,' ')
                            this.$set(item.commentItem,'time',time)
                        }
                    })
                }
            })
        },
        handleChangeStatus(e){
            this.checked = e.mp.detail;
        },
        queryUsers(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.users,
                    SessionKey: this.sessionkey,
                    Lktp: 8,
                    projectId: this.RegardingObjectId
                }
            }).then(res=>{
                this.userList = res.listData;
                this.isShow = true;
            })
        },
        // 更改状态
        pickerStatus(e){
            this.StateCodeIdx = e.mp.detail.value;
            this.detail.StateCode ={
                name: this.statusList[this.StateCodeIdx].name,
                id: this.statusList[this.StateCodeIdx].statusId
            }
            console.log(this.StateCodeIdx, this.detail,this.statusList)
            this.getSaveData('StateCode',this.detail.StateCode.id);
        },
        pickerStartTime(e){
            this.detail.ScheduledStart = e.mp.detail.value;
            this.getSaveData('ScheduledStart',this.detail.ScheduledStart);
        },
        pickerEndTime(e){
            this.detail.ScheduledEnd = e.mp.detail.value;
            this.getSaveData('ScheduledEnd',this.detail.ScheduledEnd);
        },
         // 选择人
        getPopupSel(item,index){
            this.popupIdx = index;
            this.detail.CreatedBy = {
                Id: item.ID,
                Name: item.Name
            }
            this.getSaveData('CreatedBy',this.detail.CreatedBy).then(res=>{
                console.log('success:',res);
            })
            this.popupIdx = -1;
            this.isShow = false;
        },
        handleOpenLevel(){
            this.isPriority = true;
        },
         // 选择优先级
        handleSelectLevel(item,index){
            this.levelIdx = index;
            this.detail.PriorityCode = item;
            this.getSaveData('PriorityCode',item.id)
            this.isPriority = false;
        },
        handleOpenDesc(){
            this.isDesc = true;
        },
        // 备注
        handleDescComplete(){
            this.getSaveData('Description',this.desc).then(res=>{
                this.isDesc = false;
                this.getDetail();
            })
        },
        closeDesc(){
            this.isDesc = false;
        },
        closePriority(){
            this.isPriority = false;
        },
        hanleOpenComment(){
            this.overlayShow = true;
        },
        getCloseOver(){
            this.overlayShow = false;
        },
        getSendout(){
            var params = {
                params: {
                    recordRep: {
                        objTypeCode: 20310,
                        fields: {
                            Body: this.comment,
                            RegardingObjectId: {
                                Id: this.id
                            },
                            CommentType: 1,
                            RegardingObjectTypeCode: 4212
                        }
                    }
                }
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.sendComment,
                    SessionKey: this.sessionkey,
                    message: JSON.stringify(params)
                }
            }).then(res=>{
                console.log(res);
                if(res.status==1){
                    this.getCloseOver();
                    this.queryCommentList();
                }
            })
        },
        getSaveData(filed,value){
            return new Promise((resolve,reject)=>{
                this.params.recordRep.fields[filed] = value;
                var params = {
                    params: this.params
                };
                
                this.$httpWX.post({
                    url: this.$api.message.queryList,
                    data:{
                        method: this.$api.task.create,
                        SessionKey: this.sessionkey,
                        message: JSON.stringify(params)
                    }
                }).then(res=>{
                    console.log('res',res);
                    if(res.status*1===1){
                        message.toast({
                            title: '修改成功',
                            delta: 0,
                            success:res=>{
                                setTimeout(()=>{
                                    this.getDetail();
                                },500)
                            }
                        })
                    }
                    resolve(res)
                })
            })
        },
        handleMore(tag,item = {}){
            this.tag = tag;
            this.childrenId = item.id;
            this.isSheet = true;
        },
        handleDetail(item){
            this.childrenId = item.id;
            wx.navigateTo({
                url:'/pages/task/detail_task/main?id='+item.id
            })
        },
        handleSelect(e){
            console.log(e);
            let name = e.mp.detail.name;
            if(name=='删除'){
                this.deleteTask();
            }
        },
        handlePreviewFile(item){
            this.fileDetail = item;
            this.isFileMore = true;
        },
        // 上传文件
        handleSelectFile(e){
            console.log(e)
            let name = e.mp.detail.name;
            if(name=='上传图片'){
                this.uploadPhoto();
            }else {
                this.chooseMessageFile();
            }
        },
        // 查看/删除文件
        handleSelectFileMore(e){
            let name = e.mp.detail.name;
            if(name=='预览'){
                const openImgs = JSON.stringify([this.fileDetail.link]);
                getOpenFiles(this.fileDetail,openImgs);
                this.isFileMore = false;
            }else if(name=='删除'){
                this.deleteFile();
            }
        },
        deleteFile(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.deleteFile,
                    SessionKey: this.sessionkey,
                    Id: this.fileDetail.id
                }
            }).then(res=>{
                console.log(res);
                this.isFileMore = false;
                this.getFilesList();
            })
        },
        onClosePopup(){
            this.isShow =  false;
        },
        closeFileMore(){
            this.isFileMore = false;
        },
        uploadPhoto(){
            var that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    console.log(res);
                    const tempFilePaths = res.tempFilePaths;
                    const tempFiles = res.tempFiles;
                    tempFiles.map(item=>{
                        console.log(item, that)
                        var new_size = that.fileSize(item.size);
                        item.new_size = new_size;
                        return item;
                    })
                    console.log('tempFiles:', tempFiles)
                    wx.uploadFile({
                        url: that.$api.pathUrl+'/rest?method='+that.$api.task.upload+'&SessionKey='+that.sessionkey+'&pid='+that.id+'&ObjTypeCode='+4200,
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            const data = res.data
                            // that.files = that.files.concat(tempFiles);
                            that.isFileSheet = false;
                            that.getFilesList();
                        }
                    })
            }
            })
        },
        getFilesList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.public.getFile,
                    SessionKey: this.sessionkey,
                    ObjTypeCode: 4200,
                    pid: this.id
                }
            }).then(res=>{
                this.files = res.listData.map(item=>{
                    const new_size = this.fileSize(item.fileSize);
                    item.new_size = new_size;
                    return item;
                });

            })
        },
        fileSize(val){
            if (!val) return "";
            if (val < 102.4) {
                return val + " B";
            }
            let num = val / 1024;
            if (num > 1024) {
                num = num / 1024;
                return num.toFixed(2) + "MB";
            } else {
                return num.toFixed(2) + "KB";
            }
        },
        chooseMessageFile(){
            var that = this;
            wx.chooseMessageFile({
                count:2,
                type: 'file',
                // extension: ['.xlsx', '.xls', '.XLSX', '.XLS', 'xlsx', 'xls', 'XLSX', 'XLS'],
                success:res=>{
                    console.log(res,'message');
                    const tempFilePaths = res.tempFiles
                    var len = 0;
                    for (var i in tempFilePaths) {
                        len++
                         wx.uploadFile({
                            url: that.$api.pathUrl+'/rest?method='+that.$api.task.upload+'&SessionKey='+that.sessionkey+'&pid='+that.id+'&ObjTypeCode='+4200,
                            filePath:  tempFilePaths[i].path,
                            name: 'file',
                            formData: {
                                'file': tempFilePaths[i].path
                            },
                            success:response=>{
                                console.log(response);
                                if(len==tempFilePaths.length){
                                    message.toast({
                                        title: '上传成功!',
                                        delta: 0,
                                        success:function(){
                                            that.isFileSheet = false;
                                            setTimeout(()=>{
                                                that.getFilesList();
                                            },100)
                                        }
                                    })
                                }
                            },
                            fail:err=>{
                                console.log(err);
                            }
                         })
                    }
                }
            })
        },
        handleOpenFile(){
            this.isFileSheet = true;
        },
        onCancelSheet(){
            this.isSheet = false;
        },
        closeFileSheet(){
            this.isFileSheet = false;
        },
        deleteTask(){
            let id = this.id;
            if(this.tag == 'childTask'){
                id = this.childrenId;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.delete,
                    SessionKey: this.sessionkey,
                    objTypeCode: 4200,
                    id: id
                }
            }).then(res=>{
                this.isSheet = false;
                if(res.actions[0].state=='SUCCESS'){
                    if(this.tag=='task'){
                        message.toast({
                            title: '删除成功',
                            delta: 1
                        })
                    }else if(this.tag=='childTask'){
                        message.toast({
                            title: '删除成功',
                            delta: 0,
                            success:res=>{
                                setTimeout(()=>{
                                    this.getDetail().then(res=>{
                                        this.getChildTaskList();    
                                    })
                                },500)
                            }
                        })
                    }
                }
            })
        },
        // 添加子任务
        handleAddChildTask(){
            wx.navigateTo({
                url: '/pages/task/create_task/main?id='+this.id+'&projectId='+this.projectId
            })
        }
    },
    onShareAppMessage() {
        // const promise = new Promise(resolve => {
        //     setTimeout(() => {
        //         resolve({
        //             title: '分享给好友'
        //         })
        //     }, 2000)
        // })
        return {
            title: '分享给好友',
            path: 'pages/task/detail_task/main?id='+this.id+'&projectId='+this.projectId
        }
    }
}
</script>
<style lang="scss">
@import url('../../../../static/css/task.css');
    .wrapper{
        padding-bottom: 100px;
    }
    .bd{
        // background: #fff;
        .header{
            padding: 20rpx 30rpx;
            display: flex;
            align-items: center;
            background: #fff;
            .IssueType{
                width: 40rpx;
                height: 40rpx;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .subject{
                font-size: 32rpx;
                font-weight: bold;
                padding-left: 20rpx;
            }
        }
        .center{
            .form{
                .row:first-child{
                    align-items: center;
                }
                .row{
                    padding: 20rpx 30rpx;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    // align-items: center;
                    background: #fff;
                    .left{
                        img{
                            width: 40rpx;
                            height: 40rpx;
                        }
                    }
                    .cen{
                        flex: 1;
                        font-size: 28rpx;
                        color: #333;
                        padding: 0 20rpx;
                        .status{
                            display: inline-block;
                            color: #333;
                            font-weight: initial;
                            font-size: 28rpx;
                            width: 100rpx;
                            text-align: center;
                            height: 50rpx;
                            line-height: 50rpx;
                            border-radius: 5rpx;
                        }
                    }
                }
                .child{
                    border-bottom: 1rpx solid #e2e3e5;
                }
            }
            .children_task{
                margin-top: 20rpx;
            }
        }
    }
    .upload{
        margin: 20rpx 0;
        padding-left: 30rpx;
        background: #fff;
        .files{
            .file{
                display: flex;
                align-items: center;
                padding: 15rpx 0;
                border-bottom: 1rpx solid #e2e3e5;
                .l_img{
                    width: 80rpx;
                    height: 120rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .name{
                    flex: 1;
                    margin-left: 20rpx;
                    font-size: 28rpx;
                    color: #333;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .size{
                    font-size: 28rpx;
                    color: #666;
                    padding:0 20rpx;
                }
            }
        }
        .row{
            padding: 20rpx 0;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            .cen{
                flex: 1;
                font-size: 28rpx;
                color: #3399ff;
                padding: 0 20rpx;
            }
        }
    }
    .list_wrap{
        margin-top: 30rpx;
        .comment{
            .content{
                background: #fff;
                padding: 30rpx;
                display: flex;
                border-bottom: 1rpx solid #eceeed;
                .row:nth-child(1){
                    p{
                        width: 69rpx;
                        height: 69rpx;
                        border-radius: 50%;
                        background: #3399ff;
                        text-align: center;
                        line-height: 69rpx;
                        font-size: 23rpx;
                        color: #fff;
                    }
                }
                .row:nth-child(2){
                    flex:1;
                    margin-left: 19rpx;
                    .name{
                        font-size: 31rpx;
                        color: #3399ff;
                    }
                    .cont{
                        font-size: 35rpx;
                        margin: 15rpx 0;
                        color: #333333;
                    }
                    .dept{
                        font-size: 26rpx;
                        color: #999999;
                    }
                    .info{
                        font-size: 27rpx;
                        color: #999999;
                        span{
                            // margin-left: 20rpx;
                        }
                    }
                }
                .row:nth-child(3){
                    display: flex;
                    // align-items: center;
                    .zan{
                        color:#999999;
                        font-size: 12px;
                    }
                    span{
                        margin-left: 10rpx;
                        font-size: 27rpx;
                        color: #666666;
                    }
                    .active{
                        color: #ff6666;
                    }
                }
            }
        }
        .history{
            background: #fff;
            .cell{
                display: flex;
                padding: 15rpx 20rpx;
                border-bottom: 1rpx solid #e2e3e5;
                .right_info{
                    margin-left: 20rpx;
                    font-size: 28rpx;
                    color: #666;
                    .name{
                        line-height: 1.2;
                        span{
                            color: #333;
                            padding-right: 20rpx;
                        }
                    }
                    .time{
                        padding-top: 15rpx;
                    }
                }
            }
        }
    }
    .inpWrap{
        width: 100%;
        position: fixed;
        bottom: 100px;
        z-index: 999999;
        .top{
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 1);
            opacity: .5;
        }
        .bottom{
            width: 100%;
            height: auto;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 9999;
            .box{
                padding: 33rpx 33rpx 0 33rpx;
                .textarea{
                    width: 100%;
                    height: 188rpx;
                    background: #fff;
                    color: #333333;
                    font-size: 28rpx;
                    border-bottom: 2rpx solid #eaebeb;
                }
                .total{
                    display: flex;
                    justify-content: space-between;
                    padding: 33rpx 0;
                    p:nth-child(1){
                        color: #999999;
                        font-size: 28rpx;
                    }
                    p:nth-child(2){
                        color: #999999;
                        font-size: 33rpx;
                    }
                    p:nth-child(2).active{
                        color: #3399ff;
                    }
                }
            }
        }
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 20rpx;
        background: #fff;
        border-top: 1rpx solid #e2e3e5;
        box-shadow: 0 3rpx 10rpx 0 rgba(0,0,0,.1);
        z-index: 10;
        .box{
            display: flex;
            .btn{
                line-height: 100rpx;
                text-align: center;
                font-size: 28rpx;
                color: #3399ff;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
            }
            button {
                margin: 0 ;
                padding: 0;
                background: #fff;
                border-radius: 0;
                -webkit-appearance: none;

                &::after {
                    border: none;
                }
            }
        }
    }
    .popupWrap{
        .head{
            padding: 15rpx 20rpx;
            box-shadow: 0 3rpx 10rpx 0 rgba(0,0,0,.1);
            position: relative;
            text-align: center;
            color: #333;
            .title{
                text-align: center;
                font-weight: bold;
                font-size: 32rpx;
            }
            .close{
                display: inline-block;
                position: absolute;
                top: 15rpx;
                left: 20rpx;
                font-size: 28rpx;
            }
        }
        .bd{
            .row{
                display: flex;
                align-items: center;
                padding-left:30rpx;
                .color{
                    width: 30rpx;
                    height: 30rpx;
                    border-radius: 50%;
                    // border: 5rpx solid #999;
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .r_level{
                    color: #333;
                    font-size: 28rpx;
                    border-bottom: 1rpx solid #e2e3e5;
                    margin-left: 20rpx;
                    flex: 1;
                    padding: 20rpx 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-right: 20rpx;
                    box-sizing: border-box;
                }
            }
        }
        // 选择人
        .uls{
            margin-top: 20rpx;
            li{
                padding: 33rpx ;
                color: #333333;
                font-size: 28rpx;
                display: flex;
                justify-content: space-between;
                background: #fff;
                margin-bottom: 10rpx;
            }
        }
    }
    .message_popup{
        width: 100%;
        height: 100vh;
        .head{
            padding: 20rpx 30rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title{
                font-size: 32rpx;
                font-weight: bold;
            }
        }
        .cont{
            padding: 20rpx 30rpx;
            textarea{
                width: 100%;
            }
        }
    }
</style>