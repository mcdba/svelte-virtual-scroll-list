<script lang="ts">
  import { flip } from "svelte/animate";
  import VirtualScroll from "$lib/VirtualScroll.svelte";
  import { createSequenceGenerator, randomInteger } from "../mock.js";
  import TestItem from "./TestItemHorizontal.svelte";

  const getItemId = createSequenceGenerator();

  let items: any[] = [];
  addItems(1000);

  function addItems(count = 10) {
    let new_items = [];
    for (let i = 0; i < count; i++)
      new_items.push({ uniqueKey: getItemId(), width: randomInteger(40, 200) });
    items = [...items, ...new_items];
  }
</script>

<div class="h-[300px] vz">
  <VirtualScroll data={items} key="uniqueKey" isHorizontal={true}>
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
<style>
   .vz :global(.virtual-scroll-item) {
    padding: 0 4px;
  }

  .vz :global(.virtual-scroll-wrapper) {
    display: flex;
    flex-direction: row;
  }
  .vz :global(.virtual-scroll-root) {
    display: flex;
    flex-direction: row;
  }
</style>
