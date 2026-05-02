const el = {
  namesInput: document.querySelector('#names-input'),
  mixBtn: document.querySelector('#mix-btn'),
  clearBtn: document.querySelector('#clear-btn'),
  result: document.querySelector('#mixed-list'),
  copyBtn: document.querySelector('#copy-btn'),
};

function getNamesArray() {
  const names = el.namesInput.value.trim();
  if (!names) return [];

  return names
    .split('\n')
    .map(name => name.trim())
    .filter(name => name !== '');
}

function splitNames(fullNames) {
  const firstNames = [];
  const lastNames = [];

  fullNames.forEach(name => {
    const parts = name.split(/\s+/);
    if (parts.length > 1) {
      firstNames.push(parts[0]);
      lastNames.push(parts[parts.length - 1]);
    }
  });
  return { firstNames, lastNames };
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getMixedLastNames(originalLastNames) {
  let shuffled = [...originalLastNames];
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    shuffleArray(shuffled);

    const hasMatch = shuffled.some(
      (name, index) => name === originalLastNames[index],
    );

    if (!hasMatch) break;
    attempts++;
  }
  return shuffled;
}

function displayNames(firstNames, lastNames) {
  el.result.innerHTML = '';

  firstNames.forEach((first, i) => {
    const li = document.createElement('li');
    li.textContent = `${first} ${lastNames[i]}`;
    el.result.appendChild(li);
  });
}

el.mixBtn.addEventListener('click', () => {
  const names = getNamesArray();

  if (names.length < 2) {
    alert('Please enter at least two names to mix.');
    return;
  }

  const { firstNames, lastNames } = splitNames(names);
  const mixedLastNames = getMixedLastNames(lastNames);

  displayNames(firstNames, mixedLastNames);
});

el.clearBtn.addEventListener('click', () => {
  el.namesInput.value = '';
  el.result.innerHTML = '';
});

async function copyToClipboard() {
  const listItems = el.result.querySelectorAll('li');

  const textToCopy = Array.from(listItems)
    .map(li => li.textContent)
    .join('\n');

  if (!textToCopy) return;

  try {
    await navigator.clipboard.writeText(textToCopy);

    const originalText = el.copyBtn.textContent;
    el.copyBtn.textContent = 'Copied!';
    setTimeout(() => (el.copyBtn.textContent = originalText), 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
el.copyBtn.addEventListener('click', copyToClipboard);
