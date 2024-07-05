<template>
    <div class="wrap">
        <div class="container">
            <div class="content" v-for="(item,index) in list" :key="index" @click="getOpen(item)">
                <div class="img">
                    <p>
                        <img v-if="item.fileExtension=='jpg'||item.fileExtension=='png'" :src="item.link" alt="">
                        <img v-else-if="item.fileExtension=='xls' || item.fileExtension=='xlsx'" :src="photoUrl+'xls.png'" alt="">
                        <img v-else-if="item.fileExtension=='doc' || item.fileExtension=='word' || item.fileExtension=='docx'" :src="photoUrl+'02.3.1.Word.png'" alt="">
                        <img v-else-if="item.fileExtension=='rar'" :src="photoUrl+'rar.png'" alt="">
                        <img v-else-if="item.fileExtension=='txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
                        <img v-else-if="item.fileExtension=='pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
                        <img v-else-if="item.fileExtension=='ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
                    </p>
                </div>
                <div class="cont">
                    <div>
                        <p class="title overflow">{{item.name}}</p>
                        <p class="text">{{item.name}}.{{item.fileExtension}}</p>
                    </div>
                    <p class="icon" @click.stop="getOperation(item)">
                        <i class="iconfont icon-gengduo"></i>
                    </p>
                </div>
            </div>
            <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
                <van-button type="primary" custom-class="btn" @click="getClear" block>清除记录</van-button>
            </div>
        </div>
        <van-popup
        :show="show"
        :round="false"
        position="bottom"
        custom-style="width:100%;height: auto;border-top-left-radius: 23rpx;border-top-right-radius: 23rpx;"
        @close="onClose"
        >
            <div class="popup">
                <h3 class="overflows">{{name}}</h3>
                <p>发送</p>
                <p @click="getSendOut">发邮件</p>
                <p>打开目录</p>
                <p @click="getRowClear">清除记录</p>
                <p class="row"></p>
                <p @click="onClose">取消</p>
            </div>
        </van-popup>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
import openFiles from '@/utils/openFiles';
export default {
    data(){
        return {
            list:[],
            show:false,
            name:"",
            sessionkey:"",
            files:[]
        }
    },
    onUnload(){
        this.clearFile([]);
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        photoUrl(){
            return this.$api.photo.url;
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    methods:{
        ...mapMutations(['handleFiles','clearFile']),
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.latest,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        onClose(){
            this.show = false;
        },
        getClear(){
            let that = this;
            wx.showModal({
                title: '清除使用记录',
                content: '是否清除最近使用的全部记录，清空后记录将无法恢复',
                confirmText:'清除',
                cancelColor:"#3399ff",
                confirmColor:"#3399ff",
                success:res=> {
                    if (res.confirm) {
                        that.clear();
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        },
        clear(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.latelyClear,
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.getQuery();
            })
        },
        getOperation(item){
            this.name = `${item.name}.${item.fileExtension}`;
            this.id = item.id;
            this.files.push({
                id:item.id,
                name:item.name,
                link:item.link,
                fileExtension:item.fileExtension
            })
            this.show = true;
        },
        getRowClear(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.latelyClear,
                    SessionKey:this.sessionkey,
                    fileId:this.id
                }
            }).then(res=>{
                this.show = false;
                this.getQuery();
            })
        },
        getSendOut(){
            this.handleFiles(this.files);
            const url = '/pages/email/writeMail/main';
            // const url = '/pages/publics/contacts/main?file='+'lately'+'&id='+this.id+'&method='+'file.share';
            wx.navigateTo({
                url:url
            })
            this.show = false;
        },
        getOpen(item){
            const openImgs = JSON.stringify([item.link]);
            openFiles(item,openImgs);
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/public.scss';
    .container{
        padding-bottom: 80px;
    }
    .content{
        background: #fff;
        display: flex;
        padding:0 20rpx;
        .img{
            padding:20rpx 0;
            p{
                width: 83rpx;
                height: 83rpx;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
        .cont{
            margin-left: 26rpx;
            flex: 1;
            display: flex;
            justify-content: space-between;
            border-bottom: 1rpx solid #f6f6f6;
            padding:20rpx 0;
            .title{
                font-size: 32rpx;
                color: #333333;
                padding-bottom: 21rpx;
            }
            .text{
                font-size: 24rpx;
                color: #999999;
            }
            .icon{
                .iconfont{
                    margin-top: 20rpx;
                    color: #a4a4a4;
                    font-size: 20px;
                    transform: rotate(90deg);
                }
            }
        }
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 20px;
        background: #fff;
        .btn{
            background: #fff;
            color: #3399ff;
            border: none;
            font-size: 33rpx;
        }
    }
    .popup{
        // padding: 0 30rpx;
        text-align: center;
        .overflows{
            width: 500rpx;
            margin: 0 auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        h3{
            font-size: 12px;
            color: #999999;
            padding: 20rpx 0;
        }
        p{
            padding:25rpx 0;
            font-size: 28rpx;
            border-top: 1rpx solid #e2e3e5;
        }
        .row{
            height: 16rpx;
            background: #eceded;
            border: none;
            padding: 0;
        }
    }
</style>