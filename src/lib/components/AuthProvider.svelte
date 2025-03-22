<script lang="ts">
  import { onMount } from 'svelte';
  import useAuth from '$lib/hooks/useAuth';
  import { browser } from '$app/environment';

  // Initialize auth utilities
  const { initAuth, isLoading } = useAuth();

  // Initialize auth state when the component mounts
  onMount(() => {
    if (browser) {
      initAuth();
    }
  });
</script>

{#if $isLoading}
  <div class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
{/if}

<slot />

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style> 