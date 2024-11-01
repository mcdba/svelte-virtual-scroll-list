<script lang="ts">
  import { VirtualScroll } from "$lib/index.js";
  import { createSequenceGenerator, randomInteger } from "../mock.js";
  import TestItem from "../TestItem.svelte";

  const getItemId = createSequenceGenerator();

  let items: any[] = $state([]);
  addItems(true, 1000);

  let notifications = {};

  function addItems(top = true, count = 10) {
    let new_items = [];
    for (let i = 0; i < count; i++)
      new_items.push({ uniqueKey: getItemId(), height: randomInteger(40, 60) });
    if (top) items = [...new_items, ...items];
    else items = [...items, ...new_items];
  }
</script>

<div class="h-[300px]">
  <VirtualScroll data={items} key="uniqueKey">
    {#snippet header()}
      This is a header
    {/snippet}
    {#snippet children({ data })}
      <TestItem {...data} class="mb-2" />
    {/snippet}

    {#snippet footer()}
      This is a footer
    {/snippet}
  </VirtualScroll>
</div>
<div class="flex items-center gap-4 p-4">
  <button
    class="rounded-md border border-sky-400 bg-sky-50 px-1 py-0.5 text-sky-900 hover:bg-sky-200"
    onclick={() => addItems()}>Add 10 to top</button
  >
  <button
    class="rounded-md border border-sky-400 bg-sky-50 px-1 py-0.5 text-sky-900 hover:bg-sky-200"
    onclick={() => addItems(false)}>Add 10 to bottom</button
  >
</div>
