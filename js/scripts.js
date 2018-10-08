window.onload = function() {

    const API = 'https://flipkart-mock-serve.now.sh/';
    const dropdownToggler = document.getElementById("dropdownToggler");
    const productsDropdown = document.getElementById("productsDropdown");
    const compareTable = document.getElementById("compareTable");
    const featureTable = document.getElementById("featureTable");
    let compareCounter = 0;

    init();


    function init() {
        fetchData();
    }

    function fetchData() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                apiData = JSON.parse(xhttp.responseText);
                populateProductDropdown();
            }
        };
        xhttp.open("GET", API, true);
        xhttp.send();
    }


    function populateProductDropdown() {
        const {
            products: {
                compareSummary: {
                    titles: productTitleObj
                } = {}
            } = {}
        } = apiData;
        const productIDs = Object.keys(productTitleObj);

        
        const ulProdList = document.createElement("ul");
        ulProdList.id = "productsList";
        
        productIDs.forEach(function(prodId, idx){
            const li = document.createElement("li");
            li.id = prodId;
            li.classList.add("prod");
            li.innerText = productTitleObj[prodId].title;
            ulProdList.appendChild(li);
        });
        productsDropdown.appendChild(ulProdList)
    }

    dropdownToggler.addEventListener("click", toggleDropDown);

    function toggleDropDown(evt) {
        evt && evt.preventDefault();

        if( productsDropdown.classList.contains("hide") ) {
            productsDropdown.classList.remove("hide");
        }
        else {
            productsDropdown.classList.add("hide");            
        }
    }

    productsDropdown.addEventListener("click",fetchProductDetails);



    function fetchProductDetails(evt) {
        compareCounter++;
        if (compareCounter <= 3) {
        toggleDropDown();
        const selectedProduct = evt.target.id;
        document.getElementById("counter").innerText = compareCounter;
        document.getElementById(selectedProduct).remove();
        if(compareCounter === 3) {
            document.getElementById("addProduct").remove();            
        }
        const {
            products: {
                featuresList,
                compareSummary
            } = {}
        } = apiData;

        const compareSummaryDetailsArray = Object.keys(compareSummary);

        compareSummaryDetailsArray.forEach(function(eachDetail) {
            const tr = document.createElement("tr");
            
            if( featureTable.querySelector(`.${eachDetail.split(' ')[0]}`) === null ) {
                tr.classList.add("featureTr");
                if( eachDetail === "images" ) {
                    const prodImg = document.createElement("img");
                    prodImg.classList.add("prod-img");
                    prodImg.src = compareSummary[eachDetail][selectedProduct];
                    tr.classList.add(eachDetail.split(' ')[0]);
                    tr.id = selectedProduct;
                    const tdFeature = document.createElement("td");
                    tdFeature.appendChild(prodImg);
                    tr.appendChild(tdFeature);
                }
                else if ( eachDetail === "titles" ) {
                    tr.classList.add(eachDetail.split(' ')[0]);
                    tr.id = selectedProduct;                
                    const tdFeature = document.createElement("td");
                    tdFeature.textContent = `${compareSummary[eachDetail][selectedProduct]["title"]}${compareSummary[eachDetail][selectedProduct]["subtitle"]}`;
                    tr.appendChild(tdFeature);
                }
                else {
                    tr.classList.add(eachDetail.split(' ')[0]);
                    tr.id = selectedProduct;                
                    const priceSpan = document.createElement("span");
                    priceSpan.id = "price";
                    priceSpan.style.fontWeight = "bold";
                    priceSpan.textContent = `Rs${compareSummary[eachDetail][selectedProduct]["finalPrice"]}`;
                    const discountPriceSpan = document.createElement("span");
                    discountPriceSpan.id = "discountPrice";
                    discountPriceSpan.textContent = `Rs${compareSummary[eachDetail][selectedProduct]["price"]}`;             
                    const discountSpan = document.createElement("span");
                    discountSpan.id = "discount";
                    discountSpan.textContent = `${compareSummary[eachDetail][selectedProduct]["totalDiscount"]}% off`; 
                    const tdFeature = document.createElement("td");     
                    tdFeature.appendChild(priceSpan);
                    tdFeature.appendChild(discountPriceSpan);
                    tdFeature.appendChild(discountSpan);
                    tr.appendChild(tdFeature);                
                }
                featureTable.appendChild(tr);   
            }     
            else {
                const currentTr = featureTable.querySelector(`.${eachDetail.split(' ')[0]}`);
                if( eachDetail === "images" ) {
                    const prodImg = document.createElement("img");
                    prodImg.classList.add("prod-img");
                    prodImg.src = compareSummary[eachDetail][selectedProduct];
                    const tdFeature = document.createElement("td");
                    tdFeature.appendChild(prodImg);
                    currentTr.appendChild(tdFeature);
                }
                else if ( eachDetail === "titles" ) {                
                    const tdFeature = document.createElement("td");
                    tdFeature.textContent = `${compareSummary[eachDetail][selectedProduct]["title"]}${compareSummary[eachDetail][selectedProduct]["subtitle"]}`;
                    currentTr.appendChild(tdFeature);
                }
                else {              
                    const priceSpan = document.createElement("span");
                    priceSpan.id = "price";
                    priceSpan.textContent = `Rs${compareSummary[eachDetail][selectedProduct]["finalPrice"]}`;
                    const discountPriceSpan = document.createElement("span");
                    discountPriceSpan.id = "discountPrice";
                    discountPriceSpan.textContent = `Rs${compareSummary[eachDetail][selectedProduct]["price"]}`;                
                    const discountSpan = document.createElement("span");
                    discountSpan.id = "discount";
                    discountSpan.textContent = `${compareSummary[eachDetail][selectedProduct]["totalDiscount"]}% off`; 
                    const tdFeature = document.createElement("td");     
                    tdFeature.appendChild(priceSpan);
                    tdFeature.appendChild(discountPriceSpan);
                    tdFeature.appendChild(discountSpan);
                    currentTr.appendChild(tdFeature);                
                }
            }    
        })

        featuresList.forEach(function({features, title}) {
            if ( compareTable.querySelector(`.compare-${title.split(' ')[0]}`) === null ) {
                const trMain = document.createElement("tr");
                trMain.classList.add(`compare-${title.split(' ')[0]}`);
                trMain.classList.add("tableTr");
                trMain.id = selectedProduct;      
                const tdFeature = document.createElement("td");
                tdFeature.textContent = title;
                tdFeature.style.fontWeight = "bold";
                trMain.appendChild(tdFeature);
                compareTable.appendChild(trMain);
            }

            features.forEach(function(subFeature) {
                if( compareTable.querySelector(`.compare-${subFeature.featureName.split(' ')[0]}`) === null ) {
                    const tr = document.createElement("tr");
                    tr.classList.add(`compare-${subFeature.featureName.split(' ')[0]}`);
                    tr.classList.add("tableTr");
                    tr.id = selectedProduct;                
                    const tdFeature = document.createElement("td");
                    tdFeature.textContent = subFeature.featureName;
                    tdFeature.style.fontWeight = "bold";
                    const tdData = document.createElement("td");
                    tdData.textContent = subFeature.values[selectedProduct];
                    tr.appendChild(tdFeature);
                    tr.appendChild(tdData);
                    compareTable.appendChild(tr);
                }
                else {
                    const currentTr = compareTable.querySelector(`.compare-${subFeature.featureName.split(' ')[0]}`);
                    const tdData = document.createElement("td");
                    tdData.textContent = subFeature.values[selectedProduct];
                    currentTr.appendChild(tdData);
                }
            });
        });
    }
    }

}