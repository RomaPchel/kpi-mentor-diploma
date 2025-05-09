<script>
import Header from '$lib/components/Header.svelte';
</script>
<Header />

<main>
	<section class="hero">
		<h2>Ласкаво просимо до SMP</h2>
		<p>
			Допомагаємо студентам знаходити досвідчених менторів і формувати своє майбутнє.
		</p>
	</section>

	<section class="info">
		<h3>Як працює SMP</h3>
		<p>
			Наша платформа з'єднує вас із менторами зі старших курсів, які поділяють ваші інтереси та спеціальність. Завдяки персоналізованим рекомендаціям та вбудованому чату ви легко отримаєте підтримку в навчанні та кар’єрному розвитку.
		</p>
		<ul>
			<li>Переглядайте менторів за кафедрою та інтересами</li>
			<li>Спілкуйтеся через безпечний внутрішній чат</li>
			<li>Плануйте індивідуальні сесії або групові зустрічі</li>
		</ul>
	</section>
</main>


<style>
    :global(body) {
        margin: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f9f9f9;
    }

    header {
        background: #fff;
        border-bottom: 1px solid #eee;
        padding: 1rem 2rem;
        position: sticky;
        top: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header-content {
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo h1 {
        margin: 0;
        font-size: 1.8rem;
        color: #333;
    }

    nav.auth-links a {
        margin-left: 1rem;
        text-decoration: none;
        color: #0070f3;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    nav.auth-links a:hover {
        color: #005bb5;
    }

    main {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 2rem;
    }

    .hero {
        text-align: center;
        padding: 4rem 1rem;
        background: #e0f7fa;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }

    .hero h2 {
        font-size: 2.4rem;
        margin-bottom: 1rem;
        color: #00796b;
    }

    .hero p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        color: #004d40;
    }

    .buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .btn {
        text-decoration: none;
        padding: 0.75rem 1.5rem;
        background-color: #0070f3;
        color: #fff;
        border-radius: 6px;
        transition: background 0.3s ease;
        font-weight: 500;
    }

    .btn:hover {
        background-color: #005bb5;
    }

    .btn.register {
        background-color: #4caf50;
    }

    .btn.register:hover {
        background-color: #388e3c;
    }

    .info {
        background: #fff;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }

    .info h3 {
        margin-top: 0;
        color: #333;
    }

    .info ul {
        list-style: disc;
        padding-left: 1.5rem;
        margin-top: 1rem;
        color: #555;
    }

    footer {
        text-align: center;
        padding: 1rem;
        background: #fff;
        border-top: 1px solid #eee;
        font-size: 0.9rem;
        color: #777;
    }
</style>
