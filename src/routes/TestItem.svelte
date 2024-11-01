<script lang="ts">
  import { cn } from "$lib/index.js";
  import type { ClassValue } from "clsx";
  type Props = {
    uniqueKey: string;
    height: number;
    class?: string;
  };

  let { uniqueKey, height, class: className }: Props = $props();
</script>

<div
  style="height: {height}px"
  class={cn("rounded-xl border border-slate-300 bg-slate-200 p-4", className)}
>
  {uniqueKey} Item ({height}px)
</div>
