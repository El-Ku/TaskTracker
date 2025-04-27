const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
});

registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.style.display = 'block';
  loginForm.style.display = 'none';
});

registerForm.addEventListener('submit', (event) => {
    event.preventDefault(); // stops the page from refreshing
    const formData = new FormData(registerForm);
    if(formData.get('password') !== formData.get('confirmPassword')) {
        alert("The passwords does not match");
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        return;
    }
    const userDetails = {
        username: formData.get('username'),
        password: formData.get('password'),
    };
    fetch('/api/users/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
    })
        .then((res) => handleError(res))
        .then((data) => {
            const {result, message} = data;
            console.log(`${result} : ${message}`);
        })
        .catch((err) => console.error(err));
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // stops the page from refreshing
    const formData = new FormData(loginForm);
    const userDetails = {
        username: formData.get('username'),
        password: formData.get('password'),
    };
    fetch('/api/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
    })
        .then((res) => handleError(res))
        .then((data) => {
            const {result, message, token} = data;
            if(result == "success") {
                localStorage.setItem('token', token);
                window.location.href = '/profile.html';  // Redirect to profile page
            }
            console.log(`${result} : ${message}`);
        })
        .catch((err) => console.error(err));
});

const handleError = async function(res) {
    if(res.status !== 200) {
        const {result, message} = await res.json();
        throw new Error(`${result} : ${message}`);
    } else {
        return res.json();
    } 
}