<template>
    <div class="wrap">
        <div class="container" v-if="!maxShow">
            <div class="search">
                <van-search :value="keyValue" @click="getFriends" placeholder="请输入搜索关键词" />
            </div>
            <div class="header">
                <scroll-view :scroll-x="true" class="yy">
                    <span class="blue" @click="getReturnBack">
                        通讯录
                        <i-icon type="enter" size="20" color="#999999" />
                    </span>
                    <span @click="getBack" class="back" :class="{'active':isShow}">
                        {{organizationName}}
                    </span>
                    <span class="back" :class="{'active':index+1!=sonList.length}" v-if="isShow" v-for="(item,index) in sonList" :key="index" @click="index+1!=sonList.length?getCurrentDepartment(item,index):''">
                        <i-icon type="enter" size="20" color="#999999" />
                        {{item.name}}
                    </span>
                </scroll-view>
            </div>
            <!-- 选择 -->
            <!-- <div class="head" v-if="!isShow">
                <van-checkbox :value="check" @change="changeAll">
                    <p :style="{'width':width+'px'}">全选</p>
                </van-checkbox>
            </div> -->
            <div class="center" v-if="!isShow">
                <div class="content" v-for="(item,index) in list" :key="index">
                    <div class="lBox">
                        <!-- 选择 -->
                        <!-- <van-checkbox-group :value="result" @change="onChange">
                            <van-checkbox  :value="item.checked" :name="item.id">{{item.name}} ({{item.quantity}}）</van-checkbox>
                        </van-checkbox-group> -->
                        {{item.name}} ({{item.quantity}}）
                    </div>
                    <div class="rBox" @click="getSubordinate(item)">
                        <i class="iconfont icon-xiaji" :class="item.className">下级</i>
                    </div>
                </div>
            </div>
            <Contacts :id="id" ref="childRef" v-if="isShow" @childFn="getSubordinate" :cc="cc" :meetingId="meetingId" />
            <!-- <Public :sign="sign" :cc="cc" :admin="admin" :foldersId="foldersId" :RightCode="RightCode" :meetingId="meetingId" /> -->
        </div>
        <!-- <ShowList v-if="maxShow" /> -->
        <Public :sign="sign" :cc="cc" :admin="admin" :foldersId="foldersId" :RightCode="RightCode" :meetingId="meetingId" />
        <SearchMailList v-if="maxShow" :cc="cc" />
    </div>
</template>
<script>
import Public from '@/components/mailList/public';
import Contacts from '@/components/mailList/contacts';
import {mapState,mapMutations} from 'vuex';
import ShowList  from '@/components/mailList/showList';
import SearchMailList from '@/components/searchMailList';
export default {
    components:{
        Public,
        Contacts,
        ShowList,
        SearchMailList
    },
    data(){
        return {
            departName:"",
            width:"",
            check:false,
            result:[],
            sessionkey:"",
            list:[],
            isShow:false,
            id:"",
            maxShow:false,
            cc:"",
            foldersId:"",
            RightCode:"",
            admin:"",
            meetingId:"", // 会议id
            sonShow:false,
            sonList:[]
        }
    },
    computed:{
        ...mapState({
            sign:state=>{
                return state.mailList.sign
            }
        }),
        organizationName(){
            return wx.getStorageSync('organizationName');
        }
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.cc = options.cc;
        this.RightCode = options.RightCode;
        this.foldersId = options.foldersId;
        this.admin = options.admin;
        this.meetingId = options.meetingId;
        this.width = wx.getSystemInfoSync().windowWidth-60;
        this.sessionkey = wx.getStorageSync('sessionkey');
        this.getQuery();
    },
    methods:{
        ...mapMutations([
            'getSingleDelete'
        ]),
        getFriends(){
            this.maxShow = true;
        },
        getBack(){
            this.isShow = false;
            this.sonList = [];
        },
        getCurrentDepartment(item,index){
            this.sonList.splice(index+1,this.sonList.length);
            this.id = item.id;
            this.$refs.childRef.getQuery();
        },
        changeAll(e){
            this.check = e.mp.detail;
            if(this.check){
                let temp = [];
                this.list.forEach(item=>{
                    this.$set(item,'checked',true);
                    temp.push(item.id);
                })
                this.result = temp;
            }else {
                this.list.forEach(item=>{
                    this.$set(item,'checked',false);
                })
                this.result = [];
            }
        },
        onChange(e){
            this.result = e.mp.detail;
            let selectData = [];
            for(var i=0; i<this.list.length;i++){
                this.list[i].checked = false;
                this.list[i].className = '';
                // this.getSingleDelete(this.list[i].ValueId);
                for(var j=0; j<this.result.length; j++){
                    if(this.list[i].id==this.result[j]){
                        this.list[i].checked = true;
                        this.list[i].className = 'active';
                        selectData.push(this.list[i].id)
                        break;
                    }
                }
            }
            console.log(selectData);
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.unitandaddresslist.group.list",
                    SessionKey:this.sessionkey,
                    parentId:"",
                }
            }).then(res=>{
                console.log(res);
                this.list = res.unitData;
                var temp = [];
                this.list.forEach(item=>{
                    temp = temp.concat(item.item);
                })
                this.list = temp;
                this.list.forEach(item=>{
                    this.$set(item,'checked',false)
                })
            })
        },
        getSubordinate(item){
            this.isShow = true;
            if(this.isShow){
                this.sonList.push({
                    name:item.name,
                    id:item.id
                })
            }
            this.departName = item.name;
            this.id = item.id;
            // this.isShow = true;
        },
        getContcats(){
            this.departName = "";
            this.id = "";
            this.isShow = false;
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

.icon-xiaji:before {
  content: "\e604";
}




.wrap{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .header{
        background: #fff;
        // display: flex;
        padding: 20rpx 25rpx;
        white-space: nowrap;
        .yy{
            font-size: 34rpx;
            color: #999999;
            margin-left: 10px;
            .blue{
                color: #3399ff;
            }
            .blue.active{
                color: #999999;
            }
            .back.active{
                color: #3399ff;
            }
        }
    }
    .head{
        width: 100%;
        background: #fff;
        padding:30rpx 33rpx;
        margin: 16rpx 0;
    }
    .center{
        padding-bottom: 100px;
        .content:last-child{
            border-bottom: none;
        }
        .content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20rpx 33rpx;
            background: #fff;
            border-bottom: 2rpx solid #e2e3e5;
            .lBox{
                font-size: 34rpx;
                color: #333333;
            }
            .rBox{
                font-size: 29rpx;
                color: #3399ff;
                display: flex;
                i{
                    border-left: 1rpx solid #ccc;
                    padding-left: 20rpx;
                }
                i.active{
                    opacity: .5;
                }
            }
        }
    }
}
</style>