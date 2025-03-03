<template lang="">
    <el-scrollbar height="50vh" ref="chatref">
        <div class="blog-chat-wrap" ref="chatwrap">
            <div class="blog-chat-item" v-for="item in chatList" :key="item.time">
                <el-divider v-if="item.type==='action'" border-style="dashed">
                    <p class="blog-chat-action">{{item.content}}</p>
                </el-divider>
                <div class="blog-chat-user" v-else >
                    <div class="blog-chat-content" :style="{'justify-content':item.isMe?'flex-end':'flex-start'}">
                        <el-avatar :size="30" :src="item.avatar" v-if="!item.isMe"/>
                        <div class="blog-chat-right" :style="{'align-items':item.isMe?'flex-end':'flex-start'}">
                            <p class="blog-chat-name">{{item.nickname}}</p>
                            <el-card :class="{isme:item.isMe}" style="max-width:50vw" shadow="always"><p>{{item.content}}</p></el-card>
                            <p class="blog-chat-time" :style="{'text-align':item.isMe?'right':'left'}">{{item.time}}</p>
                        </div>
                        <el-avatar :size="30" :src="item.avatar" v-if="item.isMe"/>  
                    </div>
                    
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>
<script setup>

const { chatList } = defineProps({
    chatList:Array
})

</script>
<style lang="less">
.blog-chat-item{
    min-height: 30px;
}
.blog-chat-action{
    min-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    color:#ccc;
}
.blog-chat-content{
    display:flex;
    align-items: flex-start;
}
.blog-chat-right{
    display:flex;
    flex-direction:column;
}
.blog-chat-time{
    padding:@white-space;
    font-size: 12px;
    color:#ccc
}
.blog-chat-name{
    font-size: 14px;
    padding:0 @white-space;
    margin-bottom: 3px;
}
.blog-chat-user{
    display: flex;
    flex-direction: column;
    padding: 0 @white-space;
    margin: @white-space 0;
    .el-card{
        display: inline-block;
        user-select: none;
        margin: 0 @white-space;
        
        word-wrap:break-word;
        word-break:break-all;
        background-color: white;
        color:black;
        &.isme{
            background-color: rgb(51.2, 126.4, 204);
            color:white
        }
        .el-card__body{
            padding:@white-space;
            white-space: normal;
        }
    }
    
}
</style>