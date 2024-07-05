<template>
    <div class="wrap">
        <!-- <div class="header">
            <p @click="getReturn">取消</p>
            <p @click="getSend">发送</p>
        </div> -->
        <div class="center">
            <div class="content">
                <textarea name="" id="" cols="30" rows="10" maxlength="100000"
                 :auto-height="true"
                 :hold-keyboard="keyboard"
                 :show-confirm-bar="false"
                 @focus="getFocus"
                 @blur="getBlur"
                 v-model="description"
                  placeholder="分享新动态..."></textarea>
            </div>
            <div class="imgs" v-if="fileList!=''">
                <van-uploader :file-list="fileList" @afterRead="afterRead" @delete="getDelete" />
            </div>
        </div>
        <div class="footer" @click="getKeyboard" :style="{'bottom':keyboardHeight+'px'}" :class="{'active':isModelmes}" catchtouchmove="true">
            <div class="active_box" :class="{'active':isModelmes}">
                <div class="row">
                    <p class="position" :class="{'active':address!=''}" @click="getLocation">
                        <i class="iconfont icon-dizhi"></i>
                        {{address!=''?address:'你在哪里?'}}</p>
                    <p class="del" v-if="address!=''" @click="getDelIcon">
                        <i-icon type="close" />
                    </p>
                </div>
                <p class="open" @click="getOpen">
                    <i class="iconfont icon-gongkai" v-if="visible==0"></i>
                    <i class="iconfont icon-simi" v-if="visible==1"></i>
                    <i class="iconfont icon-xiaozu" v-if="visible==3"></i>
                    {{visibleName}}</p>
            </div>
            <div class="box_ICON">
                <div class="l">
                    <p class="icon_" @click="getPhotograph">
                        <i class="iconfont icon-paizhao"></i>
                    </p>
                    <p class="icon_" @click="getUploadImg">
                        <i class="iconfont icon-tupian"></i>
                    </p>
                    <!-- <p class="icon_">
                        <i class="iconfont icon-tupian"></i>
                    </p> -->
                </div>
                <p class="send" :class="{'active':description!=''}" @click="description!=''?getSend():''">
                    发送
                </p>
            </div>
        </div>
        <van-popup
            :show="show"
            closeable
            z-index="9999"
            position="bottom"
            custom-style="height: 100%"
            @close="onClose"
        >
            <shareRange @changeValue="getValue" />
        </van-popup>
    </div>
</template>
<script>
import shareRange from '@/components/shareRange';
import {message} from '@/utils/message';
export default {
    components:{
        shareRange
    },
    data(){
        return {
            isFocus:false,
            keyboardHeight:"",
            keyboard:false,
            Location:"",
            Latitude:"",
            Longitude:"",
            address:"",
            show:false,
            visible:0,
             fileList: [],
            groupid:"",
            description:""

        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        visibleName(){
            return this.visible==0?'公开':this.visible==1?'仅自己可见':this.visible==2?'部分可见':
            this.visible==3?'指定分组可见':'公开'
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        wx.onKeyboardHeightChange(res => { //监听键盘高度变化
            console.log(res.height,'res');
            this.keyboardHeight = res.height;
        })
    },
    methods:{
        getDelete(e){
            let idx = e.mp.detail.index;
            this.fileList.splice(idx,1);
        },
        afterRead(event) {
            console.log(event)
            let that = this;
            const { file } = event.mp.detail;
            this.fileList.push({url:file.path,name:Math.floor(Math.random() * (100 - 1)) + 1});

            // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
            // wx.uploadFile({
            //     url: "https://oawx.hnca.org.cn/rest?method="+'file.attachfiles.upload'+'&SessionKey=' + that.sessionkey+'&objTypeCode='+'6000',
            //     filePath: file.path,
            //     name: 'file',
            //     formData: { user: 'test' },
            //     success(res) {
            //         console.log(res);
            //         that.fileList.push({url:file.path,name:Math.floor(Math.random() * (100 - 1)) + 1});
            //         // 上传完成需要更新 fileList
            //         // const { fileList = [] } = this.data;
            //         // fileList.push({ ...file, url: res.data });
            //         // this.fileList = fileList;
            //     },
            // });
        },
        uploadFile(id){
            // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
            let idx = 0;
            let that = this;
            for(let i=0; i < that.fileList.length; i++){
                wx.uploadFile({
                    url: "https://oawx.hnca.org.cn/rest?method="+'file.uploadimages'+'&SessionKey=' + that.sessionkey+'&objTypeCode='+'5500'+'&pid='+id,
                    filePath: that.fileList[i].url,
                    name: 'file',
                    formData: { user: 'test' },
                    success(res) {
                        console.log(res);
                        if(i==that.fileList.length-1){
                            message.toast({
                                title:'发送成功',
                                delta:1
                            })
                        }
                    },
                });
            }
        },
        getValue(val){
            this.show = val.show;
            this.visible = val.value;
            if(this.visible==3){
                this.groupid = val.groupid;
            }
        },
        onClose(){
            this.show = false;
        },
        getKeyboard(){
            this.keyboard = true;
        },
        getFocus(e){
            this.isFocus = true;
            
        },
        getBlur(e){
            this.isFocus = false;
        },
        getReturn(){
            wx.navigateBack({
                delta:1
            })
        },
        getLocation(){
            // this.isShow = true;
            var that = this;
            wx.chooseLocation({
                success: function (res) {
                    console.log(res);
                    // success
                    that.Location = res.name;
                    that.Latitude = res.latitude;
                    that.Longitude = res.longitude;
                    that.address = res.address;
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })
        },
        getPhotograph(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    that.fileList.push({url:tempFilePaths[0],name:Math.floor(Math.random() * (100 - 1)) + 1});

                }
            })
        },
        getUploadImg(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    that.fileList.push({url:tempFilePaths[0],name:Math.floor(Math.random() * (100 - 1)) + 1});
                }
            })
        },
        getSend(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.community.send,
                    SessionKey:this.sessionkey,
                    status:this.description,
                    visible:this.visible,
                    Longitude:this.Longitude,
                    Latitude:this.Latitude,
                    Location:this.address,
                    groupid:this.groupid
                }
            }).then(res=>{
                if(res.status==1){
                    // wx.showToast({
                    //     title:res.msg,
                    //     icon:"none",
                    //     duration:2000
                    // })
                    // message.toast({
                    //     title:res.msg,
                    //     delta:1
                    // })
                    this.uploadFile(res.data.id);
                }
            })
        },
        getOpen(){
            this.show = true;
        },
        getDelIcon(){
            this.address = '';
            this.Location = '';
            this.Latitude = '';
            this.Longitude = '';
            this.WorklogType = '';
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/journal.css';
    .wrap{
        width: 100%;
        height: 100vh;
        overflow: hidden;
        // background: #fff;
        .header{
            width: 100%;
            position: fixed;
            top: 0;
            display: flex;
            justify-content: space-between;
            padding: 30rpx;
            color: #3399ff;
        }
        .center{
            height: 100vh;
            background: #fff;
            .content{
                // margin-top: 100rpx;
                margin-top: 35rpx;
                background: #fff;
                height: 30vh;
                padding: 40rpx 33rpx;
                textarea{
                    width: 100%;
                    height: 100% !important;
                    font-size: 33rpx;
                    // background: red;
                }
            }
        }
        .footer.active{
            padding-bottom: 50rpx;
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            border-top: 1rpx solid #e2e3e5;
            z-index: 999;
            i{
                color: #3399ff;
            }
            .active_box.active{
                bottom: 180rpx !important;
            }
            .active_box{
                width: 100%;
                position: absolute;
                bottom: 130rpx;
                z-index: 99999;
                display: flex;
                justify-content: space-between;
                padding: 0 30rpx;
                .row{
                    display: flex;
                    background: #f8f8f8;
                    border: 1rpx solid #cccccc;
                    border-radius: 28rpx;
                    padding: 0 10rpx;
                    align-items: center;
                    .position{
                        width: 194rpx;
                        height: 56rpx;
                        line-height: 56rpx;
                        font-size: 28rpx;
                        color: #505050;
                        text-align: center;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        display: flex;
                        align-items: center;
                    }
                    .position.active{
                        border-right: 1rpx solid #ccc;
                    }
                    .del{
                        padding-left: 10rpx;
                    }
                }
                .open{
                    width: 125rpx;
                    height: 56rpx;
                    line-height: 56rpx;
                    border-radius: 28rpx;
                    font-size: 28rpx;
                    color:  #5B6991;
                    text-align: center;
                    background: #f8f8f8;
                    border: 1rpx solid #cccccc;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    display: flex;
                    padding-left: 10rpx;
                }
            }
            .box_ICON{
                display: flex;
                justify-content: space-between;
                padding: 26rpx 33rpx;
                .l{
                    display: flex;
                    .icon_{
                        // width: 49rpx;
                        // height: 49rpx;
                        // background: #999999;
                        margin-right: 67rpx;
                        i{
                            color: #3399ff;
                            font-size: 20px;
                        }
                    }
                }
                .send{
                    width: 125rpx;
                    height: 56rpx;
                    line-height: 56rpx;
                    border-radius: 28rpx;
                    font-size: 28rpx;
                    color: #cccccc;
                    text-align: center;
                    background: #f8f8f8;
                    border: 1rpx solid #cccccc;
                }
                .send.active{
                    border: none;
                    background: #3399ff;
                    color: #fff;
                }
            }
        }
    }
</style>