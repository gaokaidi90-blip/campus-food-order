/**
 * 从 shared package 导入所有 mock 数据
 * 用户端和管理端操作同一份数据，确保数据一致性
 */
export {
  users,
  userPasswords,
  canteens,
  categories,
  dishes,
  orders,
  addresses,
  carts,
} from '@campus-food/shared/mocks'
