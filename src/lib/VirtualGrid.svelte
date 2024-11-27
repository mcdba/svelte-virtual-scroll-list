<script lang="ts">
  import { VirtualScroll, cn } from "./index.js";

  type Props = {
    child?: import("svelte").Snippet<[any]>;
    header?: import("svelte").Snippet;
    footer?: import("svelte").Snippet;
    data: any[];
    key?: string;
    columns: number;
    keeps?: number;
  };
  let {
    data,
    key = "id",
    child,
    columns,
    keeps,
    footer,
    header,
  }: Props = $props();
  // Function to chunk the array into groups of specified size
  const chunkArray = (array: any[], chunkSize: number) => {
    const result = [];
    let currentKey = 0;
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push({
        [key]: currentKey + "",
        data: array.slice(i, i + chunkSize),
      });
      currentKey++;
    }
    return result;
  };
  const gridData = $derived(chunkArray(data, columns));
</script>

<VirtualScroll
  data={gridData}
  {key}
  {keeps}
  classItem={cn(
    "grid gap-4",
    columns === 1 && "grid-cols-1",
    columns === 2 && "grid-cols-2",
    columns === 3 && "grid-cols-3",
    columns === 4 && "grid-cols-4",
    columns === 5 && "grid-cols-5",
    columns === 6 && "grid-cols-6",
    columns === 7 && "grid-cols-7",
    columns === 8 && "grid-cols-8",
    columns === 9 && "grid-cols-9",
    columns === 10 && "grid-cols-10",
  )}
  {footer}
  {header}
>
  {#snippet children({ data })}
    {#each data.data as item}
      {@render child?.({ item })}
    {/each}
  {/snippet}
</VirtualScroll>
