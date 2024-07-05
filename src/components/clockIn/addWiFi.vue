<template>
    <div class="wrap">
        <h3>可能需要的Wi-Fi</h3>
        <div class="content_">
            <!-- <radio-group @change="changeRadio">
                <radio class="radio" :value="123">
                    <div class="cont">
                        <p>123123</p>
                        <p>nos</p>
                        <p>你附近的</p>
                    </div>
                </radio>
            </radio-group> -->
            <van-radio-group :value="radio" @change="changeRadio">
                <van-radio custom-class="radio" :style="{'width':wdith+'px'}" :name="item.SSID+','+item.BSSID" v-for="(item,index) in wifiList" :key="index">
                    <div class="cont">
                        <p>{{item.SSID}}</p>
                        <p>{{item.BSSID}}</p>
                        <p>你附近的</p>
                    </div>
                </van-radio>
            </van-radio-group>
        </div>
        <div class="footer">
            <div class="box">
                <van-button type="primary" color="#3399ff" block @click="getSubmit">保存</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"addWiFi",
    data(){
        return {
            wifiList:[],
            groupList:[],
            SSID:"",
            BSSID:"",
            wdith:"",
            radio:""
        }
    },
    onLoad(){
        this.wdith = wx.getSystemInfoSync().windowWidth;
        console.log(this.wdith,'-------')
        wx.setNavigationBarTitle({
            title: '添加办公Wi-Fi'
        })
        this.getWifiList();
    },
    methods:{
        getWifiList(){
            let that = this;
            that.wifiList = [
                // {
                //     SSID:'24234',
                //     BSSID:"sfsdfdsf"
                // },
                // {
                //     SSID:'2423434',
                //     BSSID:"sfs234dfdsf"
                // }
            ];
            wx.startWifi({
            success:function(e){
                    wx.getWifiList({
                        success:function(e){
                            console.log(e,'wx.getWifiList');
                            wx.onGetWifiList(function(e){
                                console.log(e,'callback')
                                that.wifiList = e.wifiList;
                            })
                        }
                    })
                }
            })
        },
        changeRadio(e){
            // this.groupList = e.mp.detail.value;
            // let item = e.mp.detail.value;
            // let SSID = "";
            // let BSSID = "";
            // for (var i = 0; i < item.length; i++){
            //     var row = item[i].split(',');
            //     SSID = row[0];
            //     BSSID = row[1];
            // }
            // this.SSID = SSID;
            // this.BSSID = BSSID;
            console.log(e,'-')
            this.radio = e.mp.detail;
            let item = e.mp.detail.split(',');
            this.SSID = item[0];
            this.BSSID = item[1];
            console.log(this.SSID,this.BSSID,'123123');
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    SessionKey:"207A11C0-12E3-4F7E-8033-F61B6883FFD8",
                    method:"entity.create",
                    ObjTypeCode:"30093",
                    Name:this.SSID,
                    Address:this.BSSID
                }
            }).then(res=>{
                this.$emit('childFn',false);
            })
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        h3{
            padding: 31rpx 33rpx;
            color: #999999;
            font-size: 26rpx;
        }
        .content_{
            padding-bottom: 80px;
            .radio{
                width: 375px !important;
                background: #fff !important;
                padding: 20rpx 33rpx !important;
                border-bottom: 2rpx solid #e2e4e3 !important;
                .cont{
                    margin-left: 20rpx;
                    p:nth-child(1){
                        font-size: 32rpx;
                        color: #333333;
                    }
                    p:nth-child(2){
                        color: #333333;
                        font-size: 24rpx;
                    }
                    p:nth-child(3){
                        color: #999999;
                        font-size: 24rpx;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .box{
                padding: 20rpx 33rpx;
            }
        }
    }
</style>