import { create } from 'zustand';
import { type SwiperCardRefType } from 'rn-swiper-list';

interface SwiperStore {
  swiperRef: React.RefObject<SwiperCardRefType> | null;
  setSwiperRef: (ref: React.RefObject<SwiperCardRefType>) => void;
}

export const useSwiperStore = create<SwiperStore>((set) => ({
  swiperRef: null,
  setSwiperRef: (ref) => set({ swiperRef: ref }),
}));
