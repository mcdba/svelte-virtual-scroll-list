<script lang="ts">
  import { VirtualScroll } from "$lib/index.js";
  import { createSequenceGenerator, randomInteger } from "../mock.js";
  import TestItem from "../TestItem.svelte";

  const getItemId = createSequenceGenerator();

  let items: any[] = [];
  addItems(true, 1000);

  function addItems(top = true, count = 10) {
    let new_items = [];
    for (let i = 0; i < count; i++)
      new_items.push({ uniqueKey: getItemId(), height: randomInteger(20, 60) });
    if (top) items = [...new_items, ...items];
    else items = [...items, ...new_items];
  }
</script>

<div class="h-[400px]">
  <VirtualScroll data={items} key="uniqueKey"  pageMode={true}>
    {#snippet header()}
        <div >This is a header</div>
    {/snippet}
    {#snippet children({data})}
        
    <TestItem {...data} />
    {/snippet}
    
    {#snippet footer()}
    This is a footer
    {/snippet}

  </VirtualScroll>
</div>

