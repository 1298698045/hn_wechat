<template>
    <div class="wrapper">
        <div class="header">
            <p class="cancel" @click="getBack">取消</p>
            <p class="submit" @click="handleComplete">完成</p>
        </div>
        <div class="container">
            <div class="form">
                <div v-for="(item,index) in listData" :key="index">
                    <div class="cell" v-if="item.type=='project'">
                        <picker :value="projectIdx" range-key="name" :range="projectList" @change="function(val){changeProject(val,item)}">
                            <div class="row">
                                <div class="l_label">
                                    <span class="required" v-if="item.fieldConfig.isRequired">*</span>
                                    <i class="iconfont icon-fenzu"></i>
                                    {{item.name}}
                                </div>
                                <div class="c_input">
                                    <input type="text" :disabled="true" :value="projectList[projectIdx] && projectList[projectIdx].name" class="inp">
                                </div>
                                <div class="r_icon">
                                    <van-icon name="arrow" color="#999" />
                                </div>
                            </div>
                        </picker>
                    </div>
                    <div class="cell" v-if="item.type=='text'">
                        <div class="richText">
                            <textarea :placeholder="'请输入任务'+item.name" @input="(e)=>{handleTextarea(e,item)}" v-model="item.value"  maxlength="200"></textarea>
                        </div>
                    </div>
                    <div class="cell" v-if="item.type=='issuetype'">
                        <picker :value="item.idx" range-key="name" :range="item.issueTypes.nodes" @change="(e)=>{handlePickerType(e,item)}">
                            <div class="row">
                                <div class="l_label">
                                    <span class="required" v-if="item.fieldConfig.isRequired">*</span>
                                    <img v-if="item.issueTypes.nodes[item.idx]" :src="imgUrl+item.issueTypes.nodes[item.idx].iconUrl" alt="">
                                    {{item.name}}
                                </div>
                                <div class="c_input">
                                    <input type="text" :disabled="true" :value="item.issueTypes.nodes[item.idx] && item.issueTypes.nodes[item.idx].name" class="inp">
                                </div>
                                <div class="r_icon">
                                    <van-icon name="arrow" color="#999" />
                                </div>
                            </div>
                        </picker>
                    </div>
                    <div class="cell" v-if="item.type=='user'" @click="queryUsers(item,index)">
                        <div class="row">
                            <div class="l_label">
                                <span class="required" v-if="item.fieldConfig.isRequired">*</span>
                                <i class="iconfont icon-canyuren"></i>
                                {{item.name}}
                            </div>
                            <div class="c_input">
                                <input type="text" placeholder="请选择" :disabled="true" :value="item.value && item.value.Name" class="inp">
                            </div>
                            <div class="r_icon">
                                <van-icon name="arrow" color="#999" />
                            </div>
                        </div>
                    </div>
                    <div class="cell" v-if="item.type=='date'">
                        <!-- <picker class="picker" mode="multiSelector" :value="item.multiIndex"  @change="((val)=>{bindMultiPickerChange(val,item)})"
                        :range="newMultiArrayList">
                            <div class="row">
                                <div class="l_label">
                                    <span class="required" v-if="item.fieldConfig.isRequired">*</span>
                                    {{item.name}}
                                </div>
                                <div class="c_input">
                                    <input type="text" placeholder="请选择" :disabled="true" :value="item.value" class="inp">
                                </div>
                                <div class="r_icon">
                                    <van-icon name="arrow" color="#999" />
                                </div>
                            </div>
                        </picker> -->
                        <picker class="picker" mode="date" :value="item.value"  @change="(e)=>{pickerStartTime(e,item)}">
                            <div class="row">
                                <div class="l_label">
                                    <span class="required" v-if="item.fieldConfig.isRequired">*</span>
                                    <i class="iconfont icon-kaishi1" v-if="item.fieldId=='ScheduledStart'"></i>
                                    <i class="iconfont icon-jiezhi" v-else></i>
                                    {{item.name}}
                                </div>
                                <div class="c_input">
                                    <input type="text" placeholder="请选择" :disabled="true" :value="item.value" class="inp">
                                </div>
                                <div class="r_icon">
                                    <van-icon name="arrow" color="#999" />
                                </div>
                            </div>
                        </picker>
                    </div>
                    <div class="cell" v-if="item.type=='description'">
                        <!-- <div class="row">
                            <div class="l_label">
                                <span class="required" v-if="item.fieldConfig.isRequired">*</span>
                                <i class="iconfont icon-beizhu"></i>
                                {{item.name}}
                            </div>
                            <div class="c_input">
                                <input type="text" @input="(e)=>{handleTextarea(e,item)}" v-model="item.value" placeholder="添加备注" class="inp">
                            </div>
                            <div class="r_icon">
                                <van-icon name="arrow" color="#fff" />
                            </div>
                        </div> -->
                        <div class="richText">
                            <textarea :placeholder="'请输入'+item.name" @input="(e)=>{handleTextarea(e,item)}" v-model="item.value"  maxlength="200"></textarea>
                        </div>
                    </div>
                    <div class="cell" v-if="item.type=='priority'">
                        <div class="row">
                            <div class="l_label">
                                <span class="required" v-if="item.fieldConfig.isRequired">*</span>
                                <img v-if="item.priorities.nodes[item.idx]" :src="imgUrl+item.priorities.nodes[item.idx].iconUrl" alt="">
                                {{item.name}}
                            </div>
                            <div class="c_input" @click="handleOpenPriority(item,index)">
                                <input type="text" placeholder="选择优先级" :value="item.value" :disabled="true" class="inp">
                            </div>
                            <div class="r_icon">
                                <van-icon name="arrow" color="#999" />
                            </div>
                        </div>
                    </div>
                    <div class="upload" v-if="item.type=='attachment'">
                        <div class="files">
                            <div class="file" v-for="(v,idx) in files" :key="idx"  @click="handlePreviewFile(v)" >
                                <div class="l_img">
                                    <img :src="v.path" alt="">
                                </div>
                                <p class="name">{{v.path}}</p>
                                <p class="size">{{v.new_size}}</p>
                            </div>
                        </div>
                        <div class="row" @click="handleOpenFile(item,index)">
                            <div class="left">
                                <i class="iconfont icon-tianjiafujian"></i>
                            </div>
                            <div class="cen">
                                添加附件
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="btn">
                <van-button type="info" block @click="handleComplete">完成</van-button>
            </div>
        </div> -->
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
    </div>
</template>
<script>
import {newMultiArray} from '@/utils/multiArray';
import {message} from '@/utils/message.js';
import getOpenFiles from '@/utils/openFiles';
export default {
    data() {
        return {
            list:[
                {
                    val: '123',
                    label:'项目',
                    id: 1
                }
            ],
            idx: 0,
            multiIndex: [0, 0, 0, 0, 0],
            value:"",
            isPriority: false, // 优先级
            levels:[
                '较低','普通','紧急','非常紧急'
            ],
            levelIdx: -1,
            color: ['#999','#3399ff','orange','red'],
            isShow:false,
            lksrch: "",
            popupIdx: -1,
            listData: [],
            projectList: [],
            projectIdx: 0,
            userList: [],
            userId: "",
            params:{
                recordRep:{
                    objTypeCode: 4200,
                    fields:{
                        ActivityTypeCode: 4212,
                        ListId: {
                            Id: ''
                        }
                    }
                },
            },
            recordLevel: "",
            userIdx: '',
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
            tempFiles: [],
            tempFilePaths: [],
            fileIndex: '',
            id: '',
            fileDetail:{},
            isFileMore: false,
            fileMoreActions:[
                {
                    name: '预览'
                },
                {
                    name: '删除'
                }
            ],
            id: '',
            projectId: "ee35bacd-8991-439d-9038-5db96744234e"
        }
    },
    computed:{
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        newMultiArrayList(){
            return newMultiArray();
        },
        isModelmes(){
            return  wx.getStorageSync('isModelmes');
        },
        imgUrl(){
            return "https://oawx.hnca.org.cn/static/img";
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        if(options.id){
            this.id = options.id;
            this.params.recordRep.fields['ParentActivityId'] = {
                Id: options.id
            }
        }
        
        console.log(this.params,'params')
        this.files = [];
        this.queryProject().then(res=>{
            this.queryLayout().then(()=>{
                if(options.projectId){
                    console.log(options.projectId)
                    this.projectIdx = this.projectList.findIndex(v=>v.id===options.projectId);
                    this.projectId = options.projectId;
                    this.params.recordRep.fields.ListId.Id = options.ListId;
                    this.params.recordRep.fields.RegardingObjectId = {
                        Id: options.projectId
                    };
                }
            });
        })
    },
    methods:{
       async queryProject(){
           let response
           await this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.project,
                    SessionKey: this.sessionkey,
                    Lktp: 20290
                }
            }).then(res=>{
                this.projectList = res.data.allProjects.nodes;
                response = res;
            })
            return response;
        },
        // 项目
        changeProject(val,item){
            console.log(val,item)
            this.projectIdx = val.mp.detail.value;
            this.params.recordRep.fields[item.fieldId] = {
                Id: this.projectList[this.projectIdx].id,
                Name: this.projectList[this.projectIdx].name
            };
            this.projectId = this.projectList[this.projectIdx].id;
            console.log(this.params,'params')
        },
        handleTextarea(e,item){
            item.value = e.mp.detail.value;
            this.params.recordRep.fields[item.fieldId] = item.value;
        },
        // 类型
        handlePickerType(e,item){
            console.log(e,item)
            item.idx = e.mp.detail.value;
            this.$set(item,'idx',e.mp.detail.value)
            this.params.recordRep.fields[item.fieldId] = item.issueTypes.nodes[item.idx].id;
            console.log('this.params.recordRep.fields[item.fieldId]',this.params.recordRep.fields[item.fieldId])
        },
        bindPickerChange(e,item){

        },
        queryUsers(item,index){
            this.userIdx = index;
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.users,
                    SessionKey: this.sessionkey,
                    Lktp: 8,
                    projectId: this.projectId
                }
            }).then(res=>{
                this.userList = res.listData;
                this.isShow = true;
            })
        },
        queryLayout(){
           return   this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method: this.$api.task.formLayout,
                    SessionKey: this.sessionkey,
                    projectId: this.projectId
                }
            }).then(res=>{
                this.listData = res.data.issueCreateFields.fields.nodes;
                this.listData.forEach(item=>{
                    this.$set(item,'value','');
                    if(item.type==='project'){
                        this.projectIdx = this.projectList.findIndex(v=>v.id===item.project.id) || '';
                        if(this.projectIdx!=''){
                            this.params.recordRep.fields[item.fieldId] = {
                                Id: this.projectList[this.projectIdx].id,
                                Name: this.projectList[this.projectIdx].name
                            }
                            item.value = {
                                Id: this.projectList[this.projectIdx].id,
                                Name: this.projectList[this.projectIdx].name
                            }
                            this.projectId = this.projectList[this.projectIdx].id;
                        }
                    }
                    if(item.type==='issuetype'){
                        this.$set(item,'idx',0)
                        if(this.id!=''){
                            item.idx = item.issueTypes.nodes.findIndex(v=>v.id==='10010');
                            this.params.recordRep.fields[item.type] = '10010';
                            item.value = '10010';
                        }else if(item.issueType.id){
                            item.idx = item.issueTypes.nodes.findIndex(v=>v.id===item.issueType.id);
                            this.params.recordRep.fields[item.fieldId] = item.issueType.id;
                            item.value = item.issueType.id;
                        }
                    }
                    if(item.type=='user' && item.fieldId=='CreatedBy'){
                        item.value = {
                            Name: item.user.name,
                            Id: item.user.accountId
                        }
                        this.params.recordRep.fields[item.fieldId] = item.value;
                    }
                    // 优先级
                    if(item.type=='priority'){
                        var idx = item.priorities.nodes.findIndex(v=>v.id==item.priority.id);
                        item.idx = idx;
                        item.value = item.priority.name;
                        this.params.recordRep.fields[item.fieldId] = item.priority.id;
                    }
                })
            })
        },
        bindMultiPickerChange(v,item){
            console.log(v,item)
            item.multiIndex = v.mp.detail.value;
            item.value = this.getCurrentTime(item.multiIndex);
            this.params.recordRep.fields[item.fieldId] = item.value;
        },
        pickerStartTime(e,item){
            console.log(e,item)
            item.value = e.mp.detail.value;
            this.params.recordRep.fields[item.fieldId] = item.value;
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
        RemoveChinese(strValue){ 
            if(strValue != null && strValue != ""){ 
                var reg =/[\u4e00-\u9fa5]/g; 
                return strValue.replace(reg, "");
            }else{
                return "";
            }
        },
        // 选择优先级
        handleSelectLevel(item,index){
            this.levelIdx = index;
            this.listData[this.recordLevel].value = item.name;
            this.params.recordRep.fields[this.listData[this.recordLevel].fieldId] = item.id;
            this.listData[this.recordLevel].idx = this.listData[this.recordLevel].priorities.nodes.findIndex(v=>v.id==item.id)
            this.isPriority = false;
        },
        handleOpenPriority(item,index){
            this.recordLevel = index;
            this.levels = item.priorities.nodes;
            this.isPriority = true;
        },
        closePriority(){
            this.isPriority = false;
        },
        // 选择人
        getPopupSel(item,index){
            this.popupIdx = index;
            this.listData[this.userIdx].value = {
                Id: item.ID,
                Name: item.Name
            }
            this.params.recordRep.fields[this.listData[this.userIdx].fieldId] = {
                Id: item.ID,
                Name: item.Name
            };
            this.popupIdx = -1;
            this.isShow = false;
        },
        onClosePopup(){
            this.isShow =  false;
        },
        handleChangeSearch(e){
            this.lksrch = e.mp.detail;
            // this.getLookup().then(res=>{
            //     this.list[this.searchIdx].temp = res.listData;
            // });
        },
        // 打开选择人
        getOpenModal(){
            this.isShow = true;
        },
        // 完成
        handleComplete(){
            console.log(this.params)
            const params = {
                params: this.params
            }
            this.listData.forEach(item=>{
                if(item.fieldConfig.isRequired && item.type!=='attachment'){
                    if(item.value==''){
                        message.toast({
                            title: '请填写'+item.name
                        })
                        throw new Error('请填写'+item.name);
                    }
                }
            })
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
                    let id = res.recordRep.id;
                    if(this.files.length>0){
                        this.uploadFile(id);
                    }else {
                        message.toast({
                            title: '创建成功',
                            delta: 1
                        })
                    }
                }
            })
        },
        handleOpenFile(item,index){
            this.fileIndex = index;
            this.isFileSheet = true;
        },
        closeFileSheet(){
            this.isFileSheet = false;
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
                    that.files = tempFiles;
                    that.listData[that.fileIndex].value = tempFilePaths;
                    that.tempFilePaths = tempFilePaths;
                }
            })
        },
        chooseMessageFile(){
            var that = this;
            wx.chooseMessageFile({
                count:2,
                type: 'file',
                // extension: ['.xlsx', '.xls', '.XLSX', '.XLS', 'xlsx', 'xls', 'XLSX', 'XLS'],
                success:res=>{
                    console.log(res,'message');
                    const tempFiles = res.tempFiles;
                    that.files = that.files.concat(tempFiles);
                }
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
        uploadFile(id){
            var that = this;
            var len = 0;
            for(var i in that.files){
                len++
                wx.uploadFile({
                    url: that.$api.pathUrl+'/rest?method='+that.$api.task.upload+'&SessionKey='+that.sessionkey+'&pid='+id+'&ObjTypeCode='+4200,
                    filePath: that.files[i].path,
                    name: 'file',
                    formData: {
                        'file': that.files[i].path
                    },
                    success (res){
                        console.log(res,'附件上传')
                        if(len==that.files.length){
                            const data = JSON.parse(res.data)
                            if(data.actions[0].state=='SUCCESS'){
                                message.toast({
                                    title: '创建成功',
                                    delta: 1
                                })
                            }
                        }
                        that.isFileSheet = false;
                    }
                })
            }
        },
        handlePreviewFile(item,index){
            this.fileIndex = index;
            this.fileDetail = item;
            this.isFileMore = true;
        },
        // 查看/删除文件
        handleSelectFileMore(e){
            let name = e.mp.detail.name;
            if(name=='预览'){
                const openImgs = JSON.stringify([this.fileDetail.path || this.fileDetail.link]);
                this.fileDetail.fileExtension = this.fileDetail.fileExtension || 'png';
                getOpenFiles(this.fileDetail,openImgs);
                this.isFileMore = false;
            }else if(name=='删除'){
                this.deleteFile();
            }
        },
        closeFileMore(){
            this.isFileMore = false;
        },
        deleteFile(){
            this.files.splice(this.fileIndex,1);
            this.tempFilePaths.splice(this.fileIndex,1);
            console.log(this.files, this.tempFilePaths);
        },
        getBack(){
            wx.navigateBack({
                delta: 1,
            });
        }
    }
}
</script>
<style lang="scss">
@import url('../../../../static/css/task.css');
    // page{
    //     background: #fff;
    // }
    .wrapper{
        .header {
            display: flex;
            justify-content: space-between;
            background: #fff;
            padding: 32rpx 33rpx;
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 99999;
            .cancel {
                font-size: 34rpx;
                color: #999999;
            }
            .submit {
                font-size: 34rpx;
                color: #3399ff;
            }
        }
        .container{
            margin-top: 135rpx;
            .form{
                .cell{
                    background: #fff;
                    border-bottom: 1rpx solid #e2e3e5;
                    padding: 0 20rpx;
                    margin: 20rpx 0;
                    .row{
                        padding: 20rpx 0;
                        display: flex;
                        align-items: center;
                        .l_label{
                            width: 168rpx;
                            color: #666;
                            display: flex;
                            align-items: center;
                            img{
                                width: 40rpx;
                                height: 40rpx;
                                margin-right:  5rpx;
                            }
                            .required{
                                color: red;
                                padding-right: 5rpx;
                            }
                            i{
                                margin-right: 8rpx;
                            }
                        }
                        .c_input{
                            flex: 1;
                            padding-left: 20rpx;
                            .inp{
                                width: 100%;
                                height: 50rpx;
                            }
                        }
                        .r_icon{

                        }
                    }
                    .richText{
                        padding: 20rpx 0;
                        textarea{
                            width: 100%;
                            height: 200rpx;
                            min-height: 200rpx;
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
                        align-items: center;
                        .cen{
                            flex: 1;
                            font-size: 32rpx;
                            color: #3399ff;
                            padding: 0 20rpx;
                        }
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
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            border-top: 1rpx solid #e2e3e5;
            box-shadow: 0 3rpx 10rpx 0 rgba(0,0,0,.1);
            z-index: 10;
            .btn{
                padding: 20rpx;
            }
        }
    }
</style>