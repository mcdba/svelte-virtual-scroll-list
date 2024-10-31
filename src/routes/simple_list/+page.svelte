<script lang="ts">

  import { VirtualScroll } from "$lib/index.js";
  import { createSequenceGenerator, randomInteger } from "../mock.js";
  import TestItem from "../TestItem.svelte";

  const getItemId = createSequenceGenerator();

  let items: any[] = [];
  addItems(1000);

  function addItems(count = 10) {
    let new_items = [];
    for (let i = 0; i < count; i++)
      new_items.push({
        uniqueKey: getItemId(),
        height: randomInteger(20, 260),
      });
    items = [...items, ...new_items];
  }
</script>

<div class="h-[400px] ">
  <VirtualScroll data={items} key="uniqueKey">
    {#snippet header()}
    <div class="p-4 bg-purple-200 rounded-xl border-purple-300 border mb-4 text-center font-bold text-xl">
        This is a header snippet
    </div>
    {/snippet}

    {#snippet children({data})}
    <div class="mb-4">
      <TestItem {...data} />
    </div>
    {/snippet}

    {#snippet footer()}
        <div class="p-4 bg-teal-200 rounded-xl border-teal-300 border text-center font-bold text-xl">
       This is a footer snippet
       </div>   
    {/snippet}
  </VirtualScroll>
</div>

