import type { Canteen } from '@campus-food/shared'

/**
 * 食堂数据
 */
export const canteens: Canteen[] = [
  {
    id: '1',
    name: '第一食堂',
    description: '提供中式快餐，物美价廉',
    image: '/images/provided/canteen-1.jpg',
    address: '教学楼A区1楼',
    openTime: '07:00',
    closeTime: '20:00',
    status: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: '第二食堂',
    description: '特色美食，品种丰富',
    image: '/images/provided/canteen-2.jpg',
    address: '教学楼B区2楼',
    openTime: '07:30',
    closeTime: '21:00',
    status: 1,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: '第三食堂',
    description: '环境宽敞，提供多种特色美食',
    image: '/images/provided/canteen-3.jpg',
    address: '教学楼C区1楼',
    openTime: '08:00',
    closeTime: '19:00',
    status: 1,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
]
