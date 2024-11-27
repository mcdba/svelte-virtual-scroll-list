<script lang="ts">
  import Virtual, { isBrowser } from "./virtual.js";
  import Item from "./Item.svelte";
  import { onMount } from "svelte";
  import { cn } from "./index.js";

  interface Props {
    key?: string; // Unique key for getting data from `data`
    data: any[]; // Source for list
    keeps?: number; // Count of rendered items
    estimateSize?: number; // Estimate size of each item, needs for smooth scrollbar
    isHorizontal?: boolean; // Scroll direction
    start?: number; // scroll position start index
    offset?: number; // scroll position offsetpnpm i
    pageMode?: boolean; // Let virtual list using global document to scroll through the list
    header?: import("svelte").Snippet;
    children?: import("svelte").Snippet<[any]>;
    footer?: import("svelte").Snippet;
    class?: string;
    classWrapper?: string;
    classItem?: string;
    styleItem?: string;
  }

  let {
    key = "id",
    data,
    keeps = 30,
    estimateSize = 50,
    isHorizontal = false,
    start = 0,
    offset = 0,
    pageMode = false,
    header,
    children,
    footer,
    class: className,
    classWrapper,
    classItem,
    styleItem = "",
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
      buffer: Math.round(keeps / 3), // recommend for a third of keeps
      uniqueIds: getUniqueIdFromDataSources(),
    },
    onRangeChanged,
  );
  let root: HTMLDivElement | undefined = $state();
  let shepherd: HTMLDivElement | undefined = $state();
  let range = null;

  function getOffset() {
    if (pageMode && isBrowser()) {
      return (
        //@ts-ignore
        document.documentElement[directionKey] || document.body[directionKey]
      );
    } else {
      //@ts-ignore
      return root ? Math.ceil(root[directionKey]) : 0;
    }
  }

  function getClientSize() {
    const key = isHorizontal ? "clientWidth" : "clientHeight";
    if (pageMode && isBrowser()) {
      return document.documentElement[key] || document.body[key];
    } else {
      return root ? Math.ceil(root[key]) : 0;
    }
  }

  function getScrollSize() {
    const key = isHorizontal ? "scrollWidth" : "scrollHeight";
    if (pageMode && isBrowser()) {
      return document.documentElement[key] || document.body[key];
    } else {
      return root ? Math.ceil(root[key]) : 0;
    }
  }
  export function updatePageModeFront() {
    if (root && isBrowser()) {
      const rect = root.getBoundingClientRect();
      const { defaultView } = root.ownerDocument;
      const offsetFront = isHorizontal
        ? rect.left + (defaultView ? defaultView.scrollX : 0)
        : rect.top + (defaultView ? defaultView.scrollY : 0);
      virtual.updateParam("slotHeaderSize", offsetFront);
    }
  }

  function scrollToOffset(offset: number) {
    if (!isBrowser()) return;
    if (pageMode) {
      //@ts-ignore
      document.body[directionKey] = offset;
      //@ts-ignore
      document.documentElement[directionKey] = offset;
    } else if (root) {
      //@ts-ignore

      root[directionKey] = offset;
    }
  }

  function scrollToIndex(index: number) {
    if (index >= data.length - 1) {
      scrollToBottom();
    } else {
      const offset = virtual.getOffset(index);
      scrollToOffset(offset);
    }
  }

  function scrollToBottom() {
    if (shepherd) {
      const offset = shepherd[isHorizontal ? "offsetLeft" : "offsetTop"];
      scrollToOffset(offset);

      // check if it's really scrolled to the bottom
      // maybe list doesn't render and calculate to last range,
      // so we need retry in next event loop until it really at bottom
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

    if (pageMode) {
      updatePageModeFront();
    }
  });

  function getUniqueIdFromDataSources() {
    return data.map((dataSource) => dataSource[key]);
  }

  function onItemResized(event: any) {
    const { id, size, type } = event;
    if (type === "item") virtual.saveSize(id, size);
    else if (type === "slot") {
      if (id === "header") virtual.updateParam("slotHeaderSize", size);
      else if (id === "footer") virtual.updateParam("slotFooterSize", size);

      // virtual.handleSlotSizeChange()
    }
  }

  function onRangeChanged(range_: any) {
    range = range_;
    paddingStyle = isHorizontal
      ? `0px ${range.padBehind}px 0px ${range.padFront}px`
      : `${range.padFront}px 0px ${range.padBehind}px`;
    displayItems = data.slice(range.start, range.end + 1);
  }

  function onScroll(event: any) {
    const offset = getOffset();
    const clientSize = getClientSize();
    const scrollSize = getScrollSize();

    // iOS scroll-spring-back behavior will make direction mistake
    if (offset < 0 || offset + clientSize > scrollSize || !scrollSize) {
      return;
    }

    virtual.handleScroll(offset);
  }

  function handleKeepsChange(keeps: number) {
    virtual.updateParam("keeps", keeps);
    virtual.handleSlotSizeChange();
  }

  function handleDataSourcesChange(data: any[]) {
    virtual.updateParam("uniqueIds", getUniqueIdFromDataSources());
    virtual.handleDataSourcesChange();
    //FIX original error: start not set to last item when update
    start = virtual.range.end + 1;
  }
  $effect(() => scrollToOffset(offset));
  $effect(() => handleDataSourcesChange(data));
  $effect(() => scrollToIndex(start));
  $effect(() => handleKeepsChange(keeps));
</script>

<div
  bind:this={root}
  onscroll={onScroll}
  style="height:inherit;overflow-y:auto"
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
        style={styleItem}
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
    style="width: {isHorizontal ? '0px' : '100%'};height: {isHorizontal
      ? '100%'
      : '0px'}"
  ></div>
</div>
