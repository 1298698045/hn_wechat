<template>
    <div class="wrap">
        <div class="header">
            <i-tabs :current=" current " @change="handleChange">
                <i-tab key="tab2" title="待我审批的"></i-tab>
                <i-tab key="tab3" title="我已审批的"></i-tab>
            </i-tabs>
            <!-- <div class="nav" v-if="!isShow&&!isMenu">
                <div class="box lBox" @click="getSearch">
                    <div class="row ">
                        <p>
                            <i-icon type="search" size="20" />
                        </p>
                        <p>
                            搜索
                        </p>
                    </div>
                </div>
                <div class="box" @click="getScreen">
                    <div class="row">
                        <p>
                            <i-icon type="search" size="20" />
                        </p>
                        <p>
                            筛选
                        </p>
                    </div>
                </div>
            </div>
            <div class="search" v-if="isShow">
                <van-search
                    :value="value"
                    cancel-class="cancelText"
                    placeholder="搜索标题、编号、正文内容"
                    show-action
                    @search="onSearch"
                    @cancel="onCancel"
                />

            </div>
            <div class="dropdown" v-if="isMenu">
                <van-dropdown-menu>
                    <van-dropdown-item :value="index1" :options="option1" @change="changeDropDown" />
                </van-dropdown-menu>
            </div> -->
            <div class="nav" v-if="!isBlock">
                <div class="lBox">
                    <picker @change="bindPickerChange" :value="timeSortIdx" :range="timeSort">
                        <p>{{timeSort[timeSortIdx]}}<i-icon type="enter" color="#999999" /></p>
                    </picker>
                </div>
                <div class="rBox">
                    <p @click="getSearch">
                        <i class="iconfont icon-sousuo-copy"></i>
                    </p>
                    <p @click="getScreen">
                        <i class="iconfont icon-xuankeshaixuantubiaoimg-copy"></i>
                    </p>
                </div>
            </div>
        </div>
        <div class="center">
            <NavShow v-if="isBlock" ref="childs" @childFn="getChildFn" :childShow="childShow" />
            <div class="content" v-if="!isBlock||isBlock&&childShow==0" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                <div class="row">
                    <div class="lBox">
                        <p>{{item.newName}}</p>
                    </div>
                    <div class="rBox">
                        <div class="title">
                            <p>{{item.createdByName}}提交的{{item.processIdName}}</p>
                            <p @click.stop="getMore">
                                <i-icon type="more" size="20" color="#999999" />
                            </p>
                        </div>
                        <div class="level">
                            <p>
                                <i class="iconfont icon-jinji2 icon" :class="item.priority==0?'icon':item.priority==1?'zhongji':'jinji'"></i>
                            </p>
                            <p class="name">{{item.name}}</p>
                        </div>
                        <!-- <p class="text">标题:{{item.name}}</p>
                        <p class="text">级别:{{item.priority==0?'普通':item.priority==1?'中级':'高级'}}</p> -->
                        <!-- <p class="status">{{item.createdOn}} · 来自审批</p> -->
                        <div class="statusBottom">
                            <p class="time">{{item.createdOn}} · 来自{{item.createdByName}} {{item.businessUnitIdName}}</p>
                            <div class="tag" :class="item.className">
                                {{item.stateCode==1?'审批中':item.stateCode==3?'已通过':item.stateCode==5?'已拒绝':item.stateCode==4?'已撤销':item.stateCode==0?'草稿':item.stateCode==2?'挂起':''}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-action-sheet
            :show=" show "
            :round="false"
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
                <p class="row" @click="getEntrust">委托</p>
                <p class="row" @click="getCirculation">传阅</p>
                <p class="row" @click="getLabel">加签</p>
            </div>
        </van-action-sheet>

    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import NavShow from '../../../components/approval/navShow';
export default {
    components:{
        NavShow
    },
    data(){
        return {
            current:'tab2',
            isShow:false,
            option1: [
                { text: '院办', value: 0 },
                { text: '院办', value: 1 },
                { text: '院办', value: 2 },
            ],
            index1:0,
            isMenu:false,
            show:false,
            sessionkey:"",
            list:[],
            isBlock:false, // 
            timeSort:['时间排序','优先级排序'],
            timeSortIdx:0,
            isBook:false,
            childShow:'',
            pageSize:25,
            pageNumber:1,
            isPage:false
        }
    },
    computed:{
        length(){
            return this.list.length;
        },
        sort(){
            let sort = this.timeSortIdx==0?'CreatedOn':'Priority';
            return sort;
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        let sessionkey = wx.getStorageSync("sessionkey");
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    methods:{
        bindPickerChange(e){
            this.timeSortIdx = e.mp.detail.value;
            this.getQuery();
        },
        getSearch(){
            this.childShow = 0;
            this.isBlock = true;
        },
        getScreen(){
            this.childShow = 1;
            this.isBlock = true;
        },
        getChildFn(isBook){
            this.isBook = isBook;
            if(this.current=='tab2'){
                this.getQuery();
            }else {
                this.getAlreadyQuery();
            }
        },
        getQuery(){
            console.log(this.isBook?this.$refs.childs.statusCode:'','-----');
            // return;
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.waitingtasks.getlist",
                    SessionKey:this.sessionkey,
                    sort:this.sort,
                    search:this.isBook?this.$refs.childs.searchValue:'',
                    processId:this.isBook?this.$refs.childs.processId:'',
                    // stateCode:this.isBook?this.$refs.childs.statusNum:'',
                    stateCode:this.isBook?this.$refs.childs.statusCode:'',
                    deptIds:this.isBook?this.$refs.childs.deptIds.join(','):'',
                    createdByIds:this.isBook?(this.$refs.childs.designee.hasOwnProperty('id')?this.$refs.childs.designee.id:''):"",
                    pageSize:this.pageSize,
                    pageNumber:this.pageNumber
                }
            }).then(res=>{
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
                this.list = result;
                // this.list = res.listData;
                this.list.forEach(item=>{
                    const name = item.createdByName.length>2?item.createdByName.substr(1):item.createdByName;
                    item.newName = name;
                    let className = item.stateCode==1?'approvalIng':item.stateCode==3?'tag':item.stateCode==5?'error':item.stateCode==4?'revoke'
                    :item.stateCode==0?'draft':item.stateCode==2?'挂起':'';
                    this.$set(item,'className',className);
                    return item;
                })
            })
        },
        ...mapMutations([
            'updateInstanceId'
        ]),
        getDetail(item){
            let sign = '';
            if(this.current=='tab3'){
                sign = 'btnOff'
            }
            this.updateInstanceId(item.instanceId);
            const url = '/pages/todoBusiness/detail/main?processInstanceId='+item.processInstanceId+'&processId='+item.processId+'&sign='+sign+'&RuleLogId='+item.id+'&createdByName='+item.createdByName+'&processIdName='+item.processIdName
            +'&current='+this.current+'&toActivityId='+item.toActivityId;
            wx.navigateTo({
                url:url
            })
        },
        getAlreadyQuery(){
            console.log(this.isBook?this.$refs.childs.statusCode:'','-----');
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"flow.finishedtasks.getlist",
                    SessionKey:this.sessionkey,
                    sort:this.sort,
                    search:this.isBook?this.$refs.childs.searchValue:'',
                    processId:this.isBook?this.$refs.childs.processId:'',
                    // stateCode:this.isBook?this.$refs.childs.statusNum:'',
                    stateCode:this.isBook?this.$refs.childs.statusCode:'',
                    deptIds:this.isBook?this.$refs.childs.deptIds.join(','):'',
                    createdByIds:this.isBook?(this.$refs.childs.designee.hasOwnProperty('id')?this.$refs.childs.designee.id:''):"",
                    pageSize:this.pageSize,
                    pageNumber:this.pageNumber
                }
            }).then(res=>{
                // this.list = res.listData;
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
                this.list = result;
                this.list.map(item=>{
                    const name = item.createdByName.length>2?item.createdByName.substr(1):item.createdByName;
                    item.newName = name;
                    return item;
                })
            })
        },
        handleChange(e){
            this.current = e.mp.detail.key;
            this.isBook = false;
            if(this.current=='tab2'){
                this.getQuery();
            }else {
                this.getAlreadyQuery();
            }
        },
        // getSearch(){
        //     this.isShow = true;
        // },
        onCancel(){
            this.isShow = false;
        },
        // getScreen(){
        //     this.isMenu = true;
        // },
        changeDropDown(e){
            console.log(e);
            this.isMenu = false;
        },
        getMore(){
            this.show = true;
        },
        onClose(){
            this.show = false;
        },
        getCirculation(){
            const url = '/pages/todoBusiness/circulate/main';
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
    .wrap{
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .header{
            width: 100%;
            background: #fff;
            border-bottom: 2rpx solid #e2e3e5;
            .nav{
                width: 100%;
                display: flex;
                background: #ffffff;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx;
                .lBox{
                    font-size: 26rpx;
                    color: #999999;
                }
                .rBox{
                    display: flex;
                    p{
                        flex:1;
                        text-align: center;
                        color: #333333;
                        font-size: 28rpx;
                    }
                    p:nth-child(1){
                        margin-right: 60rpx;
                    }
                }
            }
            .search{
                background: #f7f7f7;
                padding-top: 10rpx;
                .cancelText{
                    color: #3399ff;
                }
            }
        }
        .center{
            flex: 1;
            width: 100%;
            background: #fff;
            overflow-y: scroll;
            .content{
                .row{
                    display: flex;
                    padding: 35rpx 24rpx;
                    border-bottom: 2rpx solid #e2e3e5;
                    .lBox{
                        width: 68rpx;
                        height: 68rpx;
                        line-height: 68rpx;
                        text-align: center;
                        background: #3399ff;
                        border-radius: 50%;
                        color: #fff;
                        font-size: 26rpx;
                    }
                    .rBox{
                        flex: 1;
                        margin-left: 25rpx;
                        .title{
                            display: flex;
                            justify-content: space-between;
                            padding-bottom: 20rpx;
                            p{
                                font-size: 34rpx;
                                color: #333333;
                            }
                            .time{
                                font-size: 22rpx;
                                color: #bbbbbb;
                            }
                        }
                        .level{
                            display: flex;
                            align-items: center;
                            .icon{
                                color: #74b48c;
                            }
                            .icon.jinji{
                                color: #ec746c;
                            }
                            .icon.zhongji{
                                color: #e49c5c;
                            }
                            .name{
                                font-size: 28rpx;
                                color: #333333;
                                margin-left: 20rpx;
                            }
                        }
                        .statusBottom{
                            display: flex;
                            justify-content: space-between;
                            margin-top: 20rpx;
                            .time{
                                color: #999999;
                                font-size: 12px;
                            }
                            .tag{
                                width: 80rpx;
                                height: 32rpx;
                                line-height: 32rpx;
                                text-align: center;
                                font-size: 20rpx;
                                background: #e6f6f0;
                                color: #57b987;
                                border-radius: 7rpx;
                            }
                            .tag.draft{
                                background: #e6f0f6;
                                color: #3399ff;
                            }
                            .tag.error{
                                background: #faebe9;
                                color: #ff6666;
                            }
                            .tag.revoke{
                                background: #ebecf2;
                                color: #5b6991;
                            }
                            .tag.approvalIng{
                                background: #fcf2e9;
                                color: #f09951;
                            }
                        }
                        .text{
                            font-size: 26rpx;
                            color: #333333;
                        }
                        .status{
                            font-size: 22rpx;
                            color: #999999;
                            padding-top: 20rpx;
                        }
                        .status.success{
                            color: #39c1b3;
                        }
                        .status.error{
                            color: #ff6666;
                        }
                    }
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