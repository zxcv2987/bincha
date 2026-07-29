"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Dialog({
  open,
  onClose,
  title,
  disableBackdropClose = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  disableBackdropClose?: boolean;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // 내부 폼에 입력이 있었는지 추적한다. input/select 어떤 필드든 change가 버블되면
  // dirty로 표시하고, 닫기 직전(ESC/백드롭/X)에만 확인창을 띄운다 — 제출 성공 후
  // 부모가 open을 false로 내려서 닫히는 경로는 이 가드를 타지 않는다.
  const dirtyRef = useRef(false);

  // <dialog>는 open prop이 아니라 showModal()/close() 명령형 호출로 제어한다.
  // 실제로 닫히는 경로(ESC, 백드롭 클릭, X 버튼)는 전부 dialogRef.close()로
  // 모으고, 네이티브 close 이벤트 하나가 onClose prop을 호출한다 — 그래서
  // 이 effect는 열 때만 showModal()을 부르면 되고, dialog.open으로
  // 중복 close 호출을 막는다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dirtyRef.current = false;
      dialog.showModal();
      // React의 autoFocus는 마운트 시점에 .focus()를 호출할 뿐 실제 autofocus
      // 속성을 심지 않는데, 그 시점엔 dialog가 아직 열리기 전(display:none)이라
      // 포커스가 먹히지 않는다. showModal() 이후 헤더(닫기 버튼)를 제외한
      // content 영역에서 첫 포커스 가능 요소를 직접 찾아 포커스한다.
      contentRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  const confirmDiscard = () =>
    !dirtyRef.current || window.confirm("작성 중인 내용이 있습니다. 닫으시겠습니까?");

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(e) => {
        if (!confirmDiscard()) e.preventDefault();
      }}
      onChangeCapture={(e) => {
        const target = e.target;
        // 라디오/체크박스 선택은 원클릭으로 되돌릴 수 있는 "선택"이지 잃어버릴
        // "작성 중인 내용"이 아니므로 dirty 판단에서 제외한다.
        if (
          target instanceof HTMLInputElement &&
          (target.type === "radio" || target.type === "checkbox")
        )
          return;
        dirtyRef.current = true;
      }}
      onClick={(e) => {
        if (!disableBackdropClose && e.target === dialogRef.current && confirmDiscard()) {
          dialogRef.current?.close();
        }
      }}
      aria-labelledby="modal-title"
      // dialog:modal의 기본 중앙정렬은 margin:auto인데, 전역 preflight가
      // 모든 요소의 margin을 0으로 리셋해버려서 명시적으로 다시 넣어야 한다.
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-fit overflow-y-auto rounded-xl bg-white p-4 shadow-xl backdrop:bg-zinc-700/20"
    >
      <div className="flex w-full flex-row items-center justify-between border-b border-zinc-100 pb-3">
        <h2 id="modal-title" className="text-2xl font-bold text-zinc-700">
          {title}
        </h2>
        <button
          type="button"
          aria-label="모달 닫기"
          onClick={() => confirmDiscard() && dialogRef.current?.close()}
          className="cursor-pointer rounded px-1 text-sm font-thin text-zinc-700 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          ✖
        </button>
      </div>
      <div ref={contentRef} className="pt-4">{children}</div>
    </dialog>
  );
}
