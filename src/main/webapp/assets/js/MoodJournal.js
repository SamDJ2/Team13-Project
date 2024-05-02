// Function to handle item click and update the selected prompt text
function updateSelectedPrompt(item) {
  document.getElementById('selectedPrompt').textContent = item.querySelector('h4').textContent;
  console.log('updateSelectedPrompt function called: Updated prompt text.');

  // Optional: Scroll to the journal entry form
  document.querySelector('.journal-entry-form').scrollIntoView({ behavior: 'smooth' });
}

// Event listeners for each item in the carousel
document.querySelectorAll('.owl-carousel .item').forEach(item => {
  item.addEventListener('click', function () {
    console.log('Click event on carousel item.');
    updateSelectedPrompt(this); // Calling updateSelectedPrompt function here
  });
});

// Function to just clear the form data without handling submission
function clearFormData(e) {
  e.preventDefault(); // Prevent the default form submission
  document.getElementById('promptTitle').value = '';
  document.getElementById('promptContent').value = '';
  console.log('clearFormData function called: Form data cleared.');
}

// Adding event listener for the form submission
document.getElementById('journalForm').addEventListener('submit', clearFormData); // Calling clearFormData function here
