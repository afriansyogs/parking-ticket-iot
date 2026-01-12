<script lang="ts">
  import { onMount } from "svelte";
  import { fly, scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { goto } from "$app/navigation";
  import type { NewUser } from "$lib/types";
  

  let mounted = $state<boolean>(false);
  let loading = $state<boolean>(false);
  let newUser = $state<NewUser>({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })

  function clearForm() {
    newUser = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    }
  }

  async function handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (!newUser.email || !newUser.username || !newUser.password || !newUser.passwordConfirm) {
      alert("Smua field harus diisi");
      clearForm();
      return;
    }

    if (newUser.password.length < 8) {
      alert("Password harus lebih dari 8 karakter");
      clearForm();
      return;
    }

    if (newUser.password !== newUser.passwordConfirm) {
      alert("Password tidak sama");
      clearForm();
      return;
    }

    loading = true;

    try {
      const response: Response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
        }),
      });
      const responseData: any = await response.json();

      console.log(responseData);

      if (response.ok) {
        alert("Registrasi Berhasil!");
        goto("/login");
      } else {
        alert("Registrasi Gagal: " + responseData.error);
      }
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    mounted = true;
  });
</script>
<div class="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
  </div>

  {#if mounted}
    <div in:fly={{ y: 50, duration: 800, easing: cubicOut }} class="w-full max-w-md relative z-10 flex flex-col gap-6">
      <div class="flex flex-col items-center justify-center mb-2">
        <div class="relative w-full flex justify-center items-end h-24">
          <div class="absolute bottom-2 w-32 h-2 bg-indigo-500/50 rounded-full blur-md animate-pulse"></div>
          <div class="relative animate-bounce">
            <div class="w-20 h-9 bg-slate-700 rounded-t-2xl mx-auto translate-y-1 relative border-t border-slate-600">
            <div class="absolute top-2 right-2 w-10 h-5 bg-sky-900/50 rounded-tr-lg backdrop-blur-sm border-t border-r border-sky-500/30"></div>
          </div>
          <div class="w-36 h-12 bg-slate-800 rounded-2xl relative shadow-2xl flex items-center justify-between px-4 border-t border-slate-700">
            <div class="w-3 h-5 bg-yellow-200 rounded-full blur-[2px] shadow-[0_0_25px_rgba(253,224,71,0.9)] animate-pulse"></div>
            <div class="w-[2px] h-8 bg-slate-950/50 absolute left-16"></div>
            <div class="w-3 h-1 bg-slate-950/50 rounded-full absolute left-18 top-3"></div>
            <div class="w-1.5 h-5 bg-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.8)]"></div>
          </div>
          <div class="absolute -bottom-3 left-5 w-9 h-9 bg-black rounded-full border-[3px] border-slate-600 flex items-center justify-center shadow-lg">
            <div class="w-2 h-2 bg-slate-500 rounded-full"></div>
          </div>
          <div class="absolute -bottom-3 right-5 w-9 h-9 bg-black rounded-full border-[3px] border-slate-600 flex items-center justify-center shadow-lg">
            <div class="w-2 h-2 bg-slate-500 rounded-full"></div>
          </div>
          </div>
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] pt-4 pb-8 px-8 shadow-2xl relative overflow-hidden group">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        <h1 class="mt-6 text-3xl font-extrabold text-white tracking-tight text-center">
          Register Petugas
        </h1>
        <h1 class="mt-2 text-2xl font-bold text-indigo-500 tracking-tight text-center">
          BIRO YODICK PARKING
        </h1>
        <form class=" mt-6 space-y-5" onsubmit={handleSubmit}>
          <div class="space-y-1">
            <label for="username" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              USERNAME</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-indigo-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  ></path><circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input type="text" id="username" bind:value={newUser.username} placeholder="Username"
                class="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-slate-600"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label for="email" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              EMAIL
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-indigo-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  ><path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  ></path><polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input type="email" id="email" bind:value={newUser.email} placeholder="nama@email.com"
                class="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-slate-600"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="password" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                PASSWORD
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><rect x="3" y="11" width="18" height="11" rx="2" ry="2"
                    ></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input type="password" id="password" bind:value={newUser.password} placeholder="••••"
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-slate-600"
                />
              </div>
            </div>
            <div class="space-y-1">
              <label for="confirm" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                PASSWORD CONFIRMATION
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                    ></path><polyline points="22 4 12 14.01 9 11.01"
                    ></polyline>
                  </svg>
                </div>
                <input type="password" id="confirm" bind:value={newUser.passwordConfirm} placeholder="••••"
                  class="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-slate-600"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} class="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] transform active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group/btn">
            {#if loading}
              <div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Memproses...</span>
            {:else}
              <span>Daftar Sekarang</span>
              <svg
                class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                ></path>
              </svg>
            {/if}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-xs text-slate-400">
            Sudah punya akses?
            <a href="/login" class="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Masuk disini
            </a>
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
