<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { TrendData } from '@/api'

echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])

const props = defineProps<{
  data: TrendData[]
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
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
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
      boundaryGap: false,
      data: props.data.map((item) => item.date),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2,
        },
        areaStyle: {
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#ecf5ff' },
          ]),
        },
        itemStyle: {
          color: '#409eff',
        },
        data: props.data.map((item) => item.value),
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
