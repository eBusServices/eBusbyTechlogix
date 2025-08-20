// Show modal after page load (safe if element is missing)
window.onload = () => {
  document.getElementById("welcomeModal")?.classList.remove("hidden");
};

// Close modal (safe if element is missing)
function closeModal() {
  document.getElementById("welcomeModal")?.classList.add("hidden");
}

// Load and display trip data from Vercel API
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tripTable");
  if (!container) return; // Only run on pages that have the container

  try {
    // Replace with your Vercel deployment URL when deployed
    const API_BASE = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://your-vercel-app.vercel.app';
    
    const res = await fetch(`${API_BASE}/api/trips`);
    const trips = await res.json();

    trips.forEach((trip) => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow flex justify-between items-center";

      card.innerHTML = `
        <div>
          <h2 class="text-lg font-semibold">${trip.route}</h2>
          <p class="text-gray-600">NGN ${trip.price.toLocaleString()}</p>
        </div>
        <a href="book-form.html?id=${trip.id}" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Book Trip
        </a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading trips:', error);
    container.innerHTML = "<p class='text-red-500'>Failed to load trips. Please try again later.</p>";
  }
});
