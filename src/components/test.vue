<template>
  <div></div>
</template>
<script>
  export default {
    name : 'test',
    data(){
      return {
        msg: '请输入'
      }
    },
    props : ['inputValue'],
    methods : {
      inputValue(msg){
        console.log(msg);
      }
    }
  }
</script>
