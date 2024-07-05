<template>
    <div class="wrap">
        <div class="header back">
            <van-search :value="value" placeholder="请输入搜索关键词" />
        </div>
        <!-- <div class="recyclebin" @click="getRouteBin">
            回收站：我在“我的文件”删除了6个文件
        </div> -->
        <div class="center back">
            <div class="rowWrap" @click="getLately">
                <p class="imgBox">
                    <img :src="photoUrl+'Lately_Files.png'" alt="">
                </p>
                <p class="text">最近使用</p>
            </div>
            <div class="rowWrap" @click="getMyFiles">
                <p class="imgBox">
                    <img :src="photoUrl+'My_Files.png'" alt="">
                </p>
                <p class="text">我的文件</p>
            </div>
            <div class="rowWrap" @click="getSharedFile">
                <p class="imgBox">
                    <img :src="photoUrl+'Shared_files.png'" alt="">
                </p>
                <p class="text">共享文件</p>
            </div>
        </div>
        <h3>单位文件</h3>
        <div class="content back">
            <div class="rowWrap" @click="getCompanyFile">
                <p class="imgBox">
                    <img :src="photoUrl+'Unit_file.png'" alt="">
                </p>
                <p class="text">{{organizationName || '单位文件'}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            value:"",
            files:[],
            folders:[],
            sessionkey:""
        }
    },
    computed:{
        photoUrl(){
            return this.$api.photo.url;
        },
        organizationName(){
            return wx.getStorageSync('organizationName');
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQueryCompanyFile();
    },
    methods:{
        getQueryCompanyFile(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.filesQuery,
                    SessionKey:this.sessionkey,
                    srchType:'org',
                    // sort:this.sort
                }
            }).then(res=>{
                console.log(res);
                this.files = res.files;
                this.folders = res.folders;
                this.files.forEach(item=>{
                    this.$set(item,'str',' files');
                    if(item.fileExtension=='jpg'){
                        this.imgList.push(item.link)
                    }
                })
                this.folders.forEach(item=>{
                    this.$set(item,'str',' folders');
                })
            })
        },
        getLately(){
            const url = '/pages/usbDrive/lately/main';
            wx.navigateTo({url:url});
        },
        getMyFiles(){
            const url = '/pages/usbDrive/myFile/main?srchType='+'my'+'&id='+'10010000-0000-0000-0000-000000000001'
            +'&canAdmin='+true+'&canCreate='+true;
            wx.navigateTo({url:url});
        },
        getSharedFile(){
            const url = '/pages/usbDrive/shareFile/main?srchType='+'share'+'&id='+'10010000-0000-0000-0000-000000000003';
            wx.navigateTo({url:url});
        },
        getCompanyFile(){
            const url = '/pages/usbDrive/shareFile/main?srchType='+'org'+'&id='+'10010000-0000-0000-0000-000000000002';
            wx.navigateTo({url:url});
        },
        // 回收站
        getRouteBin(){
            const url = '/pages/usbDrive/recycleBin/main';
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .back{
        background: #fff;
    }
    .recyclebin{
        background: #fff;
        padding: 20rpx 32rpx 31rpx 32rpx;
        color: #333333;
        font-size: 28rpx;
    }
    .center{ 
        padding: 20rpx;
        margin-top: 16rpx;
        .rowWrap{
            display: flex;
            padding: 17rpx 0;
            // border-bottom: 1rpx solid #efefef;
            .imgBox{
                width: 83rpx;
                height: 83rpx;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
            .text{
                line-height: 80rpx;
                margin-left: 20px;
                font-size: 34rpx;
                color: #333333;
            }
        }
    }
    h3{
        padding: 20rpx;
        font-size: 29rpx;
        color: #a1a5aa;
    }
    .content{
        padding: 20rpx;
        .rowWrap{
            display: flex;
            padding: 10rpx 0;
            // border-bottom: 1rpx solid #efefef;
            .imgBox{
                width: 80rpx;
                height: 80rpx;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
            .text{
                line-height: 80rpx;
                margin-left: 20px;
                font-size: 28rpx;
            }
        }
    }
</style>