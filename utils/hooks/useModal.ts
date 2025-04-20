import { useState, useEffect, useRef } from "react";

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.getElementById("root") ?? document.body;
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !isLoading
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
  }, [isOpen, isLoading]);

  return { isOpen, setIsOpen, modalRef, isLoading, setIsLoading };
}
