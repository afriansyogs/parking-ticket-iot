<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
  import "../../app.css"
  import { goto } from '$app/navigation';
  import type { usernameEmailRole } from '$lib/types';
  import { tokenUser } from '$lib/state/token.svelte';
  import { authGuard } from '$lib/utils/authGuard';

	let isMobileMenuOpen = $state<boolean>(false);
  let userData = $state<usernameEmailRole>({
    username: "",
    email: "",
    role: ""
  })
	
	let navItems = $state([
		{ name: 'Dashboard', href: '/', icon: '<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>' },
		{ name: 'Ticket', href: '/ticket-stream', icon: '<path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 010 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 010-4V7z"/>' },
		{ name: 'Scan Ticket', href: '/scan', icon: '<path d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 16H4m16 0h-2m0 0v-4h2v4zM6 16h2v-4H6v4zm4-9V4m-4 1h16M6 9h2V5H6v4zm10 0h2V5h-2v4zM6 16v4m12-4v4"/>' }, 
		{ name: 'Reports', href: '/reports', icon: '<path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
		{ name: 'Register Petugas', href: '/register', icon: '<path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>' },
	]);

	$effect(() => {
		if ($page.url.pathname) {
			isMobileMenuOpen = false;
		}
	});

  function toggleMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function handleLogOut() {
    localStorage.removeItem('token')
    goto('/login')
  }

  async function getUsernameAndEmail() {
    const res = await fetch(`http://localhost:3000/auth/getUserEmail`, {
			method: 'GET',
			headers: {
				"Authorization": `Bearer ${tokenUser.token}`,
				"Content-Type": "application/json" 
			}
		});
		const responseData = await res.json();
		userData = responseData.data

    if (userData.role !== 'ADMIN') {
      navItems = navItems.filter(item => item.href !== '/register');
    }
  }

  onMount(() => {
    tokenUser.token = localStorage.getItem("token");
    authGuard();
    $inspect(tokenUser.token)
    getUsernameAndEmail();
  })
</script>

<div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
  <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
  <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[120px]"></div>
  </div>

  <header class="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-50">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <span class="text-white font-bold text-sm">P</span>
      </div>
      <span class="font-bold text-white tracking-tight">SmartPark</span>
    </div>

    <button onclick={toggleMenu} class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {#if isMobileMenuOpen}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        {/if}
      </svg>
    </button>
  </header>


  {#if isMobileMenuOpen}
    <div  transition:fade={{ duration: 200 }} class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onclick={toggleMenu} role="presentation"></div>
    <aside transition:fly={{ x: -280, duration: 300 }} class="fixed top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-white/10 z-50 md:hidden flex flex-col">
      <div class="p-6 border-b border-white/5 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h1 class="font-bold text-white text-lg tracking-tight">SmartPark</h1>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] uppercase text-emerald-400 font-bold tracking-wider">System Online</span>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {#each navItems as item}
          {@const isActive = $page.url.pathname === item.href}
          <a href={item.href}
            class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden
            {isActive ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'}"
          >
            {#if isActive}
              <div class="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
            {/if}
            <svg class="w-5 h-5 {isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {@html item.icon}
            </svg>
            <span class="font-medium text-sm">{item.name}</span>
          </a>
        {/each}
      </nav>
      
      <div class="p-4 border-t border-white/5 m-2 bg-slate-950/30 rounded-2xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span class="font-bold text-indigo-400">AD</span>
          </div>
          <div>
            <p class="text-sm font-bold text-white">{userData.username}</p>
            <p class="text-xs text-slate-500">Log Out</p>
          </div>
        </div>
      </div>
    </aside>
  {/if}

  <aside class="hidden md:flex fixed inset-y-0 left-0 w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 z-40 flex-col">
    <div class="h-24 flex items-center px-8 border-b border-white/5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group">
          <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h1 class="font-bold text-xl text-white tracking-tight">SmartPark</h1>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">IoT System Active</span>
          </div>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
      {#each navItems as item}
        {@const isActive = $page.url.pathname === item.href}
        <a href={item.href} class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
          {isActive ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/30 translate-x-2' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}"
        >
          <svg class="w-5 h-5 {isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            {@html item.icon}
          </svg>
          <span class="font-medium text-sm tracking-wide">{item.name}</span>
          {#if isActive}
            <div class="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>
          {/if}
        </a>
      {/each}
    </nav>

    <div class="p-6 border-t border-white/5">
      <div class="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 border border-white/5 transition-colors group">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center">
          <span class="font-bold text-white text-xs">ADM</span>
        </div>
        <div class="text-left flex-1">
          <p class="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{userData.username}</p>
          <p class="text-xs text-slate-500">{userData.email}</p>
        </div>
        <button onclick={handleLogOut} class="cursor-pointer">
          <svg class="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </div>
  </aside>