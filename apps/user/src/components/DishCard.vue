<script setup lang="ts">
import type { Dish } from '@campus-food/shared'

interface Props {
  dish: Dish
}

defineProps<Props>()

const emit = defineEmits<{
  click: [dish: Dish]
}>()
</script>

<template>
  <div class="dish-card" @click="emit('click', dish)">
    <van-image :src="dish.image" fit="cover" class="dish-image" />
    <div class="dish-info">
      <div class="dish-name">{{ dish.name }}</div>
      <div class="dish-desc">{{ dish.description }}</div>
      <div class="dish-specs" v-if="dish.specifications">
        {{ dish.specifications }}
      </div>
      <div class="dish-footer">
        <div class="dish-price">
          <span class="current-price">¥{{ dish.price }}</span>
          <span class="original-price" v-if="dish.originalPrice">
            ¥{{ dish.originalPrice }}
          </span>
        </div>
        <div class="dish-sales">已售 {{ dish.sales }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dish-card {
  display: flex;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    background: #f7f8fa;
  }
}

.dish-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  flex-shrink: 0;
}

.dish-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dish-name {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dish-desc {
  font-size: 12px;
  color: #969799;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.dish-specs {
  font-size: 11px;
  color: #646566;
  background: #f7f8fa;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  align-self: flex-start;
  margin-bottom: 8px;
}

.dish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #ee0a24;
}

.original-price {
  font-size: 12px;
  color: #969799;
  text-decoration: line-through;
}

.dish-sales {
  font-size: 12px;
  color: #969799;
}
</style>
