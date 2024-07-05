<template>
    <div class="wrap">
        <i-tabs :current="current" @change="handleChange">
            <i-tab key="tab1" title="待投票"></i-tab>
            <i-tab key="tab2" title="我创建的"></i-tab>
            <i-tab key="tab3" title="已结束"></i-tab>
        </i-tabs>
        <div class="center" v-if="listData!=''">
            <div class="content" v-for="(item,index) in listData" :key="index" @click="getDetail(item)">
                <div class="heads">
                    <div class="Avatar">
                        {{item.OwningUserName}}
                    </div>
                    <div class="info">
                        <div class="r">
                            <p class="name">
                                {{item.OwningUserName}}
                            </p>
                            <p class="more" @click.stop="getMore(item)">
                                <i-icon type="more" color="#666666" size="20" />
                            </p>
                        </div>
                        <p class="text">信息中心 {{item.CreatedOn}}</p>
                    </div>
                </div>
                <h3>
                    {{item.Poll.Title}}
                </h3>
                <div class="cont_wrap" v-if="!item.Poll.HasPolled">
                    <div class="icon-text">
                        <p>
                            <i class="iconfont icon-shijian-copy"></i>
                            <span>
                                 {{item.Poll.CloseTime}} 截止
                            </span>
                        </p>
                        <p @click.stop="getInvitees(item)">
                            <i class="iconfont icon-canyuren"></i>
                            <span>
                                {{item.Poll.AllowVoteQty}}人参与
                            </span>
                        </p>
                    </div>
                    <div class="sign">
                        {{item.Poll.PollType==0?'选项（单选）':'选项（最多可选5项）'}}
                        
                    </div>
                    <div class="max_radioWrap" v-if="item.Poll.PollType==0">
                        <div class="radio_wrap" @click.stop>
                            <van-radio-group v-model="radio" @change="(e)=>{changeRadio(e,index)}">
                                <van-radio v-for="(v,i) in item.Poll.Options" :key="i" custom-class="radio" :name="v.PollOptionId">{{v.SortNumber}}.{{v.Option}}</van-radio>
                                <!-- <van-radio custom-class="radio" name="2">单选框 2</van-radio> -->
                            </van-radio-group>
                        </div>
                        <div class="voteBtn" :class="{'active':radio!=''&&numActive==index}" @click.stop="radio!=''&&numActive==index?getVote(item):''">
                            投票
                        </div>
                    </div>
                    <div class="max_checkboxWrap"  v-if="item.Poll.PollType==1">
                        <div class="checkbox_wrap" @click.stop>
                            <van-checkbox-group :value="result" @change="(e)=>{onChange(e,index)}">
                                <van-checkbox shape="square" custom-class="check" :value="v.checked" :name="v.PollOptionId" v-for="(v,i) in item.Poll.Options" :key="i">
                                    <div class="row">
                                        <div>
                                            {{v.SortNumber}}.
                                        </div>
                                        <div class="radius"></div>
                                        <div>
                                            <p class="name">{{v.Option}}</p>
                                            <p class="deparment">{{v.Description}}</p>
                                        </div>
                                    </div>
                                </van-checkbox>
                            </van-checkbox-group>
                        </div>
                        <div class="voteBtn" :class="{'active':result!=''&&numActive==index}"  @click.stop="getVote(item)">
                            投票
                        </div>
                    </div>
                    
                </div>
                <div class="create_wrap" v-if="item.Poll.HasPolled">
                    <div class="row_text">
                        <p>
                            <i class="iconfont icon-shijian-copy"></i>
                            <span>
                                 {{item.Poll.CloseTime}} 截止
                            </span>
                        </p>
                        <p @click.stop="getInvitees(item)">
                            <i class="iconfont icon-canyuren"></i>
                            <span>
                                {{item.Poll.AllowVoteQty}}人参与
                            </span>
                        </p>
                    </div>
                    <div class="sign_title">
                        {{item.Poll.PollType==0?'选项（单选）':'选项（最多可选5项）'}}
                    </div>
                    <div class="row" v-for="(v,i) in item.Poll.Options" :key="i">
                        <div class="l">
                            {{v.SortNumber}}.
                        </div>
                        <div class="c">
                            <p class="text">{{v.Option}}(已选)</p>
                            <div class="mBom">
                                <p class="progress">
                                    <span :class="{'active':current=='tab3'}" :style="{width:v.widthNum+'rpx',background:colorList[i]}"></span>
                                </p>
                                <p class="num">
                                    <span>
                                        {{v.PollQty}}票
                                    </span>
                                    <span>
                                        {{v.num}}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div class="r">
                            <i-icon type="enter" size="20" color="#666666" />
                        </div>
                    </div>

                    <div class="voteBtn" @click="!item.Poll.HasPolled?getVote(item):''">
                        {{item.Poll.HasPolled?'你已投票':'投票'}}
                    </div>
                </div>
            </div>

            <!--  -->
            <!-- <div class="content">
                <div class="heads">
                    <div class="Avatar">
                        崔曼
                    </div>
                    <div class="info">
                        <div class="r">
                            <p class="name">
                                崔曼
                            </p>
                            <p  @click="getMore">
                                <i-icon type="more" color="#666666" size="20" />
                            </p>
                        </div>
                        <p class="text">信息中心 04-04  10:30</p>
                    </div>
                </div>
                <h3>
                    医院里哪个科的医生最优秀？
                </h3>
                <div class="cont_wrap" v-if="current=='tab1'">
                    <div class="icon-text">
                        <p>06月18日 周二 18:00 截止</p>
                        <p>56人参与</p>
                    </div>
                    <div class="sign">
                        选项（最多可选5项）
                    </div>
                    <div class="checkbox_wrap">
                        <van-checkbox-group :value="result" @change="onChange">
                            <van-checkbox shape="square" custom-class="check" :value="item.checked" :name="item.id" v-for="(item,index) in list" :key="index">
                                <div class="row">
                                    <div>
                                        1.
                                    </div>
                                    <div class="radius"></div>
                                    <div>
                                        <p class="name">{{item.name}}</p>
                                        <p class="deparment">内科，副主任医师</p>
                                    </div>
                                </div>
                            </van-checkbox>
                        </van-checkbox-group>
                    </div>
                    <div class="voteBtn" :class="{'active':result!=''}">
                        投票
                    </div>
                </div>
            </div> -->
        </div>
        <div class="emptyWrap" v-else>
            <div class="box">
                <p class="img">
                    <img :src="imgUrl+'02.1-1Affair.png'" alt="">
                </p>
                <p>暂无投票</p>
            </div>
        </div>
        <van-divider v-if="isMoreShow" contentPosition="center">没有更多了~</van-divider>
        <!-- <div class="footer" :class="{'bottomActive':isModelmes,'footImt':!isModelmes}">
            <van-button type="primary" custom-class="btn" block>创建投票</van-button>
        </div> -->
        <div class="clues-add-button" @click="onCluesAddBtnClick" :class="{'active':isModelmes}">
            <van-icon name="plus" size="25" />
        </div>
        
        <van-action-sheet
            :show="show"
            @close="getClose"
            @cancel="getClose"
            cancel-text="取消"
            z-index="9999"
        >
            <div class="sheetWrap">
                <p @click="getEdit">编辑</p>
                <p @click="getAddPeople">添加参与人</p>
                <p @click="getDelete">删除</p>
                <p @click="getLookRecord">查看投票人员</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import {message} from '@/utils/message';
export default {
    data(){
        return {
            current:'tab1',
            radio:"",
            result: [],
            show:false,
            list:[
                {
                    id:1,
                    name:'朱炜1',
                    checked:false
                },
                {
                    id:2,
                    name:'朱炜2',
                    checked:false
                },
                {
                    id:3,
                    name:'朱炜3',
                    checked:false
                }
            ],
            scope:0,
            listData:[],
            pollid:"",
            numActive:'',
            pageNumber:1,
            pageSize:25,
            isPage:false,
            colorList:[
                '#3399ff',
                'red',
                'yellow',
                '#FF6666'
            ],
            isMoreShow: false
        }
    },
    computed:{
        isModelmes(){
            return wx.getStorageSync('isModelmes');
        },
        sessionkey(){
            return wx.getStorageSync('sessionkey');
        },
        imgUrl(){
            return this.$api.photo.url;
        },
        ...mapState({
            selectListName:state=>{
                return state.mailList.selectListName;
            }
        })
    },
    onLoad(){
        this.getQuery();
    },
    onShow(){
        this.getQuery();
        const pages = getCurrentPages();
        const currPage = pages[pages.length-1];
        if(currPage.route=='pages/vote/main'){
            if(this.selectListName!=''){
                this.getPeoples();
            }
        }
    },
    methods:{
        ...mapMutations(['getClear']),
        // 邀请投票人员
        getPeoples(){
            let temp = this.selectListName.map(item=>item.id)
            let Userids = temp.join(',');
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.invite,
                    SessionKey:this.sessionkey,
                    pollid:wx.getStorageSync('pollid'),
                    Userids:Userids
                }
            }).then(res=>{
                console.log(res);
                if(res.status==1){
                    message.toast({
                        title:res.msg,
                        delta:0,
                        success:()=>{
                            setTimeout(()=>{
                                this.getClear([]);
                                this.getQuery();
                            },500)
                        }
                    })
                }
            })
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.query,
                    SessionKey:this.sessionkey,
                    scope:this.scope,
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize
                }
            }).then(res=>{
                console.log(res);
                if(this.listData.length>0&&res.listData==""){
                    this.isMoreShow = true;
                }
                if(res.listData==""){
                    this.isPage = false;
                }else {
                    this.isPage = true;
                }
                let result = [];
                if(this.pageNumber==1){
                    result = res.listData;
                }else {
                    result = this.listData.concat(res.listData);
                }
                this.listData = result;
                // this.listData = res.listData;
                this.listData.forEach(item=>{
                    item.Poll.Options.forEach(v=>{
                        this.$set(v,'checked',false);
                    })
                    if(this.current=='tab2'||this.current=='tab3'){
                        item.Poll.Options.forEach(v=>{
                            let num = this.GetPercent(v.PollQty,v.Pct);
                            let widthNum = this.toPoint(num) * 333;
                            console.log(widthNum,'1231')
                            this.$set(v,'num',num);
                            this.$set(v,'widthNum',widthNum);
                        })
                    }
                })
                console.log(this.listData,'listData')
            })
        },
        toPoint(percent){
            var str=percent.replace("%","");
            str= str/100;
            return str;
        },
        GetPercent(num, total) {
            /// <summary>
            /// 求百分比
            /// </summary>
            /// <param name="num">当前数</param>
            /// <param name="total">总数</param>
            num = parseFloat(num);
            total = parseFloat(total);
            if (isNaN(num) || isNaN(total)) {
                return "-";
            }
            return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            this.pageNumber = 1;
            this.isMoreShow = false;
            if(this.current=='tab1'){
                this.scope = 0;
            }else if(this.current=='tab2'){
                this.scope = 1;
            }else {
                this.scope = 2;
            }
            this.getQuery();
        },
        changeRadio(e,index){
            this.numActive = index;
            this.radio = e.mp.detail;
            this.listData[index].polloptionids = this.radio;
        },
        onChange(e,index){
            this.numActive = index;
            this.result = e.mp.detail;
            this.listData[index].polloptionids = this.result.join(',');
            this.listData.forEach(item=>{
                for(var i=0;i<item.Poll.Options.length;i++){
                    item.Poll.Options[i].checked = false;
                    for(var j=0; j<this.result.length; j++){
                        if(item.Poll.Options[i].PollOptionId==this.result[j]){
                            item.Poll.Options[i].checked = true;
                            break;
                        }
                    }
                }
            })
            
        },
        // 投票
        getVote(item){
            let endTime = new Date(item.Poll.CloseTime).getTime();
            let currenTime = new Date().getTime();
            if(currenTime > endTime) {
                message.toast({
                    title: "不可投票，已超过投票截至时间!",
                    duration: 3000,
                    delta: 0
                })
                return false
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.response,
                    SessionKey:this.sessionkey,
                    pollid:item.PollId,
                    polloptionids:item.polloptionids
                }
            }).then(res=>{
                console.log(res)
                if(res.status===1){
                    message.toast({
                        title:res.msg,
                        delta:0,
                        success:()=>{
                            setTimeout(()=>{
                                this.getQuery();
                            },500)
                        }
                    })
                }
                
            })
        },
        getMore(item){
            wx.setStorageSync('pollid',item.PollId);
            this.pollid = item.PollId;
            this.show = true;
        },
        // 删除
        getDelete(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.vote.delete,
                    SessionKey:this.sessionkey,
                    pollid:this.pollid
                }
            }).then(res=>{
                if(res.status===1){
                    wx.showToast({
                        title:res.msg,
                        icon:'success',
                        duration:2000,
                        success:()=>{
                            setTimeout(()=>{
                                this.getQuery();
                                this.show = false;
                            },500)
                        }
                    })
                }
                
            })
        },
        getClose(){
            this.show = false;
        },
        onCluesAddBtnClick(){
            const url = '/pages/vote/create/main';
            wx.navigateTo({url:url});
        },
        getEdit(){
            this.show = false;
            const url = '/pages/vote/create/main?pollid='+this.pollid;
            wx.navigateTo({url:url});
        },
        getInvitees(item){
            const url = '/pages/vote/joinDetail/main?PollId='+item.PollId;
            wx.navigateTo({url:url});
        },
        getDetail(item){
            const url = '/pages/vote/detail/main?PollId='+item.PollId;
            wx.navigateTo({url:url});
        },
        getAddPeople(){
            this.show = false;
            const url = '/pages/publics/mailList/main';
            wx.navigateTo({url:url});
        },
        getLookRecord(){
            this.show = false;
            const url = '/pages/vote/peopleDetail/main?id='+this.pollid;
            wx.navigateTo({url:url});
        }
    },
    // 下拉刷新
    onPullDownRefresh() {
        // this.current_scroll = '推荐';
        this.pageNumber = 1;
        this.getQuery();
        wx.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if(this.isPage){
            this.pageNumber++;
            this.getQuery();
        }
    }
}
</script>
<style lang="scss">
@import '../../../static/css/vote.css';
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .center{
            padding-bottom: 80px;
            .content{
                width: 100%;
                background: #fff;
                padding: 30rpx 33rpx;
                margin-top: 21rpx;
                .heads{
                    display: flex;
                    .Avatar{
                        width: 75rpx;
                        height: 75rpx;
                        line-height: 75rpx;
                        text-align: center;
                        border-radius: 50%;
                        font-size: 21rpx;
                        background: #3399ff;
                        color: #fff;
                    }
                    .info{
                        flex: 1;
                        margin-left: 24rpx;
                        .r{
                            display: flex;
                            justify-content:space-between;
                            .name{
                                font-size: 28rpx;
                                color: #333333;
                            }
                            .more{
                                transform: rotate(90deg);
                            }
                        }
                        .text{
                            font-size: 22rpx;
                            color: #999999;
                        }
                    }
                }
                h3{
                    font-size: 33rpx;
                    color: #333333;
                    font-weight: bold;
                    margin-top: 31rpx;
                }
                .cont_wrap{
                    width: 100%;
                    // height: 200px;
                    background: #f8f8f8;
                    margin-top: 28rpx;
                    padding: 0 21rpx;
                    .icon-text{
                        font-size: 24rpx;
                        color: #999999;
                        display: flex;
                        justify-content: space-between;
                        padding: 38rpx 0;
                        p{
                            display: flex;
                            align-items: center;
                            i{
                                color: #a4a4a4;
                            }
                            span{
                                margin-left: 10rpx;
                            }
                        }
                    }
                    .sign{
                        font-size: 28rpx;
                        color: #666666;
                    }
                    .radio_wrap{
                        .radio{
                            padding: 31rpx 0;
                            border-bottom: 1rpx solid #ebedec;
                            font-size: 31rpx;
                            color: #333333;
                        }
                    }
                    .checkbox_wrap{
                        .van-checkbox__icon-wrap{
                            // margin-top: 20rpx;
                        }
                        .check{
                            padding: 31rpx 0;
                            border-bottom: 1rpx solid #ebedec;
                            display: flex;
                            align-items: center;
                            .row{
                                display: flex;
                                align-items: center;
                                .radius{
                                    width: 104rpx;
                                    height: 104rpx;
                                    border: 1rpx solid #ebedec;
                                    margin: 0 21rpx;
                                }
                                div:nth-child(3){
                                    .name{
                                        font-size: 31rpx;
                                        color: #333333;
                                    }
                                    .deparment{
                                        font-size: 28rpx;
                                        color: #999999;
                                    }
                                }
                            }
                        }
                    }
                    .voteBtn{
                        font-size: 31rpx;
                        color: #999999;
                        text-align: center;
                        padding: 24rpx 0;
                    }
                    .voteBtn.active{
                        color: #3399ff;
                    }
                }
                .create_wrap{
                    width: 100%;
                    // height: 200px;
                    background: #f8f8f8;
                    margin-top: 28rpx;
                    padding: 0 21rpx;
                    .row_text{
                        display: flex;
                        justify-content: space-between;
                        font-size: 24rpx;
                        color: #999999;
                        padding: 38rpx 0;
                        p{
                            display: flex;
                            align-items: center;
                            i{
                                color: #a4a4a4;
                            }
                            span{
                                margin-left: 10rpx;
                            }
                        }
                    }
                    .sign_title{
                        font-size: 28rpx;
                        color: #666666;
                        padding: 15rpx 0;
                    }
                    .row{
                        display: flex;
                        align-items: center;
                        padding: 33rpx 0;
                        border-bottom: 1rpx solid #ebedec;
                        .l{
                            font-size: 31rpx;
                            color: #333333;
                        }
                        .c{
                            flex: 1;
                            margin-left: 24rpx;
                            .text{
                                font-size: 31rpx;
                                color: #333333;
                            }
                            .mBom{
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                .progress{
                                    width: 333rpx;
                                    height: 21rpx;
                                    background: #e5e5e5;
                                    margin-top: 27rpx;
                                    span{
                                        display: block;
                                        width: 30rpx;
                                        height: 100%;
                                        background: #3399ff;
                                    }
                                    span.active{
                                        background: #999999 !important;
                                    }
                                }
                                .num{
                                    height: 21rpx;
                                    font-size: 25rpx;
                                    color: #999999;
                                    span:nth-child(1){
                                        margin-right: 28rpx;
                                    }
                                }
                            }
                        }
                    }
                    .voteBtn{
                        font-size: 31rpx;
                        color: #999999;
                        padding: 24rpx 0;
                        text-align: center;
                    }
                }
            }
        }
        .emptyWrap{
            display: flex;
            justify-content: center;
            padding-top: 292rpx;
            .img{
                width: 162rpx;
                height: 162rpx;
                img{
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
            p{
                font-size: 32rpx;
                color: #999999;
                text-align: center;
                margin-top: 56rpx;
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #fff;
            padding: 21rpx 33rpx;
            .btn{
                background: #3399ff;
                color: #fff;
                border: none;
            }
        }
        .clues-add-button {
            position: fixed;
            right: 20px;
            bottom: 40px;
            background: #049bfb;
            width: 48px;
            height: 48px;
            z-index: 1002;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0rpx 5rpx 12rpx 0rpx rgba(0, 0, 0, 0.3);
        }
        .clues-add-button.active{
            // bottom: 100px;
        }
        .sheetWrap{
            p{
                font-size: 34rpx;
                color: #333333;
                text-align: center;
                padding: 30rpx 0;
            }
            P:nth-child(2){
                border-top: 1rpx solid #e2e3e5;
                border-bottom: 1rpx solid #e2e3e5;
            }
        }
    }
</style>