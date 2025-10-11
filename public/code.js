(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  /*unirse al chat*/
  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      if (username.length == 0) {
        return;
      }
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });
  /*enviar mensaje*/
  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message,
      });
      socket.emit("chat", {
        username: uname,
        text: message,
      });
      app.querySelector(".chat-screen #message-input").value = "";
    });
  //salir del chat
  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });
  //mostrar lo que hacen otros
  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });
  socket.on("diceroll",function(diceroll){
     renderMessage("diceroll","",abilityresult,skillresult, toolresult );
     console.log("alguien mas tiró un dado")
  });
  //enviar dados
  app
    .querySelector(".chat-screen #send-dice")
    .addEventListener("click", function () {
      let abilitydice = app.querySelector(".chat-screen #abilitydice").value;
      let skilldice = app.querySelector(".chat-screen #skilldice").value;
      let tooldice = app.querySelector(".chat-screen #tooldice").value;
      let abilityresult = rollDice(abilitydice);
      let skillresult = rollDice(skilldice);
      let toolresult = rollDice(tooldice);
      renderMessage("diceroll", "", abilityresult, skillresult, toolresult);
      //console.log(abilityresult);
      socket.emit("diceroll", uname, abilityresult,skillresult, toolresult);
    });
  /*mostrar mensaje enviado*/
  function renderMessage(
    type,
    message,
    abilityresult = "",
    skillresult = "",
    toolresult = ""
  ) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      //console.log("yo mandé un mje");
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
            <div>
             <div class="name">Tú</div>
             <div class="text">${message.text}</div>
            </div>
          `;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
            <div>
             <div class="name">${message.username}</div>
             <div class="text">${message.text}</div>
            </div>
          `;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    } else if (type == "diceroll") {
      let el = document.createElement("div");
      let aR = Array.isArray(abilityresult) ? abilityresult.join(" ") : abilityresult;
      let sR = Array.isArray(skillresult) ? skillresult.join(" ") : skillresult;
      let tR = Array.isArray(toolresult) ? toolresult.join(" ") : toolresult;
      el.setAttribute("class", "update");
      //el.setAttribute("class", "dice-result");
      el.innerHTML = `
        <div>
            ${message.username} tiro dados y sacó <br>
            <p class="ability-dice"> <mark>${aR}</mark></p>
            <br>
            <p class="skill-dice"> <mark>${sR}</mark></p>
            <br>
            <p class="tool-dice"> <mark>${tR}</mark></p>
            <br>
        </div>
      `;
      messageContainer.appendChild(el);
    }
    // tira el chat pa arriba
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }

  //funciones de dados
  function getDieSymbol(num) {
    const symbols = ["☠︎", "⚁", "⚂", "⚃", "⚄", "⚔"];
    return symbols[num - 1];
  }
  function dieRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }
  function rollDice(dice) {
    const results = [];
    for (let i = 0; i < dice; i++) {
      results.push(getDieSymbol(dieRoll()));
    }
    return results;
  }
})();
