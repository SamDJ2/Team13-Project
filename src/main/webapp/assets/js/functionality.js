document.addEventListener('DOMContentLoaded', function () {
  // Function to add a new habit when the "Add Habit" button is clicked
  function addNewHabit(button) {
    button.addEventListener('click', function () {
      const habitItem = this.parentNode;
      const ul = habitItem.querySelector('ul');
      const newCheckbox = document.createElement('input');
      newCheckbox.type = 'checkbox';
      const newLi = document.createElement('li');
      newLi.appendChild(newCheckbox);
      const newTextInput = document.createElement('span');
      newTextInput.contentEditable = true; // Allow text editing
      newTextInput.textContent = 'New Habit'; // Default text
      newLi.appendChild(newTextInput);
      ul.appendChild(newLi);

      // Add event listener to the new checkbox for strikethrough functionality
      newCheckbox.addEventListener('change', function () {
        if (this.checked) {
          newTextInput.style.textDecoration = 'line-through';
        } else {
          newTextInput.style.textDecoration = 'none';
        }
      });
    });
  }

  // Function to add functionality for existing "Add Habit" buttons
  const addHabitButtons = document.querySelectorAll('.add-habit');
  addHabitButtons.forEach(addNewHabit);

  // Function to generate habit tracker for a new week
  function generateNewWeekHabitTracker() {
    // Get the current date
    const currentDate = new Date();
    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = currentDate.getDay();
    // Calculate the days to add to reach next Monday
    const daysToAdd = currentDay === 0 ? 1 : 8 - currentDay;
    // Create a new date object for next Monday
    const nextMonday = new Date(currentDate);
    nextMonday.setDate(currentDate.getDate() + daysToAdd);

    // Get the date of the Monday of the previous week
    const previousMonday = new Date(nextMonday);
    previousMonday.setDate(nextMonday.getDate() - 7);

    // Update the week starting text
    const weekStartingText = document.querySelector('.week-starting p');
    weekStartingText.textContent = `Week Starting @${formatDate(nextMonday)}`;

    // Generate habit tracker for the new week and append habits from the previous week
    generateHabitTracker(previousMonday, nextMonday);
  }

  // Function to format date as "Month Day, Year" (e.g., "March 21, 2024")
  function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Function to generate habit tracker for the current week
  function generateHabitTracker(startDate, endDate) {
    // Get the container for habit tracker
    const habitGrid = document.querySelector('.habit-grid');
    // Clear existing habit tracker
    habitGrid.innerHTML = '';

    // Array of days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Loop through each day of the week to generate habits
    for (let i = 0; i < 7; i++) {
      const habitItem = document.createElement('div');
      habitItem.classList.add('habit-item');
      const dayOfWeek = daysOfWeek[i];
      // HTML template for habit item
      const habitHTML = `
          <p>${dayOfWeek}</p>
          <ul>
            <li><input type="checkbox">Wake up at 6 AM</li>
            <li><input type="checkbox">Gym</li>
            <li><input type="checkbox">4 hrs focus work</li>
            <li><input type="checkbox">Eat healthy</li>
            <li><input type="checkbox">Drink 2L of water</li>
            <!-- Add more habits here -->
          </ul>
          <button class="add-habit">Add Habit</button>
        `;
      habitItem.innerHTML = habitHTML;
      habitGrid.appendChild(habitItem);
    }

    // Call the function to add event listeners for new "Add Habit" buttons
    addEventListenersToAddHabitButtons();

    // Apply strikethrough to existing checkboxes
    applyStrikethrough();
  }

  // Function to add event listeners for new "Add Habit" buttons
  function addEventListenersToAddHabitButtons() {
    const addHabitButtons = document.querySelectorAll('.add-habit');
    addHabitButtons.forEach(function (button) {
      addNewHabit(button);
    });
  }

  // Function to apply strikethrough to existing checkboxes
  function applyStrikethrough() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        const habitText = this.parentNode;
        if (this.checked) {
          habitText.style.textDecoration = 'line-through';
        } else {
          habitText.style.textDecoration = 'none';
        }
      });
    });
  }

  // Add event listener for the "New Weekly Habit Tracker" button
  const newWeeklyHabitTrackerButton = document.querySelector('.new-weekly-habit-tracker');
  newWeeklyHabitTrackerButton.addEventListener('click', generateNewWeekHabitTracker);

  // Call the function to generate habit tracker for the current week
  generateHabitTracker(new Date(), new Date());
});
