  
    let sCards = "";
    const loadHtml = data => {
        const cards = data.reduce( ( acc, elemento ) => {
            return acc + `
                <div class="card" id="card-${elemento.id}" data-aos="flip-left">
                    <div class="form-group">
                       <button class="button-card" id="button-${elemento.id}" onclick="savedatos('${elemento.id}','${ elemento.stock}')">
                          <i class="fa-solid fa-check"></i>
                       </button>   
                       <input value="0" type="text" " id="input-${elemento.id}" class="inp-cant" style="width:50px;text-align:right;height: 10px;font-weight: bold";
                        />                         
                    </div>

                    <figure class="container-card">
                        <img src=${elemento.thumbnail} alt="${elemento.id}">
                    </figure>

                    <h3 class="pcar-stor2">
                        ${ elemento.title }
                    </h3>
                    <p class="pcar-stor2">
                       Marca ${ elemento.brand}
                    </p>
                    <p class="pcar-stor2">
                       Categoria ${ elemento.category }
                    </p> 
                    <p class="pcar-stor">
                       Precio $ ${ elemento.price }
                    </p>
                    <p class="pcar-stor">
                       Descuento ${ elemento.discountPercentage }%
                    </p>
                    <p class="pcar-stor">
                       Stock ${elemento.stock}
                    </p>
                    <p class="pcar-stor">
                      SKU: ${ elemento.id }
                    </p>
            </div>  
            `
        }, "")
        sCards = cards;
        document.querySelector(".container-cards").innerHTML = sCards;
    }

    // Si la información del producto es correcta
    // almaceno datos en LocalStorage
     function savedatos(id,stock) {            

        let berror = false;
        //Rescato Cantidad de Input Cantidad           
        let inputCant = document.getElementById(`input-${id}` );
        let cantidad = inputCant.value;

        console.log(`(1)Datos de producto:(input-${id})` );
        console.log( cantidad );

        // Valido Errores en cantidad ingresada
        if (Number(cantidad) == 0){
            Swal.fire({
                title: "Error Cantidad",
                text: "Cantidad debe ser mayor a cero !!",
                icon: "error",
                footer: "producto SKU["+id+"]"  
            })
            berror = true;
        }

       // Valido si hay Stock
       if (Number(cantidad) > Number(stock)){
                Swal.fire({
                    title: "Error Stock",
                    text: `Cantidad ${cantidad} es mayor al stock ${stock} disponible !!`,
                    icon: "error",
                    footer: "producto SKU["+id+"]" 
                })
                berror = true;
              }

       if (! berror ) {
            let url = `https://dummyjson.com/products/${id}`;
            let data = [];
            fetch(url)
            .then( respuesta => respuesta.json())
            .then( (informacion) => {

                // Hago PUSH al arreglo de la información que necesito 
                // en LocalStorage...
                data.push({
                    id: id,
                    cantidad: cantidad,
                    title: informacion.title,   
                    thumbnail:informacion.thumbnail, 
                    stock: informacion.stock,
                    brand: informacion.brand,
                    category:informacion.category,
                    price: informacion.price,
                    discountPercentage: informacion.discountPercentage                
                });

                //console.log(informacion.results);
                console.log(informacion);        
                localStorage.setItem("producto"+id, JSON.stringify(data))
                    
                // Muestro en Pantalla mensaje de
                // productos agregado al carro
                Toastify({
                    text: ` Agregado a Carrito
                            Cantidad : ${cantidad}
                            SKU ${informacion.id}
                            ${informacion.title}                    
                        `,
                    className: "error",
                    style: {
                      backgroundcolor : "green",
                    }
                }).showToast();
            })  
        }        
    }

    // Acá rescato productos de la api y la muestro en 
    // tarjetas....
    const eleh2 = document.querySelector("#h2pro");
    if (eleh2 != null) {
        eleh2.addEventListener("click", (e) => {            
            let url = `https://dummyjson.com/products`;
            fetch(url)
            .then( respuesta => respuesta.json())
            .then( (informacion) => {
                let productos = informacion.products;
                let data_ = [];
                console.log("datos:");
                console.log(productos);

                // verifico el orden del los productos 
                // por precios
                const chk1 = document.querySelector("#chk1");
                const chk2 = document.querySelector("#chk2");
                const chk3 = document.querySelector("#chk3");
                const chk4 = document.querySelector("#chk4");
                console.log("Valido orden información chk1");
                console.log(chk1.checked);

                //  Ordenar productos 
                // según lo pedido
                let copiadata = productos;
                if (chk1.checked) {
                    productos = productos.sort(function(a, b){
                                  return a.price - b.price;
                                 });
                }
                if (chk2.checked) {
                    productos = productos.sort(function(a, b){
                                 return b.price - a.price;
                                });
               }                

               if (chk3.checked) {
                   productos = productos.slice().sort(( a, b ) => {
                        if ( a.title < b.title ) {
                            return - 1
                        } else if ( a.title > b.title ) {
                            return 1
                        } else {
                            return 0
                        }
                    })
                }

                if (chk4.checked) {
                    productos = productos.slice().sort(( a, b ) => {
                        if ( b.title < a.title ) {
                            return - 1
                        } else if ( b.title > a.title ) {
                            return 1
                        } else {
                            return 0
                        }
                    })
                }

                // Si corresponde debo filtrar producto por dato de búsqueda...
                // console.log(productos);
                console.log("Verifico si aplico filtro o  no");
                let idname = document.getElementById(`idname-busqueda` );
                if (idname != null) {
                    let saux = "";    
                    let stitle = "";
                    saux = idname.value.toUpperCase();
                    console.log("Dato a buscar o filtrar:"+saux);   

                    // Recorro el array y valido si el nombre
                    // del producto conincide con la búsqueda requerida
                    // aplico un Match y creo un objeto temporal solo 
                    // para visualizar los productos .... en un array temporal...
                    productos.forEach(( data, index ) => {
                        stitle = data.title;
                        //console.log(stitle);
                        stitle = stitle.toUpperCase();  
                        if (stitle.match(saux)) {
                            //console.log("Encuentro con Match producto:"+stitle+". Indice:"+index);

                            data_.push({
                                id: data.id,
                                cantidad: data.cantidad,
                                title: data.title,   
                                thumbnail:data.thumbnail, 
                                stock: data.stock,
                                brand: data.brand,
                                category:data.category,
                                price: data.price,
                                discountPercentage: data.discountPercentage                
                            });
                        } 
                    });
                    //console.log("filtro-FIN:"+productos.length);
                    console.log("Arreglo con datos filtrados...");
                    console.log(data_);
                } // if.... id = null ...
                loadHtml(data_);
            })
        })
        }    

    // Rescato evento Click del botón de contacto.
    // luego ejecuto unas validaciones y muestro un Sweet alert si corresponde
    const btncon = document.querySelector("#btncon");
    //console.log("Boton de contacto");
    if (btncon != null) {
        btncon.addEventListener("click", (e) => {
            //alert("click boton contactos");
            let berror = false;
            const inputname = document.querySelector(".inputname");
            if ( inputname != null) {
                console.log("contacto-inputname:");
                console.log(inputname.value);

                 if (inputname.value == ""){
                    Toastify({
                        text: ` Debe ingresar
                                Nombre del contacto ..! `,
                        className: "error",
                        style: {
                          backgroundcolor : "green",
                        }
                    }).showToast();
                    inputname.focus();
                    berror = true;
                }
            }

            const inputcelu = document.querySelector(".inputcelu");
            if ( inputcelu != null) {
                console.log("contacto-inputcelu");
                console.log(inputcelu.value);

               if (inputcelu.value == ""){
                    Toastify({
                        text: ` Debe ingresar
                                Fono de contacto ..! `,
                        className: "error",
                        style: {
                        backgroundcolor : "green",
                        }
                    }).showToast();
                    inputcelu.focus();
                    berror = true;
                }                
            }

            const inputmail = document.querySelector(".inputmail");
            if ( inputmail != null) {
                console.log("contacto-inputmail");
                console.log(inputmail.value);
                
                if (inputmail.value == ""){
                    Toastify({
                        text: ` Debe ingresar
                                Mail del contacto ..! `,
                        className: "error",
                        style: {
                        backgroundcolor : "green",
                        }
                    }).showToast();
                    inputmail.focus();
                    berror = true;
                }
            }

            if (!berror) { 
                Swal.fire({
                    title: "Envio de Mail OK!",
                    text: "Gracias por escribirnos. Te contactaremos a la brevedad !",
                    icon: "info",
                    footer: "Mail contacto"  
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    } else if (result.isDenied) {
                        alert("Error");
                    }
              })
                
            }
        });
    } // if  btnContacto 
        
    // Esta función es para cambiar el estado de botón oscuro/claro
    function cambiarModo() { 
        let cuerpoweb = document.body;       
        let oscuro = cuerpoweb.classList.toggle("oscuro");
        let header_ = document.getElementsByClassName("header");        

        // Cambio al color al contenedor de tarjetas y total venta..
        // solo si existe la clase..
        let cards_ = document.getElementsByClassName("container-cards");  
        let totvta_ = document.getElementsByClassName("totvta");  

        localStorage.setItem("oscuro", oscuro);

        if (oscuro ) {  
           document.body.style.backgroundColor = "#36383F";
           header_[0].style.backgroundColor = '#36383F';

           if (cards_ != null) {cards_[0].style.backgroundColor = '#36383F'} 
           if (totvta_ != null) {totvta_[0].style.backgroundColor = '#36383F'} 
       } else { 
           document.body.style.backgroundColor = "#229395";
           header_[0].style.backgroundColor = '#229395';
           if (cards_ != null) {cards_[0].style.backgroundColor = '#229395'} 
           if (totvta_ != null) {totvta_[0].style.backgroundColor = '#229395'} 
        }
      }

      // función para hacer load de la variable  dia noche
      function loadModo() { 
        let header_ = document.getElementsByClassName("header");   
        let oscuro = localStorage.getItem("oscuro");
        
        // Cargo el color de contenedores de tarjetas y total venta..
        // solo si existe la clase..
        let cards_ = document.getElementsByClassName("container-cards");  
        let totvta_ = document.getElementsByClassName("totvta");  

        if (oscuro =='true') {  
           document.body.style.backgroundColor = "#36383F";
           header_[0].style.backgroundColor = '#36383F';

           if (cards_.length >= 1) {cards_[0].style.backgroundColor = '#36383F'} 
           if (totvta_.length >= 1 ) {totvta_[0].style.backgroundColor = '#36383F'} 
           console.log("negro");
        } else { 
           console.log("verde");
           document.body.style.backgroundColor = "#229395";
           header_[0].style.backgroundColor = '#229395';
           if (cards_.length >= 1) {cards_[0].style.backgroundColor = '#229395'} 
           if (totvta_.length >= 1) {totvta_[0].style.backgroundColor = '#229395'} 
        }
      }      
      
      // Verifico si el HTML esta cargado
      // y aplico color dia/Noche
      document.addEventListener("DOMContentLoaded", function() {         
         if (localStorage.getItem("oscuro")) {
            loadModo();
         }
      });

      // Rescato Información del LocalStorage Boton Click de carro
      // y Creo Tarjeta del producto que esta LocalStorage....
      const h2car = document.querySelector("#h2car");
      if (h2car != null) {
         h2car.addEventListener("click", (e) => { cargarLocalstorage() })
      }  

    function cargarLocalstorage() {
        let sCard = "";
        let sValor = "";
        let sid = "";
        let scantidad = "";
        let sprice = "";
        let stitle = "";
        let sstock = "";
        let sdiscountPercentage = "";
        let sthumbnail = "";
        let sbrand = "";
        let scategory = "";     
        let stota = "";  
        let ftota = 0;       
        for (var i = 0; i<localStorage.length; i++) {

             sValor = JSON.parse(localStorage.getItem(localStorage.key(i)));
             // Solo considero de LocalStogare los datos que
             // me sirven.. de productos, descarto datos de por ejemplo
             // dia/noche... ese dato no me sirve...
             if (typeof sValor != 'boolean'  ) {  //...'true' && 'false' 
                  //console.log("valor:"+i);
                  console.log(sValor);                                      

                  sid      = sValor[0].id;
                  scantidad= sValor[0].cantidad;
                  sprice   = sValor[0].price;
                  sstock   = sValor[0].stock;
                  stitle   = sValor[0].title;
                  sdiscountPercentage = sValor[0].discountPercentage;
                  sthumbnail= sValor[0].thumbnail;
                  sbrand    = sValor[0].brand;
                  scategory = sValor[0].category; 

                  // Calculo total con descuentos
                  stota = Number(scantidad) * Number(sprice);
                  if (sdiscountPercentage.trim != '' && 
                      sdiscountPercentage.trim != '0'){
                      stota = Number(scantidad) * Number(sprice); 
                      stota = Number(stota) * ((100-Number(sdiscountPercentage)) / 100);
                      stota = Math.round(Number(stota));
                  }
                  ftota = ftota + Number(stota);

                  sCard = sCard +`
                  <div class="card" id="card-${sid}" data-aos="flip-left">
                      <div class="form-group">
                          <button class="button-card" id="carbutton-${sid}" onclick="fundelLocalstorage('${sid}')" style="background-color: #FF3300">
                              <i class="fa-solid fa-x"></i>
                          </button>   
                          <input value=${scantidad} type="text" " style="width:50px;text-align:right;height:10px;font-weight: bold;"
                              id="input-${sid}" class="inp-cant" onchange="changeCant('${sid}')"
                          />                         
                      </div>
                      <p class="pcar-stor2">
                          SKU: ${ sid }
                      </p>        
                      <figure class="container-card">
                          <img src=${sthumbnail} alt="${sid}">
                      </figure>
  
                      <h3 class="pcar-stor2">
                          ${ stitle }
                      </h3>
                      <p class="pcar-stor2">
                          Marca ${ sbrand }
                      </p>
                      <p class="pcar-stor" id="psto-${sid}">
                          Stock ${ sstock }
                      </p>
                      <p class="pcar-stor" id="ppre-${sid}">
                          Precio $ ${ sprice }
                      </p>
                      <p class="pcar-stor" id="dpre-${sid}">
                          Descuento ${ sdiscountPercentage }% 
                      </p>
                      <p class="pcar-stor" id="tota-${sid}">
                          Total $ ${stota}
                      </p>
                  </div> `
             } //if true o false 
        } // For...
        document.querySelector(".container-cards").innerHTML = sCard

        // Actualizo el total de la venta
        const ptotal = document.querySelector("#ptotal");
        ptotal.innerHTML = "$ "+ftota;
    }
  
    function fundelLocalstorage( id ) {
        let sProducto="producto"+id;
        
        Swal.fire({
            title:  `Desea eliminar producto id ${id}? `,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
          }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Elimino de localStorage producto:"+sProducto);
                    localStorage.removeItem(sProducto);

                    // Cargo nuevamente los productos que quedan
                    // en localStorage ya que acabo de eliminar un registro
                    cargarLocalstorage();
                    Swal.fire('Registro eliminado!', '', 'success');
                } else if (result.isDenied) {
                    Swal.fire('Eliminación cancelada', '', 'info')
                }
          })
    }

    // Hay cambio (Change), cambio de la cantidad en el carrito
    // Debo validar si hay stock, de lo contrario no se puede vender....
    function changeCant(id){
        let sppre = "0";
        let sdpre = "0";
        let sptoc = "0";
        let scant = "0";
        let sValor = [];
        let data = [];
        let sid = `psto-${id}`;
        //alert("Change precio:"+sid);

        const psto = document.getElementById(sid);
        console.log("Stock:" + sid);
        if (psto != null) {
            sptoc = psto.innerHTML;
            sptoc = sptoc.replace('Stock','');
            sptoc = sptoc.trim();             
            console.log("Stock final:" + sptoc);
        }

        sid = `ppre-${id}`;
        const ppre = document.getElementById(sid);
        console.log("precio:" + sid);
        if (ppre != null) {
            sppre = ppre.innerHTML;
            sppre = sppre.replace('$',''); 
            sppre = sppre.replace('Precio',''); 
            sppre = sppre.trim();
            console.log("precio final:" + sppre);
        }  

        sid = `dpre-${id}`;
        const dpre = document.getElementById(sid);
        console.log("descuento :" + id);
        if (dpre != null) {
            sdpre = dpre.innerHTML;
            sdpre = sdpre.replace('%',''); 
            sdpre = sdpre.replace('Descuento',''); 
            sdpre = sdpre.trim();
            console.log("Descuento final:" + sdpre);
        }  

        // Rescato nueva cantidad ...
        sid = `input-${id}`;
        const cant = document.getElementById(sid);
        console.log("cantidad :" + sid);
        //console.log(cant);
        //console.log(cant.value);
        if (cant != null) {
            scant = cant.value;
            scant = scant.trim();
            console.log("Cantidad final:" + scant);
        }

        // Rescato dato de LocalStorage...
        // y modifico la nueva cantidad de la venta
        sValor = JSON.parse((localStorage.getItem('producto'+id)));     
        console.log("Datos de LocalStorage");
        console.log(sValor);
        console.log("cantidad en localStorage:"+ sValor[0].cantidad);
        console.log("cantidad:"+ scant);
        console.log("stock:"+ sptoc);

        // Valido si hay Stock...
        // Si no hay stock vuelvo cantidad atrás....
        if (Number(scant) > Number(sptoc)) {
            Swal.fire({
                title: "Error Stock",
                text: `Cantidad ${scant} es mayor a stock ${sptoc} disponible !!`,
                icon: "error",
                footer: "producto SKU["+id+"]" 
            });
            scant = sValor[0].cantidad;
        } 

        // Hago PUSH al arreglo de la información que necesito 
        // en LocalStorage... 
        data.push({
            id: id,
            cantidad: scant,
            title: sValor[0].title,   
            thumbnail:sValor[0].thumbnail, 
            stock: sValor[0].stock,
            brand: sValor[0].brand,
            category:sValor[0].category,
            price: sValor[0].price,
            discountPercentage: sValor[0].discountPercentage                
        });
        localStorage.setItem('producto'+id, JSON.stringify(data));

        // Ahora debo recargar el LocalStorage modificado
        cargarLocalstorage();
     }

      // Temina venta simulando pago en dbClick en imagen .......
      const imgpago = document.querySelector("#imgpago");
      if (imgpago != null) {
          imgpago.addEventListener("dblclick", (e) => { 

           // Rescato el total de la venta
           const ptotal = document.querySelector("#ptotal");
           let stotal = ptotal.innerHTML;
           let stotal_ = stotal.replace('$','');
           stotal_ = stotal_.trim();
           console.log("Total Venta(0):" + stotal_);

            // Uso un swith porque el if del del Swal
            // presenta problemas
            switch(stotal_) {
                case '0':
                    Swal.fire('Error no existen registros para Venta', '', 'error');
                  break;
                default:
                    Swal.fire({  
                        title:  `Desea terminar Venta por ${stotal_} ? `,
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Si',
                        denyButtonText: `No`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire('Venta Terminada Correctamente !', '', 'success');
                            
                            //Ahora debo limpiar Localstorage ...
                            // de los registros de la venta
                            // pero debo rescatar la variable de dia / noche
                            let oscuro = localStorage.getItem("oscuro");
                            localStorage.clear();
                            localStorage.setItem("oscuro", oscuro);
                            // Cargo nuevamente, no debe existir informacion
                            cargarLocalstorage();
                        } else if (result.isDenied) {
                            Swal.fire('Proceso de Venta Cancelado', '', 'error')
                        }
                   });                
              }  // switch ...
            }); // dbclick ...
      } // If imgpago ...

      // Cargo datos de cliente para mostrar un carrusel...
      function loadClientes() {         
          let sCard = "";
          sCard = sCard +`
                <h2 class="h2pro wrapper square">CARRUSEL NUESTROS CLIENTES</h2>            
                <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel" data-interval="100">
                <div class="carousel-inner" >
                <div class="carousel-item active">
                    <img src="./img/dimasoft.png" class="d-block w-80" alt="Dimasoft" >
                </div>
                <div class="carousel-item">
                    <img src="./img/versluys.png" class="d-block w-80" alt="Versulys Talcahuano">
                </div>
                <div class="carousel-item">
                    <img src="./img/versluys_2.png" class="d-block w-80" alt="Versulys San Pedro">
                </div>
                <div class="carousel-item">
                    <img src="./img/advicom.jpg" class="d-block w-80" alt="Advicom">
                </div>              
                <div class="carousel-item">
                    <img src="./img/larrondo.png" class="d-block w-80" alt="Larrondo">
                </div>
                <div class="carousel-item">
                    <img src="./img/tecknopos.png" class="d-block w-80" alt="Tecknopos">
                </div>              
                <div class="carousel-item">
                    <img src="./img/mentec.png" class="d-block w-80" alt="Mentec">
                </div> 
                <div class="carousel-item">
                    <img src="./img/endif.png" class="d-block w-80" alt="Endif">
                </div> 
                <div class="carousel-item">
                    <img src="./img/ecoboleta.png" class="d-block w-80" alt="Ecoboleta">
                </div>                            
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previo</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
                </button>
            </div>`;
            console.log(document.querySelector(".carcli"));
            document.querySelector(".carcli").innerHTML = sCard;

            // Creo Swiper de productos con ofertas ...
            const swiper = new Swiper('.swiper', {
                direction: 'horizontal',
                loop: true,
                autoplay: {     
                    delay: 2000,   
                },
                pagination: {
                el: '.swiper-pagination',
                },
                navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                },    
                scrollbar: {
                el: '.swiper-scrollbar',
                },
            });
       }  
       
       