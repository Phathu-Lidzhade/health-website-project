document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop the usual form POST

    // 1) Read the values the user typed
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const admin_code = document.getElementById("admin_code").value;

    // 2) Send them as JSON to our API endpoint
    const res = await fetch("api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, admin_code }),
    });

    // 3) Parse the JSON response from the server
    const data = await res.json();

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      alert("Server error, check console");
      return;
    }
   

    // 4) Redirect based on whether they’re an admin
    if (data.success) {
      if (data.is_admin) {
        window.location.href = "admin page/admin.html";
      } else {
        window.location.href = "products page/products.html";
      }
    } else {
      alert("Invalid credentials or admin code.");
    }
  });
});
