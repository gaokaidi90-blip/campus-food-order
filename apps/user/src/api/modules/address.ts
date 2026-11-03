import type {
  Address,
  CreateAddressReq,
  UpdateAddressReq,
} from '@campus-food/shared'
import { get, post, put, del } from '@/utils/request'

/**
 * 获取地址列表
 */
export function getAddresses() {
  return get<Address[]>('/user/addresses')
}

/**
 * 创建地址
 * @param data 地址信息
 */
export function createAddress(data: CreateAddressReq) {
  return post<Address>('/user/addresses', data)
}

/**
 * 更新地址
 * @param id 地址 ID
 * @param data 地址信息
 */
export function updateAddress(id: string, data: UpdateAddressReq) {
  return put<Address>(`/user/addresses/${id}`, data)
}

/**
 * 删除地址
 * @param id 地址 ID
 */
export function deleteAddress(id: string) {
  return del<null>(`/user/addresses/${id}`)
}
