import type { Canteen } from '@campus-food/shared'

const localCanteenImages: Record<string, string> = {
  第一食堂: '/images/provided/canteen-1.jpg',
  第二食堂: '/images/provided/canteen-2.jpg',
  第三食堂: '/images/provided/canteen-3.jpg',
  清真食堂: '/images/provided/canteen-3.jpg',
}

export function getCanteenImage(canteen: Pick<Canteen, 'name' | 'image'>) {
  return localCanteenImages[canteen.name] || canteen.image
}
