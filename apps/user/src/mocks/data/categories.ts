import type { Category } from '@campus-food/shared'

/**
 * 菜品分类数据
 */
export const categories: Category[] = [
  // 第一食堂分类
  {
    id: '1',
    canteenId: '1',
    name: '热菜',
    sort: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    canteenId: '1',
    name: '凉菜',
    sort: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    canteenId: '1',
    name: '主食',
    sort: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  // 第二食堂分类
  {
    id: '4',
    canteenId: '2',
    name: '面食',
    sort: 1,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '5',
    canteenId: '2',
    name: '盖浇饭',
    sort: 2,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '6',
    canteenId: '2',
    name: '小吃',
    sort: 3,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  // 清真食堂分类
  {
    id: '7',
    canteenId: '3',
    name: '清真热菜',
    sort: 1,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
  {
    id: '8',
    canteenId: '3',
    name: '清真面食',
    sort: 2,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
]
