/**
 * 引用用户端的共享数据
 * 管理端和用户端操作同一份数据，确保数据一致性
 */

// 食堂数据
export { canteens } from '../../../user/src/mocks/data/canteens'

// 分类数据
export { categories } from '../../../user/src/mocks/data/categories'

// 菜品数据
export { dishes } from '../../../user/src/mocks/data/dishes'

// 订单数据（管理端和用户端共享）
export { orders } from '../../../user/src/mocks/data/orders'

// 用户数据（只读，用于管理端查看）
export { users } from '../../../user/src/mocks/data/users'

// 地址数据
export { addresses } from '../../../user/src/mocks/data/addresses'
