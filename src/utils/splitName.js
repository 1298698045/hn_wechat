export const splitName = (str) =>{
    let name = '';
    if(str.length>2){
        name = str.substr(1);
    }else {
        name = str;
    }
    return name;
}