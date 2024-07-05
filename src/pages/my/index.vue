<template>
    <div class="wrap">
        <!-- <div class="swiper">
            <swiper :current="number" @change="changeSwiper" slidesPerView="2" @transition="getTransition" indicator-color='red' indicator-active-color='yellow' :autoplay='false'>
                <block>
                    <swiper-item v-for="(item,i) in currentList" :key="i">
                        <div class="swiper-wrapper">
                            <ul class="swiper-slide">
                                <li v-for="(k,j) in item" @click="setCurrent(j,k.sendDate)" :key="j">
                                    <p>{{k.week}}</p>
                                    <span class="jin" v-if="k.now">今</span>
                                    <span class="select" v-else :class="{'active':currentIndex==j}">{{k.showDate}}</span>
                                </li>
                            </ul>
                        </div>
                    </swiper-item>
                </block>
            </swiper>
        </div> -->
        <div class="header">
            <div class="navBox" @click="getInfo">
                <div>
                    <p class="radius" v-if="imgUrl==''">{{info.name}}</p>
                    <p class="imgs" v-if="imgUrl!=''">
                        <img :src="imgUrl" alt="">
                    </p>
                </div>
                <div>
                    <p class="name">{{info.fullName}}</p>
                    <p class="info">{{info.deptName}}</p>
                </div>
                <div>
                    <!-- <i class="iconfont icon-erweima2" style="color:#A3A7AC;"></i> -->
                    <!-- <van-icon name="qr" size="30" color="#cccccc" @click="getQrCode" /> -->
                    <i-icon type="enter" size="20" color="#cccccc" />
                </div>
            </div>
        </div>
        <div class="center">
            <!-- <div class="row">
                <p>
                    <i class="iconfont icon-shequshenghuo" style="color:#e4a454;"></i>
                </p>
                <p>
                    社区
                </p>
                <p>
                    <i-icon type="enter" size="20" color="#cccccc" />
                </p>
            </div> -->
            <div class="rowWrap">
                <div class="box" @click="getEmail">
                    <p>
                        <i class="iconfont icon-shejiao_youjian" style="color:#ec746c;"></i>
                        <!-- <img src="https://oawx.hnca.org.cn/img/wechat/06.Mail.png" alt=""> -->
                    </p>
                    <p class="division">
                        邮件
                        <span><i-icon type="enter" size="20" color="#cccccc" /></span>
                    </p>
                </div>
                <div class="box" @click="getUsb">
                    <p>
                        <i class="iconfont icon-youpan" style="color:#3399ff;"></i>
                        <!-- <img src="https://oawx.hnca.org.cn/img/wechat/06.Mail.png" alt=""> -->
                    </p>
                    <p class="division">
                        优盘
                        <span><i-icon type="enter" size="20" color="#cccccc" /></span>
                    </p>
                </div>
                <div class="box" @click="handleQrcode">
                    <p>
                        <i class="iconfont icon-youpan" style="color:#3399ff;"></i>
                    </p>
                    <p class="division">
                        扫一扫
                        <span><i-icon type="enter" size="20" color="#cccccc" /></span>
                    </p>
                </div>
                <div class="box" @click="distinguishOCR">
                    <p>
                        <i class="iconfont icon-youpan" style="color:#3399ff;"></i>
                    </p>
                    <p class="division">
                        ocr识别
                        <span><i-icon type="enter" size="20" color="#cccccc" /></span>
                    </p>
                </div>
            </div>
            <div class="row" @click="getRouterSet">
                <p>
                    <i class="iconfont icon-shezhi1" style="color:#587396;"></i>
                    <!-- <img src="https://oawx.hnca.org.cn/img/wechat/06.Mail.png" alt=""> -->
                </p>
                <p>
                    设置
                </p>
                <p>
                    <i-icon type="enter" size="20" color="#cccccc" />
                </p>
            </div>
            <!-- <button @click="getOpen">订阅</button> -->
        </div>
        <vue-tab-bar
          @fetch-index="clickIndexNav"
          :selectNavIndex="selectNavIndex"
          :needButton="needButton"
          :handButton="handButton"
          :btnText="btnText">
      </vue-tab-bar>
    </div>
</template>
<script>
import vueTabBar from '../../components/vueTabBar';

export default {
    components:{
        vueTabBar
    },
    data(){
        return {
            sessionkey:"",
            info:{},
            tmplIds:[],
            data:"",
            openid:"",
            imgUrl:"",
            currentList:[
            ],
            currentFirstDate: null,
            currentIndex: new Date().getDay(),
            cateLeft: 0,
            nowDate:this.setNowDate(new Date()),
            sign:null,
            number:1,
            actNum:0,
            selectNavIndex:4,
            needButton:false,
            handButton:'',
            btnText:''
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.openid = wx.getStorageSync('openid');
        this.sessionkey = sessionkey;
        console.log(this.nowDate,'nowDate')
        this.now();
        this.getUserInfo();
        // this.getAvatar();
        this.getTemplate();
        
    },
    onShow(){
        this.getAvatar();
    },
    methods:{
        distinguishOCR(){
            
        },
        changeSwiper(e){
            console.log(e);
            let current = e.mp.detail.current;
            if(current==this.currentList.length-1){
                console.log(this.number,'123');
                // let now = this.setDate(new Date());
                // let pre = this.setDate(this.addDate(this.currentFirstDate, -7))
                let next = this.setDate(this.addDate(this.currentFirstDate, 7))
                // console.log(next,'next----')
                this.currentList.push(next);
                this.currentIndex = 6;
                this.nowDate=this.currentList[current][6].sendDate;
                console.log(this.nowDate,'nowDate');
                // console.log(this.currentList,'currentList');
            }else 
            if(current==0){
                //console.log(this.number,'number');
                this.actNum++
                this.number=current
                let pre = this.setDate(this.addDate(this.sign, -7))
                //console.log(pre,'pre');
                this.currentList.unshift(pre);
                //e.mp.detail.current=1
                this.number=1
                this.currentIndex = 6;
                this.nowDate=this.currentList[this.number][6].sendDate;
                console.log(this.nowDate,'nowDate');
                //console.log(this.number,'number');
                //console.log(this.currentList,'---')
            }else {
                this.nowDate=this.currentList[current][6].sendDate;
                console.log(this.nowDate,'nowDate----');
            }
        },
        getTransition(e){
            // console.log(e);
        },
        formatDate(nowDate) {
            //console.log(nowDate,'nowdate');
            let year = nowDate.getFullYear();
            let month = (nowDate.getMonth() + 1);
            let date = nowDate.getDate();
            let week = ['日', '一', '二', '三', '四', '五', '六'][nowDate.getDay()];
            return {
                week,
                showDate: date,
                listDate: `${month}月${date}日 ${week}`,
                sendDate: `${year}-${month}-${date}`,
                now: nowDate.toLocaleDateString() === new Date().toLocaleDateString()
            }
        },
        now(){
            let now = this.setDate(new Date());
            let pre = this.setDate(this.addDate(this.currentFirstDate, -7))
            let next = this.setDate(this.addDate(this.currentFirstDate, 14))
            this.currentList = [pre, now, next]
        },
        addDate(date, n) {
            date.setDate(date.getDate() + n);
            return date;
        },
        setDate(date) {
            console.log('setdate')
            let week = date.getDay();
            date = this.addDate(date, week * -1);

            this.currentFirstDate = new Date(date);
            if(!this.sign){
                this.sign = this.addDate(new Date(date),-7);
            }
            let list = []
            for (let i = 0; i < 7; i++) {
                list.push(this.formatDate(i === 0 ? this.addDate(date, 0) : this.addDate(date, 1)));
            }
            //console.log(list,'list');
            return list
        },
        setNowDate(nowDate){
            let year = nowDate.getFullYear();
            let month = (nowDate.getMonth() + 1);
            let date = nowDate.getDate();
            return `${year}-${month}-${date}`;
        },
        currentClassStatus(i, j) {
            console.log(i === 1 && j === this.currentIndex,'boolear');
            return i === 1 && j === this.currentIndex
        },
        setCurrent(j,sendDate) {
            console.log(j,sendDate);
            this.currentIndex = j;
            this.nowDate=sendDate;
        },
        getNow(){
            this.now()
            this.nowDate=this.setNowDate(new Date())
            this.currentIndex=new Date().getDay()
        },
        getEmail(){
            const url = '/pages/email/main';
            wx.navigateTo({url:url});
        },
        getUsb(){
            const url = '/pages/usbDrive/main';
            wx.navigateTo({url:url});
        },
        getTemplate(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"wxmi.user.msgsubscribe.notaccept",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.tmplIds = res.data;
            })
        },
        getOpen(){
            let that = this;
            wx.requestSubscribeMessage({
                tmplIds:this.tmplIds,
                success:res=>{
                    console.log(res);
                    that.data = JSON.stringify(res);
                    that.$httpWX.get({
                        url:that.$api.message.queryList,
                        data:{
                            method:"wxmi.user.msgsubscribe.save",
                            SessionKey:this.sessionkey,
                            openid:that.openid,
                            data:that.data
                        }
                    }).then(res=>{
                        console.log(res);
                    })
                }
            })
        },
        getUserInfo(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.userinfo.get",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.info = res.data[0];
                if(this.info.fullName.length>2){
                    this.info.name = this.info.fullName.substr(1);
                }else {
                    this.info.name = this.info.fullName;
                }
                this.getAvatar();
                // let that = this;
                // const downloadTask = wx.downloadFile({
                //     url: that.info.avatar, //仅为示例，并非真实的资源
                //     success (res) {
                //         console.log(res);
                //         // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                //         if (res.statusCode === 200) {
                //             that.imgUrl = res.tempFilePath;
                //         }else {
                //             that.imgUrl = '';
                //         }
                //     }
                // })
                
                // downloadTask.onProgressUpdate((res)=>{
                //     console.log(res.progress,'下载进度');
                //     console.log(res.totalBytesWritten,'已经下载的数据长度，单位 Bytes');
                //     console.log(res.totalBytesExpectedToWrite,'预期需要下载的数据总长度，单位 Bytes');
                // })
            })
        },
        getAvatar(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.my.isset,
                    SessionKey:this.sessionkey,
                    userId:this.info.id
                }
            }).then(res=>{
                console.log(res);
                if(res.status==0){
                    this.imgUrl = '';
                }else {
                    let that = this;
                    let url = `${that.$api.upload.url}?method=${that.$api.my.getAvatar}&SessionKey=${that.sessionkey}&UserId=${that.info.id}`;
                    wx.downloadFile({
                        url: url, //仅为示例，并非真实的资源
                        success (res) {
                            console.log(res);
                            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                            if (res.statusCode === 200) {
                                that.imgUrl = res.tempFilePath;
                            }
                        }
                    })
                }
            })
        },
        getRouterSet(){
            const url = '/pages/myFile/mysetting/main';
            wx.navigateTo({url:url});
        },
        getQrCode(){
            const url = '/pages/myFile/qrCode/main';
            wx.navigateTo({url:url});
        },
        getInfo(){
            this.number = ''
            this.number = this.actNum+1;
            this.currentIndex = new Date().getDay();
            console.log(this.number);
            const url = '/pages/myFile/personalInfo/main';
            wx.navigateTo({url:url});
        },
        handleQrcode() {
            wx.scanCode({
                success (res) {
                    console.log(res)
                }
            })
        }
    }
}
</script>
<style lang="scss">
    @import '../../../static/css/public.scss';
    @font-face {
        font-family: 'iconfont';
        src: url(data:font/truetype;charset=utf-8;base64,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) format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    }

    .icon-shequshenghuo:before {
    content: "\e60a";
    }

    .icon-youpan:before {
    content: "\e600";
    }

    .icon-shezhi1:before {
    content: "\e63d";
    }

    .icon-shejiao_youjian:before {
    content: "\e601";
    }

    .icon-erweima2:before {
    content: "\e602";
    }


    .wrap{
        .swiper{
            height: 56px;
            .swiper-wrapper{
                width: 100%;
                height: 100%;
                // background: #3399ff;
                .swiper-slide{
                    padding: 10px;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;
                    background: #3399ff;
                    li {
                        color: #fff;
                        font-size: 11px;
                        text-align: center;
                        width: 25px;
                        p {
                            font-size: 9px;
                            opacity: 0.7;

                        }
                        .jin{
                            display:inline-block;
                            font-size: 10px;
                            width: 18px;
                            height: 18px;
                            line-height: 18px;
                            text-align: center;
                            background: #fff;
                            color: #3399ff;
                            border-radius: 50%;
                        }
                        span {
                            margin-top: 5px;
                            display: inline-block;
                        }

                        .select.active {
                            width: 18px;
                            height: 18px;
                            line-height: 18px;
                            text-align: center;
                            background: #ffffff;
                            color: #4d7eff;
                            border-radius: 50%;
                            font-size: 10px;
                        }

                        i {
                            font-size: 20px;
                            display: inline-block;
                            margin-top: 2px;
                        }
                        }
                }
            }
        }
        .header{
            background: #fff;
            .navBox{
                padding: 30rpx;
                display: flex;
                div:nth-child(1){
                    .radius{
                        width: 132rpx;
                        height: 132rpx;
                        line-height: 132rpx;
                        text-align: center;
                        border-radius: 50%;
                        color: #fff;
                        font-size: 41rpx;
                        background: #3399ff;
                    }
                    .imgs{
                        width: 132rpx;
                        height: 132rpx;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                            border-radius: 50%;
                        }
                    }
                }
                div:nth-child(2){
                    flex: 1;
                    margin-left: 30rpx;
                    .name{
                        font-size: 40rpx;
                        font-weight: bold;
                        color: #333333;
                        margin-top: 20rpx;
                    }
                    .info{
                        font-size: 26rpx;
                        color: #999999;
                        margin-top: 10rpx;
                    }
                }
                div:nth-child(3){
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .center{
            margin-top: 16rpx;
            .row{
                display: flex;
                background: #fff;
                margin: 20rpx 0;
                padding: 30rpx;
                align-items: center;
                p:nth-child(1){
                    i{
                        font-size: 44rpx;
                    }
                    // width: 50rpx;
                    // height: 50rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
                p:nth-child(2){
                    font-size: 35rpx;
                    color: #333333;
                    flex: 1;
                    margin-left: 30rpx;
                }
            }
            .rowWrap{
                background: #fff;
                .box:last-child .division{
                    border: none;
                }
                .box{
                    display: flex;
                    padding: 0 30rpx;
                    align-items: center;
                    p:nth-child(1){
                        // width: 50rpx;
                        // height: 50rpx;
                        i{
                            font-size: 44rpx;
                        }
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    p:nth-child(2){
                        font-size: 35rpx;
                        color: #333333;
                        flex: 1;
                        margin-left: 30rpx;
                        overflow: hidden;
                        padding: 30rpx 0;
                        span{
                            float: right;
                        }
                    }
                    .division{
                        border-bottom: 1rpx solid #e2e4e3;
                    }
                }
            }
        }
    }
</style>