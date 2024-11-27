<script lang="ts">
  import VirtualScroll from "./VirtualScroll.svelte";
  type Props = {
    child?: import("svelte").Snippet<[any]>;
    header?: import("svelte").Snippet;
    footer?: import("svelte").Snippet;
    data: any[];
    key?: string;
    columns: number;
    keeps?: number;
  };
  let { data, key, child, columns, keeps, footer, header }: Props = $props();
  // Function to chunk the array into groups of specified size
  const chunkArray = (array: any[], chunkSize: number) => {
    const result = [];
    let key = 0;
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push({ key: key + "", data: array.slice(i, i + chunkSize) });
      key++;
    }
    return result;
  };
  const gridData = $state(chunkArray(data, columns));
</script>

<VirtualScroll
  data={gridData}
  {key}
  {keeps}
  classItem="grid grid-cols-3 gap-4"
  {footer}
  {header}
>
  {#snippet children({ data })}
    {#each data.data as item}
      {@render child?.({ item })}
    {/each}
  {/snippet}
</VirtualScroll>
