<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { DishRank } from '@/api'

echarts.use([BarChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])

const props = defineProps<{
  data: DishRank[]
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const isEmpty = computed(() => !props.data || props.data.length === 0)

function initChart() {
  if (!chartRef.value) return

  // 空数据处理
  if (isEmpty.value) {
    if (chartInstance) {
      chartInstance.clear()
    }
    return
  }

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const param = params[0]
        const dish = props.data[param.dataIndex]
        return `${param.axisValue}<br/>销量: ${dish.count}<br/>销售额: ¥${dish.revenue.toFixed(2)}`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.dishName),
      axisLabel: {
        interval: 0,
        rotate: 30,
        formatter: (value: string) => {
          return value.length > 6 ? value.substring(0, 6) + '...' : value
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '销量',
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f56c6c' },
            { offset: 1, color: '#fef0f0' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#f56c6c' },
              { offset: 1, color: '#f56c6c' },
            ]),
          },
        },
        data: props.data.map((item) => item.count),
      },
    ],
  }

  chartInstance.setOption(option)
}

watch(
  () => props.data,
  () => {
    initChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => chartInstance?.resize())
})
</script>

<template>
  <div v-if="isEmpty" class="empty-chart">
    <el-empty description="暂无数据" />
  </div>
  <div v-else ref="chartRef" style="width: 100%; height: 350px"></div>
</template>

<style scoped>
.empty-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
}
</style>
