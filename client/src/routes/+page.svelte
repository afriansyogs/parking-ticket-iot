<script lang="ts">
  import type { Ticket } from "$lib/types";
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let ticket: Ticket | null = $state(null);
  let status: string = $state("Silahkan Tekan button...");
  let loading = $state(true);

  onMount(() => {
    const ev = new EventSource("http://localhost:3000/ticket-stream");

    ev.addEventListener("ticket", (event: MessageEvent<string>) => {
      ticket = JSON.parse(event.data) as Ticket;
      status = "Ticket dibuat";
      loading = false;
    });

    ev.onerror = (): void => {
      status = "connection closed";
    };

    return (): void => ev.close();
  });
</script>

<div class="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
  <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px]"></div>
  </div>

  <div class="z-10 w-full max-w-sm flex flex-col gap-8">
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[10px] uppercase tracking-widest text-slate-300 font-semibold">System Active</span>
      </div>
      <h1 class="text-3xl font-bold text-white tracking-tight">Smart Parking</h1>
      <p class="text-slate-400 text-sm font-medium">{status}</p>
    </div>

    {#if loading}
      <div 
        in:scale={{ duration: 400, easing: cubicOut }} 
        out:fade 
        class="relative flex flex-col items-center justify-center h-64 w-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div class="relative z-10 animate-bounce">
          <div class="w-20 h-10 bg-indigo-400 rounded-t-2xl mx-auto translate-y-1 relative">
            <div class="absolute top-2 right-2 w-10 h-6 bg-indigo-900/30 rounded-tr-lg"></div>
          </div>
            
          <div class="w-32 h-10 bg-indigo-500 rounded-2xl relative shadow-lg flex items-center justify-between px-3">
            <div class="w-2 h-4 bg-yellow-300 rounded-full blur-[1px] shadow-[0_0_10px_rgba(253,224,71,0.8)]"></div>
            <div class="w-1 h-3 bg-rose-500 rounded-full"></div>
          </div>

          <div class="absolute -bottom-3 left-4 w-7 h-7 bg-slate-800 rounded-full border-[3px] border-slate-600 animate-spin shadow-md flex items-center justify-center">
            <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
          </div>
          <div class="absolute -bottom-3 right-4 w-7 h-7 bg-slate-800 rounded-full border-[3px] border-slate-600 animate-spin shadow-md flex items-center justify-center">
            <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
          </div>
        </div>

        <div class="mt-6 w-24 h-2 bg-black/20 rounded-full blur-sm animate-pulse"></div>
        <p class="mt-6 text-indigo-300/80 font-mono text-xs tracking-[0.2em] uppercase animate-pulse">Scanning...</p>
      </div>

    {:else if ticket}
      <div 
        in:fly={{ y: 50, duration: 600, easing: cubicOut }} 
        class="w-full bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative"
      >
        <div class="h-3 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>

        <div class="p-6 pb-0 relative">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="flex flex-col">
              <span class="text-xl font-bold text-black uppercase tracking-wider">BIRO YODICK</span>
              <span class="text-xl font-bold text-black uppercase tracking-wider mb-1">PARKING</span>
            </div>
            <div class="flex flex-col items-end text-right">
              <span class="text-md text-slate-500">{new Date(ticket.date).toLocaleDateString('id-ID')}</span>
              <span class="font-bold text-slate-800">{new Date(ticket.date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>

          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center mb-6 relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1 bg-indigo-500/20"></div>
            <p class="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Nomor Parkir</p>
            <h2 class="text-7xl font-black text-slate-900 tracking-tighter tabular-nums group-hover:scale-105 transition-transform duration-300">
              {ticket.noParking ?? "--"}
            </h2>
          </div>
        </div>

        <div class="relative w-full h-8 flex items-center justify-center">
          <div class="absolute -left-3 w-6 h-6 bg-slate-950 rounded-full"></div>
          <div class="w-full border-b-2 border-dashed border-slate-200 mx-4"></div>
          <div class="absolute -right-3 w-6 h-6 bg-slate-950 rounded-full"></div>
        </div>

        <div class="p-6 pt-2 bg-white">
          <div class="space-y-3">
            <div class="flex items-center">
              <span class="font-mono text-lg font-bold text-slate-800">{ticket.id}</span>
            </div>
          </div>

          <div class="mt-2 flex flex-col items-center gap-2 opacity-60">
            <div class="h-8 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjMwIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIzMCIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==')]"></div>
            <p class="text-[10px] text-slate-400 font-mono text-center">SCAN QR UNTUK PEMBAYARAN</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>