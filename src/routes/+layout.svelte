<script lang="ts">
  import { page } from "$app/stores";
  import "../app.css";
  let { children } = $props();

  const menuItems = [
    { name: "Simple list", component: "simple_list" },
    { name: "Simple list horizontal", component: "simple_list_horizontal" },
    { name: "Infinite list", component: "infinite_list" },
    { name: "SimpleListStore", component: "list_store" },
  ];
</script>

<svelte:head>
  <title>svelte-virtual-scroll-list example</title>
</svelte:head>

<main class="mx-auto max-w-5xl p-4">
  <h1 class="mb-8 text-3xl font-black">svelte-virtual-scroll-list example</h1>
  <div class="mb-8">
    <div class="flex items-center gap-2">
      {#each menuItems as item}
        <a
          href={item.component}
          class="rounded-md border border-sky-400 bg-sky-50 px-1 py-0.5 text-sky-900 hover:bg-sky-200"
          style={$page.url.pathname.split("/")[2] === item.component
            ? " font-weight: 700;"
            : ""}
          >{item.name}
        </a>
      {/each}
      <a
        class="flex-1 text-right underline"
        href="https://github.com/mcdba/svelte-virtual-scroll-list/tree/master/src/routes/{$page.url.pathname.split(
          '/',
        )[2]}">Source</a
      >
    </div>
  </div>
  {@render children?.()}
</main>
