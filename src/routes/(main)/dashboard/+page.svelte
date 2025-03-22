<script lang="ts">

</script>

<main>
	<div class="dashboard-header">
		<h2>Welcome to the Student Mentor Platform</h2>

	</div>
	
	<p class="intro-text">
		Whether you're a soon-to-be student or a first-year student, our platform connects you with experienced mentors to guide your academic journey.
	</p>

	<div class="dashboard-cards">
		<div class="feature-card">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
			<h3>Find a Mentor</h3>
			<p>Connect with experienced mentors to guide your academic journey</p>
		</div>
		
		<div class="feature-card">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
			<h3>Become a Mentor</h3>
			<p>Share your knowledge and help guide others in their academic journey</p>
		</div>
		
		<div class="feature-card">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
			<h3>Secure Chat</h3>
			<p>Communicate easily with your mentor or mentees through our secure chat</p>
		</div>
		
		<div class="feature-card">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
			<h3>Personalized Matching</h3>
			<p>Get matched with mentors based on your specific needs and interests</p>
		</div>
	</div>
</main>

<style>
    main {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .user-controls {
        display: flex;
        gap: 1rem;
    }
    
    .btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .profile-btn {
        background-color: #e0f2fe;
        color: #0369a1;
    }
    
    .settings-btn {
        background-color: #f1f5f9;
        color: #475569;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .intro-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #4b5563;
        margin-bottom: 2rem;
    }
    
    .dashboard-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
    
    .feature-card {
        background-color: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .feature-card svg {
        color: #0ea5e9;
        margin-bottom: 1rem;
    }
    
    .feature-card h3 {
        margin: 0.5rem 0;
        color: #1e293b;
    }
    
    .feature-card p {
        color: #64748b;
        margin: 0;
    }
    
    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    }
</style>
