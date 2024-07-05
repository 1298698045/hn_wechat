<template>
    <div class="wrap">
        <van-popup
            :show="newFolderShow"
            position="center"
            custom-style="width:80%;height:auto;border-radius:7rpx;"
            @close="getOnClose"
        >
            <div class="popupContent">
                <!-- <h3 class="overflow">{{sign==1?fileName:'新建文件夹'}}</h3> -->
                <h3 class="overflow">{{str=='folders'?'修改文件夹名':str=='files'?'修改文件名':'新建文件夹'}}</h3>
                <p class="tips">{{sign==1?'请输入新命名':'请输入文件夹名称'}}</p>
                <div class="inpWrap">
                    <input class="inp" v-model="name" type="text" selection-start="10">
                </div>
                <div class="footers">
                    <p @click="getOnClose">取消</p>
                    <p @click="getConfirm">确定</p>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    name:"newFolder",
    props:['fileName','newSign','fileId','str','ParentId'],
    data(){
        return {
            newFolderShow:true,
            name:'',
            sign:'',
            sessionkey:""
        }
    },
    onLoad(){
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.name = this.fileName;
        this.sign = this.newSign;
        console.log(this.newSign);
    },
    methods:{
        getOnClose(){
            this.newFolderShow = false;
            this.$emit('changeShow',false);
        },
        getConfirm(){
            if(this.sign==0){
                this.$httpWX.get({
                   url:this.$api.message.queryList,
                   data:{
                       method:"file.directory.create",
                       SessionKey:this.sessionkey,
                       Name:this.name,
                       ParentId:this.ParentId                  
                   }
               }).then(res=>{
                   console.log(res);
                   wx.showToast({
                       title:res.msg,
                       icon:'none',
                       duration:2000
                   })
                   this.newFolderShow = false;
                   this.$emit('changeShow',false);
               })
            }else if(this.sign==1){//重命名
                if(this.str=='folders'){
                    this.$httpWX.get({
                       url:this.$api.message.queryList,
                       data:{
                           method:"file.directoryinfo.rename",
                           SessionKey:this.sessionkey,
                           Name:this.name,
                           Id:this.fileId                  
                       }
                   }).then(res=>{
                        console.log(res);
                        wx.showToast({
                            title:res.msg,
                            icon:'none',
                            duration:2000
                        })
                        this.newFolderShow = false;
                        this.$emit('changeShow',false);
                   })
                }else if(this.str=='files'){
                    this.$httpWX.get({
                       url:this.$api.message.queryList,
                       data:{
                           method:"file.fileinfo.rename",
                           SessionKey:this.sessionkey,
                           Name:this.name,
                           Id:this.fileId                  
                       }
                   }).then(res=>{
                        console.log(res);
                        wx.showToast({
                            title:res.msg,
                            icon:'none',
                            duration:2000
                        })
                        this.newFolderShow = false;
                        this.$emit('changeShow',false);
                   })
                }
            }
            
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .popupContent{
            .overflow{
                width: 100%;
            }
            h3{
                color: #333333;
                font-size: 33rpx;
                text-align: center;
                padding-top: 42rpx;
            }
            .tips{
                color: #999999;
                font-size: 25rpx;
                text-align: center;
                padding: 15rpx 0;
            }
            .inpWrap{
                padding: 0 37rpx 20rpx 37rpx; 
                .inp{
                    height: 69rpx;
                    line-height: 69rpx;
                    border: 1rpx solid #aaaaaa;
                    border-radius: 12rpx;
                }
            }
            .footers{
                background: #fff;
                border-top: 1rpx solid #aaaaaa;
                display: flex;
                color: #3399ff;
                font-size: 31rpx;
                p{
                    flex: 1;
                    text-align: center;
                    height: 100rpx;
                    line-height: 100rpx;
                }
                p:nth-child(1){
                    border-right: 1rpx solid #aaaaaa;
                }
            }
        }
    }
</style>