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
const auth_update = firebase.auth();
auth_update.onAuthStateChanged((e) => {
    if(!auth_update.currentUser){
        console.log('not user');
        window.location.assign('../index.html');
    }
});

document.getElementById('update').onclick = async function (req,res){
    const db = firebase.firestore();
    let title = document.getElementById("title");
    let price = document.getElementById("price");
    let stock = document.getElementById("stock");
    if(title.value == ""){
        alert("You Must Fill Product Name")
        return
    }
    if(price.value == "" && stock.value == ""){
        alert("No Updates")
        return;
    }
    if(isNaN(price.value) || isNaN(stock.value) || parseFloat(price.value) <= 0 || parseInt(stock.value) < 0){
        alert("Price and Stock must be numbers: \nPrice bigger than 0\nStock at least 0")
        return;
    }
    if(!Number.isInteger(Number(stock.value))){
        alert("Stock must be of type integer")
        return;
    }


    var docRef = db.collection("products").doc(title.value.toLowerCase());
        await docRef.get().then(async function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let userID = auth_update.currentUser.uid;
                var userDocRef = db.collection("users").doc(userID);
                const userData = await userDocRef.get();
                let isOwner = userData.data().products.includes(title.value.toLowerCase());
                if(isOwner){
                    if (confirm(`Are you sure you want to update changes?`)){
                        let _price = price.value === ""? doc.data().Price : price.value;
                        let _stock = stock.value === ""? doc.data().Stock : stock.value;
                        await docRef.update({
                            Price: _price,
                            Stock: _stock
                        }).catch((error) => {
                            alert("Error Updating ", error);
                        });

                        alert("Product Updated Successfully!"),
                            title.value='', 
                            price.value='',
                            stock.value=''

                    }else {
                        console.log('Nothing was updated.');
                        title.value='',
                        price.value='',
                        stock.value=''
                    }  
                } else {
                    alert(`You are not the owner of *${title.value}* product`);
                    title.value='',
                    price.value='',
                    stock.value=''
                }
            } else {  // doc.data() will be undefined in this case
                alert(`No product with title ${title.value}!`);
                title.value='',
                price.value='',
                stock.value=''
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            title.value='';
            price.value='';
            stock.value='';
        });
    
}