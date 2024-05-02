document.addEventListener('DOMContentLoaded', function () {
  const checkboxes = document.querySelectorAll('.habit-checkbox');

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      const habitItem = this.parentElement;
      if (this.checked) {
        habitItem.classList.add('checked');
      } else {
        habitItem.classList.remove('checked');
      }
    });
  });
});
