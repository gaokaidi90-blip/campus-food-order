<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserProfile, updateUserProfile, uploadImage } from '@/api'
import { showToast, showConfirmDialog } from 'vant'
import type { User } from '@campus-food/shared'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const userInfo = ref<Omit<User, 'password'> | null>(null)
const showEditDialog = ref(false)
const editForm = ref({
  name: '',
  avatar: [] as any[]
})

/**
 * 加载用户信息
 */
async function fetchUserInfo() {
  loading.value = true
  try {
    const { data } = await getUserProfile()
    userInfo.value = data.data
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 退出登录
 * 清除本地 token 并跳转到登录页
 */
async function handleLogout() {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要退出登录吗？',
    })

    // 调用 store 中的退出方法
    userStore.logout()

    // 跳转到登录页
    router.replace('/login')
  } catch {
    // 用户取消退出
  }
}

/**
 * 跳转到订单列表
 */
function goToOrders() {
  router.push('/order')
}

/**
 * 跳转到地址管理
 */
function goToAddress() {
  router.push('/address')
}

/**
 * 打开编辑对话框
 */
function handleEdit() {
  if (!userInfo.value) return
  editForm.value.name = userInfo.value.name
  editForm.value.avatar = []
  showEditDialog.value = true
}

/**
 * 保存用户信息
 */
async function handleSave() {
  if (!editForm.value.name.trim()) {
    showToast('请输入昵称')
    return
  }

  loading.value = true
  try {
    // 处理头像：如果有上传的文件，先上传到服务器
    let avatarUrl = userInfo.value?.avatar || ''
    if (editForm.value.avatar.length > 0) {
      const file = editForm.value.avatar[0]
      if (file.file) {
        // 新上传的文件，上传到服务器
        const formData = new FormData()
        formData.append('file', file.file)

        const uploadRes = await uploadImage(formData, 'avatar')
        avatarUrl = uploadRes.data.data.url
      }
    }

    const { data } = await updateUserProfile({
      name: editForm.value.name,
      avatar: avatarUrl || undefined,
    })
    userInfo.value = data.data
    showEditDialog.value = false
    showToast('保存成功')
  } catch (error) {
    showToast('保存失败')
  } finally {
    loading.value = false
  }
}

/**
 * 图片上传后的回调
 */
function afterRead(file: any) {
  // van-uploader 会自动处理文件，file.file 包含原始 File 对象
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="profile-container">
    <van-nav-bar title="我的" fixed />

    <div class="content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <van-skeleton :loading="loading" :row="3">
          <div v-if="userInfo" class="user-info">
            <van-image
              v-if="userInfo.avatar"
              :src="userInfo.avatar"
              class="avatar-img"
              round
            />
            <van-icon v-else name="user-circle-o" class="avatar" />
            <div class="info">
              <div class="name">{{ userInfo.name }}</div>
              <div class="student-id">学号：{{ userInfo.studentId }}</div>
              <div class="phone">手机：{{ userInfo.phone }}</div>
            </div>
            <van-button
              type="primary"
              size="small"
              round
              @click="handleEdit"
            >
              编辑
            </van-button>
          </div>
        </van-skeleton>
      </div>

      <!-- 功能列表 -->
      <van-cell-group inset title="我的服务">
        <van-cell title="我的订单" icon="orders-o" is-link @click="goToOrders" />
        <van-cell title="收货地址" icon="location-o" is-link @click="goToAddress" />
      </van-cell-group>

      <!-- 退出登录 -->
      <div class="logout-wrapper">
        <van-button type="danger" block @click="handleLogout">退出登录</van-button>
      </div>
    </div>

    <van-tabbar route>
      <van-tabbar-item icon="wap-home" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/order">订单</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>

    <!-- 编辑对话框 -->
    <van-dialog
      v-model:show="showEditDialog"
      title="编辑资料"
      show-cancel-button
      @confirm="handleSave"
    >
      <van-form class="edit-form">
        <van-field
          v-model="editForm.name"
          label="昵称"
          placeholder="请输入昵称"
          required
        />
        <van-field label="头像">
          <template #input>
            <van-uploader
              v-model="editForm.avatar"
              :max-count="1"
              :after-read="afterRead"
            />
          </template>
        </van-field>
      </van-form>
    </van-dialog>
  </div>
</template>

<style lang="less" scoped>
.profile-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;
}

.content {
  padding-top: 46px;
}

.user-card {
  background: #fff;
  padding: 24px 16px;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  font-size: 64px;
  color: #1989fa;
  margin-right: 16px;
  flex-shrink: 0;
}

.avatar-img {
  width: 64px;
  height: 64px;
  margin-right: 16px;
  flex-shrink: 0;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 18px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 8px;
}

.student-id,
.phone {
  font-size: 14px;
  color: #969799;
  margin-bottom: 4px;
}

.logout-wrapper {
  margin-top: 24px;
  padding: 0 16px;
}

.edit-form {
  padding: 16px;
}
</style>
