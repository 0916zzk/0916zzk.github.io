<template lang="">
    <div class="category-info">
            <div class="category-heading">
                <h3 class="category-title">分类</h3>
            </div>
            <div id="blog-editor—category">
                <div v-for="item in categories" :key="item._id">
                    <input type="radio" name="category" id="{{item._id}}" style="display: none;" value="{{item._id}}" v-model="category">
                    <label for="{{_id}}" :class="{active:category===item._id}" @click="changeCategory(item._id)">{{item.name}}</label>
                </div>
            </div>
        </div>
</template>
<script setup>

const { categories } = defineProps({
    categories: {
        type:Array
    }
})
const emit = defineEmits(["changeCategory"])
const category= defineModel("category")
function changeCategory(val) { 
    category.value = val
    emit("changeCategory",val)
}
</script>
<style lang="less">
.category-info{
    margin: @white-space 0;
    border: 1px solid @bg-motify-color;
}
.category-heading{
    padding:@white-space;
    background-color: @bg-theme-color;
    color: @bg-motify-color;
}
#blog-editor—category{
    box-sizing: content-box;
    height: 30px;
    display: flex;
    align-items: center;
    border-top: 1px solid @bg-motify-color;
    padding: @white-space;
    label{
        cursor: pointer;
        margin-right: @white-space;
        padding:@white-space;
        border: 1px solid @bg-motify-color;
        border-radius: @border-normal-radius;
        &.active{
            background-color: @bg-theme-color;
            color: white;
        }
    }
}
</style>