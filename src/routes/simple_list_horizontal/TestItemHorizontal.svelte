<script lang="ts">
  let { uniqueKey, width } = $props();
</script>

<div style="width: {width}px" class="p-2 bg-slate-200 rounded-2xl h-full">
  {uniqueKey} Item ({width}px)
</div>
