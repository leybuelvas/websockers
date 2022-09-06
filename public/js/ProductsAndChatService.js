const socket = io();

socket.on('from-server-request-socket-handler', ()=> {
    socket.emit('from-client-products');
});


socket.on('from-sever-new-product', (product) => {
    console.log({product});
    renderNewProduct(product);
});

socket.on("from-server-request-socket-handler", () => {
  socket.emit("from-client-chat");
});

socket.on("from-server-messages", (messages) => {
  console.log(messages);
  buildMessages(messages);
});

function saveProduct() {
    const inputTitle = document.querySelector('#title');
    const inputPrice = document.querySelector('#price');
    const inputThumbnail = document.querySelector('#thumbnail');

    if(!inputTitle.value ||  !inputPrice.value || !inputThumbnail.value) {
        alert("Se deben completar todos los campos");
        return;
    }

    const newProduct = {
        title: inputTitle.value,
        price: inputPrice.value,
        thumbnail: inputThumbnail.value
    }

    socket.emit('from-client-new-product', newProduct);

    inputTitle.value = "";
    inputPrice.value = ""
    inputThumbnail.value = ""
    inputTitle.focus();

}

const sendMessage = () => {
  const joinUser = document.querySelector("#user");
  const joinContent = document.querySelector("#msg");

  if (!joinUser.value && !joinContent.value) {
    return alert("Debe ingresar un usuario y un mensaje");
  }
  if (!joinUser.value) {
    alert("Debe ingresar un usuario");
    return;
  }
  if (!joinContent.value) {
    alert("Debe ingresar un mensaje");
    return;
  }

  const message = {
    author: joinUser.value,
    text: joinContent.value,
  };
  socket.emit("from-client-message", message);
  joinContent.value = "";
  joinContent.focus();
};

function buildMessages(messages) {
  const buildMessage = messages
    .map((msg) => {
      return `
            <style>
            .container {
                background-color: rgba(182,227,227,0.22);
                margin-top: 10px;
            }
            #chat {
            box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
            margin-top: 1.5em;
            margin-bottom: 1.5em;
            </style>
                <span>
                    <span style="color: #43437b;"><b>${msg.author}</b></span> 
                    <span style="color: #a76767;"> [${msg.date}]:</span> 
                    <span style="color: #89ca89; font-style: italic;">${msg.text}</span>
                </span>`;
    })
    .join("<br>");
  document.querySelector("#chat").innerHTML = buildMessage;
}

function renderNewProduct(product) {

    if(!document.querySelector('#productTable')){
        createTable();
    }

    const tableBody = document.querySelector('#productsContent')
    const newRow = `
                    <tr>
                        <td>${ product.title }</td>
                        <td>${ product.price }</td>
                        <td>
                            <img width="30px" src="${ product.thumbnail}" alt="${ product.title }">
                        </td>
                    </tr>
    `;

    const newRowHtml = document.createElement("TR");
    newRowHtml.innerHTML = newRow;
    tableBody.appendChild(newRowHtml);
}



function createTable() {
    const container = document.querySelector("#productsContainer");
    container.innerHTML = `
        <div id="productTable" class="table table-responsive">
            <table class="table table-dark">
                <thead>
                <tr style="color: #dcdcd0;">
                    <th>Title</th>
                    <th>Price</th>
                    <th>Imagen</th>
                </tr>
                </thead>
                <tbody id="productsContent">
                </tbody>
            </table>
        </div>`;
}
