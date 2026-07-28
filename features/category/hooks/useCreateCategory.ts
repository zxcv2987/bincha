"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { createCategoryByName } from "@/features/category/category.actions";
import { CategoryType } from "@/features/category/category.types";

export default function useCreateCategory(
  onSuccess: (category: CategoryType) => void,
) {
  // refresh: false — 이 화면에서는 zustand 스토어를 직접 갱신해 즉시
  // 반영하므로, 모달이 열려 있는 채로 router.refresh()까지 할 필요는 없다.
  // createCategoryByName은 성공 시 항상 data를 주지만 ActionResult의 data는
  // 범용 타입이라 optional이라, 여기서만 안전하게 좁혀 넘긴다.
  return useAsyncAction(createCategoryByName, {
    onSuccess: (data) => {
      if (data) onSuccess(data);
    },
    refresh: false,
  });
}
