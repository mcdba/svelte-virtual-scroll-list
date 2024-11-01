import VirtualScroll from "./VirtualScroll.svelte";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { VirtualScroll, cn };
export default VirtualScroll;
