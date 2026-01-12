<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade, scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { each } from "chart.js/helpers";
  import { tokenUser } from "$lib/state/token.svelte";
  import { formatIDR } from "$lib/utils/formatIdr";
  import type { StashCard } from "$lib/types";

  let mounted = $state(false);
  let stash = $state<StashCard>()
  let lineChartData = $state({
    revenueData: [],
    maxRevenue: 0,
    labels: []
  })
  const slotParkir: number[] = [1,2,3];        
  let slotParkirKosong = $state<number[]>([]);

  $inspect(slotParkirKosong)  
  let parkingSlots = $derived(slotParkir.map(slot => slotParkirKosong?.includes(slot) ? 0 : 1));



  // Generate points line chart
  const getPolylinePoints = () => {
    const width = 100; // viewBox width
    const height = 50; // viewBox height
    const step = width / (lineChartData.revenueData.length - 1);
    
    return lineChartData.revenueData.map((val, i) => {
      const x = i * step;
      const y = height - (val / lineChartData.maxRevenue) * height * 0.8; // 0.8 scale biar ga mentok atas
      return `${x},${y}`;
    }).join(" ");
  };

  async function fetchStash() {
    try {
      const res = await fetch(`http://localhost:3000/dashboard/stash`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${tokenUser.token}`,
          "Content-Type": "application/json" 
        }
      })
      const responseData = await res.json();
      stash = responseData.data;
    } catch (error) {
      console.log("Gagal get data")
    }
  }

  async function getRavenueWeek() {
    try {
      const res = await fetch(`http://localhost:3000/dashboard/ravenueLastWeek`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${tokenUser.token}`,
          "Content-Type": "application/json" 
        }
      })
      const responseData = await res.json();
      lineChartData = responseData.data;
    } catch (error) {
      console.log("Gagal get total revenue")
    }
  }

  async function getSlotParkingKosong() {
    try {
      const res = await fetch(`http://localhost:3000/dashboard/slotKosong`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${tokenUser.token}`,
          "Content-Type": "application/json" 
        }
      })
      const responseData = await res.json();
      slotParkirKosong = responseData.data;
    } catch (error) {
      console.log("Gagal get slot parkir kosong")
    }
  }

  onMount(() => {
    mounted = true;
    fetchStash();
    getRavenueWeek(); 
    getSlotParkingKosong(); 
  });
</script>

<div class="min-h-screen w-full bg-slate-950 p-6 md:p-8 font-sans text-slate-200 relative overflow-x-hidden">
  {#if mounted}
    <div class="max-w-7xl mx-auto flex flex-col gap-8">
      <div in:fly={{ y: -20, duration: 600 }} class="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">Admin Dashboard</span>
          </div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p class="text-slate-400">Monitoring aktivitas parkir.</p>
        </div>
        <div class="text-right hidden md:block">
          <p class="text-2xl font-bold text-white">{new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</p>
          <p class="text-sm text-slate-500">{new Date().toLocaleDateString('id-ID', {weekday: 'long', day:'numeric', month:'long'})}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div in:fly={{ y: 20, duration: 600, delay: 100 }} class="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg class="w-16 h-16 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"/></svg>
          </div>
          <p class="text-sm font-medium text-slate-400 uppercase tracking-wider">Tiket Hari Ini</p>
          <div class="mt-2 flex items-baseline gap-2">
            {#if stash}
              <span class="text-3xl font-bold text-white">{stash.totalToday}</span>
            {:else}
							<p class="text-xl font-bold text-emerald-400">Loading...</p>

            {/if}
            <!-- <span class="text-xs text-emerald-400 font-bold flex items-center">
                <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                +12%
            </span> -->
          </div>
        </div>

        <div in:fly={{ y: 20, duration: 600, delay: 200 }} class="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg class="w-16 h-16 text-rose-400" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/></svg>
          </div>
          <p class="text-sm font-medium text-slate-400 uppercase tracking-wider">Sedang Parkir</p>
          <div class="mt-2 flex items-baseline gap-2">
            {#if stash}
              <span class="text-3xl font-bold text-white">{stash.totalPending}</span>
            {:else}
							<p class="text-xl font-bold text-emerald-400">Loading...</p>

            {/if}
            <span class="text-xs text-slate-500">Mobil</span>
          </div>
        </div>

        <div in:fly={{ y: 20, duration: 600, delay: 300 }} class="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 backdrop-blur-md relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg class="w-16 h-16 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/></svg>
          </div>
          <p class="text-sm font-medium text-emerald-400 uppercase tracking-wider">Total Pendapatan</p>
          <div class="mt-2 flex items-baseline gap-2">
            {#if stash}
              <span class="text-2xl font-bold text-white">{formatIDR(stash.totalPrice)}</span>
            {:else}
							<p class="text-xl font-bold text-emerald-400">Loading...</p>
            {/if}
          </div>
        </div>

        <div in:fly={{ y: 20, duration: 600, delay: 400 }} class="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg class="w-16 h-16 text-violet-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
          </div>
          <p class="text-sm font-medium text-slate-400 uppercase tracking-wider">Total User</p>
          <div class="mt-2 flex items-baseline gap-2">
            {#if stash}
              <span class="text-3xl font-bold text-white">{stash.totalUser}</span>
            {:else}
							<p class="text-xl font-bold text-emerald-400">Loading...</p>
            {/if}
            <!-- <span class="text-xs text-indigo-400 font-bold">+5 Baru</span> -->
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div in:fly={{ y: 30, duration: 800, delay: 500 }} class="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-white">Grafik Pendapatan (7 Hari)</h3>
            <!-- <button class="text-xs text-indigo-400 hover:text-indigo-300 font-bold">Lihat Detail</button> -->
          </div>

          <div class="w-full h-48 relative">
            <div class="absolute inset-0 flex flex-col justify-between text-xs text-slate-600">
              <div class="border-b border-white/5 w-full h-0"></div>
              <div class="border-b border-white/5 w-full h-0"></div>
              <div class="border-b border-white/5 w-full h-0"></div>
              <div class="border-b border-white/5 w-full h-0"></div>
            </div>

            <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#6366f1" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
                </linearGradient>
              </defs>
                
              <polygon 
                points={`0,50 ${getPolylinePoints()} 100,50`} 
                fill="url(#lineGradient)"
              />
                
              <polyline 
                fill="none" 
                stroke="#818cf8" 
                stroke-width="1.5" 
                points={getPolylinePoints()}
                vector-effect="non-scaling-stroke"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              />

              {#each lineChartData.revenueData as val, i}
                <circle 
                  cx={(i * (100 / (lineChartData.revenueData.length - 1)))} 
                  cy={50 - (val / lineChartData.maxRevenue) * 50 * 0.8} 
                  r="1.5" 
                  fill="white"
                  class="hover:scale-150 transition-transform cursor-pointer"
                >
                  <title>Rp {val}0.000</title>
                </circle>
                {/each}
            </svg>
          </div>
          
          <div class="flex justify-between text-[10px] text-slate-500 mt-2 font-mono uppercase">
            {#each lineChartData.labels as label}
              <span>{label}</span>
            {/each}
          </div>
        </div>

        <div in:fly={{ y: 30, duration: 800, delay: 600 }} class="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col">
          <h3 class="text-lg font-bold text-white mb-4">Status Slot Parkir</h3>
          <div class="grid grid-cols-5 gap-3">
            {#each parkingSlots as status, i}
              <div 
                class="aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 cursor-pointer
                {status === 1 
                  ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]' 
                  : 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'}"
                title={status === 1 ? `Slot ${i+1}: Terisi` : `Slot ${i+1}: Kosong`}
              >
                {i + 1}
              </div>
            {/each}
          </div>
          <div class="mt-auto flex justify-between items-center text-xs pt-4">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="text-slate-400">Kosong ({slotParkirKosong?.length})</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-rose-400"></span>
              <span class="text-slate-400">Terisi ({slotParkir?.length - slotParkirKosong?.length})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>