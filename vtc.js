setTimeout(function() {
  let website = getDomain();
  let env = "staging";
  if (website == config.websiteTestUrl || window.location.href == "file:///C:/Users/guill/Desktop/vtc/vtc.html") {
    env = "staging";
  } else if (website == config.websiteProdUrl) {
    env = "production";
  }
  stripePublicKey = env == "production" ? config.stripeProdPublicKey : config.stripeTestPublicKey;
  stripeProductId = env == "production" ? config.stripeProdProductId : config.stripeTestProductId;
  stripePricesCreationKey = env == "production" ? config.stripeProdPricesCreationKey : config.stripeTestPricesCreationKey;
  stripeSessionsReadingKey = env == "production" ? config.stripeProdSessionsReadingKey : config.stripeTestSessionsReadingKey;
  websiteUrl = env == "production" ? config.websiteProdUrl : config.websiteTestUrl;
  const form = document.getElementById("form1");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  const form2 = document.getElementById("ResrvForm");
  form2.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  /*if (window.location.href == "file:///C:/Users/guill/Desktop/vtc/vtc.html") {
    url = window.location.href;
    url += '?session_id=cs_test_a1WpZLXWTyspqZUXQv3tPCya20n87gfWglAOm6B4wgjGEE56X1TTvoSsm6&email=guillaume.auxois%40live.fr&prenom=Guillaume&nom=Auxois&date=30%2F05%2F2023&heure=23%3A00&depart=Paris%2C%20France&arrivee=Clermont-Ferrand%2C%20France&prix=449.52&voiture=STANDARD&pers=1&datetime=30%2F05%2F2023%2023%3A00&tel=0681858209';
    window.location.href = url;
  }*/
  const urlParams = new URLSearchParams(window.location.search.split('?')[1]);
  // Récupération des valeurs des paramètres
  let sessionId = urlParams.get('session_id');
  let email = urlParams.get('email');
  let prenom = urlParams.get('prenom');
  let nom = urlParams.get('nom');
  let date = urlParams.get('date');
  let heure = urlParams.get('heure');
  let depart = urlParams.get('depart');
  let arrivee = urlParams.get('arrivee');
  let prix = urlParams.get('prix');
  let voiture = urlParams.get('voiture');
  let pers = urlParams.get('pers');
  let datetime = urlParams.get('datetime');
  let tel = urlParams.get('tel');
  if (sessionId) {
    getCheckoutSession(sessionId, email, prenom, nom, date, heure, depart, arrivee, prix, voiture, pers, datetime, tel);
    // Supprimer les paramètres de l'URL
    let url = window.location.href;
    url = url.replace(/[?&].+?(?=&|$)/g, '');
    window.history.replaceState({}, '', url);
  }
}, 1000);

async function calcDistance(option) {
  if (option == 1){
    var adresse1 = document.getElementById('autocomplete1').value;
    var adresse2 = document.getElementById('autocomplete2').value;
  } else {
    var adresse1 = document.getElementById('autocomplete3').value;
    var adresse2 = document.getElementById('autocomplete4').value;
  }

  return isAddressInParis(adresse1).then((res1) => {
    return isAddressInFrance(adresse2).then((res2) => {
      if (res1 && res2) {
        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer();
    
        return new Promise((resolve, reject) => {
          directionsService.route({
            origin: adresse1,
            destination: adresse2,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
            optimizeWaypoints: true,
            provideRouteAlternatives: false,
            avoidFerries: false,
          }, function(response, status) {
            if (status === 'OK') {
              directionsRenderer.setDirections(response);
              var distance = response.routes[0].legs[0].distance.text;
              var distance2 = response.routes[0].legs[0].distance.value / 1000;
              var duree = response.routes[0].legs[0].duration.text;
              resolve([distance, duree, distance2]);
            } else {
              reject('Directions request failed due to ' + status);
            }
          });
        });
      }
    });
  });  
}
  
  function calculerTarif(typeVehicule, nbPers, distance) {
    // Tarif de base en euros par kilomètre pour chaque type de véhicule
    const tarifs = {
      1: 1.06,
      2: 1.16,
      3: 1.2
    };

    const nbPersonnes = {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1
      };
    
    // Calcul du tarif en fonction du type de véhicule et du nombre de personnes
    let tarif = tarifs[typeVehicule] * nbPersonnes[nbPers];
    
    // Calcul du tarif total en fonction de la distance
    const tarifTotal = tarif * distance;
    
    // Retourne le tarif arrondi à 2 décimales
    return Math.round(tarifTotal * 100) / 100;
  }

  var duree;
  var distance;
  var tarif;

// Fonction appelée par le clic sur le bouton "Calculer tarif"
async function afficherTarif() {
  // Récupération des valeurs du formulaire
  const typeVehicule = document.getElementById('typeVehicule').value;
  const nbPersonnes = document.getElementById('nbPersonnes').value;
  
  // Appel de la fonction calculerTarif() avec les valeurs du formulaire
  await calcDistance(1).then(result => {
    distance = result[0];
    duree = result[1];
    const distance2 = result[2];
    console.log(distance, duree, distance2);
    tarif = calculerTarif(typeVehicule, nbPersonnes, distance2);

    // Affichage du tarif dans la div "tarif"
    var res = document.getElementById('reservation');
    if (tarif) {
      document.getElementById('cout').innerHTML = "<strong> Coût du Trajet : " + tarif.toString() + " Euros </strong>";
      document.getElementById('resultat').innerHTML = "Estimation: " + duree.toString() +"<br>Distance: " + distance.toString();
      res.style.display = 'block';
    } else {
      res.style.display = 'none';
    }
  });
}
  
// Récupérer l'élément <select> par son ID
setTimeout(function() {
  var typeVehicule = document.getElementById('typeVehicule');
  var nbPersonnes = document.getElementById('nbPersonnes');
  var res = document.getElementById('reservation');
  var pers1 = document.getElementById('pers1');
  var pers2 = document.getElementById('pers2');
  var pers3 = document.getElementById('pers3');
  var pers4 = document.getElementById('pers4');
  var pers5 = document.getElementById('pers5');
  var pers6 = document.getElementById('pers6');
  var pers7 = document.getElementById('pers7');

  // Ajouter un écouteur d'événement pour l'événement 'change'
  typeVehicule.addEventListener('change', function() {
    nbPersonnes.value = "";
    res.style.display = 'none';
    // Récupérer la nouvelle valeur sélectionnée
    var typeV = typeVehicule.value;

    // Utiliser la nouvelle valeur comme flag
    if (typeV === '1' || typeV === '2') {
      pers1.style.display = 'block';
      pers2.style.display = 'block';
      pers3.style.display = 'block';
      pers4.style.display = 'none';
      pers5.style.display = 'none';
      pers6.style.display = 'none';
      pers7.style.display = 'none';
    } else if (typeV === '3') {
      pers1.style.display = 'block';
      pers2.style.display = 'block';
      pers3.style.display = 'block';
      pers4.style.display = 'block';
      pers5.style.display = 'block';
      pers6.style.display = 'block';
      pers7.style.display = 'block';
    } else {
      pers1.style.display = 'none';
      pers2.style.display = 'none';
      pers3.style.display = 'none';
      pers4.style.display = 'none';
      pers5.style.display = 'none';
      pers6.style.display = 'none';
      pers7.style.display = 'none';
    }
  });
}, 1000);

setTimeout(function() {
  var typeVehicule2 = document.getElementById('voiture');
  var nbPersonnes2 = document.getElementById('pers');
  var res = document.getElementById('reservation');
  var pers11 = document.getElementById('pers11');
  var pers12 = document.getElementById('pers12');
  var pers13 = document.getElementById('pers13');
  var pers14 = document.getElementById('pers14');
  var pers15 = document.getElementById('pers15');
  var pers16 = document.getElementById('pers16');
  var pers17 = document.getElementById('pers17');

  // Ajouter un écouteur d'événement pour l'événement 'change'
  typeVehicule2.addEventListener('change', function() {
    nbPersonnes2.value = "";
    res.style.display = 'none';
    // Récupérer la nouvelle valeur sélectionnée
    var typeV2 = typeVehicule2.value;

    // Utiliser la nouvelle valeur comme flag
    if (typeV2 === '1' || typeV2 === '2') {
      pers11.style.display = 'block';
      pers12.style.display = 'block';
      pers13.style.display = 'block';
      pers14.style.display = 'none';
      pers15.style.display = 'none';
      pers16.style.display = 'none';
      pers17.style.display = 'none';
    } else if (typeV2 === '3') {
      pers11.style.display = 'block';
      pers12.style.display = 'block';
      pers13.style.display = 'block';
      pers14.style.display = 'block';
      pers15.style.display = 'block';
      pers16.style.display = 'block';
      pers17.style.display = 'block';
    } else {
      pers11.style.display = 'none';
      pers12.style.display = 'none';
      pers13.style.display = 'none';
      pers14.style.display = 'none';
      pers15.style.display = 'none';
      pers16.style.display = 'none';
      pers17.style.display = 'none';
    }
  });
}, 1000);

function reserver(){
  window.location.href = "tel:+33782690072";
  /*var adresse1 = document.getElementById('autocomplete1').value;
  var adresse2 = document.getElementById('autocomplete2').value;
  var typeVehicule = document.getElementById('typeVehicule').selectedIndex;
  var nbPersonnes = document.getElementById('nbPersonnes').selectedIndex;
  document.getElementById('autocomplete3').value = adresse1;
  document.getElementById('autocomplete4').value = adresse2;
  document.getElementById('voiture').selectedIndex = typeVehicule;
  document.getElementById('pers').selectedIndex = nbPersonnes;
  document.getElementById('totalDep').innerHTML = adresse1;
  document.getElementById('totalArr').innerHTML = adresse2;
  document.getElementById('totalDist').innerHTML = distance;
  document.getElementById('totalTem').innerHTML = duree;
  document.getElementById('totalPrix').innerHTML = tarif + " €";
  document.getElementById('p1').style.display = 'none';
  document.getElementById('p2').style.display = 'block'*/
}

setTimeout(function() {
  var res = document.getElementById('reservation');
  // Ajouter un écouteur d'événement pour l'événement 'change'
  document.getElementById('autocomplete1').addEventListener('change', function() {
    res.style.display = 'none';   
  });
  document.getElementById('autocomplete2').addEventListener('change', function() {
    res.style.display = 'none';   
  });
  document.getElementById('autocomplete3').addEventListener('change', async function() {
    setTimeout(async function() {
      // Récupération des valeurs du formulaire
      const voiture = document.getElementById('voiture').selectedIndex;
      const pers = document.getElementById('pers').selectedIndex;
      var adresse3 = document.getElementById('autocomplete3').value;
      var adresse4 = document.getElementById('autocomplete4').value;
      
      // Appel de la fonction calculerTarif() avec les valeurs du formulaire
      await calcDistance(2).then(res => {
        distance = res[0];
        duree = res[1];
        const distance2 = res[2];
        console.log(distance, duree, distance2);
        tarif = calculerTarif(voiture, pers, distance2);  
        if (tarif) {
          document.getElementById('totalDep').innerHTML = adresse3;
          document.getElementById('totalArr').innerHTML = adresse4;
          document.getElementById('totalDist').innerHTML = distance;
          document.getElementById('totalTem').innerHTML = duree;
          document.getElementById('totalPrix').innerHTML = tarif + " €";
        } else {
          document.getElementById('totalDep').innerHTML = null;
          document.getElementById('totalArr').innerHTML = null;
          document.getElementById('totalDist').innerHTML = null;
          document.getElementById('totalTem').innerHTML = null;
          document.getElementById('totalPrix').innerHTML = "0" + " €";
        }
      });
    }, 1000);
  });
  document.getElementById('autocomplete4').addEventListener('change', async function() {
    setTimeout(async function() {
      // Récupération des valeurs du formulaire
      const voiture = document.getElementById('voiture').selectedIndex;
      const pers = document.getElementById('pers').selectedIndex;
      var adresse3 = document.getElementById('autocomplete3').value;
      var adresse4 = document.getElementById('autocomplete4').value;
      
      // Appel de la fonction calculerTarif() avec les valeurs du formulaire
      await calcDistance(2).then(res => {
        distance = res[0];
        duree = res[1];
        const distance2 = res[2];
        console.log(distance, duree, distance2);
        tarif = calculerTarif(voiture, pers, distance2);  
        if (tarif) {
          document.getElementById('totalDep').innerHTML = adresse3;
          document.getElementById('totalArr').innerHTML = adresse4;
          document.getElementById('totalDist').innerHTML = distance;
          document.getElementById('totalTem').innerHTML = duree;
          document.getElementById('totalPrix').innerHTML = tarif + " €";
        } else {
          document.getElementById('totalDep').innerHTML = null;
          document.getElementById('totalArr').innerHTML = null;
          document.getElementById('totalDist').innerHTML = null;
          document.getElementById('totalTem').innerHTML = null;
          document.getElementById('totalPrix').innerHTML = "0" + " €";
        }
      });
    }, 1000);
  });
  document.getElementById('pers').addEventListener('change', async function() {
      // Récupération des valeurs du formulaire
    const voiture = document.getElementById('voiture').selectedIndex;
    const pers = document.getElementById('pers').selectedIndex;
    var adresse3 = document.getElementById('autocomplete3').value;
    var adresse4 = document.getElementById('autocomplete4').value;
    
    // Appel de la fonction calculerTarif() avec les valeurs du formulaire
    await calcDistance(2).then(res => {
      distance = res[0];
      duree = res[1];
      const distance2 = res[2];
      console.log(distance, duree, distance2);
      tarif = calculerTarif(voiture, pers, distance2);  
      if (tarif) {
        document.getElementById('totalDep').innerHTML = adresse3;
        document.getElementById('totalArr').innerHTML = adresse4;
        document.getElementById('totalDist').innerHTML = distance;
        document.getElementById('totalTem').innerHTML = duree;
        document.getElementById('totalPrix').innerHTML = tarif + " €";
      } else {
        document.getElementById('totalDep').innerHTML = null;
        document.getElementById('totalArr').innerHTML = null;
        document.getElementById('totalDist').innerHTML = null;
        document.getElementById('totalTem').innerHTML = null;
        document.getElementById('totalPrix').innerHTML = "0" + " €";
      }
    });
  });
  document.getElementById('voiture').addEventListener('change', async function() {
    document.getElementById('totalDep').innerHTML = null;
    document.getElementById('totalArr').innerHTML = null;
    document.getElementById('totalDist').innerHTML = null;
    document.getElementById('totalTem').innerHTML = null;
    document.getElementById('totalPrix').innerHTML = "0" + " €";
  });
}, 1000);

function sendEmail(email, prenom, nom, date, heure, depart, arrivee, prix, voiture, pers, datetime, tel) {
  sendEmailClient(email, prenom, nom, date, heure, depart, arrivee, prix);
  sendEmailAdmin(prenom, nom, voiture, pers, datetime, depart, arrivee, prix, tel, email);
}

function sendEmailClient(email, prenom, nom, date, heure, depart, arrivee, prix) {
  emailjs.init(config.mailApiKey);
  emailjs.send("service_transport_rocha", "template_gfgqz75", {
    to_email: email,
    prenom: prenom,
    nom: nom,
    date: date,
    heure: heure,
    depart: depart,
    arrivee: arrivee,
    prix: prix.toString() + " €"
  })
  .then(function(response) {
    console.log("SUCCESS", response);
  }, function(error) {
    console.log("FAILED", error);
  });
}

const refVoiture = ["STANDARD","BERLINE","VAN"];

function sendEmailAdmin(prenom, nom, voiture, pers, datetime, depart, arrivee, prix, tel, email) {
  emailjs.init(config.mailApiKey);
  emailjs.send("service_transport_rocha", "template_57z5csj", {
    to_email: config.administratorEmailAddress,
    prenom: prenom,
    nom: nom,
    voiture: voiture,
    pers: pers,
    datetime: datetime,
    depart: depart,
    arrivee: arrivee,
    prix: prix.toString() + " €",
    tel: tel,
    email: email
  })
  .then(function(response) {
    console.log("SUCCESS", response);
  }, function(error) {
    console.log("FAILED", error);
  });
}

async function createStripeSession(prix, url) {
  // Initialiser Stripe.js avec ta clé publique
  const stripe = Stripe(stripePublicKey);

  const priceData = {
    unit_amount: prix*100, // prix en cents
    currency: "eur",
    product: stripeProductId
  };
  
  fetch('https://api.stripe.com/v1/prices', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + stripePricesCreationKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(priceData).toString(),
  }).then(response => response.json())
    .then(data => {
      priceId = data.id;
      // Créer le lien de paiement avec Stripe Checkout
      stripe.redirectToCheckout({
        lineItems: [{
          price: priceId, // ID du prix que tu as créé dans ton tableau de bord Stripe
          quantity: 1, // Quantité de produits
        }],
        mode: 'payment',
        successUrl: url,
        cancelUrl: websiteUrl,
      })
      .then((result) => {
        if (result.error) {
          // Gérer les erreurs lors de la redirection vers Stripe Checkout
          console.error(result.error);
        }
      });
    });
}

function isAddressInParis(selectedAddress) {
  let parisBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(48.699626, 2.135432),
    new google.maps.LatLng(49.045062, 2.613330)
  );

  let geocoder = new google.maps.Geocoder();

  // Utilisation d'une promesse pour encapsuler le code asynchrone
  return new Promise((resolve) => {
    geocoder.geocode({ address: selectedAddress }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();

        if (parisBounds.contains(new google.maps.LatLng(lat, lng))) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        console.log('Erreur lors de la géolocalisation : ' + status);
        resolve(false);
      }
    });
  });
}

function isAddressInFrance(selectedAddress) {
  return new Promise((resolve, reject) => {
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: selectedAddress }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0].address_components.some(component => component.types.includes('country') && component.short_name === 'FR')) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        console.log('Erreur lors de la géolocalisation : ' + status);
        reject(status);
      }
    });
  });
}

function getCheckoutSession(sessionId, email, prenom, nom, date, heure, depart, arrivee, prix, voiture, pers, datetime, tel) {
  // Utiliser l'API Stripe pour récupérer les informations de la session de paiement
  fetch('https://api.stripe.com/v1/checkout/sessions/' + sessionId, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + stripeSessionsReadingKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => response.json())
  .catch(error => console.log('Erreur lors de la récupération de la session de paiement : ', error))
  .then(data => {
    if (data.payment_status == "paid") {
      //envoyer emails
      sendEmail(email, prenom, nom, date, heure, depart, arrivee, prix, voiture, pers, datetime, tel);
      // Récupérer la boîte modale et le bouton de fermeture
      var popup = document.querySelector('.popup-container');
      // Afficher la boîte modale
      popup.style.display = "block";      
    }
  });
}

function addQueryParam(url, key, value) {
  // Vérifier si l'URL contient déjà des paramètres
  const hasQueryString = url.indexOf('?') !== -1;

  // Ajouter le nouveau paramètre
  const newQueryParam = `${key}=${encodeURIComponent(value)}`;
  
  // Concaténer le nouveau paramètre à l'URL existante
  if (hasQueryString) {
    return `${url}&${newQueryParam}`;
  } else {
    return `${url}?${newQueryParam}`;
  }
}


function confirmer() {
  if (document.getElementById('email').value != '' && document.getElementById('prenom').value != '' && document.getElementById('nom').value != '' && document.getElementById('datetimepicker').value != '' &&
  document.getElementById('autocomplete3').value != '' && document.getElementById('autocomplete4').value != '' && tarif != null && tarif != 0 && tarif != undefined && document.getElementById('tel').value != '' &&
  document.getElementById('voiture').selectedIndex != 0 && document.getElementById('pers').selectedIndex != 0) {
    url = websiteUrl + "?session_id={CHECKOUT_SESSION_ID}";
    url = addQueryParam(url, "email", document.getElementById('email').value);
    url = addQueryParam(url, "prenom", document.getElementById('prenom').value);
    url = addQueryParam(url, "nom", document.getElementById('nom').value);
    url = addQueryParam(url, "date", document.getElementById('datetimepicker').value.substring(0, 10));
    url = addQueryParam(url, "heure", document.getElementById('datetimepicker').value.slice(-5));
    url = addQueryParam(url, "depart", document.getElementById('autocomplete3').value);
    url = addQueryParam(url, "arrivee", document.getElementById('autocomplete4').value);
    url = addQueryParam(url, "prix", tarif.toString());
    url = addQueryParam(url, "voiture", refVoiture[document.getElementById('voiture').selectedIndex - 1]);
    url = addQueryParam(url, "pers", document.getElementById('pers').value);
    url = addQueryParam(url, "datetime", document.getElementById('datetimepicker').value);
    url = addQueryParam(url, "tel", document.getElementById('tel').value);
    createStripeSession(tarif, url);
  }
}

function getDomain() {
  // Récupérer l'URL complète de la page
  var url = window.location.href;

  // Extraire le domaine de l'URL
  var domain = '';
  if (url.indexOf("//") > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }

  // Retourner le domaine
  return "https://" + domain + "/";
}
