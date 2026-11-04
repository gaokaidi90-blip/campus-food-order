<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrder } from '@/composables/useOrder'
import { getAddresses } from '@/api'
import type { Address } from '@campus-food/shared'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { createOrder } = useOrder()

const loading = ref(false)
const addresses = ref<Address[]>([])
const selectedAddressId = ref('')
const remark = ref('')

// 从 query 中获取选中的购物车项 ID
const itemIds = (route.query.items as string)?.split(',') || []

/**
 * 计算选中的购物车项
 */
const selectedItems = computed(() => {
  return cartStore.cartItems.filter((item) => itemIds.includes(item.id))
})

/**
 * 计算总价
 */
const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    const price = item.dish?.price || 0
    return sum + price * item.quantity
  }, 0)
})

/**
 * 获取食堂 ID
 */
const canteenId = computed(() => {
  return selectedItems.value[0]?.canteenId || ''
})

/**
 * 加载地址列表
 */
async function fetchAddresses() {
  try {
    const { data } = await getAddresses()
    addresses.value = data.data

    // 自动选择默认地址
    const defaultAddress = addresses.value.find((addr) => addr.isDefault === 1)
    if (defaultAddress) {
      selectedAddressId.value = defaultAddress.id
    } else if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0]!.id
    }
  } catch (error) {
    showToast('加载地址失败')
  }
}

/**
 * 选择地址
 */
function handleSelectAddress() {
  router.push('/address')
}

/**
 * 提交订单
 */
async function handleSubmit() {
  if (!selectedAddressId.value) {
    showToast('请选择收货地址')
    return
  }

  if (selectedItems.value.length === 0) {
    showToast('购物车为空')
    return
  }

  loading.value = true

  await createOrder({
    canteenId: canteenId.value,
    addressId: selectedAddressId.value,
    items: selectedItems.value.map((item) => ({
      dishId: item.dishId,
      quantity: item.quantity,
    })),
    remark: remark.value || undefined,
  })

  loading.value = false
}

onMounted(() => {
  cartStore.fetchCart()
  fetchAddresses()
})
</script>

<template>
  <div class="checkout-container">
    <van-nav-bar title="确认订单" left-arrow @click-left="router.back()" fixed />

    <div class="content">
      <!-- 收货地址 -->
      <van-cell-group inset title="收货地址">
        <van-cell
          v-if="addresses.length > 0 && selectedAddressId"
          :title="addresses.find(a => a.id === selectedAddressId)?.name"
          :label="`${addresses.find(a => a.id === selectedAddressId)?.address} ${addresses.find(a => a.id === selectedAddressId)?.building} ${addresses.find(a => a.id === selectedAddressId)?.room}`"
          :value="addresses.find(a => a.id === selectedAddressId)?.phone"
          is-link
          @click="handleSelectAddress"
        />
        <van-cell
          v-else
          title="请选择收货地址"
          is-link
          @click="handleSelectAddress"
        />
      </van-cell-group>

      <!-- 商品信息 -->
      <van-cell-group inset title="商品信息">
        <div class="dish-list">
          <div
            v-for="item in selectedItems"
            :key="item.id"
            class="dish-item"
          >
            <van-image :src="item.dish?.image" fit="cover" class="dish-image" />
            <div class="dish-info">
              <div class="dish-name">{{ item.dish?.name }}</div>
              <div class="dish-meta">
                <span class="dish-price">¥{{ item.dish?.price }}</span>
                <span class="dish-quantity">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-cell-group>

      <!-- 备注 -->
      <van-cell-group inset title="备注">
        <van-field
          v-model="remark"
          rows="3"
          autosize
          type="textarea"
          placeholder="请输入备注信息（选填）"
        />
      </van-cell-group>
    </div>

    <!-- 提交订单 -->
    <van-submit-bar
      :price="totalPrice * 100"
      button-text="提交订单"
      :loading="loading"
      @submit="handleSubmit"
      style="bottom: 50px"
    />

    <van-tabbar route>
      <van-tabbar-item icon="wap-home" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/order">订单</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="less" scoped>
.checkout-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 100px;
}

.content {
  padding-top: 46px;
}

.dish-list {
  padding: 12px 16px;
}

.dish-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.dish-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-right: 12px;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60px;
}

.dish-name {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
}

.dish-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-price {
  font-size: 14px;
  color: #ee0a24;
  font-weight: bold;
}

.dish-quantity {
  font-size: 13px;
  color: #969799;
}
</style>
