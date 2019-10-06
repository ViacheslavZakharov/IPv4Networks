document.addEventListener('readystatechange', async function(e) {
    if (document.readyState !== "complete") {
        return;
    }
    //  var allClients = await getClients();
    //отобразить всех клиентов, если они есть
    // displayAllAddedClient(allClients);
});

//!!!!!!!!!!!!
// function getClients() {
//     //TODO:
//     //заглушка, потом получать данные с сервера
//     var url = "https://localhost:5001/Home";
//     return $.ajax({
//         url: url,
//         type: 'GET',
//         async: true,
//         success: function(clients) {
//             return JSON.parse(clients);
//         },
//         error: function(xhr, status, error) {
//             alert(error);
//         }
//     });


//     // var allClients = new Map();
//     // allClients.set("id_1", "44.34.23.126/30");
//     // allClients.set("id_2", "44.50.23.555/30");
//     // return allClients;
// }
// //!!!
// function displayAllAddedClient(allClients) {
//     //  var isFirstClient = true;
//     allClients.forEach(function(value, key, map) {
//         appendContainerClient(key, value, isFirstClient);
//         isFirstClient = false;
//     });
// }

function appendContainerClient(clientId, clientNetwork, isFirstClient) {
    var $clientsContainer = $("#clientsContainer");
    //var isFirstClient = $clientsContainer.children().length === 0;
    if (isFirstClient === true) {
        $clientsContainer.append(
            // "<div style = \"display:inline-block\"> Идентификатор </div>\
            //     <div style = \"display:inline-block\"> IPv4-подсеть </div>"
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
        // "<div id = \"" + containerId + "_Container\"> \
        //         <div id =\"" + containerId + "_clientIdDiv\" style = \"display:inline-block;min-width:100px\">" + clientId + "</div> \
        //         <div id =\"" + containerId + "_clientNetworkDiv\" style = \"display:inline-block\">" + clientNetwork + "</div>\
        //         <div style = \"display:inline-block\">\
        //             <div> \
        //                 <input id =\"" + containerId + "_removeClientButton\" type = \"button\" value = \"X\" class=\"btn btn-danger\" />\
        //             </div>\
        //             <div> \
        //                 <input type = \"button\" value = \"Редактировать\"  id =\"" + containerId + "_editClientButton\" class=\"btn btn-primary\" />\
        //             </div>\
        //         </div>\
        // </div>"
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

function getIdContainer() {
    var $lastClientContainer = $("#clientsContainer").children("div").not(".clientContainerHeader").last();
    var id = 0;
    if ($lastClientContainer.length > 0) {
        id = Number($lastClientContainer.attr("id").split('_Container')[0]) + 1;
    }
    return id;
}

function toggleDisplayAddFormAndInput(formDisplay = "block", inputDisplay = "none",
    isDisplayForEditing = false, idForEditing = null) {

    if (!isDisplayForEditing && formDisplay === "none") {
        $("#inputNewClientId").val("");
        $("#inputNewClientNetwork").val("");
    } else if (!isDisplayForEditing && formDisplay !== "none") {
        $("#addClientForm").detach().appendTo($("#mainContainer"));
    } else {
        var clientContainerId = idForEditing.split("_editClientButton")[0];
        var $clientContainer = $("#" + clientContainerId + "_Container");
        //перемещаеи форму добавления в контейнер с пользователем
        var $addForm = $("#addClientForm").detach();
        $clientContainer.after($addForm);
        var displayPreviousValueFunc = function(divId, inputId) {
            var previousValue = $("#" + divId).html();
            $("#" + inputId).val(previousValue);
        };
        displayPreviousValueFunc(clientContainerId + "_clientIdDiv", "inputNewClientId");
        displayPreviousValueFunc(clientContainerId + "_clientNetworkDiv", "inputNewClientNetwork");
    }

    //если форма открывается делаем все остальные кнопки недоступными
    var inputsButNotAdditionToForm = $("input:not(#completeInput,#canselInput,[type = text])");
    if (formDisplay !== "none") {
        inputsButNotAdditionToForm.prop("disabled", true);
    } else {
        inputsButNotAdditionToForm.prop("disabled", false);
    }
    $("#addClientForm").css("display", formDisplay);
    $("#addNewClientInput").css("display", inputDisplay);
}

function addClient() {
    //!!!TODO:
    //отправка данных на сервер
    //TODO:проверка данных будет осуществлятся на сервере, для проверки сетей
    //использовать класс IPAddress
    var valueInputId = $("#inputNewClientId").val();
    var valueClientNetwork = $("#inputNewClientNetwork").val();

    // var url = "https://localhost:5001/Home/AddClient";
    // var url = window.location.toString() + "/Home/AddClient";

    ClientService.post("Home/AddClient", valueInputId, valueClientNetwork, addContainerWithClient);
    //     //var model = {
    //     //    id: valueInputId,
    //     //    subNetwork: valueClientNetwork
    //     //    //clientId: valueInputId,
    //     //    //clientNetwork: valueClientNetwork
    //     //};
    //     //var dataModel = JSON.stringify(model);
    //     $.ajax({
    //         url: url,
    //         type: 'POST',
    //         //data: dataModel,
    //         data: { "id": valueInputId, "subNetwork": valueClientNetwork},
    //         dataType: 'json',
    //         accept: 'application/json',
    // //        contentType: "application/json; charset=utf-8",

    //         success: function() {
    //             //удаление на клиенте
    //             //  var $noteContainer = $('#NoteContainer_' + id);
    //             //  $noteContainer.remove();
    //             //  processAction(ActionType.Remove, id);
    //             var client = "7676";
    //             var cl = client + "5665";
    //         },
    //         error: function(xhr, status, error) {
    //             alert(error);
    //         }
    //     });
    //     //

    //не знаю нормально так делать или нет
    //но только ради того чтобы избавиться от глобальной переменной
    //тут проверяются есть ли записи или это первая


    //if (isValidatedIdAndNetwork(valueInputId, valueClientNetwork)) {
    //    var isFirstClient = $("#clientsContainer").children().length === 0;
    //    appendContainerClient(valueInputId, valueClientNetwork, isFirstClient);

    //    toggleDisplayAddFormAndInput("none", "inline-block");
    //    //убираем привязку с input, который подтверждает добавление нового клиента
    //    $("#completeInput").unbind('click', addClient);

    //} else {
    //    alert("Введенные значения не корректны!\n\
    //            Значения полей не может быть пустой строчкой. Количество символов \
    //            идентификатора не должно превышать 255. Подсеть клиента должна \
    //            соответствовать маске Ц*.Ц*.Ц*.Ц*/Ц*, где Ц любая цифра от 0 до 9 \
    //            * означает, любое количество цифр");
    //}
}

function addContainerWithClient(receivedData) {
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
    alert("Введенные данные не корректны!\n\
    Значение полей должно быть не пустой строкой.\n\
    Идентификатор должен быть уникален\n\
    Количество символов для идентификатора не должно превышать 255.\n\
    Подсеть клиента должна соответствовать точечно-десятичной нотации\n\
    и иметь маску подсети. Например, 123.123.123.123/30");
}

function isValidatedIdAndNetwork(valueInputId, valueClientNetwork) {
    //TODO:
    //тут надо проверить, что значения удовлетворяют
    //соответствующим регулярным выражениям
    //заглушка
    return valueInputId.length !== 0 && valueClientNetwork.length !== 0 &&
        valueInputId.length <= 255; //to be continued
}

function canselAddingClient() {
    //убираем форму
    toggleDisplayAddFormAndInput("none", "inline-block");
    //снимаем все события
    $("#completeInput").unbind('click', addClient);
    $("#completeInput").unbind('click', editClient);
}

function bindClickHandlerToButton(func, buttonContainerId, clientContainerId = 0) {

    //var $clientButton = $("#" + parentContainerId).find('#' + buttonContainerId);
    var $clientButton = $('#' + buttonContainerId);
    $clientButton.bind('click', { clientContainerId: clientContainerId }, func);
}


function displayAddFormForAddition() {
    toggleDisplayAddFormAndInput();
    bindClickHandlerToButton(addClient, "completeInput");
}

//!!!!!!!!!!!!!
//повторяющийся код, не знаю как убрать
function displayAddFormForEditing(event) {
    //!!!!!!!!
    var idEditingElement = event.target.getAttribute('id');
    toggleDisplayAddFormAndInput("inline-block", "none", true, idEditingElement);
    bindClickHandlerToButton(editClient, "completeInput", idEditingElement);
}

function onRemoveClientButtonClick(e) {

    var clientContainerId = e.target.getAttribute('id').split('_removeClientButton')[0];

    // $('#myModalBox').on('hide.bs.modal', (event) => {
    //     var button = $(event.relatedTarget);
    // });
    $("#deleteModalBox").modal('show');
    bindClickHandlerToButton(removeClient, "deleteButtonModalBox", clientContainerId);
    $('#deleteModalBox').on('hide.bs.modal', () => {
        $("#deleteButtonModalBox").unbind('click', removeClient);
    });
    // var clientNetwork = $("#" + clientContainerId + "_clientNetworkDiv").html();
    // var clientId = $("#" + clientContainerId + "_clientIdDiv").html();
    // AjaxRequest.delete("Home/RemoveClient", clientId, clientNetwork, removeClientContainer, clientContainerId);
    //ajax запрос
    //TODO:
    //!!!!!подправить
    // var url = "http://localhost:8080/addNote";
    // $.ajax({
    //     url: url,
    //     type: 'POST',
    //     data: {
    //         action: "remove",
    //         id: id,
    //         title: title,
    //         content: content
    //     },
    //     async: true,
    //     success: function() {
    //         //удаление на клиенте
    //         var $noteContainer = $('#NoteContainer_' + id);
    //         $noteContainer.remove();
    //         processAction(ActionType.Remove, id);
    //     },
    //     error: function(xhr, status, error) {
    //         alert(error);
    //     }
    // });


    //удаление на клиенте
    // var $clientContainer = $('#' + clientContainerId + '_Container');
    // $clientContainer.remove();
}

function removeClient(e) {
    $("#deleteModalBox").modal('hide');
    var clientContainerId = e.data.clientContainerId;
    var clientNetwork = $("#" + clientContainerId + "_clientNetworkDiv").html();
    var clientId = $("#" + clientContainerId + "_clientIdDiv").html();
    ClientService.delete("Home/RemoveClient", clientId, clientNetwork, removeClientContainer, clientContainerId);

}

function removeClientContainer(receivedData, clientContainerId) {
    if (receivedData !== undefined) {
        var $clientContainer = $('#' + clientContainerId + '_Container');
        $clientContainer.remove();
    }
}

function editClient(e) {
    var valueInputId = $("#inputNewClientId").val();
    var valueClientNetwork = $("#inputNewClientNetwork").val();
    //!!!!!небольшая проверка на не пустые строчки
    //ajax-запрос POST на редактирование с проверками на сервере
    var clientContainerId = e.data.clientContainerId.split('_editClientButton')[0];

    var oldValueId = $("#" + clientContainerId + "_clientIdDiv").html();
    // var oldValueNetwork = $("#" + clientContainerId + "_clientNetworkDiv").html();
    ClientService.put("Home/EditClient", oldValueId, valueInputId, valueClientNetwork, editValueIdAndNetworkClient, clientContainerId);
    //редактирование на клиенте

    // var editValueDiv = function(idElement, newValue) {
    //     var divWithPreviousVal = $("#" + idElement);
    //     divWithPreviousVal.html(newValue);
    // };

    // editValueDiv(clientContainerId + "_clientIdDiv", valueInputId);

    // editValueDiv(clientContainerId + "_clientNetworkDiv", valueClientNetwork);

    // toggleDisplayAddFormAndInput("none", "inline-block");
    // $("#completeInput").unbind('click', editClient);
}


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