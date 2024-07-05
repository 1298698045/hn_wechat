<template>
    <div class="wrapper">
        <div class="center">
            <van-cell-group :title="item.title" v-for="(item,index) in list" :key="index">
                <van-cell v-for="(v,idx) in item.children" :key="idx" :title="v.label" :value="v.value" />
            </van-cell-group>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            sessionkey:wx.getStorageSync('sessionkey'),
            id:"",
            list: [], // 修改后的表单结构
            currenData:[],
            record: []
        }
    },
    onLoad(options){
        this.id = options.id;
        // this.getDetail(); 
        this.getLayoutData()
    },
    methods:{
        getLayoutData(){
            let message = JSON.stringify({"params":{"recordId":this.id,"record":null,"inContextOfComponent":"","entityApiName":"HREmployee","mode":"EDIT","layoutType":"FULL","navigationLocation":"DETAIL"},"storable":true})
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.human.formList,
                    SessionKey:this.sessionkey,
                    message: message
                }
            }).then(res=>{
                let list = res.actions[0].returnValue.componentDef.sections;
                list.forEach(item=>{
                    item.children = []
                    if(item.rows&&item.rows!=''){
                        item.rows.forEach(row=>{
                            row.attributes.forEach(self=>{
                                self = Object.assign(self,self.attributes)
                                console.log(self)
                                self.id = self.localId
                                self.index = '';
                                item.children.push(self)
                            })
                        })
                    }
                })
                this.list = list;
                this.currenData = res.context.picklistValuesMap;
                console.log('this.currenData:', this.currenData)
                this.record = res.actions[0].returnValue.record;
                this.list.forEach(item=>{
                    // console.log('123123123123:',item)
                    item.children.forEach(self=>{
                        this.$set(self,'value','');
                        if(self.type=='F'){
                            let multiIndex = this.getIndex(currentTime());
                            self.multiIndex = multiIndex;
                        }
                        if(!self.readonly){
                            var obj = self.id;
                            if(this.record[obj] instanceof Object){
                                console.log(this.record[obj].Name,'this.record[obj].Name')
                                self.value = this.record[obj].Name;
                            }else {
                                console.log(this.record[obj],'======')
                                self.value = this.record[obj]
                            }
                        }
                    })
                })
                console.log(this.list,'-=-=-=-==-=')
            })
        },
        getDetail(){
            this.$httpWX.get({
                url:this.$api.message.queryList,
                data:{
                    method:this.$api.human.detail,
                    SessionKey:this.sessionkey,
                    entityType: 'a0V',
                    // id: this.id
                }
            }).then(res=>{
                console.log(res);
            })
        },
    }
}
</script>
<style lang="scss">
    
</style>