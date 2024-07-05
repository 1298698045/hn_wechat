<template>
    <div class="wrap">
        <div class="text">
            <textarea v-model="content" maxlength="500" placeholder-class="placeholder" name="" id="" cols="50" rows="10" placeholder="请输入投票主题"></textarea>
            <span>{{contentSize}}/{{totalCount}}</span>
        </div>
        <div class="center">
            <div class="box_wrap">
                <div class="box" v-for="(item,index) in list" :key="index">
                    <div class="row">
                        <p class="photo" @click="getOpenPhoto(item,index)">
                            <i class="iconfont icon-jiahao" v-if="item.img==''"></i>
                            <img v-else :src="item.img" alt="">
                        </p>
                        <p class="inp">
                            <input placeholder-class="place" v-model="item.option" type="text" placeholder="请输入选项">
                        </p>
                        <p class="del" v-if="index>1" @click="getDel(item,index)">-</p>
                    </div>
                    <div class="row">
                        <p class="name">描述</p>
                        <p class="inp">
                            <input placeholder-class="place" v-model="item.Description" type="text" placeholder="请输入描述">
                        </p>
                    </div>
                </div>
                <div class="btn" @click="getAddSel">
                    <i class="iconfont icon-tianjia"></i>
                    添加选项
                </div>
            </div>
            <div class="row_box" @click="getInvitation">
                <p>
                    {{value}}
                </p>
                <p>
                    <i-icon type="enter" size="20" color="#666666" />
                </p>
            </div>
            <div class="switch_wrap">
                <div class="row">
                    <p>
                        允许补充其他选项
                    </p>
                    <p>
                        <switch :checked="checked" type="switch" @change="changeSwitch"></switch>
                    </p>
                </div>
                <div class="row">
                    <p>
                        允许多选
                    </p>
                    <p>
                        <switch :checked="isSelect" @change="changeSelect"></switch>
                    </p>
                </div>
                <div class="row" v-if="isSelect">
                    <p>
                        最多可选
                    </p>
                    <p>
                        <van-stepper :value="1" min="1" max="8" @change="changeStrpper" />
                    </p>
                </div>
                <picker class="picker" mode="multiSelector" :value="multiIndex" @change="bindMultiPickerChange"
				 :range="newMultiArray">
                    <div class="row">
                        <p>截止时间</p>
                        <p class="sel" :class="{'active':time!=''}">
                            {{time?time:'请选择'}}
                            <i-icon type="enter" size="20" color="#666666" />
                        </p>
                    </div>
                </picker>
                <div class="row">
                    <p>
                        公开结果
                    </p>
                    <p>
                        <switch :checked="isPublic" @change="changePublic"></switch>
                    </p>
                </div>
            </div>
        </div>
        <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <div class="box">
                <p class="pre" :class="{'active':isBook}" @click="getPreview">
                    预览
                </p>
                <p class="create" :class="{'active':isBook}" @click="getSubmit">
                    创建投票
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { message } from '@/utils/message';
export default {
    data(){
        return {
            content:"",
            totalCount:500,
            checked:false,
            multiIndex: [ 0, 0, 0, 0, 0 ],
            list:[
                {
                    img:"",
                    option:"",
                    Description:"",
                    polloptionid:""
                },
                {
                    img:"",
                    option:"",
                    Description:"",
                    polloptionid:""
                }
            ],
            time:"",
            isSelect:false,
            isPublic:false,
            pollid:"",
            detail:{}
        }
    },
    computed:{
        contentSize(){
            return this.content.length || 0;
        },
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        newMultiArray: () => {
            let array = [];
            const date = new Date();
            const years = [];
            const months = [];
            const days = [];
            const hours = [];
            const minutes = [];
            var d = new Date();
            var y = d.getFullYear();
            for ( let i = y; i <= date.getFullYear() + 10; i++ ) {
                years.push( "" + i+'年' );
            }
            array.push( years );
            for ( let i = 1; i <= 12; i++ ) {
                if ( i < 10 ) {
                    i = "0" + i;
                }
                months.push( "" + i+'月' );
            }
            array.push( months );
            for ( let i = 1; i <= 31; i++ ) {
                if ( i < 10 ) {
                    i = "0" + i;
                }
                days.push( "" + i+'日' );
            }
            array.push( days );
            for ( let i = 0; i < 24; i++ ) {
                if ( i < 10 ) {
                    i = "0" + i;
                }
                hours.push( "" + i+'时' );
            }
            array.push( hours );
            for ( let i = 0; i < 60; i++ ) {
                if ( i < 10 ) {
                    i = "0" + i;
                }
                minutes.push( "" + i+'分' );
            }
            array.push( minutes );
            return array;
        },
        ...mapState({
            selectListName:state=>{
                return state.mailList.selectListName;
            }
        }),
        value(){
            return this.selectListName!=''?'邀请'+this.selectListName[0].FullName+'等'+this.selectListName.length+'人':'邀请参与人'
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        PollType(){
            return this.isSelect?1:0;
        },
        options(){
            let temp = [];
            let i = 0;
            this.list.forEach(item=>{
                i++
                if(item.option!=''){
                    temp.push({
                        polloptionid:item.polloptionid,
                        sortNumber:i,
                        option:item.option,
                        Description:item.Description
                    })
                }
            })
            console.log(temp,'temp')
            return temp;
        },
        peoples(){
            let temp = [];
            this.selectListName.forEach(item=>{
                temp.push(item.id)
            })
            return temp.join(',');
        },
        isBook(){
            let bol = false;
            if(this.content==''){
                return false;
            }else if(this.options==''){
                return false;
            }else if(this.options.length<2){
                return false;
            } else {
                this.options.forEach(item=>{
                    if(item.option==''){
                        return false;
                    }else {
                        bol = true;
                    }
                })
            }
            return bol;
        },
        TotalPeoples(){
            return this.selectListName.length;
        }
    },
    onUnload(){
        this.getClear([]);
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.pollid = options.pollid;
        let date = new Date();
        let years = date.getFullYear();
        let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1;
        let d = date.getDate()<10?'0'+date.getDate():date.getDate();
        let hours = date.getHours()<10?'0'+date.getHours():date.getHours();
        let minutes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
        let s = date.getSeconds();
        let startTime = `${years}-${month}-${d} ${hours}:${minutes}`;
        this.time = startTime;
        this.getCurrent(this.time);
        if(options.pollid){
            this.getDetail();
            this.getPeoples();
        }
    },
    methods:{
        getDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.getpoll,
                    SessionKey:this.sessionkey,
                    id:this.pollid
                }
            }).then(res=>{
                console.log(res);
                this.detail = res.data;
                this.content = res.data.Title;
                this.list = res.data.Options;
                this.list.forEach(item=>{
                    this.$set(item,'option',item.Option)
                    this.$set(item,'checked',false);
                })
                this.isSelect = res.data.PollType==0?false:true;
                this.IsPublic = res.data.IsPublic;
            })
        },
        getPeoples(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.peopleList,
                    SessionKey:this.sessionkey,
                    Pollid:this.pollid
                }
            }).then(res=>{
                console.log(res);
                let temp = res.listData.map(item=>({
                    id:item.UserId,
                    FullName:item.FullName
                }))
                this.getListName(temp);
            })
        },
        ...mapMutations(['getClear','getListName']),
        getCurrent(time){
            let date = new Date(time.replace(/-/g,'/'));
            let years = date.getFullYear();
            let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1;
            let d = date.getDate()<10?'0'+date.getDate():date.getDate();
            let hours = date.getHours()<10?'0'+date.getHours():date.getHours();
            let minutes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();

            const yIdx = this.newMultiArray[0].findIndex(item=>item==years+'年');
            const mIdx = this.newMultiArray[1].findIndex(item=>item==month+'月');
            const dIdx = this.newMultiArray[2].findIndex(item=>item==d+'日');
            const hIdx = this.newMultiArray[3].findIndex(item=>item==hours+'时');
            const minIdx = this.newMultiArray[4].findIndex(item=>item==minutes+'分');
            this.multiIndex[0] = yIdx;
            this.multiIndex[1] = mIdx;
            this.multiIndex[2] = dIdx;
            this.multiIndex[3] = hIdx;
            this.multiIndex[4] = minIdx;
        },
        getAddSel(){
            this.list.push({
                img:"",
                select:"",
                content:""
            })
        },
        changeSwitch(e){
            this.checked = e.mp.detail.value;
        },
        changeSelect(e){
            this.isSelect = e.mp.detail.value;
        },
        bindMultiPickerChange(e){
            this.multiIndex = e.target.value;
            const index = this.multiIndex;
            const year = this.newMultiArray[ 0 ][ index[ 0 ] ];
            const month = this.newMultiArray[ 1 ][ index[ 1 ] ];
            const day = this.newMultiArray[ 2 ][ index[ 2 ] ];
            const hour = this.newMultiArray[ 3 ][ index[ 3 ] ];
            const minute = this.newMultiArray[ 4 ][ index[ 4 ] ];
            this.time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
            this.time = this.RemoveChinese(this.time)
        },
        RemoveChinese(strValue) {  
            if(strValue!= null && strValue != ""){  
                var reg = /[\u4e00-\u9fa5]/g;   
               return strValue.replace(reg, "");   
            }  
            else  
                return "";  
        },
        getOpenPhoto(item,index){
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success (res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    item.img = tempFilePaths[0];
                    let url = `${that.$api.upload.url}?method=${that.$api.vote.upload}&SessionKey=${that.sessionkey}`
                    wx.uploadFile({
                        url: url,
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success (res){
                            console.log(res);
                            const data = JSON.parse(res.data);
                            console.log(data,'data')
                            item.polloptionid = data.parentId;
                            console.log(that.list);
                        }
                    })
                }
            })
        },
        getDel(item,index){
            this.list.splice(index,1);
        },
        // 邀请参与人
        getInvitation(){
            const url = '/pages/publics/mailList/main';
            wx.navigateTo({url:url});
        },
        ...mapMutations([
            'getVote' 
        ]),
        // 预览
        getPreview(){
            if(this.content==''){
                wx.showToast({
                    title:'请输入你的投票主题',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(this.options==''){
                 wx.showToast({
                    title:'最少输入两个选项',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(this.options.length<2){
                wx.showToast({
                    title:'最少输入两个选项',
                    icon:'none',
                    duration:2000
                })
                return false;
            } else {
                this.options.forEach(item=>{
                    if(item.option==''){
                        wx.showToast({
                            title:'请输入你的选项',
                            icon:'none',
                            duration:2000
                        })
                        return false;
                    }
                })
            }
            let obj = {
                id:this.pollid,
                content:this.content,
                PollType:this.PollType,
                closeTime:this.time,
                isPublic:this.isPublic,
                TotalPeoples:this.TotalPeoples,
                StatusCode:1,
                options:this.options,
                peoples:this.peoples,
                CreatedByName:wx.getStorageSync('fullName')
            }
            this.getVote(obj);
            const url = '/pages/vote/preview/main';
            wx.navigateTo({url:url});
        },
        changeStrpper(e){
            console.log(e);
        },
        changePublic(e){
            this.isPublic = e.mp.detail.value;
        },
        getSubmit(){
            if(this.content==''){
                wx.showToast({
                    title:'请输入你的投票主题',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(this.options==''){
                 wx.showToast({
                    title:'最少输入两个选项',
                    icon:'none',
                    duration:2000
                })
                return false;
            }else if(this.options.length<2){
                wx.showToast({
                    title:'最少输入两个选项',
                    icon:'none',
                    duration:2000
                })
                return false;
            } else {
                this.options.forEach(item=>{
                    if(item.option==''){
                        wx.showToast({
                            title:'请输入你的选项',
                            icon:'none',
                            duration:2000
                        })
                        return false;
                    }
                })
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.create,
                    SessionKey:this.sessionkey,
                    id:this.pollid?this.pollid:'',
                    poll:{
                        PollType:this.PollType,
                        title:this.content,
                        closeTime:this.time,
                        isPublic:this.isPublic,
                        TotalPeoples:this.TotalPeoples,
                        CreatedByName:this.CreatedByName,
                        StatusCode:1,
                        options:this.options
                    },
                    peoples:this.peoples
                }
            }).then(res=>{
                if(res.status==1){
                    message.toast({
                        title:res.msg,
                        delta:1
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
@import '../../../../static/css/vote.css';
    .wrap{
        .text{
            width: 100%;
            height: auto;
            background: #fff;
            textarea{
                width: 100%;
                padding: 38rpx 33rpx;
            }
            .placeholder{
                font-size: 34rpx;
                color: #ccc;
            }
            span{
                display: block;
                text-align: right;
                color: #ababab;
                font-size: 28rpx;
                padding: 0 33rpx 30rpx 0;
            }
        }
        .center{
            padding-bottom: 100px;
            .box_wrap{
                margin-top: 24rpx;
                width: 100%;
                background: #fff;
                .box{
                    border-bottom: 1rpx solid #e2e3e5;
                    .row{
                        display: flex;
                        align-items: center;
                        padding: 32rpx 33rpx;
                        .photo{
                            width: 73rpx;
                            height: 73rpx;
                            background: #f7f7f7;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            i{
                                color: #bfbfbf;
                            }
                            img{
                                width: 100%;
                                height: 100%;
                                vertical-align: middle;
                            }
                        }
                        .inp{
                            margin-left: 22rpx;
                            flex: 1;
                            input{
                                font-size: 31rpx;
                            }
                            .place{
                                font-size: 31rpx;
                                color: #ccc;
                            }

                        }
                        .del{
                            width: 38rpx;
                            height: 38rpx;
                            line-height: 38rpx;
                            text-align: center;
                            border-radius: 50%;
                            border: 1rpx solid #ff6666;
                            color: #ff6666;
                        }
                        .name{
                            font-size: 34rpx;
                            color: #333333;
                        }
                    }
                }
                .btn{
                    text-align: center;
                    color: #3399ff;
                    padding: 26rpx 0;
                    font-size: 34rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    i{
                        margin-right: 10rpx;
                    }
                }
            }
            .row_box{
                display: flex;
                justify-content: space-between;
                align-content: center;
                padding: 30rpx 33rpx;
                font-size: 34rpx;
                color: #333333;
                background: #fff;
                margin-top: 24rpx;
            }
            .switch_wrap{
                width: 100%;
                background: #fff;
                margin-top: 24rpx;
                .row{
                    display: flex;
                    align-content: center;
                    justify-content: space-between;
                    padding: 30rpx 33rpx;
                    font-size: 34rpx;
                    border-bottom: 1rpx solid #e2e3e5;
                    .sel{
                        color: #cccccc;
                    }
                    .sel.active{
                        color: #333333;
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            z-index: 999;
            .box{
                display: flex;
                justify-content: space-around;
                padding: 25rpx 0;
                p{
                    width: 331rpx;
                    height: 85rpx;
                    line-height: 85rpx;
                    text-align: center;
                    font-size: 34rpx;
                    border-radius: 5rpx;
                }
                .pre{
                    background: #f8f8f8;
                    color: #333333;
                    opacity: .4;
                }
                .create{
                    background: #3399ff;
                    color: #ffffff;
                    opacity: .4;
                }
                .pre.active{
                    opacity: 1;
                }
                .create.active{
                    opacity: 1;
                }
            }
        }
    }
</style>