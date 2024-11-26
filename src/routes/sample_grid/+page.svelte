<script lang="ts">
  import { VirtualScroll } from "$lib/index.js";
  import items from "./data.js";
  let gridWidth = $state(0);
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

  const gridData = chunkArray(currentItems, 3);
</script>

<div class="h-[400px]">
  <VirtualScroll data={gridData} key="key">
    {#snippet header()}
      <div
        class="mb-4 rounded-xl border border-purple-300 bg-purple-200 p-4 text-center text-xl font-bold"
      >
        This is a header snippet
      </div>
    {/snippet}

    {#snippet children({ data })}
      <div class="grid grid-cols-3 gap-4">
        {#each data.data as item}
          <div
            class="mb-4 rounded-lg border border-slate-300 bg-slate-200 p-2 shadow-lg"
          >
            <span>
              {item.key}
            </span>
            <h1 class="text-2xl font-bold">
              {item.name}
            </h1>
            <p>{item.content}</p>
          </div>
        {/each}
      </div>
    {/snippet}

    {#snippet footer()}
      <div
        class="rounded-xl border border-teal-300 bg-teal-200 p-4 text-center text-xl font-bold"
      >
        This is a footer snippet
      </div>
    {/snippet}
  </VirtualScroll>
</div>
<!-- <pre>{JSON.stringify(items, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(gridData, null, 2)}</pre> -->
