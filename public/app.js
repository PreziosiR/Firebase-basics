const auth = firebase.auth()

const whenSignedIn = document.getElementById('whenSignedIn')
const whenSignedOut = document.getElementById('whenSignedOut') 

const signedInBtn = document.getElementById('signInBtn')
const signedOutBtn = document.getElementById('signOutBtn')

const userDetails = document.getElementById('userDetails') 

const provider = new firebase.auth.GoogleAuthProvider()

const db = firebase.firestore()

const createThing = document.getElementById('createThings')
const thingsList = document.getElementById('thingsList')

let thingsRef
let unsubscribe

signedInBtn.onclick = () => auth.signInWithPopup(provider)
signedOutBtn.onclick = () => auth.signOut()

auth.onAuthStateChanged(user => {
    if(user) {
        whenSignedIn.hidden = false
        whenSignedOut.hidden = true 
        userDetails.innerHTML = `<h3>Hello ${user.displayName} !`
        thingsRef = db.collection('things')

        const { serverTimestamp } = firebase.firestore.FieldValue

        createThing.onclick = () =>  {
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            })
        }

        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                 const items = querySnapshot.docs.map(doc => {
                     return `<li>${doc.data().name}</li>`
                 })
                 thingsList.innerHTML = items.join(' ')
            })


    } else {
        whenSignedIn.hidden = true
        whenSignedOut.hidden = false
        userDetails.innerHTML = ''
    } 
})