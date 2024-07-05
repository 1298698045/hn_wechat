<template>
    <div class="wrap">
        <div class="nav">
            <div class="search">
                <p>
                    <van-search :value="value" :disabled="true" placeholder="搜索" @click="getRouterSeach" />
                </p>
                <!-- 第一版不做 -->
                <!-- <p @click="getAdmin" v-if="!isShow">管理</p>
                <p v-if="isShow">
                    <span @click="getCancel">取消</span>&nbsp;&nbsp;
                    <span>批量操作</span>
                </p> -->
            </div>
            <scroll-view :scroll-x="true" class="yy">
                <span class="blue" @click="getReturnBack">
                    通讯录
                    <i-icon type="enter" size="20" color="#999999" />
                </span>
                <span @click="getBack" class="back" :class="{'active':sonShow}">
                    {{organizationName||'暂无'}}
                </span>
                <span class="back" :class="{'active':index+1!=son.length}" v-if="sonShow" v-for="(item,index) in son" :key="index" @click="index+1!=son.length?getCurrentDepartment(item,index):''">
                    <i-icon type="enter" size="20" color="#999999" />
                    {{item.name}}
                </span>
            </scroll-view>
            <!-- <p class="yy">

            </p> -->
        </div>
        <div class="center" v-if="!sonShow">
            <van-index-bar :scroll-top="scrollTop" :index-list="indexList" @select="getSelect">
                <view class="boxWrap" v-for="(item,index) in list" :key="index">
                    <van-index-anchor :index="item.title" />
                    <div class="box" v-for="(v,i) in item.item" :key="i"  @click="getSubagency(v)">
                        <p>{{v.name}}({{v.quantity}})</p>
                        <p class="phone">{{v.Telephone1 || ''}}</p>
                    </div>
                </view>
            </van-index-bar>
            <!-- 暂且不用 -->
            <!-- <div class="content">
                <div class="box">
                    <p>
                        <span>丽萍</span>
                    </p>
                    <div class="text">
                        <p>张丽萍<van-tag type="primary" custom-class="tag">主管理员</van-tag></p>
                    </div>
                </div>
            </div>
             <div class="content">
                <div class="box">
                    <p>
                        <span>
                            <img src="https://oawx.hnca.org.cn/img/wechat/05.7.Add.png" alt="">
                        </span>
                    </p>
                    <div class="text">
                        <p>邀请同事加入</p>
                    </div>
                </div>
            </div> -->
        </div>
        <div class="sonCenter" v-if="sonShow">
            <!-- <div class="departRow">
                <div class="row" v-for="(item,index) in departmentList" :key="index" @click="getSubagency(item)">
                    {{item.name}}(5)
                </div>
            </div> -->
            <view class="boxWrap" v-for="(item,index) in unitData" :key="index">
                <div class="box active" v-for="(v,idx) in item.item" :key="idx" @click="getSubagency(v)">
                    <p>{{v.name}}({{v.quantity}})</p>
                    <p class="phone">{{v.Telephone1 || ''}}</p>
                </div>
            </view>
            <van-index-bar :scroll-top="scrollTopSon" :index-list="indexListSon" @select="getSelectSon">
                <view class="boxWrap" v-for="(item,index) in addrData" :key="index">
                    <van-index-anchor :index="item.title" />
                    <div class="box" v-for="(v,idx) in item.item" :key="idx"  @click="getCardInfo(v)">
                        <p class="name">
                            <span>{{v.name}}</span>
                        </p>
                        <div class="text">{{v.FullName}}
                            <p class="phone">{{v.MobilePhone || ''}}</p>
                        </div>
                    </div>
                </view>
            </van-index-bar>
        </div>
        <div class="footer" :class="{'model':model}" v-if="isShow">
            <div class="box">
                <p>添加员工</p>
                <p @click="getAddSondepartment">添加子部门</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            value:"",
            indexList:['C','H','J','L','M','Q','R','S','X','Y','Z'],
            scrollTop:"",
            isShow:false,
            son:[],
            scrollTopSon:"",
            indexListSon:['B','D','E','F'],
            model:false,
            sonShow:false,
            list:[],
            departmentList:[],
            contactsList:[],
            sessionkey:"",
            unitData:[],
            addrData:[],
            organizationName:""
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        this.organizationName = wx.getStorageSync('organizationName');
        let sessionkey = wx.getStorageSync('sessionkey');
        this.sessionkey = sessionkey;
        wx.getSystemInfo({
            success:(res)=>{
                console.log(res);
                if(res.model=="iPhone X"){
                    this.model = true;
                }else {
                    this.model = false;
                }
            }
        })
        this.getQuery();
    },
    methods:{
        hidePhone(phone){
            var str = phone.substr(0,3)+"****"+phone.substr(7);
            return str;
        },
        // 搜索
        getRouterSeach(){
            const url = '/pages/mailList/PublicSearch/main';
            wx.navigateTo({
                url:url
            })
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
                let indexList = [];
                this.list.forEach(item=>{
                    indexList.push(item.title);
                })
                this.indexList = indexList;
            })
        },
        getSelect(e){
            console.log(e)
            this.scrollTop = e.mp.detail;
        },
        getAdmin(){
            this.isShow = true;
        },
        getCancel(){
            this.isShow = false;
        },
        getSubagency(item){
            console.log(item);
            this.sonShow = true;
            if(this.sonShow){
                // this.son = item.name;
                wx.setNavigationBarTitle({
                    title: item.name
                })
                this.son.push({
                    name:item.name,
                    id:item.id
                });
            }
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.unitandaddresslist.group.list",
                    SessionKey:this.sessionkey,
                    parentId:item.id,
                }
            }).then(res=>{
                console.log(res);
                // let dataList = res;
                // let department = [];
                // let list = [];
                // dataList.forEach(item=>{
                //     if(item.datatype=='businessunit'){
                //         department.push(item);
                //     }else if(item.datatype=='addressList'){
                //         list.push(item);
                //     }
                // })
                // this.departmentList = department;
                // this.contactsList = list;
                let indexListSon = [];
                res.addrData.forEach(item=>{
                    console.log(item,1111);
                    indexListSon.push(item.title)
                })
                this.indexListSon = indexListSon;
                this.unitData = res.unitData;
                this.addrData = res.addrData;
                this.addrData.forEach(item=>{
                    item.item.forEach(v=>{
                        if(v.FullName.length>=3){
                            this.$set(v,'name',v.FullName.substr(1));
                        }else {
                            this.$set(v,'name',v.FullName);
                        }
                        if(v.HiddenPhone){
                            v.MobilePhone = this.hidePhone(v.MobilePhone)
                        }
                    })
                })
            })
                
        },
        getReturnBack(){
            wx.navigateBack({
                delta:1
            })
        },
        getBack(){
            wx.setNavigationBarTitle({
                title: '绍兴第二医院'
            })
            this.sonShow = false;
            this.son = [];
        },
        getCurrentDepartment(item,index){
            // this.son.length = index+1;
            this.son.splice(index+1,this.son.length);
            wx.setNavigationBarTitle({
                title: this.son[0].name
            })
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:"oa.unitandaddresslist.group.list",
                    SessionKey:this.sessionkey,
                    parentId:item.id,
                }
            }).then(res=>{
                let indexListSon = [];
                res.addrData.forEach(item=>{
                    indexListSon.push(item.title)
                })
                this.indexListSon = indexListSon;
                this.unitData = res.unitData;
                this.addrData = res.addrData;
                this.addrData.forEach(item=>{
                    item.item.forEach(v=>{
                        if(v.FullName.length>=3){
                            this.$set(v,'name',v.FullName.substr(1));
                        }else {
                            this.$set(v,'name',v.FullName);
                        }
                    })
                })
            })
        },
        getSelectSon(e){
            this.scrollTopSon = e.mp.detail;
        },
        getAddSondepartment(){
            const url = "/pages/mailList/addSondepartment/main";
            wx.navigateTo({url:url});
        },
        getCardInfo(item){
            const url = "/pages/mailList/cardInfo/main?id="+item.ValueId+'&hiddenphone='+item.HiddenPhone;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    @import '../../../../static/css/public.scss';
    .wrap{
        .nav{
            background: #fff;
            padding: 30rpx 20rpx;
            .search{
                // display: flex;
                font-size: 28rpx;
                p:nth-child(1){
                    // width: 70%;
                }
                p:nth-child(2){
                    width: 30%;
                    color: #3399ff;
                    text-align: center;
                    margin-top: 30rpx;
                }
            }
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
        .center{
            .van-index-anchor{
                font-size: 25rpx !important;
            }
            .boxWrap{
                .box{
                    background: #fff;
                    padding:40rpx 32rpx;
                    font-size: 34rpx;
                    color: #666666;
                    border-bottom: 1rpx solid #eaebeb;
                }
                .box:last-child{
                    border: none;
                }
            }
            .content{
                background: #fff;
                padding:40rpx 32rpx;
                margin: 20px 0;
                .box{
                    display: flex;
                    p{
                        span{
                            display: inline-block;
                            width: 80rpx;
                            height: 80rpx;
                            line-height: 80rpx;
                            border-radius: 50%;
                            text-align: center;
                            color: #fff;
                            background: #3399ff;
                            font-size: 12px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                    .text{
                        display: flex;
                        margin-left: 10px;
                        p{
                            line-height: 80rpx;
                            font-size: 28rpx;
                            .tag{
                                margin-left: 10rpx;
                            }
                        }
                    }
                }
            }
        }
        .sonCenter{
            padding-bottom: 80px;
            .van-index-anchor{
                font-size: 25rpx!important;
            }
            .boxWrap{
                margin-top: 16rpx;;
                .box{
                    background: #fff;
                    padding: 30rpx;
                    font-size: 34rpx;
                    color: #666666;
                    border-bottom: 1rpx solid #eaebeb;
                }
                .box:last-child{
                    border: none;
                }
                .box.active{
                    display: block !important;
                }
            }
            .departRow{
                background: #fff;
                margin-top: 35rpx;
                .row{
                    padding: 30rpx;
                    font-size: 32rpx;
                    color: #666666;
                    border-bottom: 2rpx solid #eaebeb;
                }
            }
            .boxWrap{
                .box{
                    background: #fff;
                    padding: 20rpx 30rpx;
                    font-size: 34rpx;
                    color: #666666;
                    border-bottom: 1rpx solid #eaebeb;
                    display: flex;
                    .name{
                        span{
                            display: inline-block;
                            width: 80rpx;
                            height: 80rpx;
                            line-height: 80rpx;
                            border-radius: 50%;
                            background: #3399ff;
                            text-align: center;
                            color: #fff;
                            font-size: 26rpx;
                        }
                    }
                    .text{
                        font-size: 34rpx;
                        width: 100%;
                        // line-height: 80rpx;
                        margin-left: 20rpx;
                    }
                }
                .box:last-child{
                    border: none;
                }
            }
        }
        .footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            background: #f8f8f8;
            .box{
                display: flex;
                padding: 30rpx 0;
                justify-content: space-around;
                p{
                    font-size: 28rpx;
                    color: #3399ff;
                }
            }
        }
        .footer.model{
            bottom: 20px;
        }
    }
</style>