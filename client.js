document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const container = document.querySelector(".container");
    const form = document.getElementById('form-container');
    const loginPage = document.querySelector('.login-page');
    const loginPageForm = document.getElementById('login-page-form');
    const messageInput = document.getElementById('messageInput');
    const userNameElement = document.getElementById('userName');
    const chatContainer = document.querySelector('.chat-container');



    let userName;

    loginPageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userName = userNameElement.value;
        console.log(userName)
        socket.emit('new-user-joined', userName);

        loginPage.style.display = "none";
        chatContainer.style.display = "block";
        appendFun(userName, 'You joined the chat', 'center');

        document.getElementById('messageInput').focus(); // auto focus to messageField
    })

    socket.on('user-joined', name => {
        console.log(`${name} joined the chat`)
        appendFun(name, `${name} joined the chat`, 'center');

    })




    document.getElementById('submitBtn').addEventListener("click", (e)=> {
        e.preventDefault();
        window.scrollTo(0, 0);
        const message = messageInput.value;
        appendFun(userName, message, 'right');
        socket.emit('send', message);
        messageInput.value = "";
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const message = messageInput.value;
        appendFun(userName, message, 'right');
        socket.emit('send', message);
        messageInput.value = "";
    })

   


    socket.on('receive', data => {
        window.scrollTo(0, 0);
        appendFun(data.name, `${data.message}`, 'left');
    })

    socket.on('leave', name => {
        window.scrollTo(0, 0);
        appendFun(name, `${name} left the chat`, 'center');
    })





    
    function appendFun(name, message, position){
        window.scrollTo(0, 0);
        if(position == "center"){
            const msg = document.createElement("p");    
            msg.innerHTML = message;
            msg.classList.add("message");
            msg.classList.add(position);
            container.append(msg);
            
        }
        else{

            let pName = document.createElement("p");
            pName.classList.add("inMessage-name");
            pName.innerText = name;
        
            let pText = document.createElement("p");
            pText.classList.add("inMessage-text");
            pText.innerText = message;

            let pTime = document.createElement("p");
            pTime.classList.add("time");
            let currentTime = new Date();
            let time = currentTime.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            pTime.innerText = time;

            let myDiv = document.createElement("div");
            myDiv.classList.add("message");
            myDiv.classList.add(position);
            myDiv.appendChild(pName);
            myDiv.appendChild(pText);
            myDiv.appendChild(pTime);

           
            container.append(myDiv);


            console.log(myDiv.clientWidth);
            if(myDiv.clientWidth > 300){
                myDiv.style.width = "18rem";
            }

        }

        container.scrollTop = container.scrollHeight; // scroll down when new msg appear

    }
});
