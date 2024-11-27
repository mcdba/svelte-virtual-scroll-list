<script lang="ts">
  import { VirtualGrid } from "$lib/index.js";
  import { faker } from "@faker-js/faker";
  function generateProducts(numProducts: number) {
    const products = [];
    for (let i = 0; i < numProducts; i++) {
      const product = {
        key: faker.string.uuid(),
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        image: faker.image.avatar(),
      };
      products.push(product);
    }
    return products;
  }
  const data = generateProducts(80);
  console.log(data);
</script>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->
<div class="h-[500px]">
  <VirtualGrid {data} key="key" columns={3} keeps={8}>
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
          {item.key}
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
