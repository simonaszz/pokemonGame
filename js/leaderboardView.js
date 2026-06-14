const NPC_TRAINERS = [
  {
    name: 'Rasa',
    totalXp: 340,
  },
  {
    name: 'Mantas',
    totalXp: 280,
  },
  {
    name: 'Jonas',
    totalXp: 190,
  },
  {
    name: 'Eglė',
    totalXp: 120,
  },
];

export function renderLeaderboard(trainer) {
  const leaderboardList = document.querySelector('#leaderboard-list');

  const leaderboard = [
    {
      name: `${trainer.name} (Tu)`,
      totalXp: trainer.totalXp ?? trainer.xp,
      isCurrentTrainer: true,
    },
    ...NPC_TRAINERS,
  ]
    .sort((firstTrainer, secondTrainer) => {
      return secondTrainer.totalXp - firstTrainer.totalXp;
    })
    .map((leaderboardTrainer, index) => {
      return createLeaderboardItem(leaderboardTrainer, index);
    })
    .join('');

  leaderboardList.innerHTML = leaderboard;
}

function createLeaderboardItem(trainer, index) {
  return `
    <li class="${getLeaderboardItemClass(trainer)}">
      <span>
        <strong>#${index + 1}</strong>
        ${trainer.name}
      </span>

      <span>${trainer.totalXp} XP</span>
    </li>
  `;
}

function getLeaderboardItemClass(trainer) {
  if (trainer.isCurrentTrainer === true) {
    return 'leaderboard-item leaderboard-item-current';
  }

  return 'leaderboard-item';
}
