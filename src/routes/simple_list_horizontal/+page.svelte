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
      new_items.push({ uniqueKey: getItemId(), width: randomInteger(80, 200) });
    items = [...items, ...new_items];
  }
</script>

<VirtualScroll
  data={items}
  key="uniqueKey"
  isHorizontal={true}
  class="h-[300px]"
  classWrapper="flex flex-row gap-2 h-[200px]"
>
  {#snippet header()}
    This is a header
  {/snippet}
  {#snippet children({ data })}
    <TestItem {...data} class="h-[200px]" />
  {/snippet}

  {#snippet footer()}
    This is a footer
  {/snippet}
</VirtualScroll>
