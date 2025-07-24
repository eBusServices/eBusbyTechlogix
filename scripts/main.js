// Show modal after page load
window.onload = () => {
  document.getElementById("welcomeModal").classList.remove("hidden");
};

// Close modal
function closeModal() {
  document.getElementById("welcomeModal").classList.add("hidden");
}

// Load and display trip data
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tripTable");

  try {
    const res = await fetch("data/trips.json");
    const trips = await res.json();

    trips.forEach((trip) => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow flex justify-between items-center";

      card.innerHTML = `
        <div>
          <h2 class="text-lg font-semibold">${trip.route}</h2>
          <p class="text-gray-600">NGN ${trip.price.toLocaleString()}</p>
        </div>
        <a href="book.html?id=${trip.id}" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Book Trip
        </a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p class='text-red-500'>Failed to load trips.</p>";
  }
});
