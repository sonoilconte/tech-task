export interface UseProductLoading {
  setProductLoading: (id: string | null) => void;
  isProductLoading: (id: string) => boolean;
}
