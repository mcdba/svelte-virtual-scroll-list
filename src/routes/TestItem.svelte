<script lang="ts">
  let { uniqueKey, height } = $props();
</script>

<div
  style="height: {height}px"
  class="p-4 bg-slate-200 rounded-xl border-slate-300 border"
>
  {uniqueKey} Item ({height}px)
</div>
