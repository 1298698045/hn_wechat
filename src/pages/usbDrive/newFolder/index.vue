<template>
    <div class="wrap">
        <div class="filed">
            <van-field
                :value="name"
                :clearable="true"
                placeholder="输入文件夹名称"
                :border="false"
                @change="onChange"
            />
        </div>
        <div class="btnWrap">
            <van-button type="primary" custom-class="btn" @click="getSubmit" block>确定</van-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            name:"",
            method:"",
            fileId:"",
            sign:"",
            sessionkey:""
        }
    },
    onLoad(options){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.name = options.name;
        this.fileId = options.id;
        this.sign = options.sign;
        if(options.name){
            wx.setNavigationBarTitle({
                title: '修改文件夹名'
            })
            this.method = this.$api.usb.rename;
        }else {
            this.method = this.$api.usb.directoryCreate;
        }
    },
    methods:{
        onChange(e){
            this.name = e.mp.detail;
        },
        getSubmit(){
            if(this.sign=='rename'||this.sign=='share'){
                this.getRenameSubmit();
            }else if(this.sign=='child'){
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.usb.directoryCreate,
                        SessionKey:this.sessionkey,
                        Name:this.name,
                        ParentId:this.fileId                  
                    }
                }).then(res=>{
                    console.log(res);
                    wx.showToast({
                        title:res.msg,
                        icon:'none',
                        duration:2000
                    })
                })
            }else {
                this.$httpWX.get({
                    url:this.$api.message.queryList,
                    data:{
                        method:this.$api.usb.directoryCreate,
                        SessionKey:this.sessionkey,
                        Name:this.name                    
                    }
                }).then(res=>{
                    console.log(res);
                    wx.showToast({
                        title:res.msg,
                        icon:'none',
                        duration:2000
                    })
                })
            }
        },
        getRenameSubmit(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.usb.rename,
                    SessionKey:this.sessionkey,
                    Id:this.fileId,
                    name:this.name                    
                }
            }).then(res=>{
                console.log(res);
                wx.showToast({
                    title:res.msg,
                    icon:'none',
                    duration:2000
                })
            })
        }
    }
}
</script>
<style lang="scss">
    .filed{
        margin-top: 20rpx;
        padding: 0 10rpx;        
    }
    .btnWrap{
        margin-top: 20rpx;
        padding: 30rpx;
        .btn{
            background: #3399ff;
            border: none;
        }
    }
</style>