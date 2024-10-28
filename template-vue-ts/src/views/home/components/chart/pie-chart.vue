<template>
    <v-chart class="chart" autoresize :option="option" :loading="loading" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { EChartsOption } from 'echarts'
// import useAsync from '@/hooks/useAsync'
// import { useHomeStore } from '../store'

// const homeStore = useHomeStore()

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent
])

interface DataProps {
    name: string
    value: number
}

const AlarmMap: { [x: string]: string } = {
    alAlarm: '加油气液比A/L预警值',
    mbAlarm: '密闭性预警值',
    ndAlarm: '处理装置排放浓度预警值',
    pvAlarm: 'P/V阀状态预警值',
    ygylAlarm: '油罐压力预警值',
    yzAlarm: '液阻预警值'
}

const { data } = defineProps<{ data: DataProps[] }>()

// echart 加载动画
const loading = ref<boolean>()

const option: Ref<EChartsOption> = ref({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        bottom: 'bottom',
        itemWidth: 10,
        itemHeight: 10,
        borderRadius: 50
    },
    series: [
        {
            name: 'Warnings',
            type: 'pie',
            radius: [20, 100],
            center: ['50%', '40%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 5
            },
            // data: [],
            data: [
                // { value: 335, name: 'Direct' },
                // { value: 310, name: 'Email' },
                // { value: 234, name: 'Ad Networks' },
                // { value: 135, name: 'Video Ads' },
                // { value: 1548, name: 'Search Engines' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
}) as Ref<EChartsOption>

onMounted(() => {
    if (data) {
        option.value.series = [
            {
                name: 'Warnings',
                type: 'pie',
                radius: [20, 100],
                center: ['50%', '40%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 5
                },
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
})

watch(
    () => data,
    (v) => {
        // option.value.series[0].data = v;
        option.value.series = [
            {
                name: 'Warnings',
                type: 'pie',
                radius: [20, 100],
                center: ['50%', '40%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 5
                },
                data: v,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
)

//     return {
//       loading,
//       option
//     }
//   }
// }

// const AlarmMap: { [x: string]: string } = {
//   alAlarm: '加油气液比A/L预警值',
//   mbAlarm: '密闭性预警值',
//   ndAlarm: '处理装置排放浓度预警值',
//   pvAlarm: 'P/V阀状态预警值',
//   ygylAlarm: '油罐压力预警值',
//   yzAlarm: '液阻预警值'
// }
</script>

<style scoped>
.chart {
    height: 380px;
}
</style>
