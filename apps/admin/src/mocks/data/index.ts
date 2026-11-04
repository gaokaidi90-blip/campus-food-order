/**
 * 从 shared package 导入所有 mock 数据
 * 管理端和用户端操作同一份数据，确保数据一致性
 */
export {
  admins,
  users,
  canteens,
  categories,
  dishes,
  orders,
  saveOrders,
  addresses,
} from '../../../../../packages/shared/src/mocks'
