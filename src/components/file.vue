<template>
    <div class="wrap">
        <div class="headerWrap">
            <div class="fileHeader">
                <p>
                    名称排序
                    <i-icon type="unfold" />
                </p>
                <p class="icon">
                    <span @click="getTypesetting"><i class="iconfont icon-liebiaoxianshi"></i></span>
                    <span @click="getCheck"><i class="iconfont icon-duoxuanti"></i></span>
                </p>
            </div>
        </div>
        <div class="center" v-if="!show" @click.stop>
            <van-checkbox-group :value="resultList" @change="changeCheckbox">
                <div class="imgList">
                    <div class="box" v-for="(item,index) in list" :key="index">
                        <div class="imgs" v-if="item.list!=''"  @click.stop="getPreview(item)">
                            <image class="img" :src="item.link" alt="" webp="true"></image>
                        </div>
                        <div class="cont" else >
                            <p class="name">{{item.name}}</p>
                            <p class="num">{{'31.2MB'}}</p>
                        </div>
                        <van-checkbox v-if="isCheck" custom-class="check" :name="item.id"></van-checkbox>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
        <div class="container" v-if="show" @click.stop>
            <van-checkbox-group :value="resultList" @change="changeCheckbox">
                <div class="box" v-for="(item,index) in list" :key="index">
                    <div class="checkWrap" v-if="isCheck">
                        <van-checkbox custom-class="check" :name="item.id"></van-checkbox>                        
                    </div>
                    <div class="lBox" v-if="item.list!=''" @click.stop="getPreview(item)">
                        <p>
                            <image class="img" :src="item.link" alt="" webp="true"></image>
                        </p>
                    </div>
                    <div class="rBox" else >
                        <div class="text">
                            <p>{{item.name}}</p>
                            <p>2{{item.createdOn}}   31.2MB</p>
                        </div>
                        <p class="icon">
                            <i-icon type="more" size="20" />
                        </p>
                    </div>
                </div>
            </van-checkbox-group>
        </div>
         <div class="bottomWrap" v-if="isCheck&&list!=''">
            <div>
                <p @click="cancalEdit">取消</p>
                <p @click="getAllelection">全选</p>
                <p :class="{'active':resultList!=''}" @click="getDelete">删除</p>
            </div>
        </div>
        <div class="clues-add-button" v-if="!isCheck&&!sheetShow&&draft=='true'" @click="onCluesAddBtnClick">
            <van-icon name="plus" size="20" color="#fff" />
        </div>
         <van-action-sheet
            :show=" sheetShow "
            :round="false"
            z-index="99999"
            cancel-text="取消"
            :actions="actions"
            @close="onClose"
            @cancel="onClose"
            @select="onSelect"
        >
            <div class="sheetWrap">
                <p class="title">
                    更多操作
                </p>
                <p class="row" @click="getChooseImage">相册</p>
                <p class="row" @click="getUpan">优盘</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex';
import getOpenFiles from '@/utils/openFiles';
export default {
    name:"File",
    props:['instanceId','processInstanceId','draft'],
    data(){
        return {
            show:false,
            list:[
                // {
                //     img:"",
                //     name:"新技术新项目中期....docx",
                //     num:"104K"
                // },
                // {
                //     img:"",
                //     name:"新技术新项目中期....docx",
                //     num:"104K"
                // },
                // {
                //     img:"https://oawx.hnca.org.cn/img/wechat/logo.png",
                //     name:"",
                //     num:"104K"
                // },
                // {
                //     img:"https://oawx.hnca.org.cn/img/wechat/logo.png",
                //     name:"",
                //     num:"104K"
                // },
                // {
                //     img:"https://oawx.hnca.org.cn/img/wechat/logo.png",
                //     name:"",
                //     num:"104K"
                // },
                // {
                //     img:"",
                //     name:"新技术新项目中期....docx",
                //     num:"104K"
                // },
                // {
                //     img:"",
                //     name:"新技术新项目中期....docx",
                //     num:"104K"
                // }
            ],
            resultList:[],
            isCheck:false,
            sheetShow:false,
            sessionkey:"",
            isSwitch:false
        }
    },
    onLoad(){
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.getFileQuery();
    },
    onShow(){
        if(!this.isSwitch){
            this.list = this.list.concat(this.selectFiles);
        }
    },
    computed:{
        ...mapState({
            selectFiles:state=>{
                return state.usb.selectFiles;
            }
        }),
        openImgs(){
            let temp = [];
            console.log(this.list,'list')
            this.list.forEach(item=>{
                console.log(item.fileExtension,'fileExtension')
                if(item.fileExtension.indexOf('jpg')!=-1||item.fileExtension.indexOf('png')!=-1){
                    temp.push(item.link);
                }
            })
            return temp;
        },
    },
    methods:{
        getPreview(item){
            this.isSwitch = true;
            const openImgs = JSON.stringify(this.openImgs);
            getOpenFiles(item,openImgs);
        },
        ...mapMutations([
            'delete'
        ]),
        getUpan(){
            const url = '/pages/uPan/main';
            wx.navigateTo({url:url});
        },
        getFileQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.instance.attachfile.getlist",
                    SessionKey:this.sessionkey,
                    id:this.instanceId
                }
            }).then(res=>{
                console.log("附件",res);
                this.list = res.listData;
                this.list = this.list.concat(this.selectFiles);
            })
        },
        changeCheckbox(e){
            this.resultList = e.mp.detail;
        },
        getCheck(){
            this.isCheck = !this.isCheck;
        },
        cancalEdit(){
            this.resultList = [];
            this.isCheck = false;
        },
        getAllelection(){
            this.list.forEach(item=>{
                this.resultList.push(item.id);
            })
        },
        getTypesetting(){
            this.show = !this.show;
        },
        onCluesAddBtnClick(){
            this.sheetShow = true;
        },
        onClose(){
            this.sheetShow = false;
        },
        getChooseImage(){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    console.log(res);
                    // tempFilePath可以作为img标签的src属性显示图片
                    
                    const tempFilePaths = res.tempFilePaths;
                    wx.uploadFile({
                        url: "https://oawx.hnca.org.cn/rest?method="+'flow.files.upload'+'&SessionKey=' + that.sessionkey+'&pid='+that.instanceId+'&objTypeCode='+'123',
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            console.log(res);
                            const data = res.data
                            that.sheetShow = false;
                            //do something
                            that.getFileQuery();
                        }
                    })
                }
            })
        },
        // 删除
        getDelete(){
            console.log(this.resultList);
            let arr = [];
            for(var i=0;i<this.resultList.length;i++){
                arr.push(i);
                let id = this.resultList[i];
                // let name = 'sign'+i;
                this.resultList[i] = new Promise((resolve, reject) => {
                    this.$httpWX.get({
                        url:this.$api.message.queryList,
                        data:{
                            method:"entity.info.delete",
                            SessionKey:this.sessionkey,
                            Id:id,
                            ObjTypeCode:1001
                        }
                    }).then(res=>{
                        resolve(res);
                        // console.log(res);
                    })
                })
            }
            Promise.all(this.resultList).then(res=>{
                console.log(res,'12321323131');
                this.isCheck = false;
                this.getFileQuery();
            }).catch(err=>{
                console.log(err,'1231323');
            })
        }

    }
}
</script>
<style lang="scss">
    @import '../../static/css/public.scss';
    .wrap{
        .headerWrap{
            width: 100%;
            .fileHeader{
                padding: 20rpx ;
                background: #fff;
                display: flex;
                font-size: 12px;
                justify-content:space-between;
                align-items: center;
                .icon{
                    display: flex;
                    i{
                        color: #3399ff;
                    }
                    span:nth-child(1){
                        i{
                            margin-right: 50rpx;
                        }
                    }
                }
            }
        }
        .container{
            background: #fff;
            padding: 20rpx;
            .box:last-child .rBox{
                border: none;
            }
            .box{
                width: 100%;
                display: flex;
                .checkWrap{
                    width: 30px;
                    .check{
                        margin-top: 10px;
                    }
                }
                .lBox{
                    p{
                        width: 80rpx;
                        height: 80rpx;
                        .img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                }
                .rBox{
                    width: 100%;
                    flex: 1;
                    margin-left: 20rpx;
                    overflow: hidden;
                    display: flex;
                    padding: 20rpx 0;
                    justify-content: space-between;
                    border-bottom: 1rpx solid #f6f6f6;
                    .text{
                        p:nth-child(1){
                            font-size: 28rpx;
                            color: #333;
                        }
                        p:nth-child(2){
                            font-size: 12px;
                            color: #999999;
                        }
                    }
                    .icon{

                    }
                }
            }
        }
        .center{
            background: #fff;
            .imgList{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                // justify-content: space-around;
                .box{
                    width: 230rpx;
                    height: 230rpx;
                    background: #dce1e4;
                    margin: 10rpx ;
                    position: relative;
                    .imgs{
                        width: 100%;
                        height: 100%;
                        .img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    .cont{
                        padding: 10rpx;
                        font-size: 28rpx;
                        color: #fff;
                        .name{
                            width: 200rpx;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            position: absolute;
                            top: 0;
                        }
                        .num{ 
                            position: absolute;
                            bottom: 0;
                        }
                    }
                    .check{
                        position: absolute;
                        top: 10rpx;
                        right: 10rpx;
                        background: ccc;
                    }
                }
            }
        }
        .bottomWrap{
            width: 100%;
            position: fixed;
            bottom: 50px;
            background: #fff;
            bottom: 190rpx;
            div{
                display: flex;
                padding: 20rpx 0;
                p{
                    flex: 1;
                    text-align: center;
                    font-size: 28rpx;
                    color: #3399ff;
                }
                p:nth-child(3){
                    color: #ff6666;
                    opacity: .5;
                }
                p:nth-child(3).active{
                    color: #ff6666;
                    opacity: 1;
                }
            }
        }
        .sheetWrap{
            width: 100%;
            .title{
                text-align: center;
                font-size: 22rpx;
                color: #999999;
                padding: 13rpx 0;
            }
            .row{
                text-align: center;
                padding: 26rpx 0;
                font-size: 33rpx;
                color: #3399ff;
                border-top: 1rpx solid #eceeed
            }
        }
    }
</style>