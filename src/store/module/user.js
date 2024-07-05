import httpWX from '../../utils/wx-request';
import api from '../../utils/interface';
import { resolve } from 'q';

const user = {
    state:{
        imgUrl:"https://oawx.hnca.org.cn/",
        journalismInfo:{},
        journalismId:"",
        contentTypeCode:"",
        selectTagList:[],
        MyChannel:[],
        instanceId:"" // 待办事务id
    },
    mutations:{
        journalismInfo(state,info){
            state.journalismInfo = info;
            console.log(info,'info');
        },
        // 新闻、通知code
        getContentTypeCode(state,code){
            state.contentTypeCode = code;
        },
        updateId(state,id){
            console.log(state,'parent');
            state.journalismId = id;
        },
        updateInstanceId(state,id){
            state.instanceId = id;
        },
        addTag(state,arr){
            console.log(arr);
            state.selectTagList = arr;

            // state.selectTagList.push({
            //     name:item.name,
            //     itemid:item.itemid
            // });
        },
        deleteTag(state,index){
            state.selectTagList.splice(index,1);
        },
        query(state,res){
            state.selectTagList = res.Selects;
            state.MyChannel = res.MyChannel;
        }
    },
    actions:{
        // async add(ctx,obj){
        //     ctx.commit('addTag',obj);
        //     const list = [1,2,3,4,5,6];
        //     return list;
        // },
        queryTag({commit}){
            httpWX.get({
                url:api.message.queryList,
                data:{
                    method:"news.my.channel.get",
                    SessionKey:"5d884846-1d19-449d-b4e2-1b5a83623a41"                    
                }
            }).then(res=>{
                commit('query',res);
            })
        },
        addTag({commit},itemid){
            return new Promise((resolve,reject)=>{
                httpWX.get({
                    url:api.message.queryList,
                    data:{
                        method:"news.my.channel.add",
                        SessionKey:"5d884846-1d19-449d-b4e2-1b5a83623a41",
                        data: [{itemid}]  
                    }
                }).then(res=>{
                    console.log(res);
                    resolve();
                })
            })
        },
        delete({commit},itemid){
            httpWX.get({
                url:api.message.queryList,
                data:{
                    method:"news.my.channel.delete",
                    SessionKey:"5d884846-1d19-449d-b4e2-1b5a83623a41",
                    id: itemid  
                }
            }).then(res=>{
                console.log(res,'delete')
                // commit('deleteTag')
            })
        }
    },
    getters:{
        // selectTagList(state){
        //     var arr = state.selectTagList;
        //     const res = new Map(); 
        //     return arr.filter((item) => !res.has(item.ItemName) && res.set(item.ItemName, 1))
        // }
    }
}
export default user;