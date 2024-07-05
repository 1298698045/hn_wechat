const mailList = {
    state:{
        selectId:[],
        sign:"",
        selectListName:[],
        organizer:{}, // 组织人
        designee:{}, // 会议纪要指派人,
        selectIdCC:[], // 抄送人
        selectListNameCC:[], // 抄送人
        groupList:[], // 群组
        groupLength:0
    },
    mutations:{
        // 清空群组
        clearGroup(state,list){
            state.groupList = list;
        },
        clearDesignee(state,obj){
            state.designee = obj;
        },
        getGroupList(state,list){
            console.log(list,'list');
            state.groupList = list;
        },
        getGroupLength(state,num){
            state.groupLength = num;
        },
        getDelGroup(state,id){
            let index = state.groupList.findIndex(item=>item.id==id);
            state.groupList.splice(index,1);
        },
        getSelectId(state,paramsListId){
            if(state.selectId==""){
                state.selectId = paramsListId;
                console.log(state.selectId,'selectId');
            }else {
                state.selectId = state.selectId.concat(paramsListId);
                console.log(state.selectId,'selectId');
            }
        },
        handleOrganizer(state,obj){
            state.organizer = obj;
        },
        handleDesignee(state,obj){
            state.designee = obj;
        },
        getListNameCC(state,list){
            if(state.selectListNameCC==""){
                state.selectListNameCC = list;
            }else {
                let hash = {};
                let arr1 = [...state.selectListNameCC,...list];
                let arr =  arr1.reduce((preVal, curVal) => {
                hash[curVal.id]		//id就是数组中的id字段
                    ? ""
                    : (hash[curVal.id] = true && preVal.push(curVal));
                    return preVal;
                }, []);
                state.selectListNameCC = arr;
            }
            console.log(state.selectListNameCC,'cc');
        },
        getListName(state,listName){
            if(state.selectListName==""){
                state.selectListName = listName;
            }else {
                let hash = {};
                let arr1 = [...state.selectListName,...listName];
                let arr =  arr1.reduce((preVal, curVal) => {
                    hash[curVal.id]		//id就是数组中的id字段
                      ? ""
                      : (hash[curVal.id] = true && preVal.push(curVal));
                    return preVal;
                  }, []);
                  state.selectListName = arr;
                // state.selectListName = state.selectListName.concat(listName);
            }
            console.log(state.selectListName,'selectListName');
        },
        getClear(state,temp){
            state.selectId = temp;
            state.selectListName = temp;
            state.selectListNameCC = temp; // 抄送人
        },
        getDeleteAll(state,temp){
            temp.map(item=>{
                console.log(item);
                const index = state.selectId.findIndex(v=>v==item);
                state.selectId.splice(index,1);
                const idx = state.selectListName.findIndex(v=>v==item);
                state.selectListName.splice(idx,1);
            })
        },
        getDeleteAllCC(state,temp){
            temp.map(item=>{
                const index = state.selectListNameCC.findIndex(v=>v==item);
                state.selectListNameCC.splice(index,1);
            })
        },
        // 删除单个联系人
        getSingleDelete(state,id){
            let index = state.selectListName.findIndex(item=>item.id==id);
            state.selectListName.splice(index,1);
            let idx = state.selectId.findIndex(item=>item==id);
            state.selectId.splice(idx,1);
        },
        getSingleDeleteCC(state,id){
            let index = state.selectListNameCC.findIndex(item=>item.id==id);
            state.selectListNameCC.splice(index,1);
        },
        getSign(state,str){
            state.sign = str;
        }
    },
    actions:{

    },
    getters:{
        doneTodos:state=>{
            return state.selectId.length;
        },
        // filterList:state=>{
        //     return state.selectId.filter((item,index,array)=>{
        //         return array.indexOf(item) === index;
        //     })
        // }
        filterList:state=>{
            let temp = state.selectListName.map(item=>{return item.id});
            let res = new Map();
            // console.log(temp.filter((v)=>!res.has(v)&&res.set(v,1)),'tempfilter')
            temp.filter((v)=>!res.has(v)&&res.set(v,1));
            return temp;
        }
    }
}
export default mailList;