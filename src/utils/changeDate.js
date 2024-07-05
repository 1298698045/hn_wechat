export const getDate = ( ModifiedOn ) => {
    let time = (new Date(ModifiedOn)).getTime();
    time = new Date(time);
    var year = time.getFullYear()+'年';
    var month = time.getMonth()+1+'月';
    var date = time.getDate()+'日';
    const newDate = `${month}${date}`;
    return newDate;
};