<script lang="ts">
	type Ticket = {
		status: number;
		message: string;
		data: {
			id: number;
			slotKosong: number[];
			noParking: number | null;
			date: string;
		};
	};

	let ticket = $state<Ticket | null>(null);
	let loading = $state(true);

	$effect(() => {
		const ev = new EventSource("http://localhost:3000/ticket-stream");

		ev.addEventListener("ticket", async () => {
			console.log("🎫 Dapat event dari backend. Mengambil ticket...");
			const res = await fetch("/ticket/data");
			ticket = await res.json(); 
			loading = false;
		});

		return () => ev.close();
	});
</script>


<h1 class="text-2xl font-bold">Ticket Parkir</h1>
{#if loading}
	<p>nunggu tombol nih</p>
{:else}
	<div class="p-4 mt-4 rounded border">
		<p><strong>No Parkir:</strong> {ticket?.data.noParking}</p>
		<p><strong>Slot Kosong:</strong> {ticket?.data.slotKosong.join(", ")}</p>
		<p><strong>Tanggal:</strong> {ticket?.data.date}</p>
	</div>
{/if}
