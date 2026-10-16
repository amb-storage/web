"use client";

import { useTranslations } from "next-intl";
import { Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  hasRefineFilters,
  useRefineDrawer,
  type RefineFilters,
  type RefineGroup,
} from "./useRefineDrawer";

interface RefineOption {
  value: string;
  label: string;
}

interface RefineDrawerProps {
  open: boolean;
  applied: RefineFilters;
  categories: RefineOption[];
  periods: RefineOption[];
  sizes: RefineOption[];
  onClose: () => void;
  onApply: (filters: RefineFilters) => void;
}

const rowClass =
  "relative flex h-16 w-full items-center justify-between border-b-[0.5px] border-black/12 pl-8 pr-7 text-left text-sm font-medium leading-[1.57]";

export default function RefineDrawer({
  open,
  applied,
  categories,
  periods,
  sizes,
  onClose,
  onApply,
}: RefineDrawerProps) {
  const t = useTranslations("shop");
  const {
    panelRef,
    backdropRef,
    groupPanelRef,
    closeButtonRef,
    draft,
    activeGroup,
    openGroup,
    closeGroup,
    setDraftValue,
    selectOption,
    clearDraft,
    submit,
  } = useRefineDrawer(open, applied, onClose, onApply);

  const groups: Array<{ key: RefineGroup; label: string; isSet: boolean }> = [
    { key: "category", label: t("filters.category"), isSet: draft.category !== "all" },
    { key: "period", label: t("filters.period"), isSet: draft.period !== "all" },
    { key: "price", label: t("filters.price"), isSet: draft.priceMin !== "" || draft.priceMax !== "" },
    { key: "size", label: t("filters.size"), isSet: draft.size !== "all" },
  ];
  const listOptions = { category: categories, period: periods, size: sizes };
  const activeLabel = groups.find((group) => group.key === activeGroup)?.label;
  const canClear = hasRefineFilters(draft);

  return (
    <>
      <div
        ref={backdropRef}
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 z-640 hidden touch-none bg-black/80 opacity-0"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("refine.title")}
        className="fixed right-0 top-0 z-650 hidden h-dvh w-full bg-white md:w-100"
      >
        <div className="flex h-full flex-col">
          {/* Tiêu đề drawer */}
          <div className="relative h-20 shrink-0 px-6 pb-6 pt-8 text-sm font-light leading-[1.71]">
            <p>{t("refine.title")}</p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t("refine.close")}
              className="absolute right-7 top-1/2 grid h-7 w-7 -translate-y-1/2 place-content-center"
            >
              <X className="h-4 w-4" strokeWidth={1.25} />
            </button>
          </div>

          <div
            data-lenis-prevent
            className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain border-t border-black/12"
            style={{ scrollbarWidth: "none" }}
          >
            {/* Danh sách nhóm lọc */}
            {groups.map((group) => (
              <button
                key={group.key}
                type="button"
                onClick={() => openGroup(group.key)}
                className={rowClass}
              >
                {group.label}
                <span className="flex items-center gap-10">
                  {group.isSet && (
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-black" />
                  )}
                  <ChevronRight className="h-5 w-5 text-black/55" strokeWidth={1} />
                </span>
              </button>
            ))}

            {/* Panel con của nhóm đang mở */}
            {activeGroup && (
              <div ref={groupPanelRef} className="absolute inset-0 bg-white">
                <div className="flex h-14 items-center gap-4 px-6">
                  <button
                    type="button"
                    onClick={closeGroup}
                    aria-label={t("refine.back")}
                    className="-m-2 p-2"
                  >
                    <ChevronLeft className="h-5 w-5 text-black/55" strokeWidth={1} />
                  </button>
                  <p className="text-lg font-medium leading-[1.55]">{activeLabel}</p>
                </div>

                {activeGroup === "price" ? (
                  <div className="flex flex-wrap items-center gap-1.5 px-6 py-4 text-[11.2px] font-light">
                    <span>¥</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={draft.priceMin}
                      onChange={(event) => setDraftValue("priceMin", event.target.value)}
                      aria-label={t("refine.priceMin")}
                      className="h-10 w-36.75 rounded bg-black/3 pl-4 text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span>〜</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={draft.priceMax}
                      onChange={(event) => setDraftValue("priceMax", event.target.value)}
                      aria-label={t("refine.priceMax")}
                      className="h-10 w-36.75 rounded bg-black/3 pl-4 text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                ) : (
                  <div role="radiogroup" aria-label={activeLabel}>
                    {[{ value: "all", label: "ALL" }, ...listOptions[activeGroup]].map(
                      (option) => {
                        const isSelected = draft[activeGroup] === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => selectOption(activeGroup, option.value)}
                            className={rowClass}
                          >
                            {option.label}
                            {isSelected && <Check className="h-4 w-4" strokeWidth={1} />}
                          </button>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nút xoá điều kiện + áp dụng */}
          <div className="flex shrink-0 justify-center bg-white px-6 pb-8 pt-4 shadow-[0_0_4px_#0000001f]">
            <button
              type="button"
              onClick={clearDraft}
              disabled={!canClear}
              className="h-7 w-full max-w-32 text-[11.2px] leading-[1.51] tracking-[0.224px] text-black disabled:text-black/16"
            >
              {t("refine.clear")}
            </button>
            <button
              type="button"
              onClick={submit}
              className="relative flex h-7 w-full max-w-54 items-center justify-center rounded-full border-[0.5px] border-black/20 text-[11.2px] leading-[1.51] tracking-[0.224px] transition-colors hover:bg-[#3f3f3f] hover:text-white"
            >
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" strokeWidth={1.25} />
              {t("refine.apply")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
