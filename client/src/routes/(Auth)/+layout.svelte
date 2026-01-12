<script lang="ts">
	let { children } = $props();
  import "../../app.css"
</script>

<svelte:head>

</svelte:head>

<div class="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
  {@render children()}
</div>