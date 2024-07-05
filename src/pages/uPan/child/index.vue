<template>
    <div class="wrap">
        <div class="center">
            <div class="row" v-for="(item,index) in folders" :key="index" @click="getSeeDetail(item)">
                <div class="lBox">
                    <p>
                        <img src="https://oawx.hnca.org.cn/img/wechat/Folder.png" alt="">
                    </p>
                </div>
                <div class="rBox">
                    <p class="name">{{item.name}}</p>
                    <p class="time">{{item.createdOn}}</p>
                </div>    
            </div>  
            <div class="files">
                <van-checkbox-group :value="result" @change="onChange">
                    <van-checkbox custom-class="checkbox" :vlaue="item.checked" :name="item.id" v-for="(item,index) in files" :key="index">
                        <div class="rows">
                            <div class="lBox">
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
                            <div class="rBox">
                                <p class="name">{{item.name}}</p>
                                <p class="time">{{item.createdOn}}</p>
                            </div>    
                        </div>  
                    </van-checkbox>
                </van-checkbox-group>
            </div>  
        </div> 
        <div class="footer">
            <div class="boxBtn">
                <p class="num">
                    已选择:{{length}}
                    <i-icon type="unfold" color="#3399ff" size="20" />
                </p>
                <p class="btn" @click="getSubmit">确定</p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex';
export default {
    data(){
        return {
            result:[],
            sessionkey:"",
            files:[],
            folders:[],
            sort:"Name",
            imgList:[],
            srchType:"my",
            ParentId:"", // 共享文件 10010000-0000-0000-0000-000000000003 // 单位文件 10010000-0000-0000-0000-000000000002
        }
    },
    onShow(){
        const pages = getCurrentPages();
        const currPage = pages[pages.length-1]
        console.log('currpage:', currPage)
        if(currPage.options.ParentId!==undefined){
            this.ParentId = currPage.options.ParentId;
        }else {
            currPage.ParentId = this.ParentId;
        }
        this.getQuery();
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.ParentId = options.ParentId;
        this.srchType = options.srchType;
        // this.getQuery();
    },
    computed:{
        ...mapState({
            selectFiles:state=>{
                return state.usb.selectFiles;
            }
        }),
        length(){
            return this.selectFiles.length;
        },
        photoUrl(){
            return this.$api.photo.url;
        }
    },
    methods:{
        ...mapMutations([
            'handleFiles'
        ]),
        onChange(e){
            this.result = e.mp.detail;
            console.log(this.result);
            let selectData = [];
            for(var i=0; i<this.files.length; i++){
                this.files[i].checked = false;
                for(var j=0; j<this.result.length; j++){
                    if(this.files[i].id==this.result[j]){
                        this.files[i].checked = true;
                        selectData.push({
                            id:this.files[i].id,
                            name:this.files[i].name,
                            fileExtension:this.files[i].fileExtension,
                            link:this.files[i].link
                        });
                        break;
                    }
                }
            }
            this.handleFiles(selectData);
        },
        getSeeDetail(item){
            const url = '/pages/uPan/child/main?ParentId='+item.id+'&srchType='+this.srchType
            wx.navigateTo({url:url});
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"file.files.search",
                    SessionKey:this.sessionkey,
                    srchType:this.srchType,
                    sort:this.sort,
                    Folderid:this.ParentId
                }
            }).then(res=>{
                console.log(res);
                this.files = res.files;
                this.folders = res.folders;
                if(this.sort=='Name'){
                    this.files.forEach(item=>{
                        this.$set(item,'str',' files');
                        this.$set(item,'checked',false);
                        if(item.fileExtension=='jpg'){
                            this.imgList.push(item.link)
                        }
                    })
                    this.folders.forEach(item=>{
                        this.$set(item,'str',' folders');
                    })
                }else {
                    this.folders.forEach(item=>{
                        this.$set(item,'str',' folders');
                    })
                    this.files.forEach(item=>{
                        console.log(item,'---')
                        item.FileList.forEach(v=>{
                            this.$set(v,'str',' files');
                        })
                    })
                }
                console.log(this.files,'123132123');
            })
        },
        getSubmit(){
            console.log(this.selectFiles);
            wx.navigateBack({
                delta: 2
            })
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .center{
            background: #fff;
            .row{
                display: flex;
                align-items: center;
                padding: 0 33rpx;
                .lBox{
                    padding: 24rpx 0;
                    p{
                        width: 83rpx;
                        height: 83rpx;
                        // border: 1rpx solid #ccc;
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .rBox{
                    flex: 1;
                    padding: 24rpx 0;
                    margin-left: 25rpx;
                    border-bottom: 2rpx solid #f6f6f6;
                    .name{
                        font-size: 32rpx;
                        color: #333333;
                    }
                    .time{
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
            }
            .files{
                .checkbox{
                    align-items: center;
                    padding: 0 33rpx;
                    .rows{
                        display: flex;
                        align-items: center;
                        // padding: 24rpx 33rpx;
                        .lBox{
                            padding: 24rpx 0;
                            p{
                                width: 83rpx;
                                height: 83rpx;
                                // border: 1rpx solid #ccc;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    vertical-align: middle;
                                }
                            }
                        }
                        .rBox{
                            flex: 1;
                            width: 100vh;                          
                            margin-left: 25rpx;
                            padding: 24rpx 0;
                            border-bottom: 2rpx solid #f6f6f6;  
                            .name{
                                font-size: 32rpx;
                                color: #333333;
                                width: 300rpx;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .time{
                                font-size: 24rpx;
                                color: #999999;
                            }
                        }
                    }
                }
            }
        }
        .footer{
            position: fixed;
            bottom: 0;
            background: #fff;
            .boxBtn{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 13rpx 32rpx;
                .num{
                    font-size: 29rpx;
                    color: #3399ff;
                }
                .btn{
                    font-size: 26rpx;
                    color: #fff;
                    width: 110rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    text-align: center;
                    background: #3399ff;
                    border-radius: 7rpx;
                }
            }
        }
    }
</style>