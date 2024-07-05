// import { stat } from "fs/promises";

// import httpWX from '../../utils/wx-request';
// import api from '../../utils/interface';
// import { resolve } from 'q';

const loginUser = {
    state:{
        openid:"",
        sessionkey:"",
        userId:"", // 用户id
        fullName:"" // 用户名字
    },
    mutations:{
        updateOpenid(state,openid){
            console.log(openid,'1213123');
            state.openid = openid;
        },
        updateSessionkey(state,sessionkey){
            state.sessionkey = sessionkey;
        },
        updateUserId(state,userId){
            state.userId = userId;
        },
        updateFullName(state,fullName){
            state.fullName = fullName;
        }
    },
    actions:{

    },
    getters:{

    }
}
export default loginUser;