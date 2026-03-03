"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export interface AdminSelectOption {
  value: string;
  label: string;
  description?: string;
  badgeClassName?: string;
  iconClassName?: string;
}

interface AdminSelectProps {
  value: string;
  options: AdminSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  fullWidth?: boolean;
  showBadge?: boolean;
  labelRenderer?: (
    selected: AdminSelectOption | undefined,
    placeholder: string
  ) => React.ReactNode;
}

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminSelect({
  value,
  options,
  onChange,
  placeholder = "Select option",
  className,
  buttonClassName,
  fullWidth = true,
  showBadge = true,
  labelRenderer,
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current?.contains(event.target as Node) ||
        triggerRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const badgeClass = selectedOption?.badgeClassName ?? "bg-gray-100 text-gray-700";

  return (
    <div className={classNames("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={classNames(
          "rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
          fullWidth ? "w-full" : "w-auto",
          buttonClassName
        )}
      >
        <div className="flex items-center justify-between gap-3">
          {labelRenderer ? (
            labelRenderer(selectedOption, placeholder)
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={classNames(
                  showBadge
                    ? "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                    : "text-sm font-medium",
                  badgeClass
                )}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              {selectedOption?.description && (
                <span className="text-xs text-gray-500">
                  {selectedOption.description}
                </span>
              )}
            </div>
          )}
          <i
            className={`fas fa-chevron-${open ? "up" : "down"} text-xs text-gray-500`}
          ></i>
        </div>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-50 mt-2 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-xl"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={classNames(
                "flex w-full items-center justify-between px-4 py-2 text-sm transition",
                opt.value === value
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-2">
                {opt.iconClassName && (
                  <i className={classNames(opt.iconClassName, "text-gray-500")}></i>
                )}
                <p className="font-medium">{opt.label}</p>
                {opt.description && (
                  <p className="text-xs text-gray-500">{opt.description}</p>
                )}
              </div>
              {opt.value === value && (
                <i className="fas fa-check text-blue-600"></i>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
