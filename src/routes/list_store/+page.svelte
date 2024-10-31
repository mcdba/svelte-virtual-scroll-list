<script lang="ts">
  import { tick } from "svelte";
  import { flip } from "svelte/animate";
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
      new_items.push({ uniqueKey: getItemId(), height: randomInteger(20, 60) });
    if (top) items = [...new_items, ...items];
    else items = [...items, ...new_items];
  }
</script>

<div class="h-[300px]">
  <VirtualScroll data={items} key="uniqueKey">
    {#snippet header()}
         This is a header
        
    {/snippet}
    {#snippet children({data})}
        
    <TestItem {...data} />
    {/snippet}
    
    {#snippet footer()}
    This is a footer
    {/snippet}
  </VirtualScroll>
</div>
<button onclick={() => addItems()}>Add 10 to top</button>
<button onclick={() => addItems(false)}>Add 10 to bottom</button>
