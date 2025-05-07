<script lang="ts">
	export let level: string;
	export let levelTitle: string;

	const styles: Record<string, { bg: string; text: string; border: string }> = {
		1: {
			bg: 'linear-gradient(135deg, #cd7f32, #b87333)',
			text: '#fff',
			border: '#b87333'
		},
		2: {
			bg: 'linear-gradient(135deg, #c0c0c0, #a9a9a9)',
			text: '#fff',
			border: '#a9a9a9'
		},
		3: {
			bg: 'linear-gradient(135deg, #ffd700, #ffb700)',
			text: '#1f2937',
			border: '#fbbf24'
		},
		4: {
			bg: 'linear-gradient(135deg, #e5e4e2, #d1d5db)',
			text: '#1f2937',
			border: '#d1d5db'
		}
	};

	const current = styles[level] || styles.Bronze;
</script>

<span
	class="level-badge"
	style="
		background: {current.bg};
		color: {current.text};
		border: 1px solid {current.border};
	"
>
	{levelTitle}
</span>

<style>
    .level-badge {
        padding: 0.4rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 9999px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        display: inline-block;
    }
</style>
