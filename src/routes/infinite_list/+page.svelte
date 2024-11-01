<script lang="ts">

  import { VirtualScroll } from "$lib/index.js";
   import InfiniteLoading from "svelte-infinite-loading";

  import {
   asyncTimeout,
    createSequenceGenerator,
    randomInteger,
  } from "../mock.js";
  import TestItem from "../TestItem.svelte";

  const getItemId = createSequenceGenerator();

  let loading = false;
  let items:any[] = itemsFactory(70);



  function itemsFactory(count = 10) {
    let new_items = [];
    for (let i = 0; i < count; i++)
      new_items.push({ uniqueKey: getItemId(), height: randomInteger(60, 80) });
    return new_items;
  }

  
  // Infinite scroll handler
  async function onInfinite({
    detail,
  }: {
    detail: { complete: () => void; loaded: () => void; error: () => void };
  }) {
      await asyncTimeout(800);
        let new_items = itemsFactory(20);
        items=[...items,...new_items]
        detail.loaded();
        if (items.length >=200) detail.complete();

  }

</script>
<p class='mb-8'>await 200 items</p>
<div class="h-[500px]">
  <VirtualScroll

    data={items}
    key="uniqueKey"
    start={30}
  >
      {#snippet header()}
        Header
    {/snippet}
   {#snippet children({ data })}
       <div class="p-1">
         <TestItem {...data} />
        </div> 
    {/snippet}
    
    {#snippet footer()}

         <InfiniteLoading on:infinite={onInfinite} />
    {/snippet}
   
  </VirtualScroll>
</div>


