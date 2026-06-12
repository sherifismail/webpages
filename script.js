const phoneForm = document.getElementById('phoneForm');
const phoneNumber = document.getElementById('phoneNumber');
const phoneError = document.getElementById('phoneError');
const phoneSuccess = document.getElementById('phoneSuccess');

phoneForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const code = document.getElementById('countryCode').value;
  const number = phoneNumber.value.trim();

  if (!/^[0-9]{6,15}$/.test(number)) {
    phoneError.textContent = 'Please enter a valid mobile number (digits only).';
    phoneSuccess.textContent = '';
    return;
  }

  phoneError.textContent = '';
  phoneSuccess.textContent = `Connecting you to chat as ${code} ${number}...`;

  const fullNumber = `${code}${number}`;

  if (window.Genesys) {
    window.Genesys('command', 'Database.set', {
      messaging: {
        customAttributes: {
          phoneNumber: fullNumber
        }
      }
    }, function () {
      window.Genesys('command', 'Messenger.open');
    }, function () {
      window.Genesys('command', 'Messenger.open');
    });
  }

  phoneForm.reset();
});
