<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { goto } from "$app/navigation";
  import type { UserLogin } from "$lib/types";

  let userLogin = $state<UserLogin>({
    username: "",
    password: "",
  });
  let loading = $state<boolean>(false);
  let mounted = $state<boolean>(false);

  function clearForm() {
    userLogin = {
      username: '',
      password: ''
    }
  }

  async function handleLogin(e: Event): Promise<void> {
    e.preventDefault();

    if (!userLogin.username || !userLogin.password) {
      alert("Smua field harus diisi");
      clearForm();
      return;
    }

    loading = true;

    try {
      const response: Response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userLogin.username,
          password: userLogin.password,
        }),
      });
      const responseData: any = await response.json();

      console.log(responseData);

      if (response.ok) {
        alert("Login Berhasil!");
        localStorage.setItem('token', responseData.data.token);
        goto("/");
      } else {
        alert(`login gagal${responseData.data.error}`);
      }
    } catch (error) {
      console.error(`register error ${error}`);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    mounted = true;
  });
</script>

<div class="absolute inset-0 overflow-hidden pointer-events-none">
  <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
  <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
</div>

{#if mounted}
  <div
    in:fly={{ y: 40, duration: 800, easing: cubicOut }}
    class="w-full max-w-md relative z-10 flex flex-col gap-6"
  >
    <div class="flex flex-col items-center justify-center mb-2">
      <div class="relative w-full flex justify-center items-end h-24">
        <div class="absolute bottom-2 w-32 h-2 bg-indigo-500/50 rounded-full blur-md animate-pulse"></div>
        <div class="relative animate-bounce z-10">
          <div class="w-28 mx-auto">
            <div class="bg-slate-900 rounded-xl shadow-lg p-4 relative border border-slate-800">
              <div class="flex items-center justify-between mb-3">
                <div class="w-8 h-4 bg-indigo-500 rounded-sm"></div>
                <div class="w-2.5 h-2.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.9)]"></div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="h-6 bg-slate-800 rounded-md"></div>
                <div class="h-6 bg-slate-800 rounded-md"></div>
                <div class="col-span-2 h-6 bg-indigo-600/90 rounded-md flex items-center justify-center">
                  <span class="text-indigo-50 text-sm font-semibold">P</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] pt-4 pb-8 px-8 shadow-2xl relative overflow-hidden group">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
      <h1 class="mt-4 text-3xl font-extrabold text-white tracking-tight text-center">
        Login
      </h1>
      <h1 class="mt-2 text-2xl font-bold text-indigo-500 tracking-tight text-center">
        BIRO YODICK PARKING
      </h1>
      <form class=" mt-6 space-y-5" onsubmit={handleLogin}>
        <div class="space-y-1">
          <label for="username" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            username
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
                ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                ></path><circle cx="12" cy="7" r="4"></circle></svg
              >
            </div>
            <input type="username" id="username" bind:value={userLogin.username} placeholder="username"
              class="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-slate-600"
            />
          </div>
        </div>

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
                  ></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg
                >
              </div>
              <input type="password" id="password" bind:value={userLogin.password} placeholder="••••"
                class="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all hover:border-slate-600"
              />
            </div>
          </div>

        <button type="submit" disabled={loading} class="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] transform active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group/btn">
          {#if loading}
            <div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Memproses...</span>
          {:else}
            <span>Login</span>
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
    </div>
  </div>
{/if}