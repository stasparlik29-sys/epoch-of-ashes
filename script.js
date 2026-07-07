const charactersCodex = document.querySelector("#charactersCodex");

if (charactersCodex) {
  db.collection("characters")
    .get()
    .then(snapshot => {
      const characters = [];

      snapshot.forEach(doc => {
        characters.push(doc.data());
      });

      let selectedIndex = 0;

      function abilityBlock(label, ability) {
        return `
          <div>
            <span>${label}</span>
            <strong>${ability.value}</strong>
            <em>${ability.mod}</em>
          </div>
        `;
      }

      function companionBlock(companion) {
        if (!companion) return "";

        return `
          <section class="wide-section companion-section">
            <h4>Спутник</h4>
            <div class="companion-header">
              <div>
                <h5>${companion.name}</h5>
                <p>${companion.type} · ${companion.status}</p>
              </div>
            </div>
            <p>${companion.description}</p>
            <div class="hero-stats companion-stats">
              <span>КД <strong>${companion.combat.ac}</strong></span>
              <span>Хиты <strong>${companion.combat.hp}</strong></span>
              <span>Скорость <strong>${companion.combat.speed}</strong></span>
            </div>
            <div class="ability-grid">
              ${abilityBlock("Сила", companion.abilities.str)}
              ${abilityBlock("Ловкость", companion.abilities.dex)}
              ${abilityBlock("Телосложение", companion.abilities.con)}
              ${abilityBlock("Интеллект", companion.abilities.int)}
              ${abilityBlock("Мудрость", companion.abilities.wis)}
              ${abilityBlock("Харизма", companion.abilities.cha)}
            </div>
          </section>
        `;
      }

      function renderCharacter(index) {
        const character = characters[index];

        charactersCodex.innerHTML = `
          <section class="codex-layout">
            <aside class="codex-list">
              <h2>Список</h2>
              ${characters.map((item, itemIndex) => `
                <button class="codex-list-item ${itemIndex === index ? "active" : ""}" data-index="${itemIndex}">
                  <strong>${item.name}</strong>
                  <span>${item.class} · ${item.role}</span>
                </button>
              `).join("")}
            </aside>

            <article class="codex-profile">
              <div class="codex-portrait">
                <img src="${character.image}" alt="${character.name}">
              </div>

              <div class="codex-info">
                <p class="codex-label">Досье персонажа</p>
                <h2>${character.name}</h2>

                <p class="role">
                  ${character.race} · ${character.class} · ${character.domain} · ${character.god}
                </p>

                <p class="character-description">${character.description}</p>

                <div class="info-grid">
                  <div><span>Раса</span><strong>${character.race}</strong></div>
                  <div><span>Класс</span><strong>${character.class}</strong></div>
                  <div><span>${character.domainLabel}</span><strong>${character.domain}</strong></div>
                  <div><span>Покровитель</span><strong>${character.god}</strong></div>
                  <div><span>Статус</span><strong>${character.status}</strong></div>
                  <div><span>Роль</span><strong>${character.role}</strong></div>
                </div>

                <div class="character-section">
                  <h3>Досье героя</h3>

                  <div class="hero-sections">
                    <section>
                      <h4>Характеристики</h4>
                      <div class="ability-grid">
                        ${abilityBlock("Сила", character.abilities.str)}
                        ${abilityBlock("Ловкость", character.abilities.dex)}
                        ${abilityBlock("Телосложение", character.abilities.con)}
                        ${abilityBlock("Интеллект", character.abilities.int)}
                        ${abilityBlock("Мудрость", character.abilities.wis)}
                        ${abilityBlock("Харизма", character.abilities.cha)}
                      </div>
                    </section>

                    <section>
                      <h4>Боевые данные</h4>
                      <div class="hero-stats">
                        <span>Уровень <strong>${character.combat.level}</strong></span>
                        <span>КД <strong>${character.combat.ac}</strong></span>
                        <span>Хиты <strong>${character.combat.hp}</strong></span>
                        <span>Скорость <strong>${character.combat.speed}</strong></span>
                        <span>Владение <strong>${character.combat.proficiency}</strong></span>
                        <span>Инициатива <strong>${character.combat.initiative}</strong></span>
                      </div>
                    </section>

                    <section>
                      <h4>Черты характера</h4>
                      <p>${character.personality}</p>
                    </section>

                    <section>
                      <h4>Идеалы</h4>
                      <p>${character.ideals}</p>
                    </section>

                    ${companionBlock(character.companion)}

                    <section class="wide-section">
                      <h4>Полная биография</h4>
                      <p>${character.biography}</p>
                    </section>
                  </div>
                </div>
              </div>
            </article>
          </section>
        `;

        document.querySelectorAll(".codex-list-item").forEach(button => {
          button.addEventListener("click", () => {
            selectedIndex = Number(button.dataset.index);
            renderCharacter(selectedIndex);
          });
        });
      }

      renderCharacter(selectedIndex);
    });
}
const journalContainer = document.querySelector("#journalContainer");

if (journalContainer) {
  db.collection("journal")
    .get()
    .then(snapshot => {
      const entries = [];

      snapshot.forEach(doc => {
        entries.push(doc.data());
      });

      entries.sort((a, b) => Number(a.id) - Number(b.id));

      journalContainer.innerHTML = entries.map(entry => `
        <article class="journal-entry">
          <button class="journal-header">
            <div>
              <span>Сессия ${entry.id}</span>
              <h2>${entry.title}</h2>
              <p>${entry.summary}</p>
            </div>
            <div class="journal-meta">
              <strong>${entry.date}</strong>
              <span class="journal-arrow">▼</span>
            </div>
          </button>
          <div class="journal-content">
            ${entry.content.map(paragraph => `<p>${paragraph}</p>`).join("")}
          </div>
        </article>
      `).join("");

      document.querySelectorAll(".journal-header").forEach(header => {
        header.addEventListener("click", () => {
          header.parentElement.classList.toggle("open");
        });
      });
    });
}

const questsContainer = document.querySelector("#questsContainer");

if (questsContainer) {
  db.collection("quests")
    .get()
    .then(snapshot => {
      const quests = [];

      snapshot.forEach(doc => {
        quests.push(doc.data());
      });

      quests.sort((a, b) => Number(a.id) - Number(b.id));
      questsContainer.innerHTML = quests.map(quest => `
        <article class="quest-card ${quest.status}">
          <div class="quest-status">${getQuestStatus(quest.status)}</div>
          <h2>${quest.title}</h2>
          <p>${quest.description}</p>
          <div class="quest-info">
            <div><span>Сложность</span><strong>${quest.difficulty}</strong></div>
            <div><span>Выдал</span><strong>${quest.giver}</strong></div>
            <div><span>Награда</span><strong>${quest.reward}</strong></div>
          </div>
        </article>
      `).join("");
    });
}

function getQuestStatus(status) {
  if (status === "active") return "Активный";
  if (status === "completed") return "Завершён";
  if (status === "failed") return "Провален";
  return "Неизвестно";
}

const mapCards = document.querySelectorAll(".map-card");
const mapModal = document.querySelector("#mapModal");
const mapModalImage = document.querySelector("#mapModalImage");
const mapModalTitle = document.querySelector("#mapModalTitle");
const mapModalClose = document.querySelector("#mapModalClose");

if (mapCards.length && mapModal) {
  mapCards.forEach(card => {
    card.addEventListener("click", () => {
      mapModalImage.src = card.dataset.image;
      mapModalTitle.textContent = card.dataset.title;
      mapModal.classList.add("open");
    });
  });

  mapModalClose.addEventListener("click", () => {
    mapModal.classList.remove("open");
  });

  mapModal.addEventListener("click", event => {
    if (event.target === mapModal) {
      mapModal.classList.remove("open");
    }
  });
}

const diceButtons = document.querySelectorAll(".dice-buttons button");
const diceResult = document.querySelector("#diceResult");
const diceHistory = document.querySelector("#diceHistory");

if (diceButtons.length && diceResult && diceHistory) {
  const history = [];

  diceButtons.forEach(button => {
    button.addEventListener("click", () => {
      const sides = Number(button.dataset.dice);
      let ticks = 0;

      diceResult.classList.remove("critical-success", "critical-fail");
      diceResult.classList.add("rolling");

      const rollAnimation = setInterval(() => {
        diceResult.textContent = Math.floor(Math.random() * sides) + 1;
        ticks++;

        if (ticks >= 14) {
          clearInterval(rollAnimation);

          const result = Math.floor(Math.random() * sides) + 1;
          diceResult.textContent = result;

          diceResult.classList.remove("rolling");
          diceResult.classList.add("roll");

          if (sides === 20 && result === 20) diceResult.classList.add("critical-success");
          if (sides === 20 && result === 1) diceResult.classList.add("critical-fail");

          history.unshift({ dice: `d${sides}`, result });

          diceHistory.innerHTML = history
            .slice(0, 10)
            .map(item => `<li><span>${item.dice}</span><strong>${item.result}</strong></li>`)
            .join("");
        }
      }, 45);
    });
  });
}

const customRollInput = document.querySelector("#customRollInput");
const customRollButton = document.querySelector("#customRollButton");
const customRollDetails = document.querySelector("#customRollDetails");

if (customRollInput && customRollButton && customRollDetails && diceHistory && diceResult) {
  customRollButton.addEventListener("click", () => {
    const formula = customRollInput.value.trim().toLowerCase();
    const match = formula.match(/^(\d*)d(\d+)([+-]\d+)?$/);

    if (!match) {
      customRollDetails.textContent = "Формат неверный. Пример: 2d6+3";
      return;
    }

    const count = Number(match[1] || 1);
    const sides = Number(match[2]);
    const modifier = Number(match[3] || 0);

    const rolls = [];

    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = rolls.reduce((sum, value) => sum + value, 0) + modifier;

    diceResult.textContent = total;

    customRollDetails.textContent =
      `${formula}: ${rolls.join(" + ")} ${modifier ? (modifier > 0 ? "+ " + modifier : "- " + Math.abs(modifier)) : ""} = ${total}`;

    diceHistory.innerHTML =
      `<li><span>${formula}</span><strong>${total}</strong></li>` +
      diceHistory.innerHTML;
  });
}
/* ==========================================
   Фоновая музыка для всего сайта
========================================== */

const musicPath = window.location.pathname.includes("/pages/")
  ? "../assets/Music/music.mp3"
  : "assets/Music/music.mp3";

const backgroundMusic = new Audio(musicPath);

backgroundMusic.loop = true;
backgroundMusic.volume = 0.25;

const savedTime = Number(localStorage.getItem("musicTime") || 0);
const musicDisabled = localStorage.getItem("musicDisabled") === "true";

backgroundMusic.currentTime = savedTime;

const musicButton = document.createElement("button");
musicButton.className = "music-button";
musicButton.innerHTML = musicDisabled ? "🔇" : "♪";

document.body.appendChild(musicButton);

function tryStartMusic() {
  if (musicDisabled) return;

  backgroundMusic.play().catch(() => {});
}

document.addEventListener("click", tryStartMusic, { once: true });
document.addEventListener("keydown", tryStartMusic, { once: true });

setInterval(() => {
  if (!backgroundMusic.paused) {
    localStorage.setItem("musicTime", backgroundMusic.currentTime);
  }
}, 1000);

musicButton.addEventListener("click", async (event) => {
  event.stopPropagation();

  if (localStorage.getItem("musicDisabled") === "true") {
    localStorage.setItem("musicDisabled", "false");
    musicButton.innerHTML = "♪";
    await backgroundMusic.play().catch(() => {});
  } else {
    localStorage.setItem("musicDisabled", "true");
    musicButton.innerHTML = "🔇";
    backgroundMusic.pause();
  }
});