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
const auth_remove = firebase.auth();
auth_remove.onAuthStateChanged((e) => {
    if(!auth_remove.currentUser){
        console.log('not user');
        window.location.assign('../index.html');
    }
});

document.getElementById('remove').onclick = async function (req,res){
    const db = firebase.firestore();
    let title = document.getElementById("title");
    if(title.value == ""){
        alert("You must enter product name")
        return;
    }

    var docRef = db.collection("products").doc(title.value.toLowerCase());
    await docRef.get().then(async function(doc) {
        if (doc.exists) { // product exists
            console.log("Document data:", doc.data());
            let userID = auth_remove.currentUser.uid;
            var userDocRef = db.collection("users").doc(userID);
            const userData = await userDocRef.get();
            let isOwner = userData.data().products.includes(title.value.toLowerCase());
            if(isOwner){
                if (confirm(`Are you sure you want to delete *${title.value}* product?`)){
                    await userDocRef.update({"products": firebase.firestore.FieldValue.arrayRemove(title.value.toLowerCase())})
                    await docRef.delete();
                    alert("Product deleted Successfully");
                    title.value='';
                }
            }
            else {
                alert(`You are not the owner of *${title.value}* product`);
                console.log('Nothing was deleted.');
                title.value='';
            }
        } else {  // doc.data() will be undefined in this case
            alert(`No product with title ${title.value}!`);
            title.value='';
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        title.value='';
    });

}