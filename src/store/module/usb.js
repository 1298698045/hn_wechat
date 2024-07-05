const usb = {
    state:{
        selectFiles:[]
    },
    mutations:{
        handleFiles(state,temp){
            state.selectFiles = temp;
        },
        delete(state,id){
            const index = state.selectFiles.findIndex(item=>item.id==id);
            state.selectFiles.splice(index,1);
        },
        clearFile(state,list){
            state.selectFiles = list;
        }
    },
    actions:{

    },
    getters:{
        changeData:state=>{
            let hash = {}; 
            const data2 = state.selectFiles.reduce((preVal, curVal) => {
                hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal); 
                return preVal 
            }, [])
            console.log(data2,'data2');
        }
    }
    
}
export default usb;