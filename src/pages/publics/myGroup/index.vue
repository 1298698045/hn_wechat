<template>
    <div class="wrap">
        <div class="container" v-if="!maxShow">
            <div class="search">
                <van-search :value="keyValue" placeholder="请输入搜索关键词" />
            </div>
            <div class="content" v-if="!isShow">
                <div class="row" v-for="(item,index) in list" :key="index" @click="getDetail(item)">
                    <div class="lBox">
                        <p>

                        </p>
                    </div>
                    <div class="rBox">
                        <p>{{item.name}}</p>
                        <p>{{item.Quantity}}人</p>
                    </div>
                </div>
            </div>
            <Contacts v-if="isShow" :groupId="groupId" :cc="cc" />
            <Public :sign="sign" :cc="cc" :admin="admin" :foldersId="foldersId" :RightCode="RightCode" :meetingId="meetingId" />
        </div>
        <ShowList v-if="maxShow" />
    </div>
</template>
<script>
import {mapState,mapMutations,mapGetters} from 'vuex';
import Public from '@/components/mailList/public';
import Contacts from '@/components/mailList/contacts'; 
import ShowList from '@/components/mailList/showList';
export default {
    components:{
        Public,
        Contacts,
        ShowList
    },
    data(){
        return {
            sessionkey:"",
            list:[],
            groupId:"",
            isShow:false,
            maxShow:false,
            cc:"",
            meetingId:""
        }
    },
    computed:{
        ...mapState({
            selectId:state=>{
                return state.mailList.selectId;
            },
            sign:state=>{
                return state.mailList.sign
            }
        }),
        ...mapGetters([
            'filterList'
        ]),
    },
    onLoad(options){
        Object.assign(this.$data,this.$options.data());
        this.cc = options.cc;
        this.RightCode = options.RightCode;
        this.foldersId = options.foldersId;
        this.admin = options.admin;
        this.meetingId = options.meetingId;
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        this.getQuery();
    },
    methods:{
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"sys.groups.search",
                    SessionKey:this.sessionkey
                }
            }).then(res=>{
                console.log(res);
                this.list = res.listData;
            })
        },
        getDetail(item){
            this.groupId = item.groupId;
            this.isShow = true;
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .content{
            background: #fff;
            .row{
                display: flex;
                align-items: center;
                padding: 10rpx 32rpx;
                .lBox{
                    p{
                        width: 100rpx;
                        height: 100rpx;
                        background: rgba(20, 188, 132, 1);
                        border-radius: 50%;
                    }
                }
                .rBox{
                    flex: 1;
                    margin-left: 25rpx;
                    p:nth-child(1){
                        font-size: 35rpx;
                        color: #333333;
                        // overflow: hidden;
                        // text-overflow: ellipsis;
                        // white-space: nowrap;
                    }
                    p:nth-child(2){
                        font-size: 26rpx;
                        color: #999999;
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