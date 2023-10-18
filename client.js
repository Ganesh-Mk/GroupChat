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


    // Login Page Submit Button
    loginPageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userName = userNameElement.value;
        console.log(userName)
        socket.emit('new-user-joined', userName);

        loginPage.style.display = "none";
        chatContainer.style.display = "block";
        appendFun(userName, 'You joined the chat', 'center');

        document.getElementById('messageInput').focus(); // auto focus to messageField
        window.scrollTo(0, 0);

    })

    socket.on('update-members', (members) => {
        let memberContainer = document.getElementById("memberContainer");
        memberContainer.innerHTML = ''; // Clear the current list

        members.forEach((name) => {
            let newMember = document.createElement("li");
            newMember.innerHTML = name;
            newMember.classList.add('activeMembers');
            memberContainer.appendChild(newMember);
        });
    });

    // New joined to group chat
    socket.on('user-joined', name => {
        console.log(`${name} joined the chat`)
        appendFun(name, `${name} joined the chat`, 'center');

    })


    // Onclick on submit button in Chat Page
    document.getElementById('submitBtn').addEventListener("click", (e)=> {
        document.getElementById("headText").innerHTML = "Group Chat";

        if(messageInput.value == ""){
            messageInput.style.boxShadow = "red 0px 0px 7px -2px";
            setTimeout(() => {
                messageInput.style.boxShadow = "0px 0px 7px -4px black";
            }, 500);
        }else{
            e.preventDefault();
            window.scrollTo(0, 0);
            const message = messageInput.value;
            appendFun(userName, message, 'right');
            socket.emit('send', message);
            messageInput.value = "";
        }
            
    });

    // Press Enter instead submit button in Chat Page
    form.addEventListener('submit', (e) => {
        document.getElementById("headText").innerHTML = "Group Chat";
        e.preventDefault();
        window.scrollTo(0, 0);
        const message = messageInput.value;
        appendFun(userName, message, 'right');
        socket.emit('send', message);
        messageInput.value = "";
    })

   










    // Receiving data 
    socket.on('receive', data => {
        window.scrollTo(0, 0);
        appendFun(data.name, `${data.message}`, 'left');
    })

    // User leave from chat 
    socket.on('leave', name => {
        window.scrollTo(0, 0);
        appendFun(name, `${name} left the chat`, 'center');
    })


    // user typing
    messageInput.addEventListener('input', () => {
        socket.emit('typing');
    });
    

    // user loses focus 
    messageInput.addEventListener('blur', () => {  
        socket.emit('stop-typing');
    });
    // onlick submit, removing stop typing icon
    document.getElementById('submitBtn').addEventListener("click", (e)=> {
        socket.emit('stop-typing');
    });
    form.addEventListener('submit', (e) => {
        socket.emit('stop-typing');
    });




    let typing = false;
    socket.on('user-typing', (name) => {
        console.log("User is typing..");
        if(typing == false){
            appendTyping(name);
            typing = true;
        }
    });
    
    socket.on('user-stopped-typing', (name) => {
        console.log("Stopped Typing");

        if (document.getElementById('typingDiv')) {
            document.getElementById('typingDiv').style.display = "none";
            document.getElementById('typingDiv').remove();
        }
        typing = false;
    });




    


    
    function appendTyping(name){
        window.scrollTo(0, 0);

       
        //  <div class="loading">
        //     <div class="snippet" data-title="dot-pulse">
        //         <div class="stage">
        //             <div class="dot-pulse"></div>
        //         </div>
        //      </div>
        //   </div>

        
        let loading = document.createElement("div");
        let snippet = document.createElement("div");
        let stage = document.createElement("div");
        let dotPulse = document.createElement("div");
        
        loading.classList.add('loading');
        snippet.classList.add('snippet');
        snippet.setAttribute('data-title','dot-pulse');
        stage.classList.add('stage');
        dotPulse.classList.add('dot-pulse');

        stage.appendChild(dotPulse);
        snippet.appendChild(stage);
        loading.appendChild(snippet);

        

        let pName = document.createElement("p");
        pName.classList.add("inMessage-name");
        pName.innerText = name;
    
       

        let pTime = document.createElement("p");
        pTime.classList.add("time");
        let currentTime = new Date();
        let time = currentTime.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        pTime.innerText = time;

        let myDiv = document.createElement("div");
        myDiv.classList.add("message");
        myDiv.classList.add("left");

        myDiv.setAttribute('id', 'typingDiv');

        myDiv.appendChild(pName);
        myDiv.appendChild(loading);
        myDiv.appendChild(pTime);
        container.append(myDiv);

        console.log(myDiv.clientWidth);
        if(myDiv.clientWidth > 300){
            myDiv.style.width = "18rem";
        }

        container.scrollTop = container.scrollHeight; // scroll down when new msg appear

    }


    
    

    
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








    // navbar
    let menuLogo = document.getElementById("menuLogo");
    let cancelLogo = document.getElementById("cancelLogo");
    let slide = document.querySelector('.slide');

    menuLogo.addEventListener('click', () => {
        menuLogo.style.display = "none";
        cancelLogo.style.display = "block";
        slide.style.right = "0";
    })
    cancelLogo.addEventListener('click', () => {
        cancelLogo.style.display = "none";
        menuLogo.style.display = "block";
        slide.style.right = "-22rem";
    })
   
      
});
