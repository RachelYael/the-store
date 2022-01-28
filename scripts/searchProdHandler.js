var firebaseConfig = {
    apiKey: "AIzaSyCqlh0Inx6FfT4rr6KhZQSbw4VAWSmGozg",
    authDomain: "web-cosmetic.firebaseapp.com",
    projectId: "web-cosmetic",
    storageBucket: "web-cosmetic.appspot.com",
    messagingSenderId: "1064931964995",
    appId: "1:1064931964995:web:f49c960b56eff8f9fcfcf6",
    measurementId: "G-Q826CPQ94E"
};
firebase.initializeApp(firebaseConfig);
const db_search = firebase.firestore();

let title_search = document.getElementById('title');
let searchFlag = 0;

document.getElementById('search').onclick = function (req,res){
    if(title_search.value == ""){
        alert("You must enter product name")
        return;
    }
    if(searchFlag == 1){
        return;
    }
    searchFlag = 1;
    var docRef = db_search.collection("products").doc(title_search.value.toLowerCase());
    docRef.get().then(function(doc) {
        if (doc.exists) {
            let data = doc.data();
            const prods = $('#found');
                    prods.append(`<div class="card m-4" id="foundProd" style="width: 18rem;">
                                                <div class="card-body">
                                                    <h5 class="card-header text-center">${data.Title}</h5>
                                                    <ul class="list-group list-group-flush">
                                                        <li class="list-group-item fs-5"><b>Price:</b> ${data.Price} $</li>
                                                        <li class="list-group-item fs-5"><b>Stock:</b> ${data.Stock}</li>
                                                    </ul>
                                                </div>
                                            </div>`
                    );
        } else {  // doc.data() will be undefined in this case
            alert(`No product with title ${title_search.value}!`);
            title_search.value='';
            searchFlag = 0;

        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        title_search.value='';
        searchFlag = 0;
    });
}


document.getElementById('clear').onclick = function (req,res){
    searchFlag = 0;
    title_search.value='';
    $("#foundProd").remove();
}