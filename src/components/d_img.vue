<template>
    <div class="public_file">
        <img v-if="item.fileExtension=='jpg'||item.fileExtension=='png'||item.fileExtension=='webp'" :src="item.link" alt="">
        <img v-else-if="item.fileExtension=='xls' || item.fileExtension=='xlsx'" :src="photoUrl+'xls.png'" alt="">
        <img v-else-if="item.fileExtension=='doc' || item.fileExtension=='word' || item.fileExtension=='docx'" :src="photoUrl+'02.3.1.Word.png'" alt="">
        <img v-else-if="item.fileExtension=='rar'" :src="photoUrl+'rar.png'" alt="">
        <img v-else-if="item.fileExtension=='txt'" :src="photoUrl+'02.3.1.Txt.png'" alt="">
        <img v-else-if="item.fileExtension=='pdf'" :src="photoUrl+'02.3.1.Pdf.png'" alt="">
        <img v-else-if="item.fileExtension=='ppt'" :src="photoUrl+'02.3.1.PPT.png'" alt="">
    </div>
</template>
<script>
export default {
    name: 'dImg',
    props:['item'],
    computed:{
        photoUrl(){
            return this.$api.photo.url;
        }
    },
    data(){
        return {
            
        }
    },
    onLoad(){
    },
    methods:{

    }
}
</script>
<style lang="scss" scoped>
    .public_file{
        width: 100%;
        height: 100%;
    }
</style>