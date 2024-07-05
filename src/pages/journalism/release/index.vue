<template>
    <div class="wrap">
        <div class="container">
            <div class="nav">
                选择可被查看范围
            </div>
            <div class="header">
                <!-- <picker class="pickers" v-model="rangeIdx" range-key="name" :range="range" @change="changeRange">
                    <van-field
                        :value="range[rangeIdx]?range[rangeIdx].name:''"
                        clearable
                        title-width="75px"
                        label="范围"
                        icon="arrow"
                        :readonly="true"
                        placeholder="请选择"
                        input-align="right"
                    />
                </picker> -->
                <van-field
                    :value="rangeName"
                    clearable
                    title-width="75px"
                    label="范围"
                    icon="arrow"
                    :readonly="true"
                    placeholder="请选择"
                    input-align="right"
                    @click="getArrow"
                />
            </div>
            <div class="content">
                <div class="heads" @click="handleSelPhoto">
                    <p>封面图片</p>
                    <!-- <p>
                        <i class="iconfont icon-tupian" style="color:#3399ff;"></i>
                    </p> -->
                </div>
                <div class="cont">
                    <p class="imgWrap" v-if="imgList!=''">
                        <img :src="imgList" alt="">
                        <span class="close"  @click="getCloseImg">
                            <i-icon type="close" color="#fff" size="12" />
                        </span>
                    </p>
                    <p class="imgWrap" @click="handleSelPhoto">
                        <i-icon type="add" color="#bec5c5" size="30" />
                    </p>
                </div>
            </div>
            <div class="header">
                <picker class="pickers" v-model="imgPositionIdx" range-key="name" :range="imgPositionList" @change="changeImgPosition">
                    <van-field
                        :value="imgPositionList[imgPositionIdx]?imgPositionList[imgPositionIdx].name:''"
                        clearable
                        title-width="75px"
                        label="图片位置"
                        icon="arrow"
                        :readonly="true"
                        placeholder="请选择"
                        input-align="right"
                    />
                </picker>
            </div>
            <!-- 接收人隐藏 -->
            <!-- <div class="content">
                <div class="heads" @click="getSelectContacts">
                    <p>接收人</p>
                    <p>
                        <span class="people">{{selectListName.length}}人</span>
                        <van-icon name="add-o" color="#3399ff" size="20" />
                    </p>
                </div>
                <div class="cont">
                    <div class="avatar" v-for="(item,index) in selectListName" :key="index" >
                        <p class="canvas">{{item.FullName}}</p>
                        <p class="name">{{item.FullName}}</p>
                        <span class="close" @click="getDelete(item)">
                            <i-icon type="close" color="#fff" size="12" />
                        </span>
                    </div>
                </div>
            </div> -->
             <div class="row">
                <div class="photo">
                    <p>重要信息</p>
                    <p>
                        <van-switch :checked="importantInfo" size="24px" @change="changeImportantInfo" />
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="photo">
                    <p>置顶信息</p>
                    <p>
                        <van-switch :checked="topInfo" size="24px" @change="getSwitchTop" />
                    </p>
                </div>
            </div>
            <div class="row" v-if="topInfo">
                <picker mode="date" :value="topDate" @change="getTopDateChange">
                    <div class="photo">
                        <p>置顶截止</p>
                        <p>
                            <span v-if="topDate==''" style="color:#ababab;">请选择</span>
                            <span else >{{topDate}}</span>
                            <i-icon type="enter" size="20" color="#cccccc" />
                        </p>
                    </div>
                </picker>
            </div>
            <div class="nav">
                选择提醒方式
            </div>
            <div class="row">
                <div class="photo">
                    <p>短信提醒</p>
                    <p>
                        <van-switch :checked="checked" size="24px" @change="changeSwitch" />
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="photo">
                    <p>应用内提醒</p>
                    <p>
                        <van-switch :checked="isSwitch" size="24px" @change="getSwitch" />
                    </p>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="btn">
                <van-button type="info" block @click="getSubmit">发布</van-button>
            </div>
        </div>
        <van-action-sheet
            :show="isPhotoShow"
            :actions="actions"
            @close="onClosePhoto"
            @select="onSelect"
            @cancel="onClosePhoto"
            z-index="99999"
            cancel-text="取消"
        />
        <van-action-sheet
            :show="show"
            @close="onClose"
            z-index="99999"
        >
            <div class="sheetWrap">
                <div class="title">
                    <p class="cancel" @click="getCancel">
                        取消
                    </p>
                    <p class="name">
                        范围
                    </p>
                    <p class="submit" @click="getDetermine">
                        确定
                    </p>
                </div>
                <div class="content">
                    <van-checkbox-group :value="result" @change="onChangeGroup">
                        <van-cell-group>
                            <van-cell
                                v-for="(item,index) in list"
                                :key="index"
                                :title="item.name"
                                value-class="value-class"
                                clickable
                                :data-name="index"
                                @click.stop="toggle"
                            >
                            <van-checkbox
                                :class="'checkboxes-'+index"
                                :name="item.groupId"
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
import {mapState,mapMutations,mapGetters} from 'vuex';
import { message } from '@/utils/message';
export default {
    data(){
        return {
            range:['第五党支部','护理部','生物医学伦理委员会','一病区测试','院领导'],
            rangeIdx:'',
            imgList:[],
            checked:false,
            isSwitch:true,
            uuid:"",
            columnId:"",
            keyWords:"",
            title:"",
            content:"",
            type:"",
            Attach:"",
            groupId:"",
            imgPositionIdx:0,
            imgPositionList:[
                {
                    name:"标题右边",
                    sign:"RightTitle"
                },
                {
                    name:"标题下面大图",
                    sign:"BelowTitleBigImg"
                },
                {
                    name:"标题下面列表",
                    sign:"BelowGrid"
                }
            ],
            coverDisplay:"RightTitle",
            importantInfo:false,
            topInfo:true,
            topDate:"",
            sessionkey:"",
            show:false,
            list:['部门','小组'],
            result:[],
            rangeName:"",
            isPhotoShow:false,
            actions: [
                // {
                //     name: '优盘',
                // },
                {
                    name: '从手机相册选择',
                }
            ],
        }
    },
    computed:{
        ...mapState({
            journalismInfo:state=>{
                return state.user.journalismInfo
            },
            contentTypeCode:state=>{
                return state.user.contentTypeCode;
            },
            selectId:state=>{
                return state.mailList.selectId
            },
            selectListName:state=>{
                return state.mailList.selectListName
            }
        }),
        ...mapGetters([
            'filterList'
        ]),
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        }
    },
    onShow(){
        console.log(this.selectListName,'selectListName');
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());  
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;      
        console.log(options);
        if(options.edit==1){
            console.log(this.journalismInfo,'12313123');
        }
        var newData= decodeURIComponent((options.info));
        console.log('newData:', newData);
        let info = JSON.parse(newData);
        this.uuid = info.uuid;
        this.columnId = info.columnId;
        this.keyWords = info.keyWords;
        this.title = info.title;
        this.content = info.content;
        this.type = info.type;
        this.Attach = info.Attach;
        this.groupQuery();
    },
    onUnload(){
        this.getClear([]);
    },
    methods:{
        ...mapMutations([
            'getSign',
            'getClear',
            'getSingleDelete'
        ]),
        getOpenSheet(){
            this.isPhotoShow = true;
        },
        onSelect(e){
            console.log(e);
            let name = e.mp.detail.name;
            if(name=='优盘'){
                const url = '/pages/uPan/main?max='+1;
                wx.navigateTo({url:url});
            }else {
                this.isPhotoShow = false;
                this.handleSelPhoto();
            }
        },
        onClosePhoto(){
            this.isPhotoShow = false;
        },
        getArrow(){
            this.show = true;
        },
        toggle(e){
            const { name } = e.mp.currentTarget.dataset;
            // const checkbox = wx.createSelectorQuery(`.checkboxes-${index}`)
            const checkbox = this.$mp.page.selectComponent(`.checkboxes-${name}`);
            checkbox.toggle();
        },
        onChangeGroup(e){
            this.result = e.mp.detail;
        },
        noop(e) {
        },
        getCancel(){
            this.show = false;
            this.result = [];
        },
        onClose(){
            this.show = false;
            this.result = [];
        },
        getDetermine(){
            this.groupId = this.result.join(',');
            let temp = [];
            this.result.forEach(item=>{
              const name = this.list.find(v=>v.groupId===item);
              temp.push(name.name);
            })
            this.rangeName = temp.join(',');
            console.log(temp);
            this.show = false;
        },
        getSelectContacts(){
            this.getSign('release');
            const url = '/pages/publics/mailList/main';
            wx.navigateTo({url:url});
        },
        getDelete(item){
            this.getSingleDelete(item.id);
        },
        groupQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.group.list",
                    SessionKey:this.sessionkey,
                    scope:"public"
                }
            }).then(res=>{
                console.log(res);
                this.range = res.listData;
                this.list = res.listData;
            })
        },
        changeRange(e){
            this.rangeIdx = e.mp.detail.value;
            this.groupId = this.range[this.rangeIdx].groupId;
        },
        changeImgPosition(e){
            this.imgPositionIdx = e.mp.detail.value;
            this.coverDisplay = this.imgPositionList[this.imgPositionIdx].sign;
        },
        // 打开本地图库
        handleSelPhoto(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success :(res)=> {
                    console.log(res);
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    // this.imgList = tempFilePaths;
                    wx.uploadFile({
                        url: "https://oawx.hnca.org.cn/rest?method="+'file.attachfiles.upload'+'&SessionKey=' + this.sessionkey+'&pid='+this.uuid, //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            console.log(res);
                            const data = res.data
                            let imgData = JSON.parse(res.data);
                            console.log(imgData.files);
                            imgData.files.forEach(item=>{
                                that.imgList = item.link;
                            })
                            //do something
                        }
                    })
                }
            })
        },
        getCloseImg(index){
            this.imgList = '';
            // this.imgList.splice(index,1);
        },
        changeImportantInfo(e){
            this.importantInfo = e.mp.detail;
        },
        getSwitchTop(e){
            this.topInfo = e.mp.detail;
        },
        getTopDateChange(e){
            this.topDate = e.mp.detail.value;
        },
        changeSwitch(e){
            this.checked = e.mp.detail;
        },
        getSwitch(e){
            this.isSwitch = e.mp.detail;
        },
        getSubmit(){
            // console.log(this.filterList.join(','),'12122');
            // this.getClear([]);
            // console.log(this.selectId,this.filterList,'---')
            // return;
            if(this.coverDisplay==""){
                wx.showToast({
                    title:"图片位置不能为空",
                    icon:"none",
                    duration:2000
                })
                return false;
            }
            let name = '';
            if(this.isSwitch==true){
                 name = this.title;
            }else {
                 name = null;
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"news.content.add",
                    SessionKey:this.sessionkey,
                    id:this.uuid,
                    folderid:this.columnId,
                    keyWords:this.keyWords,
                    title:this.title,
                    content:this.content,
                    type:this.contentTypeCode,
                    Attach:this.Attach,
                    mainImg:this.imgList,
                    remindSms:this.checked,
                    remindMessage:name,
                    groupids:'R:'+this.groupId,
                    coverDisplay:this.coverDisplay,
                    IsImportant:this.importantInfo,
                    IsTop:this.topInfo,
                    EndTopDate:this.topDate,
                    userIds:this.filterList.join(',')
                }
            }).then(res=>{
                // const url = '/pages/journalism/main';
                if(res.status==1){
                    message.toast({
                        title:"发布成功",
                        delta: 2
                    })
                }else {
                    wx.showToast({
                        title:'发布失败',
                        icon:'success',
                        duration: 2000
                    })
                }
                // wx.navigateBack({
                //     delta: 2,
                //     success () {
                //         const pageList = getCurrentPages()
                //         console.log(pageList,'123123123')
                //     }
                // })
            })
        }
    }
}
</script>
<style lang="scss">
    @import "../../../../static/css/public.scss";
    @import "../../../../static/css/icon.css";
    .container{
        padding-bottom: 80px;
        .size{
            font-size: 32rpx;
        }
    }
    .value-class {
        flex: none !important;
    }
    .nav{
        padding: 31rpx 33rpx;
        font-size: 26rpx;
        color: #999999;
    }
    .header{
        margin-bottom: 20rpx;
    }
    .content{
            background: #fff;
            margin-bottom: 20rpx;
            .heads{
                font-size: 28rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20rpx 33rpx;
                color: #666666;
                p:nth-child(2){
                    display: flex;
                    align-items: center;
                    .people{
                        font-size: 31rpx;
                        color: #ababab;
                        margin-right: 22rpx;
                    }
                    .round{
                        width: 38rpx;
	                    height: 38rpx;
                        line-height: 38rpx;
                        text-align: center;
                        border-radius: 50%;
                        border:2rpx solid #3399ff;

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
                p:nth-child(2){
                    display: flex;
                    align-items: center;
                    .people{
                        font-size: 31rpx;
                        color: #ababab;
                        margin-right: 22rpx;
                    }
                    .round{
                        width: 38rpx;
	                    height: 38rpx;
                        line-height: 38rpx;
                        text-align: center;
                        border-radius: 50%;
                        border:2rpx solid #3399ff;

                    }
                }
            }
            .cont{
                padding: 20rpx;
                display: flex;
                flex-wrap: wrap;
                // justify-content: space-between;
                flex-direction: row;
                .imgWrap:last-child{
                    background: #f7f7f7;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .imgWrap{
                    width: 96rpx;
                    height: 96rpx;
                    margin-right: 40rpx;
                    position: relative;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 7rpx;
                    }
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
                    .img{
                        position: absolute;
                        top: -10rpx;
                        right: -10rpx;
                    }
                }
                .avatar{
                    width: 50px;
                    text-align: center;
                    font-size: 28rpx;
                    position: relative;
                    margin-right: 20rpx;
                    .canvas{
                        width: 75rpx;
                        height: 75rpx;
                        line-height: 75rpx;
                        border-radius: 50%;
                        background: #3399ff;
                        font-size: 21rpx;
                        text-align: center;
                        color: #fff;
                        margin: 0 auto;
                    }
                    .name{
                        margin-top: 10rpx;
                        font-size: 24rpx;
                    }
                    .close{
                        display: inline-block;
                        width: 33rpx;
                        height: 33rpx;
                        line-height: 33rpx;
                        text-align: center;
                        background: #9c9c9c;
                        position: absolute;
                        top: 0;
                        right: 0;
                        border-radius: 50%;
                        opacity: .8;
                    }
                    .icon{
                        position: absolute;
                        top: 0;
                        right: 0;
                        color: #9c9c9c;
                    }
                }
            }
        }
        .row{
            border-top: 1rpx solid #eaebeb;
            .photo{
                padding:10px 20px;
                color: #666666;
                background: #fff;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                font-size: 32rpx;
            }
            .popupWrap{
                width: 90%;
                margin: 0 auto;
                .checkbox{
                    font-size: 16px;
                    padding: 20rpx 0;
                }
            }
        }
         .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            z-index: 99999;
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