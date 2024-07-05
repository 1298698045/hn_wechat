<template>
    <div class="wrap">
        <div class="nav">
            <i-tabs :current="current" @change="handleChange">
                <i-tab key="tab1" title="我的文件"></i-tab>
                <i-tab key="tab2" title="共享文件"></i-tab>
                <i-tab key="tab3" title="单位文件"></i-tab>
            </i-tabs>
        </div>
        <div class="container">
            <div class="content">
                <div class="row" v-for="(item,index) in folders" :key="index" @click="getCopyFiles(item,'folders')">
                    <div class="lBox">
                        <p>
                            <img :src="photoUrl+'Folder.png'" alt="">
                        </p>
                    </div>
                    <div class="rBox">
                        <h3>{{item.name}}</h3>
                        <p>{{item.createdOn}}</p>
                    </div>
                </div>
                <div class="row" v-for="(item,index) in files" :key="index">
                    <div class="lBox">
                        <p>
                            <img :src="photoUrl+'Folder.png'" alt="">
                        </p>
                    </div>
                    <div class="rBox">
                        <h3>{{item.name}}</h3>
                        <p>{{item.createdOn}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="box">
                <p @click="getAddNewFolders">新建文件夹</p>
                <p @click="getSubmit">保存到当前目录</p>
            </div>
        </div>
        <newFolder v-if="newShow" :ParentId="ParentId" :newSign="newSign" @changeShow="changeShow" />
    </div>
</template>
<script>
import newFolder  from '../../../components/newFolder';
export default {
    components:{
        newFolder
    },
    data(){
        return {
            current:"tab1",
            folders:[],
            files:[],
            srchType:"",
            id:"",
            folderId:"",
            newShow:false,
            ParentId:"10010000-0000-0000-0000-000000000001",
            newSign:0,
            sessionkey:""
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.id = options.fileId;
        this.current = 'tab1';
        this.srchType = 'my';
        this.getQuery();
    },
    computed:{
        photoUrl(){
            return this.$api.photo.url;
        }
    },
    methods:{
        changeShow(isBook){
            this.newShow = isBook;
            this.files = [];
            this.folders = [];
            this.getQuery();
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            if(this.current=='tab1'){
                this.srchType = 'my';
                this.ParentId = '10010000-0000-0000-0000-000000000001';
            }else if(this.current=='tab2'){
                this.srchType = 'share'
                this.ParentId = '10010000-0000-0000-0000-000000000003';
            }else if(this.current=='tab3'){
                this.srchType = 'org'
                this.ParentId = '10010000-0000-0000-0000-000000000002';
            }
            this.getQuery();
        },
        getAddNewFolders(){
            this.newShow = true;
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.filesQuery,
                    SessionKey:this.sessionkey,
                    srchType:this.srchType,
                    sort:this.sort
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
        getCopyFiles(item,str){
            this.folderId = item.id;
            const url = '/pages/usbDrive/copyFile/main?folderId='+item.id+'&name='+item.name+'&copyFileId='+this.id+'&str='+this.str;
            wx.navigateTo({url:url});
        },
        getSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.copy",
                    SessionKey:this.sessionkey,
                    id:this.id,
                    folderId:this.folderId?this.folderId:'10010000-0000-0000-0000-000000000001'
                }
            }).then(res=>{
                console.log(res,'copy')
                wx.showToast({
                    title:res.msg,
                    icon:'success',
                    duration:2000
                })
            })
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
        .row{
            display: flex;
            background: #fff;
            padding:0 30rpx;
            align-items: center;
            .lBox{
                padding: 20rpx 0;
                p{
                    width: 80rpx;
                    height: 80rpx;
                    img{
                        width: 100%;
                        height: 100%;
                        vertical-align: middle;
                    }
                }
            }
            .rBox{
                flex: 1;
                margin-left: 20rpx;
                border-bottom: 1rpx solid #f6f6f6;
                padding: 20rpx 0;
                h3{
                    font-size: 28rpx;
                }
                p{
                    font-size: 12px;
                    color: #999999;
                }
            }
        }
        .row:last-child .rBox{
            border: none;
        }
    }
    .footer{
        width: 100%;
        position: fixed;
        bottom: 20px;
        background: #fff;
        .box{
            display: flex;
            justify-content: space-between;
            padding: 31rpx;
            color: #3399ff;
            font-size: 29rpx;
        }
    }
</style>