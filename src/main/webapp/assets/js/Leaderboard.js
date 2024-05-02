window.leaderboardFunctions = (function () {
  function getOrdinalIndicator(rank) {
    var j = rank % 10,
      k = rank % 100;
    if (j == 1 && k != 11) {
      return rank + 'st';
    }
    if (j == 2 && k != 12) {
      return rank + 'nd';
    }
    if (j == 3 && k != 13) {
      return rank + 'rd';
    }
    return rank + 'th';
  }

  function getMedalImage(rank) {
    switch (rank) {
      case 1:
        return 'assets/images/GoldMedal.png';
      case 2:
        return 'assets/images/SilverMedal.png';
      case 3:
        return 'assets/images/BronzeMedal.png';
      default:
        return '';
    }
  }

  function populateLeaderboard(leaderboardData, containerSelector) {
    var leaderboard = document.querySelector('.leaderboard');
    if (!leaderboard) return;

    leaderboardData.sort(function (a, b) {
      return b.score - a.score;
    });

    while (leaderboard.firstChild) {
      leaderboard.removeChild(leaderboard.firstChild);
    }
    leaderboardData.forEach(function (entry, index) {
      var rank = index + 1;
      var ordinalIndicator = getOrdinalIndicator(rank);
      var medalImageSrc = getMedalImage(rank);
      var entryElement = document.createElement('div');
      entryElement.className = ''.concat(ordinalIndicator);
      entryElement.innerHTML = '\n            \n            '
        .concat(medalImageSrc ? '<img src="'.concat(medalImageSrc, '" alt="Medal" style="margin-left: 0">') : '', '\n            <h2>')
        .concat(
          ordinalIndicator,
          '</h2>\n            <div class="Avatar">\n                <img src="assets/images/Avatar.png" alt="">\n                <div class="name">'
        )
        .concat(
          entry.name,
          '</div>\n            </div>\n            <div class="bar">\n                <div class="progress">\n                    <div class="animation">\n                        <h2>'
        )
        .concat(entry.score, '</h2>\n                    </div>\n                </div>\n            </div>\n        ');
      leaderboard.appendChild(entryElement);
    });
    var highestScore = leaderboardData[0].score;
    leaderboardData.forEach(function (entry, index) {
      var progressWidth = (entry.score / highestScore) * 100;
      var entryElement = leaderboard.children[index];
      var progressBar = entryElement.querySelector('.progress');
      progressBar.style.width = ''.concat(progressWidth, '%');
    });
  }

  return {
    populateLeaderboard: populateLeaderboard,
    getOrdinalIndicator: getOrdinalIndicator,
    getMedalImage: getMedalImage,
  };
})();
