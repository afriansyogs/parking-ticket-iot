<script lang="ts">
  import { authGuard } from "$lib/utils/authGuard";
  import { formatDuration } from "$lib/utils/formatDuration";
  import { tokenUser } from "$lib/state/token.svelte";
  import type { TicketData } from "$lib/types";
  import { onMount, tick } from "svelte"; 
  import { fade, slide } from "svelte/transition";

  let scanResult: string | null = $state(null);
  let scanner: any = $state(null);
  let paymentData: TicketData | null = $state(null);
  let processing = $state<boolean>(false);
  let cameraReady = $state<boolean>(false);

  async function startCamera() {
    await tick();

    const { Html5QrcodeScanner } = await import("html5-qrcode");

    if (scanner) {
      try { await scanner.clear(); } catch(e) {}
    }

    scanner = new Html5QrcodeScanner(
      "reader", { 
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        }
      },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);
    cameraReady = true;
  }

  async function onScanSuccess(decodedText: string, decodedResult: any) {
    if (scanResult === decodedText) return;
    scanResult = decodedText;

    if (scanner) {
      await scanner.clear();
      cameraReady = false; 
    }

    await checkFee(decodedText);
  }

  function onScanFailure(error: any) {
    // console.log(`scan error = ${error}`);
  }

  async function checkFee(ticketId: string) {
    processing = true;
    try {
      const res = await fetch(
        `http://localhost:3000/tickets/check-fee/${ticketId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenUser.token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const json = await res.json();

      if (res.ok) {
        paymentData = json.data;
      } else {
        console.log(`Error: ${json.message}`);
        resetScan();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal koneksi ke server");
      resetScan();
    } finally {
      processing = false;
    }
  }

  async function processPayment() {
    if (!paymentData) return;
    processing = true;

    try {
      const res = await fetch(`http://localhost:3000/tickets/pay`, {
        method: "PATCH", 
        headers: { 
          "Authorization": `Bearer ${tokenUser.token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          id: paymentData.id,
          price: paymentData.price,
          durationParking: paymentData.durationParking,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        alert("Pembayaran success.");
        resetScan(); 
      } else {
        alert("Gagal: " + json.message);
      }
    } catch (err) {
      alert("Pembayaran Gagal Error");
    } finally {
      processing = false;
    }
  }

  async function resetScan() {
    scanResult = null;
    paymentData = null;
  
    await tick();
    startCamera();
  }

  onMount(() => {
    authGuard();
  });
</script>

<div class="min-h-screen bg-slate-950 text-white flex flex-col items-center p-4 font-sans">
  <div class="w-full max-w-md flex justify-between items-center mb-6 mt-4">
    <h1 class="text-xl font-bold tracking-tight">SCANNER</h1>
    <div class="flex items-center gap-2">
      {#if cameraReady}
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-xs text-slate-400">CAMERA READY</span>
      {:else}
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-xs text-slate-400">CAMERA OFF</span>
      {/if}
    </div>
  </div>

  {#if !paymentData}
    <div class="w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative">
      <div id="reader" class="w-full min-h-75 bg-black"></div>
    </div>
    <p class="mt-4 text-slate-500 text-sm">Arahkan QR Code Tiket ke kamera</p>
    
    {#if !cameraReady}
      <button onclick={startCamera} class="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold">
        Start Camera
      </button>
    {/if}
  {/if}

  {#if paymentData}
    <div transition:slide class="w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 shadow-2xl mt-4">
      <div class="flex flex-col sm:flex-row justify-between items-start bg-white shadow-md rounded-lg p-6 mb-6">
        <div class="mb-4 sm:mb-0">
          <p class="text-xs font-semibold text-gray-400 uppercase">Tanggal</p>
          <p class="text-2xl font-bold text-gray-800">
            {new Date(paymentData.entryTime).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs font-semibold text-gray-400 uppercase">Slot</p>
          <p class="text-xl font-bold text-gray-800">#{paymentData.slotParking}</p>
        </div>
      </div>
      <div class="mb-4 sm:mb-4">
        <p class="text-xs font-semibold text-gray-400 uppercase">Durasi</p>
        <p class="text-2xl font-bold text-gray-800">{formatDuration(paymentData.durationParking)}</p>
      </div>


      <div class="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100 mb-6">
        <p class="text-xs text-indigo-500 font-bold uppercase mb-1">Total Tagihan</p>
        <h2 class="text-5xl font-black text-indigo-600 tracking-tighter">
          Rp {paymentData.price?.toLocaleString("id-ID")}
        </h2>
      </div>

      <div class="space-y-3">
        <button onclick={processPayment} disabled={processing} 
          class="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {#if processing}
            Processing...
          {:else}
            Bayar
          {/if}
        </button>

        <button onclick={resetScan} class="w-full py-3 text-slate-400 font-semibold hover:text-slate-600 text-sm">
          Batalkan / Scan Ulang
        </button>
      </div>
    </div>
  {/if}
</div>