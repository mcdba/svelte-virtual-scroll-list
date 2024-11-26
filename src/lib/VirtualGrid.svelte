<script lang="ts">
  import VirtualScroll from "./VirtualScroll.svelte";
  type Props = {
    child?: import("svelte").Snippet<[any]>;
    data: any[];
    key?: string;
    columns: number;
  };
  let { data, key, child, columns }: Props = $props();
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

<VirtualScroll data={gridData} {key} keeps={6}>
  {#snippet children({ data })}
    <div class="grid grid-cols-3 gap-4">
      {#each data.data as item}
        {#each item.data as data}
          {@render child?.({ data })}
        {/each}
      {/each}
    </div>
  {/snippet}
</VirtualScroll>
