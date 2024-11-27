<script lang="ts">
  import { VirtualScroll, cn } from "./index.js";

  type Props = {
    children?: import("svelte").Snippet<[any]>;
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
    children,
    columns = 2,
    keeps = 30,
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
  classItem="grid gap-4"
  styleItem={`grid-template-columns:repeat(${columns},1fr)`}
  {footer}
  {header}
>
  {#snippet children({ data })}
    {#each data.data as item}
      {@render children?.({ item })}
    {/each}
  {/snippet}
</VirtualScroll>
