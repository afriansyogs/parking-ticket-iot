<script lang="ts">
	import { onMount } from "svelte";
	import { fly, fade } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
  import { StatusOptions, type TicketData, type TotalParking } from "$lib/types";
  import { tokenUser } from "$lib/state/token.svelte";
  import { formatDuration } from "$lib/utils/formatDuration";
  import { formatIDR } from "$lib/utils/formatIdr";


	let searchId = $state<string>("");
	let statusOptions = $state<StatusOptions>(StatusOptions.ALL);
	let ticketData = $state<TicketData[]>([])
	let totalParking = $state<TotalParking>()
	let loading = $state<boolean>(false);
	let mounted = $state<boolean>(false);

	function formatDate(date?: string | null): string {
		if (!date) return "-";

		const d = new Date(date);

		if (isNaN(d.getTime())) return "-";

		return d.toLocaleString("id-ID");
	}


	function formatCurrency(amount: number) : string {
		return new Intl.NumberFormat("id-ID", {
			style: "currency", currency: "IDR", minimumFractionDigits: 0
		}).format(amount);
	};

	function copyAble(id : string) {
    navigator.clipboard.writeText(id);
    alert('Teks berhasil dicopy!');
  }

	async function getTicket() {
		loading = true;
		try {
		const res = await fetch(`http://localhost:3000/tickets/allTicket?status=${statusOptions}`, {
			method: 'GET',
			headers: {
				"Authorization": `Bearer ${tokenUser.token}`,
				"Content-Type": "application/json" 
			}
		});
		searchId = "";
		const responseData = await res.json();
		ticketData = responseData.data
		} catch (error) {
      console.log("Gagal get ticket")
		} finally {
			loading = false
		}
	}

	async function getTicketById() {
		loading = true;
		try {
			const res = await fetch(`http://localhost:3000/tickets/searchTicket?id=${searchId}`, {
				method: 'GET',
				headers: {
					"Authorization": `Bearer ${tokenUser.token}`,
					"Content-Type": "application/json" 
				}
			});
			const responseData = await res.json();
			ticketData = responseData.data
		} catch (error) {
      console.log("Gagal get ticket by id")
		} finally {
			loading = false
		}
	}

	async function getTotalParkingData() {
		try {
			const res = await fetch(`http://localhost:3000/tickets/total-parking`, {
				method: 'GET',
				headers: {
					"Authorization": `Bearer ${tokenUser.token}`,
					"Content-Type": "application/json" 
				}
			});
			const responseData = await res.json();
			totalParking = responseData.data
		} catch (error) {
      console.log("Gagal get ticket by id")
		}
	}

	$effect(() => {
		if (statusOptions) {
			getTicket();
		}
	})

	onMount(() => {
		mounted = true;
		getTicket();
		getTotalParkingData();
	});
</script>

<div class="min-h-screen w-full bg-slate-950 p-6 md:p-10 font-sans text-slate-200 relative overflow-hidden">
	<div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
		<div class="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
		<div class="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-fuchsia-900/10 rounded-full blur-[120px]"></div>
	</div>

	{#if mounted}
		<div class="relative z-10 max-w-7xl mx-auto flex flex-col gap-8">
			<div in:fly={{ y: -20, duration: 600, easing: cubicOut }} class="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<h1 class="text-3xl font-bold text-white tracking-tight">Activity Reports</h1>
					<p class="text-slate-400 mt-1">Rekapitulasi data parkir harian.</p>
				</div>

				<div class="flex gap-4">
					<div class="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
						<p class="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Income</p>
						{#if totalParking}
							<p class="text-xl font-bold text-emerald-400">
								{formatIDR(totalParking.revenue)}
							</p>
						{:else}
							<p class="text-xl font-bold text-emerald-400">Loading...</p>
						{/if}
					</div>
					<div class="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
						<p class="text-xs text-slate-400 uppercase font-bold tracking-wider">Parking</p>
						<p class="text-xl font-bold text-rose-400">{totalParking?.totalPending} <span class="text-sm text-slate-500 font-normal">Vehicles</span></p>
					</div>
				</div>
			</div>

			<div 
				in:fly={{ y: 30, duration: 800, delay: 200, easing: cubicOut }}
				class="w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
			>
				<div class="p-5 border-b border-white/5 flex justify-between items-center">
					<div class="flex">
						<div class="relative">
							<svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
							<input 
								bind:value={searchId}
								type="text" 
								placeholder="Cari ID tiket..." 
								class="pl-10 pr-4 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all w-64"
							/>
						</div>
						<button type="submit" onclick={getTicketById} class="ms-4 px-2 rounded-md bg-indigo-500 font-bold cursor-pointer">Cari</button>
					</div>
					
					<div class="relative">
						<select
							bind:value={statusOptions}
							class="appearance-none pl-4 pr-10 py-2 bg-slate-950/50 border border-white/10 rounded-xl
										text-sm focus:outline-none focus:border-indigo-500
										focus:ring-1 focus:ring-indigo-500 transition-all w-40
										{statusOptions === StatusOptions.ALL ? 'text-white' : statusOptions === StatusOptions.PENDING ? 'text-red-400' : 'text-green-400'}"
						>
							<option class="text-white" value={StatusOptions.ALL}>{StatusOptions.ALL}</option>
							<option class="text-red-400" value={StatusOptions.PENDING}>{StatusOptions.PENDING}</option>
							<option class="text-green-400" value={StatusOptions.PAID}>{StatusOptions.PAID}</option>
						</select>
						<svg
							class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>

				<div class="overflow-x-auto">
					<table class="w-full text-left border-collapse">
						<thead>
							<tr class="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-white/5">
								<th class="p-5 text-center w-16">No</th>
								<th class="p-5">ID</th>
								<th class="p-5">Slot</th>
								<th class="p-5">Waktu Masuk</th>
								<th class="p-5">Waktu Keluar</th>
								<th class="p-5 text-center">Durasi</th>
								<th class="p-5 text-right">Biaya</th>
								<th class="p-5 text-center">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/5 text-sm">
							{#if loading}
								<tr>
									<td colspan="8" class="text-center p-5">
										<div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
									</td>
								</tr>
							{:else}
								{#each ticketData as ticket, i}
									<tr class="hover:bg-white/5 transition-colors group">
										<td class="p-5 text-center font-mono text-slate-500">{i + 1}</td>
										<td onclick={() => copyAble(ticket.id)} class="p-5 text-slate-300 cursor-copy">
											{ticket.id}
										</td>
										<td class="p-5">
											<div class="flex items-center gap-2">
												<div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-slate-700">
													{ticket.slotParking}
												</div>
											</div>
										</td>
										<td class="p-5 text-slate-300">
											{formatDate(ticket.entryTime)}
										</td>
										<td class="p-5 text-slate-300">
											{#if ticket.exitTime}
												{formatDate(ticket.exitTime)}
											{:else}
												<span class="text-slate-600 font-mono">-</span>
											{/if}
										</td>
										<td class="p-5 text-center">
											{#if ticket.durationParking}
												<span class="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
													{formatDuration(ticket.durationParking)}
												</span>
											{:else}
												<span class="text-slate-600 font-mono">-</span>
											{/if}
										</td>
										<td class="p-5 text-right font-mono font-bold text-slate-200 tabular-nums">
											{formatCurrency(ticket.price)}
										</td>
										<td class="p-5 text-center">
											{#if ticket.status === 'PAID'}
												<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
													<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
													PAID
												</span>
											{:else}
												<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold shadow-[0_0_10px_rgba(244,63,94,0.1)] animate-pulse">
													<span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
													PENDING
												</span>
											{/if}
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>

				<!-- <div class="p-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
					<span>Menampilkan 1-5 dari 5 data</span>
					<div class="flex gap-2">
						<button class="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>Previous</button>
						<button class="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>Next</button>
					</div>
				</div> -->
			</div>
		</div>
	{/if}
</div>