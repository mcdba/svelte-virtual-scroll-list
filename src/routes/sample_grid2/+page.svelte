<script lang="ts">
  import { VirtualGrid } from "$lib/index.js";
  import items from "./data.js";

  let currentItems = [...items, ...items];
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

  const data = chunkArray(currentItems, 3);
</script>

<div class="h-[400px]">
  <VirtualGrid {data} key="key" columns={3}>
    {#snippet child({ data })}
      <div
        class="mb-4 overflow-hidden rounded-lg border border-slate-300 bg-slate-200 p-2 shadow-lg"
      >
        <span>
          {data.key}
        </span>
        <h1 class="text-2xl font-bold">
          {data.name}
        </h1>
        <p>{data.content}</p>
      </div>
    {/snippet}
  </VirtualGrid>
</div>
