<template>
    <div class="wraps">
        <van-popup
            :show="show"
            :overlay="false"
            position="center"
            custom-style="width:100%;height: 100%;background:#fff;"
            @close="onClose"
        >
            <div class="modalWrap">
                <van-search
                    :value="searchValue"
                    placeholder="请输入搜索关键词"
                    show-action
                    @change="onSearch"
                    @cancel="onCancel"
                />
                <div class="modalCont">
                    <div class="row" v-for="(item,index) in list" :key="index" @click="getCardInfo(item)">
                        <div class="l">
                            <p>{{item.name}}</p>
                        </div>
                        <div class="c">
                            <p class="name" ref="names">{{item.FullName}}</p>
                            <p class="department">{{item.OrganizationName}}-{{item.DeptName}}</p>
                        </div>
                        <div class="r" @click.stop="getCallPhone(item)">
                            <van-icon name="phone-o" color="#66c480" size="20" />
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    name:"SearchCom",
    props:['back'],
    data(){
        return {
            show:true,
            sessionkey:"",
            searchValue:"",
            list:[]
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        this.sessionkey = wx.getStorageSync('sessionkey');
    },
    methods:{
        onSearch(e){
            this.searchValue = e.mp.detail;
            if(this.searchValue!=""){
                this.getQuery();
            }else {
                this.list = [];
            }
        },
        onCancel(){
            if(this.back){
                wx.navigateBack({
                    delta:1
                })
            }else {
                this.$parent.isShow = false;
            }
        },
        getQuery(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.mailList.queryAll,
                    SessionKey:this.sessionkey,
                    search:this.searchValue
                }
            }).then(res=>{
                this.list = res.listData;
                if(this.searchValue!=''){
                    const Reg = new RegExp(this.searchValue, 'i');
                    this.list.map(item=>{
                        if(item.FullName.length>2){
                            const name = item.FullName.substr(1);
                            item.name = name;
                        }else {
                            item.name = item.FullName;
                        }
                        const v = item.FullName.replace(Reg, `<span style="color: #3399ff;">${this.searchValue}</span>`);
                        this.$nextTick(()=>{
                            
                        })
                        return item;
                    })
                }
            })
        },
        getCardInfo(item){
            const url = '/pages/mailList/cardInfo/main?id='+item.ValueId;
            wx.navigateTo({url:url});
        },
        getCallPhone(item){
            wx.makePhoneCall({
                phoneNumber: item.TelPhone
            })
        }
    }
}
</script>
<style lang="scss">
    .wraps{
        .van-search__action{
            color: #3399ff;
        }
        .modalWrap{
            background: #fff;
            .modalCont{
                border-top: 2rpx solid #e2e3e5;
                .row{
                    display: flex;
                    align-items: center;
                    padding: 29rpx 32rpx;
                    .l{
                        p{
                            width: 96rpx;
                            height: 96rpx;
                            line-height: 96rpx;
                            text-align: center;
                            background: #3399ff;
                            color: #fff;
                            font-size: 28rpx;
                            border-radius: 50%;
                        }
                    }
                    .c{
                        flex: 1;
                        margin-left: 25rpx;
                        .name{
                            font-size: 34rpx;
                            color: #333333;
                        }
                        .highlights-text{
                            color: #3399ff;
                        }
                        .department{
                            font-size: 26rpx;
                            color: #666666;
                        }
                    }
                }
            }
        }
    }
</style>