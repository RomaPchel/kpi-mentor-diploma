<script lang="ts">
	import { fade } from 'svelte/transition';

	const formsOfEducation = [
		{ value: 'part-time', label: 'Заочна' },
		{ value: 'full-time', label: 'Денна' }
	];

	const groupCodes = ['ІПЗ-21-1', 'ІПЗ-21-2', 'ІПЗ-21-3', 'КН-21-1', 'КН-21-2', 'ПМ-21-1', 'ПМ-21-2'];

	const courses = ['1', '2', '3', '4', '5'];

	const departments = [
		'Кафедра інформатики',
		'Кафедра математики',
		'Кафедра програмної інженерії',
		'Кафедра кібербезпеки'
	];

	const predefinedInterests = [
		'Програмування', 'Машинне навчання', 'Веб-розробка',
		'Мобільні додатки', 'Бази даних', 'Штучний інтелект',
		'Кібербезпека', 'Алгоритми', 'Дизайн', 'Тестування'
	];

	let selectedInterests: string[] = [];

	function toggleInterest(interest: string) {
		selectedInterests = selectedInterests.includes(interest)
			? selectedInterests.filter(i => i !== interest)
			: [...selectedInterests, interest];
	}
</script>

<div class="register-container">
	<section class="register-card" in:fade>
		<h1>Реєстрація</h1>
		<form method="POST">
			<div class="form-grid">
				<input type="email" name="email" placeholder="Електронна пошта" required />
				<input type="password" name="password" placeholder="Пароль (мін. 6 символів)" minlength="6" required />
				<input type="text" name="firstName" placeholder="Ім’я" required />
				<input type="text" name="lastName" placeholder="Прізвище" required />

				<select name="specializationTitle" required>
					<option value="" disabled selected>Спеціальність</option>
					{#each groupCodes as spec}
						<option value={spec}>{spec}</option>
					{/each}
				</select>

				<select name="course" required>
					<option value="" disabled selected>Курс</option>
					{#each courses as c}
						<option value={c}>{c}</option>
					{/each}
				</select>

				<select name="formOfEducation" required>
					<option value="" disabled selected>Форма навчання</option>
					{#each formsOfEducation as f}
						<option value={f.value}>{f.label}</option>
					{/each}
				</select>

				<select name="groupCode" required>
					<option value="" disabled selected>Група</option>
					{#each groupCodes as code}
						<option value={code}>{code}</option>
					{/each}
				</select>

				<select name="department" required>
					<option value="" disabled selected>Кафедра</option>
					{#each departments as dept}
						<option value={dept}>{dept}</option>
					{/each}
				</select>
			</div>

			<div class="interests-section">
				<label><strong>Інтереси</strong></label>
				<div class="interests">
					{#each predefinedInterests as interest}
						<button
							type="button"
							class:selected={selectedInterests.includes(interest)}
							on:click={() => toggleInterest(interest)}
						>
							{interest}
						</button>
					{/each}
					{#each selectedInterests as interest}
						<input type="hidden" name="interests" value={interest} />
					{/each}
				</div>
			</div>

			<button class="submit-btn" type="submit">Зареєструватися</button>
		</form>
	</section>
</div>

<style>
    .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #f0f4f8;
        padding: 2rem;
    }

    .register-card {
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 600px;
    }

    h1 {
        margin-bottom: 1.5rem;
        font-size: 1.75rem;
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    input,
    select {
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
        background-color: #f9fafb;
        transition: 0.2s ease;
    }


    .interests-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .interests {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .interests button {
        padding: 0.5rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 9999px;
        background-color: #e5e7eb;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }

    .interests button.selected {
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
    }

    .submit-btn {
        padding: 0.75rem;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s ease;
    }

    .submit-btn:hover {
        background-color: #1d4ed8;
    }

    @media (max-width: 600px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
