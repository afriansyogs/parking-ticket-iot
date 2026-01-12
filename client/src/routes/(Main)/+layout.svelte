<script lang="ts">
	import { page } from '$app/stores';
  import "../../app.css"
  import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();

</script>

<div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white flex overflow-hidden">
  <Sidebar />
  <main class="flex-1 flex flex-col min-h-screen relative z-10 md:pl-72 pt-16 md:pt-0 transition-all duration-300">
    {@render children()}
  </main>
</div>