<template>
    <div class="wrap">
        <div class="container" v-if="!maxShow">
            <div class="search">
                <van-search :value="keyValue" @click="getFriends" placeholder="请输入搜索关键词" />
            </div>
            <div class="content" v-if="!isShow">
                <div class="header">
                    <!-- <div class="row" @click="getFriends">
                        <div class="lBox">
                            <p>
                                <img src="https://oawx.hnca.org.cn/img/wechat/Organization.png" alt="">
                            </p>
                        </div>
                        <div class="rBox">
                            <p>我的好友</p>
                        </div>
                    </div> -->
                    <div class="row" @click="getMyGroup">
                        <div class="lBox">
                            <p>
                                <img src="https://oawx.hnca.org.cn/img/wechat/AO1-1.MyGroup.png" alt="">
                            </p>
                        </div>
                        <div class="rBox">
                            <p>我的群组</p>
                        </div>
                    </div>
                </div>
                <div class="header marginT">
                    <div class="row">
                        <div class="lBox">
                            <p>
                                <img src="https://oawx.hnca.org.cn/img/wechat/Organization.png" alt="">
                            </p>
                        </div>
                        <div class="rBox">
                            <p class="sign">{{organizationName||''}}
                                <i class="iconfont icon-renzheng2"></i>
                            </p>
                        </div>
                    </div>
                    <div class="row" @click="getOrganization">
                        <div class="lBox">
                            <p>
                                <img class="imgs" src="https://oawx.hnca.org.cn/img/wechat/18812icon.png" alt="">
                            </p>
                        </div>
                        <div class="rBox">
                            <p>按组织架构选择</p>
                        </div>
                    </div>
                </div>
                <div class="header marginT">
                    <div class="row">
                        <div class="lBox">
                            <p>
                                <img src="https://oawx.hnca.org.cn/img/wechat/AO1-1.png" alt="">
                            </p>
                        </div>
                        <div class="rBox">
                            <p class="sign">常用联系人</p>
                        </div>
                    </div>
                    <div class="mailList">
                        <!-- <van-checkbox-group :value="result" @change="changeGroup"> -->
                            <van-checkbox custom-class="checkbox" @change="(e)=>{changeCheckbox(e,item)}" :value="item.checked" :name="item.ValueId" v-for="(item,index) in list" :key="index">
                                <div class="contRow" :style="{'width':width+'px'}">
                                    <div class="l">
                                        <p>
                                            {{item.name}}
                                        </p>
                                    </div>
                                    <div class="r">
                                        <p>{{item.FullName}}</p>
                                        <p>{{item.DeptName}}</p>
                                    </div>
                                </div>
                            </van-checkbox>
                        <!-- </van-checkbox-group> -->
                    </div>
                </div>
            </div>
            <Contacts v-if="isShow" :cc="cc" />
            <!-- <Public :total="total" :cc="cc" :admin="admin" :foldersId="foldersId" :RightCode="RightCode" :meetingId="meetingId" /> -->
            <!-- <div class="footer">
                <div class="boxWrap">
                    <p class="l">
                        已选择:{{selectId.length}}人
                        <i-icon type="unfold" />
                    </p>
                    <p class="r">
                        确定
                    </p>
                </div>
            </div> -->
        </div>
        <!-- <ShowList v-if="maxShow" /> -->
        <Public :total="total" :cc="cc" :admin="admin" :foldersId="foldersId" :RightCode="RightCode" :meetingId="meetingId" />
        <SearchMailList v-if="maxShow" :cc="cc" />
    </div>
</template>
<script>
import { mapState,mapMutations, mapGetters } from 'vuex';
import Contacts from '@/components/mailList/contacts';
import Public from '@/components/mailList/public';
import ShowList  from '@/components/mailList/showList';
import SearchCom from '@/components/mailList/searchCom';
import SearchMailList from '@/components/searchMailList';
export default {
    components:{
        Contacts,
        Public,
        ShowList,
        SearchCom,
        SearchMailList
    },
    data(){
        return {
            keyValue:"",
            result:[],
            width:"",
            sessionkey:"",
            list:[],
            isShow:false,
            maxShow:false,
            cc:'',
            admin:"",
            foldersId:"",
            RightCode:"",
            meetingId:"", // 会议id
            checkList:[]
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        if(options.cc){
            this.cc = options.cc;
        }else {
            this.cc = '';
        }
        this.admin = options.admin;
        this.foldersId = options.foldersId;
        this.RightCode = options.RightCode;
        this.meetingId = options.meetingId;
        this.width = wx.getSystemInfoSync().windowWidth-60;
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.queryList();
    },
    computed:{
        ...mapState({
            selectId:state=>{
                return state.mailList.selectId
            },
            selectListName:state=>{
                return state.mailList.selectListName;
            },
            selectListNameCC:state=>{
                return state.mailList.selectListNameCC;
            }
        }),
        ...mapGetters([
            'filterList'
        ]),
        organizationName(){
            return wx.getStorageSync('organizationName');
        }
    },
    watch:{
        selectId(value){
            this.result = value;
        }
    },
    methods:{
        ...mapMutations([
            'getSelectId',
            'getListName',
            'getSingleDelete',
            'getListNameCC',
            'getSingleDeleteCC',
            'getSign'
        ]),
        changeCheckbox(e,item){
            item.checked = e.mp.detail;
            if(item.checked){
                this.checkList.push({
                    id:item.ValueId,
                    FullName:item.FullName,
                    DeptName:item.DeptName
                })
            }else {
                let index = this.checkList.findIndex(v=>v.id==item.ValueId);
                this.checkList.splice(index,1);
                if(this.cc=='cc'){
                    this.getSingleDeleteCC(item.ValueId);
                }else {
                    this.getSingleDelete(item.ValueId);
                }
            }
            let temp = [...this.checkList,...this.selectListName];
            if(this.cc=='cc'){
                this.getListNameCC(temp);
            }else {
                this.getListName(temp);
            }
        },
        changeGroup(e){
            this.result = e.mp.detail;
            let selectData = [];
            let listName = [];
            for(var i=0; i<this.list.length;i++){
                this.list[i].checked = false;
                if(this.cc == 'cc'){
                    this.getSingleDeleteCC(this.list[i].valueId);
                }else {
                    this.getSingleDelete(this.list[i].ValueId);
                }
                for(var j=0; j<this.result.length; j++){
                    if(this.list[i].ValueId==this.result[j]){
                        this.list[i].checked = true;
                        selectData.push(this.list[i].ValueId);
                        listName.push({
                            id:this.list[i].ValueId,
                            FullName:this.list[i].FullName,
                            DeptName:this.list[i].DeptName
                        })
                        break;
                    }
                }
            }
            if(this.cc=='cc'){
                this.getListNameCC(listName);
                
            }else {
                this.getSelectId(selectData);
                this.getListName(listName);
            }
        },
         // 常用联系人
        queryList(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.addresslist.getlatestlist",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                this.list = res.data;
                this.list.map(item=>{
                    // this.$set(item,'checked',false);
                    item.checked = false;
                    if(item.FullName.length>2){
                        const name = item.FullName.substr(1);
                        item.name = name;
                    }else {
                        item.name = item.FullName;
                    }
                    return item;
                })
                if(this.cc=='cc'){
                    this.selectListNameCC.forEach(v=>{
                        this.list.forEach(one=>{
                            if(v.id==one.ValueId){
                                one.checked = true;
                            }
                        })
                    })
                }else {
                    this.selectListName.forEach(v=>{
                        this.list.forEach(one=>{
                            if(v.id==one.ValueId){
                                one.checked = true;
                            }
                        })
                    })
                }
                // this.list.map(item=>{
                //     const name = item.FullName.substr(1);
                //     item.name = name;
                //     return item;
                // })
            })
        },
        getFriends(){
            this.maxShow = true;
        },
        // 我的群组
        getMyGroup(){
            this.getSign('delta');
            const url = '/pages/publics/myGroup/main?cc='+this.cc+'&foldersId='+this.foldersId+'&RightCode='+this.RightCode+'&admin='+this.admin+'&meetingId='+this.meetingId;
            wx.navigateTo({url:url});
        },
        // 组织架构
        getOrganization(){
            this.getSign('delta');
            const url = '/pages/publics/Organization/main?cc='+this.cc+'&foldersId='+this.foldersId+'&RightCode='+this.RightCode+'&admin='+this.admin+'&meetingId='+this.meetingId;
            wx.navigateTo({
                url:url
            })
        }
    }
}
</script>
<style lang="scss">
@font-face {
    font-family: 'iconfont';
    src: url(data:font/truetype;charset=utf-8;base64,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) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-tianjiarenyuan1:before {
  content: "\e601";
}

.icon-renzheng2:before {
  content: "\e60c";
}

.icon-zuzhijiagou1:before {
  content: "\e656";
}

.icon-waibulianxiren1:before {
  content: "\e603";
}

.icon-shezhi2:before {
  content: "\e73b";
}

.icon-youxiang1:before {
  content: "\e633";
}

.icon-dianhua:before {
  content: "\e600";
}

.icon-shouji:before {
  content: "\e602";
}

.icon-xiaji:before {
  content: "\e604";
}


    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .marginT{
            margin-top: 16rpx;
            .rBox{
                .sign{
                    display: flex;
                    align-items: center;
                    i{
                        font-size: 10px;
                        color: #fa6d11;
                        margin-left: 20rpx;
                    }
                }
            }
        }
        .content{
            padding-bottom: 80px;
            .header{
                background: #fff;
                .row{
                    display: flex;
                    align-items: center;
                    padding: 16rpx 32rpx;
                    .lBox{
                        p{
                            width: 80rpx;
                            height: 80rpx;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            img{
                                width: 100%;
                                height: 100%;
                                vertical-align: middle;
                            }
                            .imgs{
                                width: 20rpx;
                                height: 20rpx;
                            }
                        }
                    }
                    .rBox{
                        flex: 1;
                        margin-left: 25rpx;
                        font-size: 35rpx;
                        color: #333333;
                        .sign{
                            font-weight: bold;
                        }
                    }
                }
                .mailList{
                    .checkbox{
                        padding: 0 33rpx!important;
                        display: flex;
                        align-items: center;
                        .contRow{
                            display: flex;
                            .l{
                                padding: 20rpx 0;
                                p{
                                    width: 80rpx;
                                    height: 80rpx;
                                    line-height: 80rpx;
                                    text-align: center;
                                    border-radius: 50%;
                                    background: #3399ff;
                                    color: #fff;
                                    font-size: 26rpx;
                                }
                            }
                            .r{
                                flex: 1;
                                width: 100%;
                                margin-left: 30rpx;
                                padding: 20rpx 0;
                                p:nth-child(1){
                                    font-size: 35rpx;
                                    color: #333333;
                                }
                                p:nth-child(2){
                                    font-size: 26rpx;
                                    color: #999999;
                                }
                            }
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 20rpx;
            background: #fff;
            .boxWrap{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 33rpx;
                .l{
                    font-size: 29rpx;
                    color: #3399ff;
                }
                .r{
                    width: 207rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    border-radius: 7rpx;
                    font-size: 26rpx;
                    color: #fff;
                    background: #3399ff;
                    text-align: center;
                }
            }
        }
    }
</style>