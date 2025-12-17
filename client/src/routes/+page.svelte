<script lang="ts">
  import type { Ticket } from "$lib/types";
  import { onMount } from "svelte";


  let ticket : Ticket | null = $state(null);
  let status: string = $state("Menunggu tombol IoT");

  onMount(() => {
    const ev = new EventSource("http://localhost:3000/ticket-stream");

    ev.addEventListener("ticket", (event: MessageEvent<string>) => {
      ticket = JSON.parse(event.data) as Ticket;
      status = "Ticket terbuat";
    });

    ev.onerror = (): void => {
      status = "connection server close";
    };

    return (): void => ev.close();
  });
</script>

<div class="">
  <h1>Smart Parking Ticket</h1>
  <p>{status}</p>
  
  {#if ticket}
    <div class="ticket">
      <p><strong>ID:</strong> {ticket.id}</p>
      <p><strong>No Parkir:</strong> {ticket.noParking ?? "-"}</p>
      <p><strong>Slot Kosong:</strong> {ticket.slotKosong.join(", ")}</p>
      <p>
        <strong>Waktu:</strong>
        {new Date(ticket.date).toLocaleString()}
      </p>
    </div>
  {/if}
</div>

<style>
  .ticket {
    border: 2px dashed #333;
    padding: 1rem;
    margin-top: 1rem;
    width: 300px;
  }
</style>