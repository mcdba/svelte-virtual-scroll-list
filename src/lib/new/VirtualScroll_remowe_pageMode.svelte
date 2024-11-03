<script lang="ts">
  import Virtual, { isBrowser } from "./virtual.js";
  import Item from "./Item.svelte";
  import { onMount } from "svelte";
  import { cn } from "./index.js";

  interface Props {
    key?: string; // Unique key for getting data from `data`
    data: any[]; // Source for list
    keeps?: number; // Count of rendered items
    estimateSize?: number; // Estimate size of each item
    isHorizontal?: boolean; // Scroll direction
    start?: number; // Scroll position start index
    offset?: number; // Scroll position offset
    header?: import("svelte").Snippet;
    children?: import("svelte").Snippet<[any]>;
    footer?: import("svelte").Snippet;
    class?: string;
    classWrapper?: string;
    classItem?: string;
  }

  let {
    key = "id",
    data,
    keeps = 30,
    estimateSize = 50,
    isHorizontal = false,
    start = 0,
    offset = 0,
    header,
    children,
    footer,
    class: className,
    classWrapper,
    classItem,
  }: Props = $props();

  let displayItems: any[] = $state([]);
  let paddingStyle: string = $state("");
  let directionKey = isHorizontal ? "scrollLeft" : "scrollTop";

  let virtual = new Virtual(
    {
      slotHeaderSize: 0,
      slotFooterSize: 0,
      keeps: keeps,
      estimateSize: estimateSize,
      buffer: Math.round(keeps / 3), // Recommend for a third of keeps
      uniqueIds: getUniqueIdFromDataSources(),
    },
    onRangeChanged,
  );

  let root: HTMLDivElement | undefined = $state();
  let shepherd: HTMLDivElement | undefined = $state();
  let range = null;

  function getOffset(): number {
    return root ? Math.ceil(root[directionKey]) : 0;
  }

  function getClientSize(): number {
    const key = isHorizontal ? "clientWidth" : "clientHeight";
    return root ? Math.ceil(root[key]) : 0;
  }

  function getScrollSize(): number {
    const key = isHorizontal ? "scrollWidth" : "scrollHeight";
    return root ? Math.ceil(root[key]) : 0;
  }

  export function updatePageModeFront(): void {
    if (root && isBrowser()) {
      const rect = root.getBoundingClientRect();
      const { defaultView } = root.ownerDocument;
      const offsetFront = isHorizontal
        ? rect.left + (defaultView?.scrollX || 0)
        : rect.top + (defaultView?.scrollY || 0);
      virtual.updateParam("slotHeaderSize", offsetFront);
    }
  }

  function scrollToOffset(offset: number): void {
    if (!isBrowser()) return;

    document.body[directionKey] = offset;
    document.documentElement[directionKey] = offset;

    if (root) {
      root[directionKey] = offset;
    }
  }

  function scrollToIndex(index: number): void {
    if (index >= data.length - 1) {
      scrollToBottom();
    } else {
      const offset = virtual.getOffset(index);
      scrollToOffset(offset);
    }
  }

  function scrollToBottom(): void {
    if (shepherd) {
      const offset = shepherd[isHorizontal ? "offsetLeft" : "offsetTop"];
      scrollToOffset(offset);

      setTimeout(() => {
        if (getOffset() + getClientSize() + 1 < getScrollSize()) {
          scrollToBottom();
        }
      }, 3);
    }
  }

  onMount(() => {
    if (start) {
      scrollToIndex(start);
    } else if (offset) {
      scrollToOffset(offset);
    }

    updatePageModeFront(); // Call without pageMode check
  });

  function getUniqueIdFromDataSources(): any[] {
    return data.map((dataSource) => dataSource[key]);
  }

  function onItemResized(event: any): void {
    const { id, size, type } = event;

    if (type === "item") {
      virtual.saveSize(id, size);
    } else if (type === "slot") {
      if (id === "header") virtual.updateParam("slotHeaderSize", size);
      else if (id === "footer") virtual.updateParam("slotFooterSize", size);

      // Uncomment if needed:
      // virtual.handleSlotSizeChange();
    }
  }

  function onRangeChanged(range_: any): void {
    range = range_;

    paddingStyle = isHorizontal
      ? `0px ${range.padBehind}px`
      : `${range.padFront}px ${range.padBehind}px`;

    displayItems = data.slice(range.start, range.end + 1);
  }

  function onScroll(event: Event): void {
    const offset = getOffset();

    const clientSize = getClientSize();
    const scrollSize = getScrollSize();

    if (offset < 0 || offset + clientSize > scrollSize || !scrollSize) return;

    virtual.handleScroll(offset);
  }

  function handleKeepsChange(keeps: number): void {
    virtual.updateParam("keeps", keeps);
    virtual.handleSlotSizeChange();
  }

  function handleDataSourcesChange(data: any[]): void {
    virtual.updateParam("uniqueIds", getUniqueIdFromDataSources());
    virtual.handleDataSourcesChange();
    start = virtual.range.end + 1; // Fix original error
  }

  // Reactive effects
  $effect(() => scrollToOffset(offset));
  $effect(() => handleDataSourcesChange(data));
  $effect(() => scrollToIndex(start));
  $effect(() => handleKeepsChange(keeps));
</script>

<div
  bind:this={root}
  onscroll={onScroll}
  style="height: inherit; overflow-y: auto;"
  class={cn("virtual-scroll-root", className)}
>
  {#if header}
    <Item resize={onItemResized} type="slot" uniqueKey="header">
      {@render header?.()}
    </Item>
  {/if}

  <div
    style="padding: {paddingStyle}"
    class={cn("virtual-scroll-wrapper", classWrapper)}
  >
    {#each displayItems as dataItem, dataIndex (dataItem[key])}
      <Item
        resize={onItemResized}
        uniqueKey={dataItem[key]}
        horizontal={isHorizontal}
        type="item"
        class={classItem}
      >
        {@render children?.({ data: dataItem, index: dataIndex })}
      </Item>
    {/each}
  </div>

  {#if footer}
    <Item resize={onItemResized} type="slot" uniqueKey="footer">
      {@render footer?.()}
    </Item>
  {/if}

  <div
    bind:this={shepherd}
    class="shepherd"
    style="width: {isHorizontal ? '0px' : '100%'}; height: {isHorizontal
      ? '100%'
      : '0px'}"
  ></div>
</div>
