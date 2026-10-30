/**
 * 收货地址实体
 */
export interface Address {
  id: string
  userId: string
  name: string
  phone: string
  address: string
  building: string
  room: string
  isDefault: number
  createdAt: string
  updatedAt: string
}

/**
 * 创建地址请求
 */
export interface CreateAddressReq {
  name: string
  phone: string
  address: string
  building: string
  room: string
  isDefault?: number
}

/**
 * 更新地址请求
 */
export interface UpdateAddressReq {
  name?: string
  phone?: string
  address?: string
  building?: string
  room?: string
  isDefault?: number
}
