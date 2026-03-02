import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoneyInput(amountInCents: number | null) {
  if (amountInCents === null) {
    return "";
  }

  return (amountInCents / 100).toFixed(2);
}

export function formatDateTimeInput(value: Date | null) {
  if (!value) {
    return "";
  }

  return format(value, "yyyy-MM-dd'T'HH:mm");
}
