<template>
    <div class="wrap">
        <div v-if="!isShow">
            <h3>设置符合你企业要求的考勤方式</h3>
            <div class="center">
                <div class="content">
                    <div class="rowWrap">
                        <div class="l">
                            <p>
                                <img src="https://oawx.hnca.org.cn/img/wechat/04.2.4.Wi-Fi.png" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <p>将整个办公室设为考勤范围</p>
                            <p>设置办公Wi-Fi，精确到5米的定位方式</p>
                        </div>
                    </div>
                    <div class="row" @click="getAddWorkWiFi">
                        <div class="lBox">
                            <p class="font blue">
                                添加办公Wi-Fi
                            </p>
                            <p class="code">24:de:c6:8f:cb:b2</p>
                        </div>
                        <div class="rBox">
                            <p>
                                <img src="https://oawx.hnca.org.cn/img/wechat/04.2.4.Add_.png" alt="">
                            </p>
                        </div>
                    </div>
                    <div class="row" v-for="(item,index) in wifiList" :key="index">
                        <div class="lBox">
                            <p class="font">
                                {{item.name}}
                            </p>
                            <p class="code">{{item.address}}</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="close" color="#999999" @click="getDeleteWifi(item)" />
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="rowWrap">
                        <div class="l">
                            <p>
                                <img src="https://oawx.hnca.org.cn/img/wechat/04.2.4.Address_.png" alt="">
                            </p>
                        </div>
                        <div class="r">
                            <p>将整个办公楼设为考勤范围</p>
                            <p>通过手机定位，精确到50～300米的定位方式</p>
                        </div>
                    </div>
                    <div class="row" @click="getAddWorkLocation">
                        <div class="lBox">
                            <p class="font blue">
                                添加办公地点
                            </p>
                            <p class="code">在此范围内即可打卡</p>
                        </div>
                        <div class="rBox">
                            <p>
                                <img src="https://oawx.hnca.org.cn/img/wechat/04.2.4.Add_.png" alt="">
                            </p>
                        </div>
                    </div>
                    <picker @change="bindPickerChange" :value="riceIdx" :range="riceList">
                        <div class="row">
                            <div class="lBox">
                                <p class="font">
                                    {{riceList[riceIdx]}}米
                                </p>
                                <p class="code">允许打卡范围</p>
                            </div>
                            <div class="rBox">
                                <i-icon type="enter" color="#999999" />
                            </div>
                        </div>
                    </picker>
                    <div class="row" v-for="(item,index) in adressList" :key="index">
                        <div class="lBox">
                            <p class="font">
                                {{item.name}}
                            </p>
                            <p class="code">{{item.location}}</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="close" color="#999999" @click="getDeleteAdress(item)" />
                        </div>
                    </div>
                    <div class="row rowActive" @click="getSeeMore">
                        <div class="lBox">
                            <p class="font">查看更多</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="enter" color="#999999" />
                        </div>
                    </div>
                    
                </div>
                <div class="content">
                    <div class="row rowActive" @click="getSeniorSetting">
                        <div class="lBox">
                            <p class="font">高级设置</p>
                        </div>
                        <div class="rBox">
                            <i-icon type="enter" color="#999999" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <addWiFi v-if="isShow" @childFn="getChildFn" />
        <van-action-sheet
            :round="false"
            :show="show"
            @close="getClose"
        >
            <div class="sheetWrap">
                <p class="title">IOS如何获取Wi-Fi连接？</p>
                <div class="cont">
                    <p>完成以下3步，就可以获取附近Wi-Fi了</p>
                    <div class="img">
                        <img src="https://oawx.hnca.org.cn/img/wechat/04.2.4.WiFi_1.jpg" alt="">
                    </div>
                    <div class="img">
                        <img src="https://oawx.hnca.org.cn/img/wechat/04.2.4.WiFi_2.jpg" alt="">
                    </div>
                    <div class="img">
                        <img src="https://oawx.hnca.org.cn/img/wechat/04.2.4.WiFi_3.jpg" alt="">
                    </div>
                </div>
                <div class="btn" @click="getToConnect">
                    <p>看懂了，去连接</p>
                </div>
            </div>
        </van-action-sheet>
        <van-popup
            :show="editShow"
            position="center"
            custom-style="width:540rpx;height: auto;border-radius:28rpx;"
            @close="onCloseEdit"
        >
            <div class="editPopup">
                <p class="title">
                    完善考勤地点名称
                </p>
                <p class="address">
                    详细地址：{{Address}}
                </p>
                <div class="inpWrap">
                    <input class="inp" type="text" v-model="Name">
                    <i-icon v-if="Name!=''" @click="getDelName" type="delete_fill" class="icon-del" size="20" color="#646464" />
                </div>
                <div class="moreBtn">
                    <p @click="onCloseEdit">取消</p>
                    <p @click="getSubmit">确认</p>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import addWiFi from './addWiFi';
// import QQMapWX from '../../../src/utils/qqmap-wx-jssdk';
// var qqmapsdk = new QQMapWX({
//     key: 'UVRBZ-UN2WU-KMJV6-2DAPJ-JW5QE-C5BYC' // 必填
// }); 
export default {
    name:"newSetting",
    components:{
        addWiFi
    },
    data(){
        return {
            isShow:false,
            wifiList:[],
            adressList:"",
            show:false,
            isMore:false,
            riceList:[],
            riceIdx:0,
            sessionkey:"",
            editShow:false,
            Name:"",
            Address:"",
            Latitude:"",
            Longitude:"",
            FlexTime:"",
            LateTime:"",
            AbsenceTime:"",
            RemindCheckIn:"",
            RemindCheckOut:"",
            AdvancedCheckIn:"",
            LateCheckOut:"",
            RemindLeaveWorkCheck:"",
            NeedPhoto:"",
            FastCheckIn:""
        }
    },
    computed:{

    },
    onShow(){
        this.getQueryWIFi();
        this.getQueryAdress();
    },
    onLoad(){
        this.sessionkey = wx.getStorageSync('sessionkey');
        let arr = [];
        for(var i=1;i<=30;i++){
            arr.push(`${i*100}`);
        }
        this.riceList = arr;
        
        this.getQuery();
        this.getQueryWIFi();
        this.getQueryAdress();
        // wx.startWifi({
        //     success:function(e){
        //         wx.getWifiList({
        //             success:function(e){
        //                 console.log(e,'wx.getWifiList');
        //                 wx.onGetWifiList(function(e){
        //                     console.log(e,'callback')
        //                 })
        //             }
        //         })
        //     }
        // })
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.clockIn.querySetting,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.DistanceRange = res.data.globalSettings.DistanceRange;
                this.FlexTime = res.data.globalSettings.FlexTime;
                this.LateTime = res.data.globalSettings.LateTime;
                this.AbsenceTime = res.data.globalSettings.AbsenceTime;
                this.RemindCheckIn = res.data.globalSettings.RemindCheckIn;
                this.RemindCheckOut = res.data.globalSettings.RemindCheckOut;
                this.AdvancedCheckIn = res.data.globalSettings.AdvancedCheckIn;
                this.LateCheckOut = res.data.globalSettings.LateCheckOut;
                this.RemindLeaveWorkCheck = res.data.globalSettings.RemindLeaveWorkCheck;
                this.NeedPhoto = res.data.globalSettings.NeedPhoto;
                this.FastCheckIn = res.data.globalSettings.FastCheckIn;
                this.riceIdx = this.riceList.findIndex(item=>item===this.DistanceRange);
            })
        },
        bindPickerChange(e){
            this.riceIdx = e.mp.detail.value;
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.clockIn.seniorSetting,
                    SessionKey:this.sessionkey,
                    DistanceRange:this.riceList[this.riceIdx],
                    FlexTime:this.FlexTime,
                    LateTime:this.LateTime,
                    AbsenceTime:this.AbsenceTime,
                    RemindCheckIn:this.RemindCheckIn,
                    RemindCheckOut:this.RemindCheckOut,
                    AdvancedCheckIn:this.AdvancedCheckIn,
                    LateCheckOut:this.LateCheckOut,
                    RemindLeaveWorkCheck:this.RemindLeaveWorkCheck,
                    NeedPhoto:this.NeedPhoto,
                    FastCheckIn:this.FastCheckIn
                }
            }).then(res=>{
                console.log(res);
            })
        },
        // 查看更多
        getSeeMore(){
            this.isMore = true;
            this.getQueryAdress();
        },
        getQueryWIFi(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:"hr.attendwifis.getlist"
                }
            }).then(res=>{
                console.log(res);
                this.wifiList = res.data;
            })
        },
        getDeleteWifi(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:"entity.info.delete",
                    Id:item.attendwifiid,
                    ObjTypeCode:30093
                }
            }).then(res=>{
                console.log(res);
                this.getQueryWIFi();
            })
        },
        getQueryAdress(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"hr.attendlocations.getlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                if(!this.isMore){
                    this.adressList = res.data.slice(0,2);
                }else {
                    this.adressList = res.data;
                }
            })
        },
        getDeleteAdress(item){
            let that = this;
            wx.showModal({
                title: '',
                content:`确定删除${item.name}吗？`,
                success:res=> {
                    if (res.confirm) {
                        that.deleteAdress(item);
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                    console.log('用户点击取消')
                    }
                }
            })
            
        },
        deleteAdress(item){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:this.sessionkey,
                    method:"entity.info.delete",
                    Id:item.attendlocationid,
                    ObjTypeCode:30092
                }
            }).then(res=>{
                console.log(res);
                this.getQueryAdress();
            })
        },
        // 添加办公地点
        getAddWorkLocation(){
            let that = this;
            wx.chooseLocation({
                success:res=>{
                    console.log(res);
                    that.Name = res.name;
                    that.Address = res.address;
                    that.Latitude = res.latitude;
                    that.Longitude = res.longitude;
                    that.editShow = true;
                },fail(error){

                }
            })
            // const url = '/pages/clockIn/mapList/main';
            // wx.navigateTo({url:url});
        },
        getClose(){
            this.show = false;
        },
        getToConnect(){
            this.show = false;
            this.$emit('childFn',false);
            this.isShow = true;
        },
        getAddWorkWiFi(){
            this.show =  true;
        },
        getChildFn(val){
            wx.setNavigationBarTitle({
                title: '设置'
            })
            this.isShow = val;
            this.$emit('childFn',true);
            this.getQueryWIFi();
        },
        // 高级设置
        getSeniorSetting(){
            const url = '/pages/clockIn/seniorSetting/main';
            wx.navigateTo({url:url});
        },
        onCloseEdit(){
            this.editShow = false;
        },
        getDelName(){
            this.Name = '';
        },
        getSubmit(){
            this.$httpWX.get({
              url:this.$api.message.queryList,
              data:{
                  SessionKey:this.sessionkey,
                  method:"entity.create",
                  ObjTypeCode:30092,
                  Name:this.Name,
                  Location:this.Address,
                  Longitude:this.Longitude,
                  Latitude:this.Latitude
              }
            }).then(res=>{
                console.log(res);
                this.editShow = false;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    h3{
        font-size: 26rpx;
        color: #999999;
        background: #f4f4f4;
        padding: 31rpx 33rpx;
    }
    .center{
        padding-bottom: 80px;
        .content{
            background: #fff;
            margin-bottom: 40rpx;
            .rowWrap{
                display: flex;
                padding: 31rpx 33rpx;
                border-bottom: 2rpx solid #e2e4e3;
                .l{
                    p{
                        width: 63rpx;
                        height: 63rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .r{
                    flex: 1;
                    margin-left: 20rpx;
                    p{
                        font-size: 26rpx;
                        color: #cccccc;
                    }
                }
            }
            .row{
                display: flex;
                padding: 31rpx 33rpx;
                border-bottom: 2rpx solid #e2e4e3;
                justify-content: space-between;
                align-items: center;
                .lBox{
                    .font{
                        font-size: 32rpx;
                        color: #333333;
                    }
                    .code{
                        font-size: 26rpx;
                        color: #999999;
                    }
                    .blue{
                        color: #3399ff;
                    }
                }
                .rBox{
                    p{
                        width: 62rpx;
                        height: 62rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
            }
            .rowActive{
                padding: 40rpx 33rpx;
            }
        }
    }
    .sheetWrap{
        .title{
            font-size: 34rpx;
            font-weight: bold;
            color: #333333;
            text-align: center;
            padding: 20rpx 0;
        }
        .cont{
            padding: 0 20rpx;
            p{
                font-size: 31rpx;
                color: #333333;
            }
            .img{
                width: 100%;
                height: 190rpx;
                margin-top: 20rpx;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
        .btn{
            display: flex;
            justify-content: center;
            margin: 30rpx 0;
            p{
                width: 400rpx;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
                background: #3399ff;
                font-size: 32rpx;
                color: #fff;
                border-radius: 42rpx;
            }
        }
    }
    .editPopup{
        .title{
            text-align: center;
            font-size: 34rpx;
            color: #000000;
            font-weight: bold;
            padding-top: 44rpx;
        }
        .address{
            text-align: center;
            color: #666666;
            font-size: 26rpx;
            padding: 20rpx 0;
        }
        .inpWrap{
            width: 476rpx;
            margin: 0 auto;
            position: relative;
        }
        .inp{
            width: 476rpx;
            height: 59rpx;
            line-height: 59rpx;
            background: #f2f3f4;
            font-size: 26rpx;
            color: #333333;
            margin: 0 auto;
            border-radius: 30rpx;
            padding: 0 20rpx;
        }
        .icon-del{
            position: absolute;
            right: 15rpx;
            top: 10rpx;
        }
        .moreBtn{
            display: flex;
            font-size: 34rpx;
            color: #3399ff;
            border-top: 1rpx solid #b3b3b2;
            margin-top: 20rpx;
            p{
                flex: 1;
                text-align: center;
                padding: 22rpx 0;
            }
            p:nth-child(1){
                border-right: 1rpx solid #b3b3b2;
            }
        }
    }
</style>