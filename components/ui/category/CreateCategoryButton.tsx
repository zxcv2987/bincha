// components/ui/category/CreateCategoryButton.tsx
"use client";

import { useModalStore } from "@/utils/providers/ModalProvider";
import Modal from "@/components/common/modal/Modal";
import CategoryForm from "@/components/ui/category/CategoryForm";

export default function CreateCategoryButton() {
  const open = useModalStore((set) => set.open);

  return (
    <>
      <button
        className="btn max-h-[50px] w-full md:max-w-[200px]"
        onClick={() => open("category")}
      >
        카테고리 추가 +
      </button>
      <Modal modalType="category">
        <Modal.Title>카테고리</Modal.Title>
        <CategoryForm />
      </Modal>
    </>
  );
}
