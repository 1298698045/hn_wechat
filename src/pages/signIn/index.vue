<template>
    <div class="wrap">
        <div class="container" v-if="activeIdx==0">
            <div class="content">
                <div class="row">
                    <p class="time">
                        {{date}}
                    </p>
                    <p class="btn" @click="getSetting">设置</p>
                </div>
                <div class="row">
                    <p class="location">{{address}}</p>
                    <p class="btn" @click="getChooseLocation">地点微调</p>
                </div>
                <div class="map_wrap">
                    <map class="map" id="map"
                        :longitude="longitude"
                        :latitude="latitude"
                        scale="14"
                        :markers="markers"
                        @markertap="markertap"
                        show-location></map>
                </div>
                <div class="row_box">
                    <p class="label">拜访对象</p>
                    <input type="text" placeholder="请选择或输入" placeholder-class="placeholder" v-model="value" />
                    <p class="icon" @click="getCheckPeople">选择</p>
                </div>
            </div>
            <div class="round">
                <div class="box" @click="getSign">
                    <div>
                        <p class="sign">签到</p>
                        <p class="time">{{time}}</p>
                    </div>
                </div>
            </div>
            <p class="text">{{qty?'今日你已签到'+qty+'次':'今日你还未签到'}}</p>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <p class="tab" :class="{'active':activeIdx==0}" @click="getTab(0)">签到</p>
                <p class="tab" :class="{'active':activeIdx==1}" @click="getTab(1)">统计</p>
            </div>
        </div>
        <div class="tabT_wrap" v-if="activeIdx==1">
            <map class="map" id="map"
                :longitude="longitude"
                :latitude="latitude"
                scale="14"
                :markers="markers"
                @markertap="markertap"
                show-location></map>
            <div class="listCont">
                <div class="date">
                    <p class="d">
                        02.01
                    </p>
                    <p class="divider">

                    </p>
                </div>
                <div class="row_box" v-for="(item,index) in list" :key="index">
                    <p class="time">{{item.CheckTime}}</p>
                    <div class="addresss">
                        <p>
                            {{item.BuildingName}}
                        </p>
                        <p>{{item.Location}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import QQMapWX from '@/utils/qqmap-wx-jssdk.js';
var qqmapsdk = new QQMapWX({
    key: 'UVRBZ-UN2WU-KMJV6-2DAPJ-JW5QE-C5BYC' // 必填
});
export default {
    data(){
        return {
            value:"",
            latitude:"23.099994",
            longitude:"113.324520",
            address:"",
            markers: [
                {
                    iconPath: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpng.pngtree.com%2Felement_our%2Fmd%2F20180515%2Fmd_5afb0cf7bd445.jpg&refer=http%3A%2F%2Fpng.pngtree.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614737020&t=493beae22e91c67fa4d97219590bff4c',
                    id: 0,
                    latitude: 23.099994,
                    longitude: 113.324520,
                    width: 30,
                    height: 30
                }
            ],
            time:"",
            clearTime:null,
            date:"",
            activeIdx:0,
            paramsTime:"",
            startTime:"",
            qty:"",
            list:[],
            BuildingName:"" //标志性建筑物
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        userId(){
            return wx.getStorageSync('userId');
        }
    },
    onShow(){
        this.getQuery();
    },
    onLoad(){
        this.getLocation();
        let myDate = new Date();
        let y = myDate.getFullYear();
        let m = myDate.getMonth()+1;
        let d = myDate.getDate();
        this.startTime = `${y}-${m}-${d}`;
        this.getQuery();
        this.clearTime = setInterval(()=>{
            this.getTime();
        },1000)
    },
    onUnload(){
        clearInterval(this.clearTime);
    },
    methods:{
        // 获取当前位置经纬度
        handleLoacation(toast) {
            let that = this;
            wx.getLocation({
                type: 'gcj02',
                success: res => {
                    console.log('success',res);
                    that.latitude = res.latitude;
                    that.longitude = res.longitude;
                    let latitude = res.latitude;
                    let longitude = res.longitude;
                    that.markers = [
                        {
                            iconPath: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpng.pngtree.com%2Felement_our%2Fmd%2F20180515%2Fmd_5afb0cf7bd445.jpg&refer=http%3A%2F%2Fpng.pngtree.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614737020&t=493beae22e91c67fa4d97219590bff4c',
                            id: 0,
                            latitude: res.latitude,
                            longitude: res.longitude,
                            width: 30,
                            height: 30
                        }
                    ]
                    qqmapsdk.reverseGeocoder({
                        location:{
                            latitude:latitude,
                            longitude:longitude
                        },
                        success:res=>{
                            console.log(res,'res')
                            that.address = res.result.address;
                            that.BuildingName = res.result.formatted_addresses.recommend;
                        }
                    })
                },
                fail: err => {
                    // 判断是否获取到了定位
                    // this.isLocation = false
                    
                    // 根据不同需求做了两种类型提示，需要根据实际业务修改
                    if (toast) {
                        // this.$u.toast是用的框架里封装的弹出消息
                        wx.showToast({
                            title:"您已拒绝授权，相关功能会无法使用！"
                        })
                        return
                    }
                    //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
                    wx.showModal({
                        title: '提示',
                        content: '请在系统设置中打开定位服务，重新进入小程序！'
                    })
                }
            })
        },
        getLocation(){
            wx.getSetting({
                success:res=>{
                    if (res.authSetting['scope.userLocation'] === true) {
                        console.log('已经授权，非第一次')
                        //授权后默认加载，直接获取定位
                        this.handleLoacation()
                    }else if (res.authSetting['scope.userLocation'] === undefined) {
                        // 如果用户是第一次登陆且未授权的情况，会直接弹窗请求授权
                        // 使用 getlocation 获取用户 经纬度位置
                        console.log('第一次登陆且未授权')
                        this.handleLoacation(true)
                    }else if (res.authSetting['scope.userLocation'] !== undefined && res.authSetting['scope.userLocation'] !== true) {
                        console.log('不是第一次进入该页面,且未授权')
                        wx.showModal({
                            title: '是否授权当前位置',
                            content: '需要获取您的地理位置，请确认授权，否则无法相关功能！',
                            success: res => {
                                //如果点击取消则显示授权失败
                                if (res.cancel) {
                                    this.$u.toast('您已拒绝授权!')
                                }
                                //如果点击确定会打开授权页请求二次授权
                                else if (res.confirm) {
                                    wx.openSetting({
                                        success: dataAu => {
                                            if (dataAu.authSetting['scope.userLocation'] === true) {
                                               wx.showToast({
                                                   title:'授权成功!'
                                               })
                                                //再次授权，调用getLocationt的API
                                                this.handleLoacation()
                                            } else {
                                                // this.isLocation = false
                                                 wx.showToast({
                                                    title:'授权失败!'
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                },
                fail: err => {
                    // this.isLocation = false
                    wx.showModal({
                        title: '提示',
                        content: '未知错误，请重新打开小程序！'
                    })
                }
            })
        },
        getTime(){
            let myDate = new Date();
            let y = myDate.getFullYear();
            let m = myDate.getMonth()+1;
            let d = myDate.getDate();
            this.date = `${y}年${m}月${d}日`;
            let hour = myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours();
            let min = myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes();
            let s = myDate.getSeconds();
            this.paramsTime = `${y}-${m}-${d} ${hour}:${min}`
            this.time = `${hour}:${min}`
        },
        getTab(idx){
            this.activeIdx = idx;
            if(idx==1){
                clearInterval(this.clearTime);
                this.getDaily();
            }else {
                this.getQuery();
                setInterval(() => {
                    this.getTime();
                }, 1000);
            }
        },
        getSign(){
            const url = '/pages/signIn/fillIn/main?paramsTime='+this.paramsTime+'&address='+this.address
            +'&time='+this.time+'&BuildingName='+this.BuildingName;
            wx.navigateTo({url:url});
        },
        getSetting(){
            const url = '/pages/signIn/signSetting/main';
            wx.navigateTo({url:url});
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.sign.attendcheck,
                    SessionKey:this.sessionkey,
                    startTime:this.startTime,
                    endTime:this.startTime,
                    attendType:1,
                }
            }).then(res=>{
                this.qty = res.data.qty;
            })
        },
        getDaily(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.sign.getdaily,
                    SessionKey:this.sessionkey,
                    attendDate:this.startTime,
                    attendType:1,
                    userId:this.userId
                }
            }).then(res=>{
                this.list = res.listData;
            })
        },
        getChooseLocation(){
            let that = this;
            wx.chooseLocation({
                success:res=>{
                    that.Name = res.name;
                    that.address = res.address;
                    that.latitude = res.latitude;
                    that.longitude = res.longitude;
                    that.markers = [
                        {
                            iconPath: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpng.pngtree.com%2Felement_our%2Fmd%2F20180515%2Fmd_5afb0cf7bd445.jpg&refer=http%3A%2F%2Fpng.pngtree.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1614737020&t=493beae22e91c67fa4d97219590bff4c',
                            id: 0,
                            latitude: res.latitude,
                            longitude: res.longitude,
                            width: 30,
                            height: 30
                        }
                    ]
                },fail(){

                }
            })
        },
        // 选择拜访人
        getCheckPeople(){
            // wx.startSoterAuthentication({
            //     requestAuthModes: ['fingerPrint','facial'],
            //     challenge: '123456',
            //     authContent: '请用指纹解锁',
            //     success(res) {

            //     }
            // })
            const url = '/pages/publics/externalMailList/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .content{
            background: #fff;
            padding: 0 32rpx;
            .row{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 34rpx 0;
                .time{
                    font-size: 24rpx;
                    color: #999999;
                }
                .btn{
                    font-size: 28rpx;
                    color: #3399ff;
                }
                .location{
                    font-size: 35rpx;
                    color: #333333;
                }
            }
            .map_wrap{
                padding-bottom: 25rpx;
                .map{
                    width: 100% !important;
                }
            }
            .row_box{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding:25rpx 0;
                .label{
                    font-size: 35rpx;
                    color: #333333;
                }
                .placeholder{
                    font-size: 28rpx;
                    color: #cccccc;
                }
                input{
                    font-size: 28rpx;
                }
                .icon{
                    font-size: 28rpx;
                    color: #3399ff;
                }
            }
        }
        .round{
            display: flex;
            justify-content: center;
            padding-top: 60rpx;
            .box{
                width: 280rpx;
                height: 280rpx;
                background-color: rgba(237, 183, 108, 1);
                box-shadow: 0rpx 70rpx 117rpx 0rpx rgba(237, 183, 108, 0.2);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                .sign{
                    font-size: 40rpx;
                    color: #fff;
                    opacity: .6;
                    text-align: center;
                }
                .time{
                    font-size: 49rpx;
                    color: #fff;
                    margin-top: 26rpx;
                    text-align: center;
                }
            }
        }
        .text{
            text-align: center;
            font-size: 28rpx;
            color: #666666;
            margin-top: 27rpx;
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 999;
            .box{
                display: flex;
                justify-content: space-around;
                padding: 25rpx 24rpx;
                .tab{
                    font-size: 21rpx;
                    color: #666666;
                }
                .tab.active{
                    color: #3399ff;
                }
            }
        }
        .tabT_wrap{
            .map{
                width: 100%;
            }
            .listCont{
                padding: 25rpx 33rpx;
                background: #fff;
                .date{
                    display: flex;
                    align-items: center;
                    .d{
                        padding-right: 20rpx;
                    }
                    .divider{
                        flex: 1;
                        height: 2rpx;
                        background: #e2e3e5;
                    }
                }
                .row_box{
                    display: flex;
                    padding: 20rpx 0;
                    .time{
                        font-size: 20px;
                        color: #333333;
                        padding-right: 20rpx;
                    }
                    .addresss{
                        p:nth-child(1){
                            font-size: 35rpx;
                            color: #333333;
                        }
                        p:nth-child(2){
                            font-size: 29rpx;
                            color: #999999;
                        }
                    }
                }
            }
        }
    }
</style>