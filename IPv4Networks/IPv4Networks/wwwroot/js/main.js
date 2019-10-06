document.addEventListener('readystatechange', async function(e) {
    if (document.readyState !== "complete") {
        return;
    }
});

//Динамически добавляет контейнер для одного клиента
function appendContainerClient(clientId, clientNetwork, isFirstClient) {
    var $clientsContainer = $("#clientsContainer");
    if (isFirstClient === true) {
        $clientsContainer.append(
            "<div class=\"flexHeaderContainer\">\
                <div class=\"clientContainerHeader\"> Идентификатор </div>\
                <div class=\"clientContainerHeader\"> IPv4 - подсеть </div>\
                <div class=\"flexHeader\"></div>\
            </div>"
        );
    }
    var containerId = getIdContainer();
    var backgroundClientContainer = "";
    if (containerId % 2 === 0) {
        backgroundClientContainer = "background:lightgrey;";
    } else {
        backgroundClientContainer = "background:white;";
    }
    $clientsContainer.append(
        "<div id = \"" + containerId + "_Container\" class=\"classClientContainer\" style = \"display:flex;align-items:flex-end;margin:4px 0;" + backgroundClientContainer + "\"> \
            <div id =\"" + containerId + "_clientIdDiv\" class=\"classClientId\" style=\"flex: 2;text-align: center;\">" + clientId + "</div> \
            <div id =\"" + containerId + "_clientNetworkDiv\" class=\"classClientSubNetwork\" style=\"flex: 2;text-align: center;\">" + clientNetwork + "</div>\
            <div class=\"flexClientButtonGroup\" style=\"flex: 1;\">\
                <div style=\"margin:2px 0;\"> \
                    <input id =\"" + containerId + "_removeClientButton\" type = \"button\" value = \"X\" class=\"btn btn-danger btn-sm\" />\
                </div>\
                <div style=\"margin:2px 0;\"> \
                    <input type = \"button\" value = \"Редактировать\"  id =\"" + containerId + "_editClientButton\" class=\"btn btn-primary btn-sm\" />\
                </div>\
        </div>\
</div>"
    );
    //навешиваем событие на кнопку удаления
    bindClickHandlerToButton(onRemoveClientButtonClick, containerId + '_removeClientButton', containerId);
    //навешиваем событие на кнопку редактирования
    bindClickHandlerToButton(displayAddFormForEditing, containerId + '_editClientButton', containerId);
}

//функция, которая получает id для добавляемого контейнера клиента
function getIdContainer() {
    var $lastClientContainer = $("#clientsContainer").children("div").not(".flexHeaderContainer").last();
    var id = 1;
    if ($lastClientContainer.length > 0) {
        id = Number($lastClientContainer.attr("id").split('_Container')[0]) + 1;
    }
    return id;
}

//функция, которая меняет отображение формы для добавления/редактирования клиента
function toggleDisplayAddFormAndInput(formDisplay = "block", inputDisplay = "none",
    isDisplayForEditing = false, idForEditing = null) {

    if (!isDisplayForEditing && formDisplay === "none") {//если действие добавление и сокрытие формы
        $("#inputNewClientId").val("");
        $("#inputNewClientNetwork").val("");
    } else if (!isDisplayForEditing && formDisplay !== "none") {//если добавление и открытие формы
        //отсоединяем форму добавления, на случай если до этого
        //форма использовалась для редактирования и вставляем в конец
        $("#addClientForm").detach().appendTo($("#mainContainer"));
    } else {//если действие редактирование
        //получаем контейнер с клиентом
        var clientContainerId = idForEditing.split("_editClientButton")[0];
        var $clientContainer = $("#" + clientContainerId + "_Container");
        //перемещаеи форму добавления после контейнера клиента
        var $addForm = $("#addClientForm").detach();
        $clientContainer.after($addForm);
        //отображаем редактируемые данные
        var displayPreviousValueFunc = function(divId, inputId) {
            var previousValue = $("#" + divId).html();
            $("#" + inputId).val(previousValue);
        };
        displayPreviousValueFunc(clientContainerId + "_clientIdDiv", "inputNewClientId");
        displayPreviousValueFunc(clientContainerId + "_clientNetworkDiv", "inputNewClientNetwork");
    }

    //если форма открывается диактивируем кнопки
    //если закрывается, то активируем их
    var inputsButNotAdditionToForm = $("input:not(#completeInput,#canselInput,[type = text])");
    if (formDisplay !== "none") {
        inputsButNotAdditionToForm.prop("disabled", true);
    } else {
        inputsButNotAdditionToForm.prop("disabled", false);
    }
    //отображаем или скрываем форму для добавления/редактирования и кнопку добавления
    $("#addClientForm").css("display", formDisplay);
    $("#addNewClientInput").css("display", inputDisplay);
}

//функция добавления клиента с отправкой данных на сервер
//валидность введенных данных проверяется на сервере 
function addClient() {
    var valueInputId = $("#inputNewClientId").val();
    var valueClientNetwork = $("#inputNewClientNetwork").val();
    //отправляем ajax-POST запроc на сервер
    ClientService.post("Home/AddClient", valueInputId, valueClientNetwork, addContainerWithClient);
}

//функция, которая добавляет контейнер с клиентом,
//в случае успешной проверки и добавления данных в базу
function addContainerWithClient(receivedData) {
    //если ответ от сервера пришел пустой, значит данные либо
    //не прошли проверку, либо произошла ошибка при записи в базу данных
    if (receivedData !== undefined) {
        var isFirstClient = $("#clientsContainer").children().length === 0;
        appendContainerClient(receivedData.id, receivedData.subNetwork, isFirstClient);
        toggleDisplayAddFormAndInput("none", "inline-block");
        //убираем привязку с input, который подтверждает добавление нового клиента
        $("#completeInput").unbind('click', addClient);
    } else {
        displayMessageError();
    }
}

function displayMessageError() {
    //отображает modalBox
    $("#incorrectDataModalBox").modal("show");
}

//функция, вызываемая при нажатии на кнопку отмены,
//при добавлении / редактировании клиента
function canselAddingClient() {
    //убираем форму
    toggleDisplayAddFormAndInput("none", "inline-block");
    //снимаем все события
    $("#completeInput").unbind('click', addClient);
    $("#completeInput").unbind('click', editClient);
}

//функция, навешивающая событие click на кнопку с указанной функцией
//и при необходимости дополнительные данные в виде id контейнера клиента
function bindClickHandlerToButton(func, buttonContainerId, clientContainerId = 0) {
    var $clientButton = $('#' + buttonContainerId);
    $clientButton.bind('click', { clientContainerId: clientContainerId }, func);
}

//функция отображает форму добавления клиента
function displayAddFormForAddition() {
    toggleDisplayAddFormAndInput();
    bindClickHandlerToButton(addClient, "completeInput");
}

//функция отображает форму для редактирования
function displayAddFormForEditing(event) {
    var idEditingElement = event.target.getAttribute('id');
    toggleDisplayAddFormAndInput("inline-block", "none", true, idEditingElement);
    bindClickHandlerToButton(editClient, "completeInput", idEditingElement);
}

//функция при нажатии на крестик в контейнере клиента
function onRemoveClientButtonClick(e) {
    var clientContainerId = e.target.getAttribute('id').split('_removeClientButton')[0];
    $("#deleteModalBox").modal('show');
    //присоединяем кнопке "Удалить" действие на удаление
    bindClickHandlerToButton(removeClient, "deleteButtonModalBox", clientContainerId);
    //при закрытии modal box отсоединяем событие от кнопки "Удалить"
    $('#deleteModalBox').on('hide.bs.modal', () => {
        $("#deleteButtonModalBox").unbind('click', removeClient);
    });
}

//функция для удаления клиента с запросом DELETE на сервер
function removeClient(e) {
    $("#deleteModalBox").modal('hide');
    var clientContainerId = e.data.clientContainerId;
    var clientNetwork = $("#" + clientContainerId + "_clientNetworkDiv").html();
    var clientId = $("#" + clientContainerId + "_clientIdDiv").html();
    ClientService.delete("Home/RemoveClient", clientId, clientNetwork, removeClientContainer, clientContainerId);
}

//в случае успешного запроса на сервер для удаления, удаляем контейнер с клиентом
function removeClientContainer(receivedData, clientContainerId) {
    if (receivedData !== undefined) {
        var $clientContainer = $('#' + clientContainerId + '_Container');
        $clientContainer.remove();
    }
}

//функция делает запрос на сервер PUT для редактирования клиента
function editClient(e) {
    var valueInputId = $("#inputNewClientId").val();
    var valueClientNetwork = $("#inputNewClientNetwork").val();
    var clientContainerId = e.data.clientContainerId.split('_editClientButton')[0];
    var oldValueId = $("#" + clientContainerId + "_clientIdDiv").html();
    ClientService.put("Home/EditClient", oldValueId, valueInputId, valueClientNetwork, editValueIdAndNetworkClient, clientContainerId);
}

//функция редактирует значения контейнера с клиентом в случае успешного ответа от сервера
function editValueIdAndNetworkClient(receivedData, clientContainerId) {
    if (receivedData !== undefined) {
        var editValueDiv = function(idElement, newValue) {
            var divWithPreviousVal = $("#" + idElement);
            divWithPreviousVal.html(newValue);
        };

        editValueDiv(clientContainerId + "_clientIdDiv", receivedData.id);

        editValueDiv(clientContainerId + "_clientNetworkDiv", receivedData.subNetwork);

        toggleDisplayAddFormAndInput("none", "inline-block");
        $("#completeInput").unbind('click', editClient);
    } else {
        displayMessageError();
    }
}