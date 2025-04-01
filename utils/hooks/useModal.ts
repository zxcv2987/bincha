import { useState, useEffect, useRef } from "react";
import { useModalStore } from "../providers/ModalProvider";

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.getElementById("root") ?? document.body;
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      root.addEventListener("mousedown", handleClickOutside);
    } else {
      root.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      root.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return { isOpen, setIsOpen, modalRef };
}
