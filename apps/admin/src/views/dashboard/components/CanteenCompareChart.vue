<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { CanteenStats } from '@/api'

echarts.use([
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
])

const props = defineProps<{
  data: CanteenStats[]
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
    },
    legend: {
      data: ['订单数', '营业额'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.canteenName),
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数',
        position: 'left',
      },
      {
        type: 'value',
        name: '营业额(元)',
        position: 'right',
        axisLabel: {
          formatter: '¥{value}',
        },
      },
    ],
    series: [
      {
        name: '订单数',
        type: 'bar',
        yAxisIndex: 0,
        itemStyle: {
          color: '#409eff',
          borderRadius: [5, 5, 0, 0],
        },
        data: props.data.map((item) => item.orders),
      },
      {
        name: '营业额',
        type: 'bar',
        yAxisIndex: 1,
        itemStyle: {
          color: '#67c23a',
          borderRadius: [5, 5, 0, 0],
        },
        data: props.data.map((item) => item.revenue),
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
  <div v-else ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<style scoped>
.empty-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}
</style>
