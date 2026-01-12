<script lang="ts">
  import type { Ticket } from "$lib/types";
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import QRCode from "qrcode";
  import { authGuard } from "$lib/utils/authGuard";

  let ticket: Ticket | null = $state(null);
  let status = $state<string>("Silahkan Tekan button...");
  let loading = $state<boolean>(true);

  function generateQR(node: HTMLCanvasElement, text: string) {
    if (!text) return;
    
    QRCode.toCanvas(node, text, { 
      width: 150,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    }, (error) => {
      if (error) console.error(error);
    });

    return {
      update(newText: string) {
        generateQR(node, newText);
      }
    };
  }

  onMount(() => {
    authGuard();
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
      <div in:fly={{ y: 50, duration: 600, easing: cubicOut }} class="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative">
        <div class="h-3 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
        <div class="p-6 pb-2">
          <div class="flex justify-between items-start">
            <div class="flex flex-col">
              <h1 class="text-xl font-black text-slate-900 leading-none tracking-tight">BIRO YODICK</h1>
              <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">Parking System</span>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Masuk</p>
              <div class="flex flex-col">
                  <span class="text-lg font-bold text-slate-800 leading-none">
                    {new Date(ticket.entryTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span class="text-[10px] text-slate-500">
                    {new Date(ticket.entryTime).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: '2-digit'})}
                  </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center py-4 relative">
          <div class="p-3 bg-white border-2 border-dashed border-indigo-200 rounded-2xl relative shadow-sm group">
            <div class="absolute top-[-2px] left-[-2px] w-4 h-4 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg"></div>
            <div class="absolute top-[-2px] right-[-2px] w-4 h-4 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg"></div>
            <div class="absolute bottom-[-2px] left-[-2px] w-4 h-4 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg"></div>
            <div class="absolute bottom-[-2px] right-[-2px] w-4 h-4 border-b-4 border-r-4 border-indigo-500 rounded-br-lg"></div>
            <canvas use:generateQR={ticket.id} class="rounded-lg block"></canvas>
          </div>
          <p class="mt-3 text-[10px] text-slate-400 font-mono tracking-widest uppercase">Scan untuk Keluar</p>
        </div>

        <div class="relative w-full h-6 flex items-center justify-center my-1">
          <div class="absolute -left-3 w-6 h-6 bg-slate-950 rounded-full"></div> 
          <div class="w-full border-b-2 border-dashed border-slate-200 mx-4"></div>
          <div class="absolute -right-3 w-6 h-6 bg-slate-950 rounded-full"></div> 
        </div>

        <div class="p-6 pt-2 text-center bg-white">
          <div class="mb-6 relative">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nomor Parkir</p>
            <div class="inline-block relative">
              <span class="absolute -top-2 -right-4 text-xs font-bold text-indigo-500 animate-pulse">●</span>
              <h2 class="text-6xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                {ticket.slotParking ?? "--"}
              </h2>
            </div>
          </div>

          <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-medium">Ticket ID</span>
              <span class="font-mono font-bold text-slate-700">{ticket.id.substring(0,18)}...</span>
            </div>
          </div>

          <div class="mt-4 opacity-30">
            <div class="h-6 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjMwIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIzMCIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==')]"></div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>