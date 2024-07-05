<template>
    <div class="wrap">
        <!-- <h3 v-if="!isShow">带“*”必填</h3> -->
        <div class="header"  v-if="!isShow&&!repeatShow">
            <p class="cancel" @click="getBack">取消</p>
            <p class="submit" @click="getComplete">完成</p>
        </div>
        <div class="center" v-if="!isShow">
            <div class="content">
                <div class="row">
                    <p class="lable">名称<span>*</span></p>
                    <p class="inp">
                        <input placeholder-class="placeholder" type="text" v-model="name" placeholder="请输入会议室名称">
                    </p>
                </div>
                <div class="row">
                    <p class="lable">可容纳人数<span>*</span></p>
                    <p class="inp">
                        <input placeholder-class="placeholder" type="text" v-model="Capacity" placeholder="请输入具体数量">
                        <!-- <i-icon type="enter" size="20" color="#ffffff" /> -->
                    </p>
                </div>
                <div class="row">
                    <p class="lable">地点<span>*</span></p>
                    <p class="inp">
                        <input placeholder-class="placeholder" class="addressinp" type="text" v-model="address" placeholder="请输入地点">
                        <i class="iconfont icon-dizhi1" @click.stop="getOpenAddress" style="color:#A3A4A6;"></i>
                        <!-- <i-icon type="enter" size="20" color="#999999" /> -->
                    </p>
                </div>
                <div class="row imgRow" :class="{'border':imgList!=''}">
                    <p class="lable">会议室图片</p>
                    <!-- <p class="icon">
                        <i class="iconfont icon-tupian"></i>
                    </p> -->
                </div>
                <div class="imgWrap">
                    <div class="box">
                        <p v-if="imgList==''" class="default" @click="getChooseImage">
                            <van-icon name="plus" size="20px" color="#bec5c5" />
                        </p>
                        <p v-for="(item,index) in imgList" :key="index" @click="getChooseImage">
                            <i-icon type="delete" class="icon" color="#9c9c9c" size="20" @click="getDelete(index)" />
                            <img :src="item" alt="">
                        </p>
                    </div>
                </div>
                
                
            </div>
            <div class="checkWrap">
                <p>选择会议室设备</p>
                <van-checkbox-group :value="result" @change="changeTag">
                    <div class="checkboxGroup">
                        <p v-for="(item,index) in tagList" :key="index">
                            <van-checkbox :name="item.label"  custom-class="check" label-class="labels"  shape="square">
                                {{item.label}}
                            </van-checkbox>
                        </p>
                        <!-- <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            话筒
                        </van-checkbox>
                        <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            电脑
                        </van-checkbox>
                        <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            电子屏
                        </van-checkbox>
                        <van-checkbox :value="checked" custom-class="check" label-class="label" label-position="left" shape="square" @change="onChange">
                            其他
                        </van-checkbox> -->
                    </div>
                </van-checkbox-group>
            </div>
            <div class="rowWrap">
                <!-- <div class="row">
                    <div class="l">
                        <p class="max">会议室开放预订</p>
                        <p class="min">允许员工在线预订</p>
                    </div>
                    <div class="r">
                        <van-switch :checked="checkedSwitch" @change="changeSwitch" size="20px" />
                    </div>
                </div>
                <div class="row">
                    <div class="l">
                        <p class="min">会议室使用权限</p>
                        <p class="max">全员可用</p>
                    </div>
                    <div class="r">
                        <i-icon type="enter" size="20" color="#999999" />
                    </div>
                </div> -->
                <!-- 暂且不用 -->
                <!-- <div class="row">
                    <div class="l">
                        <p>审批人</p>
                    </div>
                    <div class="r">
                        <p class="radius">
                           <i-icon type="add" color="#3399ff" size="20" />
                        </p>
                    </div>
                </div> -->
            </div>
            <div class="rowBottom" @click="getDelConference" v-if="id!=''">
                删除会议室
            </div>
        </div>
        <!-- <div class="footer" v-if="!isShow" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="boxwrap">
                <van-button type="primary" @click="getComplete" color="#3399ff" :disabled="disabled" block>完成</van-button>
            </div>
        </div> -->
        <mapList @childFn="getChildFn" @cancel="getCancelChild" v-if="isShow" />
    </div>
</template>
<script>
import mapList from '../../../components/mapList';
import { mapState } from 'vuex';
import {message} from '@/utils/message';
export default {
    components:{
        mapList
    },
    data(){
        return {
            address:"",
            result:[],
            checked:false,
            checkedSwitch:false,
            imgList:[],
            isShow:false,
            name:"",
            Capacity:"",
            Longitude:"",
            Latitude:"",
            Location:"",
            id:"",
            StatusCode:0,
            tagList:[
              
            ],
            AttachInfo:"",
            sessionkey:""
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        ...mapState({
            conferenceLink:state=>{
                return state.publics.conferenceLink;
            }
        })
    },
    onLoad(options){
        Object.assign(this.$data, this.$options.data())
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.queryTag();
        if(options.id){
            this.id = options.id;
            this.imgList = this.conferenceLink ? [this.conferenceLink] : [];
        }
        if(this.id){
            wx.setNavigationBarTitle({
                title: '编辑会议室'
            })
            this.getQuery();
        }else{
            this.id='';
        }
    },
    methods:{
        queryTag(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:this.$api.public.leaveQuery,
                    objectTypeCode:20034,
                    name:"AttachInfo"
                }
            }).then(res=>{
                this.tagList = res;
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"entity.info.get",
                    SessionKey:this.sessionkey,
                    ObjTypeCode:"20034",
                    Id:this.id
                }
            }).then(res=>{
                console.log(res, 'res');
                let data = res.data;
                this.name = data.Name;
                this.address = data.Location;
                this.Longitude = data.Longitude;
                this.Latitude = data.Latitude;
                this.Capacity = data.Capacity;
                this.result = data.AttachInfo.split(',');
                this.AttachInfo = this.result.join(',');
                if(data.StatusCode==1){
                    this.StatusCode = data.StatusCode;
                    this.checkedSwitch = true;
                }else {
                    this.StatusCode = data.StatusCode;
                    this.checkedSwitch = false;
                }
            })
        },
        changeTag(e){
            this.result = e.mp.detail;
            this.AttachInfo = this.result.join(',');
            console.log(this.AttachInfo);
        },
        getChildFn(val,isBook){
            this.address = val.Name;
            this.isShow = isBook;
            this.Latitude = val.Latitude;
            this.Longitude = val.Longitude;
        },
        getCancelChild(val){
            this.isShow = val;
        },
        getChooseImage(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    that.imgList = tempFilePaths;
                    // that.imgList = that.imgList.concat(tempFilePaths);
                    console.log(that.imgList);
                    let url = `${that.$api.upload.url}?method=${'file.attachfiles.addusbfile'}&SessionKey=${that.sessionkey}&pid=${that.ProcessId}&objTypeCode=${'20034'}`
                    wx.uploadFile({
                        url: url,
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
        changeSwitch(e){
            this.checkedSwitch = e.mp.detail;
            if(!this.checkedSwitch){
                this.StatusCode = 0;
            }else {
                this.StatusCode = 1;
            }
        },
        getDelete(index){
            this.imgList.splice(index,1);
        },
        getOpenAddress(){
            // this.isShow = true;
            var that = this;
            wx.chooseLocation({
                success: function (res) {
                    console.log(res);
                    // success
                    if (res.name == '') {
                    } else {
                        that.Location = res.name;
                        that.Latitude = res.latitude;
                        that.Longitude = res.longitude;
                        that.address = res.address;
                    }
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })
        },
        // 删除会议室
        getDelConference(){
            let that = this;
            wx.showModal({
                confirmText:"取消",
                cancelText:"确定",
                cancelColor:"#3399ff",
                confirmColor:"#3399ff",
                content: '确定要删除这个会议室吗？一旦删除所有关于该会议室预订信息全部删除',
                success:res=> {
                    if (res.confirm) {
                    } else if (res.cancel) {
                        that.del();
                    }
                }
            })
            
        },
        del(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.conference.del,
                    SessionKey:this.sessionkey,
                    Id:this.id,
                    ObjTypeCode:20034
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:"none",
                    duration:2000,
                    success:res=>{
                        setTimeout(()=>{
                            wx.navigateBack({
                                delta:1
                            })
                        },1000)
                    }
                })
            })
        },
        getBack(){
            wx.navigateBack({
                delta:1
            })
        },
        getComplete(){
            if(this.imgList!=''){
                let that = this;
                let urls = `${that.$api.upload.url}?method=${that.$api.conference.create}&SessionKey=${that.sessionkey}&ObjectTypeCode=${20034}`;
                wx.uploadFile({
                    url: urls,
                    filePath: that.imgList[0],
                    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    name: 'file',
                    formData: {
                        id:that.id,
                        name:that.name,
                        ApproveByIds:"",
                        Longitude:that.Longitude,
                        Latitude:that.Latitude,
                        Location:that.address,
                        Capacity:that.Capacity,
                        AttachInfo:that.AttachInfo,
                        StatusCode: 1 // 1启用0不启用
                    },
                    success (res){
                        console.log(res);
                        let response = JSON.parse(res.data)
                        if(response.status*1===1){
                            message.toast({
                                title:'提交成功',
                                delta:1
                            })
                        }
                    }
                })
            }else {
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        // method:"entity.save",
                        method:this.$api.conference.create,
                        ObjectTypeCode:"20034",
                        SessionKey:this.sessionkey,
                        id:this.id,
                        name:this.name,
                        ApproveByIds:"",
                        Longitude:this.Longitude,
                        Latitude:this.Latitude,
                        Location:this.address,
                        Capacity:this.Capacity,
                        AttachInfo:this.AttachInfo,
                        StatusCode: 1 // 1启用0不启用
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.status*1===1){
                        message.toast({
                            title:'提交成功',
                            delta:1
                        })
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../../../../static/css/icon.css';
    @import '../../../../static/css/conference.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .header{
            display: flex;
            justify-content: space-between;
            background: #fff;
            padding: 32rpx 33rpx;
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 99999;
            .cancel{
                font-size: 34rpx;
                color: #999999;
            }
            .submit{
                font-size: 34rpx;
                color: #3399ff;
            }
        }
        h3{
            color: #999999;
            font-size: 26rpx;
            background: #f4f4f4;
            padding: 31rpx 33rpx;
        }
        .center{
            width: 100%;
            padding-bottom: 80px;
            margin-top: 130rpx;
            .content{
                background: #fff;
                .row.border{
                    border-bottom: none;
                }
                .imgRow{
                    border: none !important;
                }
                .row{
                    padding: 30rpx 33rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1rpx solid #e2e3e5;
                    .placeholder{
                        color: #cccccc;
                        font-size: 33rpx;
                    }
                    .lable{
                        font-size: 34rpx;
                        color: #666666;
                        span{
                            color: #ff6666;
                            margin-left: 15rpx;
                        }
                    }
                    .inp{
                        display: flex;
                        align-items: center;
                        input{
                            text-align: right;
                            display: inline-block;
                        }
                        .addressinp{
                            margin-right: 20rpx;
                        }
                    }
                    .icon{
                        i{
                            color: #3399ff;
                        }
                    }
                }
                .imgWrap{
                    background: #fff;
                    padding: 0rpx 33rpx 33rpx;
                    border-bottom: 2rpx solid #eaebeb;
                    .box{
                        display: flex;
                        flex-wrap: wrap;
                        .default{
                            background: #f7f7f7;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        p{
                            width: 100rpx;
                            height: 100rpx;
                            // background: #dce1e4;
                            border-radius: 7rpx;
                            margin-right: 40rpx;
                            position: relative;
                            img{
                                width: 100%;
                                height: 100%;
                                vertical-align: middle;
                                border-radius: 7rpx;
                            }
                            .icon{
                                position: absolute;
                                top: -15rpx;
                                right: -15rpx;
                                z-index: 9999;
                            }
                        }
                    }
                }
            }
            .checkWrap{
                width: 100%;
                background: #fff;
                padding: 33rpx;
                margin: 35rpx 0;
                p{
                    font-size: 25rpx;
                    color: #ababab;
                }
                .checkboxGroup{
                    display: flex;
                    padding-top: 20rpx;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    .labels{
                        margin-left: 10rpx!important;
                        font-size: 26rpx!important;
                        // color: #666666;
                        color: var(--checkbox-label-color,#666666)!important;
                    }
                    .check{
                        margin-top: 10rpx!important;
                    }
                }
                .checkboxGroup::after{
                    content: '';
                    width: 66px;
                }
            }
            .rowWrap{
                background: #fff;
                .row{
                    padding: 33rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2rpx solid #eaebeb;
                    .l{
                        font-size: 32rpx;
                        color: #666666;
                        .max{
                            font-size: 33rpx;
                            color: #333333;
                        }
                        .min{
                            font-size: 24rpx;
                            color: #999999;
                        }
                    }
                    .r{
                        .radius{
                            border-radius: 50%;
                            border: 1rpx solid #3399ff;
                            display: flex;
                            justify-content: center;
                            width: 50rpx;
                            height: 50rpx;
                            align-items: center;

                        }
                    }
                }
            }
            .rowBottom{
                text-align: center;
                background: #fff;
                font-size: 32rpx;
                color: #ff6966;
                padding: 42rpx 0;
                margin-top: 24rpx;
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            .boxwrap{
                // display: flex;
                // justify-content: space-around;
                padding: 20rpx 33rpx;
                .btn{
                    // width: 328rpx;
                }
                .black{
                    color: #333333 !important;
                }
            }
        }
    }
</style>