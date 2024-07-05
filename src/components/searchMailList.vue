<template>
    <div class="wraps">
        <van-popup
            :show="show"
            :overlay="false"
            position="top"
            custom-style="width:100%;height: auto;background:#fff;"
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
                <div class="mailList">
                    <!-- <van-checkbox-group :value="result" @change="changeGroup"> -->
                        <van-checkbox custom-class="checkbox" @change="(e)=>{changeCheckbox(e,item)}" :value="item.checked" :name="item.ValueId" v-for="(item,index) in list" :key="index">
                            <div class="contRow" :style="{'width':width+'px'}">
                                <div class="l">
                                    <p>
                                        {{item.newName}}
                                    </p>
                                </div>
                                <div class="r">
                                    <p>{{item.FullName}}</p>
                                    <p>{{item.OrganizationName}}-{{item.DeptName}}</p>
                                </div>
                            </div>
                        </van-checkbox>
                    <!-- </van-checkbox-group> -->
                </div>
                <!-- <div class="modalCont">
                    <div class="row" v-for="(item,index) in list" :key="index" @click="getCardInfo(item)">
                        <div class="l">
                            <p>{{item.FullName}}</p>
                        </div>
                        <div class="c">
                            <p class="name" ref="names">{{item.FullName}}</p>
                            <p class="department">{{item.OrganizationName}}-{{item.DeptName}}</p>
                        </div>
                        <div class="r" @click.stop="getCallPhone(item)">
                            <van-icon name="phone-o" color="#66c480" size="20" />
                        </div>
                    </div>
                </div> -->
            </div>
        </van-popup>
    </div>
</template>
<script>
import { mapState,mapMutations, mapGetters } from 'vuex';
export default {
    name:"searchMailList",
    props:['cc'],
    data(){
        return {
            show:true,
            sessionkey:"",
            searchValue:"",
            list:[],
            result:[],
            width:"",
            checkList:[]
        }
    },
    onLoad(){
        Object.assign(this.$data,this.$options.data());
        this.width = wx.getSystemInfoSync().windowWidth-60;
        this.sessionkey = wx.getStorageSync('sessionkey');
    },
    computed:{
        ...mapState({
            selectId:state=>{
                return state.mailList.selectId
            },
            selectListName:state=>{
                return state.mailList.selectListName;
            }
        }),
        ...mapGetters([
            'filterList'
        ]),
        organizationName(){
            return wx.getStorageSync('organizationName');
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
        onSearch(e){
            this.searchValue = e.mp.detail;
            if(this.searchValue!=""){
                this.getQuery();
            }else {
                this.list = [];
            }
        },
        onCancel(){
            this.$parent.maxShow = false;
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
                        const name = item.FullName.length>2?item.FullName.substr(1):item.FullName;
                        item.checked = false;
                        item.newName = name;
                        const v = item.FullName.replace(Reg, `<span style="color: #3399ff;">${this.searchValue}</span>`);
                        this.$nextTick(()=>{
                            
                        })
                        return item;
                    })
                    this.selectListName.forEach(v=>{
                        this.list.forEach(one=>{
                            if(v.id==one.ValueId){
                                one.checked = true;
                            }
                        })
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