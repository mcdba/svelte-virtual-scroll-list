<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  interface Props {
    horizontal?: boolean;
    uniqueKey: any;
    type?: string;
    resize: (event: { id: any; size: number; type: string }) => void;
    children?: import("svelte").Snippet;
  }

  let {
    horizontal = false,
    uniqueKey,
    type = "item",
    children,
    resize,
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

<div bind:this={itemDiv} class="virtual-scroll-item">
  {@render children?.()}
</div>
