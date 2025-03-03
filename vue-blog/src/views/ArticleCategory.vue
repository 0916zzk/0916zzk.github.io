<template lang="">
    <el-card class="blog-article-category">
    </el-card>
</template>
<script setup>
/*eslint no-undef: "warn"*/
import { inject, onBeforeMount, ref, onMounted, onBeforeUnmount } from "vue"
// import * as echarts from 'echarts';
// import 'echarts-wordcloud';
import { useRouter } from "vue-router";
import bus from "@/util/bus"
let chart;
let categories = ref([]);
const axios = inject("axios")
async function getCategory() {
    try {
        await getCategories()
    } catch (e) {
        console.log(e);
    }
}
async function getCategories() {
    let res = await axios({
        type: "category"
    })
    categories.value = res.list.map(item => {
        return {
            "name": item.name,
            "value": item.aids.length,
            "id": item._id
        }
    })
    chart.setOption({
        series: {
            data: categories.value
        }
    })
}
onBeforeMount(() => {
    getCategory()
})
const router = useRouter()
onMounted(() => {
    chart = echarts.init(document.querySelector('.blog-article-category'))
    setChartOption()
    chart.on('click', function (params) {
        router.push(`/index?categoryId=${params.data.id}`)
    });
})
//监听category更新
bus.on("postCategory", getCategories)
onBeforeUnmount(() => {
    bus.off("postCategory", getCategories)
})
function setChartOption() {
    chart.setOption({
        title: {
            text: '文章分类',
            textStyle: {
                fontWeight: 'bold',
                fontSize: 30,//字体大小
                lineHeight: 40,//字体行高
            },
            x: "center",

        },
        series: [{
            type: 'wordCloud',
            shape: 'triangle-forward',
            keepAspect: false,
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            right: null,
            bottom: null,
            sizeRange: [36, 70],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 8,
            drawOutOfBound: false,
            shrinkToFit: true,
            layoutAnimation: true,
            textStyle: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function () {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                focus: 'pointer',

                textStyle: {
                    textShadowBlur: 10,
                    textShadowColor: '#333'
                }
            },
            data: categories.value
        }]
    });
}

</script>
<style lang="less">
.blog-article-category {
    height: 100%;
    width: 100%;
}
</style>