
(function () {
  const backButton = document.getElementById("medinnova-back");

  if (!backButton) return;

  function goBack() {
    if (window.history.length > 1 && document.referrer) {
      const previousPage = new URL(document.referrer);

      // Only navigate back within this website.
      if (previousPage.origin === window.location.origin) {
        window.history.back();
        return;
      }
    }

    // Adjust this path if your site is hosted in a subdirectory.
    window.location.href = "../../index.html";
  }

  backButton.addEventListener("click", goBack);

  backButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goBack();
    }
  });
})();
