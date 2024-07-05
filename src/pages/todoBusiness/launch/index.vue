<template>
    <div class="wrap">
        <div class="container">
            <div>
                <scroll-view class="menu-wrapper" :style="{height:height+'px'}" scroll-y>
                    <van-sidebar custom-class="sidebarWrap" :active-key="activeKey" @change="changeSideBar">
                        <van-sidebar-item custom-class="sidebar" v-for="(item,index) in listBar" :key="index"  :title="item.name" />
                    </van-sidebar>
                </scroll-view>
            </div>
            <scroll-view :scroll-y="true" style="height:100%;" scrollTop="100" :scroll-into-view="id">
                <div class="center">
                    <div class="boxWrap" v-for="(item,index) in list" :key="index">
                        <h3>{{item.name}}</h3>
                        <div class="content">
                            <p class="text" v-for="(v,i) in item.arr" :key="i" @click="getRouter(v)">
                                {{v.title}}
                            </p>
                        </div>
                    </div>
                </div>
            </scroll-view>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            activeKey:0,
            id:"",
            listBar:[
                {
                    id:1,
                    name:"院办"
                },
                {
                    id:2,
                    name:"审计处"
                },
                {
                    id:3,
                    name:"医学工程处"
                },
                {
                    id:4,
                    name:"医务科"
                },
                {
                    id:5,
                    name:"监察科"
                },
                {
                    id:6,
                    name:"门诊办"
                },
                {
                    id:7,
                    name:"科教科"
                },
                {
                    id:8,
                    name:"医保办"
                },
                {
                    id:9,
                    name:"医疗安全办"
                },
                {
                    id:10,
                    name:"质控办"
                },
                {
                    id:11,
                    name:"医学工程科"
                },
                {
                    id:12,
                    name:"信息科"
                },
                {
                    id:13,
                    name:"临床药学"
                },
                {
                    id:14,
                    name:"招标办"
                },
                {
                    id:15,
                    name:"护理部"
                },
                {
                    id:16,
                    name:"总务基建科"
                },
                {
                    id:17,
                    name:"教学管理科"
                }
            ],
            list:[
                {
                    id:1,
                    name:"院办",
                    arr:[
                        {
                            title:"01 请示报告"
                        },
                        {
                            title:"02 请示报告"
                        },
                        {
                            title:"03 请示报告"
                        },
                        {
                            title:"04 请示报告"
                        },
                        {
                            title:"05 请示报告"
                        }
                    ]
                },
                {
                    id:1,
                    name:"审计处",
                    arr:[
                        {
                            title:"01 科研合同（协议）审批"
                        },
                        {
                            title:"02 经济类合同审批"
                        },
                        {
                            title:"03 心协、精保所合同审批"
                        },
                        {
                            title:"04 政府采购合同审批"
                        },
                        {
                            title:"05 请示报告"
                        }
                    ]
                },
                {
                    id:1,
                    name:"审计处",
                    arr:[
                        {
                            title:"01 科研合同（协议）审批"
                        },
                        {
                            title:"02 经济类合同审批"
                        },
                        {
                            title:"03 心协、精保所合同审批"
                        },
                        {
                            title:"04 政府采购合同审批"
                        },
                        {
                            title:"05 请示报告"
                        }
                    ]
                },
                {
                    id:1,
                    name:"审计处",
                    arr:[
                        {
                            title:"01 科研合同（协议）审批"
                        },
                        {
                            title:"02 经济类合同审批"
                        },
                        {
                            title:"03 心协、精保所合同审批"
                        },
                        {
                            title:"04 政府采购合同审批"
                        },
                        {
                            title:"05 请示报告"
                        }
                    ]
                },
                {
                    id:1,
                    name:"审计处",
                    arr:[
                        {
                            title:"01 科研合同（协议）审批"
                        },
                        {
                            title:"02 经济类合同审批"
                        },
                        {
                            title:"03 心协、精保所合同审批"
                        },
                        {
                            title:"04 政府采购合同审批"
                        },
                        {
                            title:"05 请示报告"
                        }
                    ]
                }
            ],
            height:""
        }
    },
    onLoad(){
       this.height =  wx.getSystemInfoSync().windowHeight;
       console.log(this.height);
    },
    methods:{
        changeSideBar(e){
            console.log(e);
        },
        getRouter(v){
            let title = v.title;
            const url = '/pages/todoBusiness/write/main?title='+title;
            wx.navigateTo({url:url});
        }
    }
}
</script>
<style lang="scss">
    .wrap{
        .container{
            display: flex;
            .van-sidebar-item--selected{
                border-color: #3399ff!important;
            }
            .center{
                flex: 1;
                .boxWrap{
                    h3{
                        font-size: 24rpx;
                        color: #d4d3d3;
                        padding: 10rpx 28rpx;
                    }
                    .content{
                        background: #fff;
                        .text{
                            color: #333333;
                            font-size: 32rpx;
                            padding: 30rpx 28rpx;
                            border-bottom: 1rpx solid #f5f5f5;
                        }
                    }
                }

            }
        }
    }
</style>