<script lang="ts">
  import { VirtualGrid } from "$lib/index.js";
  import { faker } from "@faker-js/faker";
  function generateProducts(numProducts: number) {
    const products = [];
    for (let i = 0; i < numProducts; i++) {
      const product = {
        id: i + 1,
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        image: faker.image.avatar(),
      };
      products.push(product);
    }
    return products;
  }
  const data = generateProducts(80);
  let columns = $state(4);
</script>

<label for="example">Choose Grid Columns:</label>
<select id="example" bind:value={columns} class="mb-16">
  <option value={1}> 1</option>
  <option value={2}> 2</option>
  <option value={3}> 3</option>
  <option value={4}> 4</option>
  <option value={5}> 5</option>
  <option value={6}> 6</option>
  <option value={7}> 7</option>
  <option value={8}> 8</option>
  <option value={9}> 9</option>
  <option value={10}> 10</option>
</select>
<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<div class="h-[500px]">
  <VirtualGrid {data} {columns} keeps={8}>
    {#snippet header()}
      <div
        class="mb-4 rounded-xl border border-purple-300 bg-purple-200 p-4 text-center text-xl font-bold"
      >
        This is a header snippet
      </div>
    {/snippet}
    {#snippet child({ item })}
      <div
        class="mb-4 overflow-hidden rounded-lg border border-slate-300 bg-slate-200 p-2 shadow-lg"
      >
        <span>
          {item.id}
        </span>
        <h1 class="text-2xl font-bold">
          {item.name}
        </h1>
        <p class="text-4xl font-bold">{item.price}</p>
      </div>
    {/snippet}
    {#snippet footer()}
      <div
        class="rounded-xl border border-teal-300 bg-teal-200 p-4 text-center text-xl font-bold"
      >
        This is a footer snippet
      </div>
    {/snippet}
  </VirtualGrid>
</div>
