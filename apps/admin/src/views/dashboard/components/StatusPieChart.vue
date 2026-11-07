<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { StatusDistribution } from '@/api'

echarts.use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer])

const props = defineProps<{
  data: StatusDistribution[]
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const isEmpty = computed(() => !props.data || props.data.length === 0)

// 状态中文映射
const statusMap: Record<string, string> = {
  pending: '待接单',
  accepted: '已接单',
  ready: '已完成',
  cancelled: '已取消',
}

// 状态颜色映射
const statusColorMap: Record<string, string> = {
  pending: '#e6a23c',
  accepted: '#409eff',
  ready: '#67c23a',
  cancelled: '#909399',
}

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
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      bottom: '5%',
      left: 'center',
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: props.data.map((item) => ({
          name: statusMap[item.status] || item.status,
          value: item.count,
          itemStyle: {
            color: statusColorMap[item.status] || '#409eff',
          },
        })),
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
