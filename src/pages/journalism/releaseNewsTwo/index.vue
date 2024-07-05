<template>
    <div class="wrap">
        <!-- <div class="nav">
            带“*”必填
        </div> -->
        <div class="center">
            <div class="content">
                <picker class="pickers" v-model="columnIdx" range-key="Name" :range="column" @change="changeColumn">
                    <van-field
                        :value="column[columnIdx]?column[columnIdx].Name:''"
                        required
                        clearable
                        title-width="75px"
                        label="栏目"
                        icon="arrow"
                        :readonly="true"
                        placeholder="请选择"
                        right-icon-class="icon"
                        input-align="right"
                    />
                </picker>
                <van-field
                    :value="newTag"
                    required
                    clearable
                    title-width="75px"
                    label="标签"
                    icon="arrow"
                    :readonly="true"
                    placeholder="请选择"
                    @click="getTag"
                    right-icon-class="icon"
                    input-align="right"
                />
                <van-popup
                    :show="''"
                    position="center"
                    custom-style="width: 80%;height: auto;border-radius:7rpx;"
                    @close="onClose"
                >
                    <div class="popupContent">
                        <div class="popupWrap">
                            <h3 class="">标签</h3>
                            <van-checkbox-group :value="result" @change="changeCheckbox">
                                <div v-for="(item,index) in tagList" :key="index">
                                    <van-checkbox  :name="item.itemid" custom-class="checkbox">{{item.name}}</van-checkbox>
                                    <!-- <van-checkbox-group :value="result" @change="changeCheckbox"> -->
                                        <!-- <van-checkbox :value="item.check" custom-class="checkbox" @change="changeCheckbox(item)">{{item.name}}</van-checkbox> -->
                                    <!-- </van-checkbox-group> -->
                                </div>
                            </van-checkbox-group>  
                        </div>
                        <div class="footerBtn">
                            <div class="box">
                                <p @click="onClose">取消</p>
                                <p @click="getSubmit">确认</p>
                            </div>
                        </div>
                    </div>
                
                </van-popup>
            </div>
            <div class="content">
                <van-field
                    :value="title"
                    title-width="75px"
                    required
                    clearable
                    label="标题"
                    placeholder="请输入标题"
                    @change="changeTitle"
                    input-align="right"
                    input-class="inp"
                />
                <!-- <div class="cont"> -->
                    <van-field
                        title-width="75px"
                        :type="'text'"
                        :readonly="true"
                        required
                        autosize
                        label="内容"
                        :border="false"
                        @change="changeContent"
                    />
                    <textarea class="textarea" placeholder-class="placeholder" v-model="content" name="" placeholder="请输入内容" id="" cols="30" rows="10"></textarea>
                <!-- </div> -->
            </div>
            <div class="content">
                <div class="head">
                    <p>图片</p>
                    <!-- <p>
                        <i class="iconfont icon-tupian"></i>
                    </p> -->
                </div>
                <div class="cont">
                    
                    <p class="imgWrap" v-for="(item,index) in imgList" :key="index">
                        <img :src="item" alt="">
                        <span class="close"  @click="getCloseImg(index)">
                            <i-icon type="close" color="#fff" size="12" />
                        </span>
                    </p>
                    <p class="imgWrap" @click="handleSelPhoto">
                        <i-icon type="add" color="#bec5c5" size="30" />
                    </p>
                </div>
            </div>
            <div class="content">
                <div class="head">
                    <p>附件</p>
                    <!-- <p> 
                        <i class="iconfont icon-fujian" style="color:#3399ff;"></i>
                    </p> -->
                </div>
                <div class="fjcont" v-for="(item,index) in selectFiles" :key="index" @click="getPreview(item)">
                    <div>
                        <img :src="item.link" alt="">
                    </div>
                    <div>
                        <p class="name">{{item.name}}</p>
                        <p class="time">31.2MB</p>
                    </div>
                    <div class="iconWrap">
                        <p>预览</p>
                        <i  @click="getDeleteFile(item)" class="iconfont icon-quxiao" style="color:#B1B1B1;"></i>
                    </div>
                </div>
                <div class="fjcont">
                    <div class="default" @click="getEnclosure">
                        <i-icon type="add" color="#bec5c5" size="30" />
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <!-- <van-button type="default" custom-class="btn">取消</van-button> -->
            <div class="btn">
                <van-button type="info" block @click="getNext">下一步</van-button>
            </div>
        </div>
        <van-action-sheet
            :show="show"
            @close="onClose"
            @select="onSelect"
            z-index="99999"
        >
            <div class="sheetWrap">
                <div class="title">
                    <p class="cancel" @click="getCancel">
                        取消
                    </p>
                    <p class="name">
                        标签
                    </p>
                    <p class="submit" @click="getDetermine">
                        确定
                    </p>
                </div>
                <div class="content">
                    <van-checkbox-group :value="newResult" @change="onChangeGroup">
                        <van-cell-group>
                            <van-cell
                                v-for="(item,index) in tagList"
                                :key="index"
                                :title="item.name"
                                value-class="value-class"
                                clickable
                                :data-name="index"
                                @click.stop="toggle"
                            >
                            <van-checkbox
                                :class="'checkboxes-'+index"
                                :name="item.itemid"
                                shape="square"
                                slot="right-icon"
                            />
                            </van-cell>
                        </van-cell-group>
                    </van-checkbox-group>
                </div>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
const uuid = require('../../../utils/uuid');
import {mapState,mapMutations} from 'vuex';
import getOpenFiles from '@/utils/openFiles';
export default {
    data(){
        return {
            imgList:[],
            columnIdx:"",
            column:[],
            show:false,
            tagIndex:"",
            // tag:"",
            tagList:[
                '院办','人事','财务','医务','护理','总务','信息','后勤','监察室','质控办','临床药学','制度文件','教学管理','科教科',
                '医保办','健康管理','门诊','其他','通知','工会'
            ],
            result:[],
            columnId:"",
            title:"",
            content:"",
            uuid:"",
            resultName:[],
            result:[],
            id:"",
            // tag:"",
            sessionkey:"",
            show:false,
            newResult:[],
            newTag:""
        }
    },
    computed:{
        tag(){
            return this.resultName.join(',');
        },
        ...mapState({
            contentTypeCode:state=>{
                return state.user.contentTypeCode;
            },
            selectFiles:state=>{
                return state.usb.selectFiles;
            }
        }),
        isModelmes(){
            return  wx.getStorageSync('isModelmes');
        },
        fileIds(){
            let temp = [];
            this.selectFiles.forEach(item=>{
                temp.push(item.id);
            })
            return temp;
        },
        openImgs(){
            let temp = [];
            this.selectFiles.forEach(item=>{
                if(item.fileExtension.indexOf('jpg')!=-1||item.fileExtension.indexOf('png')!=-1){
                    temp.push(item.link);
                }
            })
            return temp;
        }
    },
    onUnload(){
        this.clearFile([]);
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        // this.isModelmes = wx.getStorageSync('isModelmes');
        this.uuid = uuid.wxuuid();
        this.getColumnQuery();
        this.queryTag();
        if(options.id){
            wx.setNavigationBarTitle({
                title: '修改新闻'
            })
            this.uuid = options.id;
            this.id = options.id;
            this.getQueryInfo();
            this.contentBody();
        }
    },
    onShow(){
        if(this.selectFiles!=''){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.addFile,
                    SessionKey:this.sessionkey,
                    fileIds:this.fileIds.join(','),
                    ObjectTypeCode:100201,
                    ObjectId:this.uuid
                }
            }).then(res=>{
                console.log(res);
            })
        }
    },
    methods:{
        ...mapMutations([
            'journalismInfo',
            'delete',
            'clearFile'
        ]),
        getEnclosure(){
            const url = '/pages/uPan/main';
            wx.navigateTo({url:url});
        },
        getDeleteFile(item){
            this.delete(item.id);
        },
        toggle(e){
            const { name } = e.mp.currentTarget.dataset;
            // const checkbox = wx.createSelectorQuery(`.checkboxes-${index}`)
            const checkbox = this.$mp.page.selectComponent(`.checkboxes-${name}`);
            checkbox.toggle();
        },
        onChangeGroup(e){
            this.newResult = e.mp.detail;
        },
        getDetermine(){
            console.log(this.newResult);
            let temp = [];
            this.newResult.forEach(item=>{
                const row = this.tagList.find(v=>v.itemid===item);
                temp.push(row.name);
            })
            this.newTag = temp.join(',');
            this.show = false;
        },
        noop(e) {
        },
        getCancel(){
            this.show = false;
            this.newResult = [];
        },
        onClose(){
            this.show = false;
            this.newResult = [];
        },
        // 预览附件
        getPreview(item){
            let openImgs = JSON.stringify(this.openImgs);
            getOpenFiles(item,openImgs);
        },
    // 新闻详情信息
        getQueryInfo(){
          this.$httpWX.get({
              url:this.$api.message.queryList,
                data:{
                    method:"content.info.get",
                    SessionKey:this.sessionkey,
                    id:this.id
                }
          }).then(res=>{
              this.info = res.data[0];
              this.resultName = this.info.KeyWords.split(',');
              this.newTag = this.resultName.join(',');
              console.log(this.resultName,'resultname')
              this.title = this.info.Title;
          })
        },
        //   新闻内容
        contentBody(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.contentbody.get",
                    SessionKey:this.sessionkey,
                    id:this.id
                }
            }).then(res=>{
                this.content =  this.convertHtmlToText(res);

            })
        },
        convertHtmlToText: function convertHtmlToText(inputText) {
            var returnText = "" + inputText;
            returnText = returnText.replace(/<\/div>/ig, '\r\n');
            returnText = returnText.replace(/<\/li>/ig, '\r\n');
            returnText = returnText.replace(/<li>/ig, ' * ');
            returnText = returnText.replace(/<\/ul>/ig, '\r\n');
            //-- remove BR tags and replace them with line break
            returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

            //-- remove P and A tags but preserve what's inside of them
            returnText=returnText.replace(/<p.*?>/gi, "\r\n");
            returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

            //-- remove all inside SCRIPT and STYLE tags
            returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
            returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
            //-- remove all else
            returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

            //-- get rid of more than 2 multiple line breaks:
            returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

            //-- get rid of more than 2 spaces:
            returnText = returnText.replace(/ +(?= )/g,'');

            //-- get rid of html-encoded characters:
            returnText=returnText.replace(/ /gi," ");
            returnText=returnText.replace(/&/gi,"&");
            returnText=returnText.replace(/"/gi,'"');
            returnText=returnText.replace(/</gi,'<');
            returnText=returnText.replace(/>/gi,'>');

            return returnText;
        },

       getColumnQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"content.category.getlist",
                    SessionKey:this.sessionkey,
                    objectTypeCode: this.contentTypeCode
                }
            }).then(res=>{
                this.column = res.listData;
            })
        },
        queryTag(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.channel.getlist",
                    SessionKey:this.sessionkey,
                }
            }).then(res=>{
                this.tagList = res.listData;
                this.tagList.forEach(item=>{
                    this.$set(item,'check',false);
                })
            })
        },
        changeColumn(e){
            this.columnIdx = e.mp.detail.value;
            this.columnId = this.column[this.columnIdx].ItemId;
        },
        changeTitle(e){
            this.title = e.mp.detail;
        },
        changeContent(e){
            this.content = e.mp.detail;
        },
        changeTag(e){
            this.tagIndex = e.mp.detail.value;
        },
        getTag(){
            this.result = [];
            this.resultName = [];
            this.show = true;
        },
        changeCheckbox(e){
            console.log(e);
            this.result = e.mp.detail;
            this.resultName = [];
            this.result.forEach(item=>{
                const name = this.tagList.find(v=>v.itemid==item);
                this.resultName.push(name.name);
                return name;
            })
            // item.check = !item.check;
            // if(item.check){
            //     this.result.push(item.itemid);
            //     this.resultName.push(item.name);
            // }
            console.log(this.result,this.resultName);
        },
        getSubmit(){
            this.show = false;
        },
        onClose(){
            this.result = [];
            this.resultName = [];
            this.show = false;
        },
        // 打开本地图库
        handleSelPhoto(){
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success :(res)=> {
                    console.log(res);
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    console.log(tempFilePaths,'123123');
                    tempFilePaths.forEach(item=>{
                        this.imgList.push(item);
                    })
                    // return;
                    // this.imgList = tempFilePaths;
                    wx.uploadFile({
                        url: "https://oawx.hnca.org.cn/rest?method="+'file.attachfiles.upload'+'&SessionKey=' + this.sessionkey+'&pid='+this.uuid+"&ObjTypeCode="+100201, //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            console.log(res);
                            const data = res.data
                            //do something
                        }
                    })
                }
            })
        },
        getCloseImg(index){
            this.imgList.splice(index,1);
        },
        getNext(){
            if(this.columnId==""){
                wx.showToast({
                    title:"栏目不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.newTag==""){
                wx.showToast({
                    title:"标签不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.title==""){
                wx.showToast({
                    title:"标题不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }else if(this.content==""){
                wx.showToast({
                    title:"内容不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }
            var object = {};
            object.uuid = this.uuid;
            object.columnId = this.columnId;
            // object.keyWords = this.tag;
            object.keyWords = this.newTag;
            object.title = this.title;
            object.content = this.content;
            object.type = 1;
            object.Attach = this.imgList.join(',');
            var info = JSON.stringify(object);
            if(this.id){
                this.journalismInfo(this.info);
                var edit = 1;
            }else {
                var edit = 0;
            }
            const url = "/pages/journalism/release/main?info="+info+'&edit='+edit;
            wx.navigateTo({url:url});
        }
    }
    
}
</script>
<style lang="scss">
    @import "../../../../static/css/public.scss";
    @import "../../../../static/css/icon.css";
    .nav{
        padding: 31rpx 33rpx;
        font-size: 26rpx;
        color: #999999;
    }
    .center{
        // padding: 10px;
        padding-bottom: 80px;
        
        .content{
            background: #fff;
            margin-bottom: 20rpx;
            .inp{
                margin-right: 20rpx;
            }
            .icon{
                color: #cccccc;
            }
            .textarea{
                width: 100%;
                height: 200rpx;
                padding: 0 33rpx;
                font-size: 31rpx;
            }
            .placeholder{
                color: #ababab;
            }
            .popupContent{
                position: relative;
                .popupWrap{
                    width: 90%;
                    margin: 0 auto;
                    height: 50%;
                    overflow: scroll;
                    padding-bottom: 100rpx;
                    h3{
                        font-size: 23rpx;
                        color: #999999;
                        text-align: left;
                    }
                    .checkbox{
                        font-size: 16px;
                        padding: 20rpx 0;
                        margin: 10rpx 0;
                    }
                    .checkbox.active{
                        background: #f3f3f3;
                    }
                }
                .footerBtn{
                    width: 100%;
                    background: #fff;
                    border-top:2rpx solid #eaebeb;
                    position: fixed;
                    bottom: 0;
                    .box{
                        display: flex;
                        justify-content: space-between;
                        padding: 20rpx 33rpx;
                        p{
                            font-size: 33rpx;
                            color: #3399ff;
                        }
                    }
                }
            }
            .head{
                font-size: 28rpx;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 20rpx 33rpx;
                color: #666666;
                .iconfont{
                    color: #3399ff;
                }
            }
            .cont{
                padding: 20rpx;
                display: flex;
                flex-wrap: wrap;
                // justify-content: space-between;
                // flex-direction: row;
                .imgWrap:last-child{
                    background: #f7f7f7;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .imgWrap{
                    width: 96rpx;
                    height: 96rpx;
                    position: relative;
                    margin-right: 20rpx;
                    margin-top: 10rpx;
                    img{
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
                    .close{
                        display: inline-block;
                        width: 33rpx;
                        height: 33rpx;
                        line-height: 33rpx;
                        text-align: center;
                        background: #343434;
                        position: absolute;
                        top: -10rpx;
                        right: -10rpx;
                        border-radius: 50%;
                        opacity: .8;
                    }
                }
            }
            .fjcont:last-child{
                border: none;
            }
            .fjcont{
                padding: 20rpx 33rpx;
                display: flex;
                border-bottom: 2rpx solid #f6f6f6;
                .default{
                    width: 96rpx;
                    height: 96rpx;
                    background: #f7f7f7;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                div:nth-child(1){
                    width: 96rpx;
                    height: 96rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 2rpx;
                    }
                }
                div:nth-child(2){
                    font-size: 32rpx;
                    color: #333333;
                    padding: 10rpx 0;
                    flex: 1;
                    margin-left: 20rpx;
                    width: 393rpx;
                    .name{
                        width: 393rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-size: 34rpx;
                        color: #333333;
                        padding-bottom: 24rpx;
                    }
                    .time{
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
                div:nth-child(3){
                    display: flex;
                    align-items: center;
                    p{
                        width: 86rpx;
                        height: 46rpx;
                        line-height: 46rpx;
                        text-align: center;
                        border-radius: 23rpx;
                        font-size: 28rpx;
                        color: #a1a5aa;
                        background: #fff;
                        margin-right: 21rpx;
                        background: #eeeeee;
                    }
                    .icon{
                        line-height: 2.5;
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
        .btn{
            padding: 20rpx;
        }
    }
    .sheetWrap{
            width: 100%;
            height: auto;
            background: #fff;
            .title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx;
                .cancel,.submit{
                    font-size: 33rpx;
                    color: #3399ff;
                }
                .name{
                    font-size: 34rpx;
                    color: #333333;
                    font-weight: bold;
                }
            }
            .content{
                .van-checkbox{
                    border-radius: 5rpx!important;
                    .van-checkbox__icon{
                        width: 36rpx!important;
                        height: 36rpx!important;
                    }
                }
            }
        }
</style>