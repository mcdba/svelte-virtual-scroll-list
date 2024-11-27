<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { cn } from "./index.js";
  interface Props {
    horizontal?: boolean;
    uniqueKey: any;
    type?: string;
    resize: (event: { id: any; size: number; type: string }) => void;
    children?: import("svelte").Snippet;
    class?: string;
    style?: string;
  }

  let {
    horizontal = false,
    uniqueKey,
    type = "item",
    children,
    resize,
    class: className,
    style = "",
  }: Props = $props();

  let resizeObserver: ResizeObserver;
  let itemDiv: HTMLDivElement | undefined = $state();
  let previousSize: number;

  const shapeKey = horizontal ? "offsetWidth" : "offsetHeight";

  onMount(() => {
    if (typeof ResizeObserver !== "undefined") {
      if (itemDiv) {
        resizeObserver = new ResizeObserver(dispatchSizeChange);
        resizeObserver.observe(itemDiv);
      }
    }
  });

  onDestroy(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  function dispatchSizeChange() {
    const size = itemDiv ? itemDiv[shapeKey] : 0;
    if (size === previousSize) return;
    previousSize = size;
    resize({ id: uniqueKey, size, type });
  }
</script>

<div bind:this={itemDiv} class={cn("virtual-scroll-item", className)} {style}>
  {@render children?.()}
</div>
