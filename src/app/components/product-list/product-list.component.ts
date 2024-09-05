import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from 'src/app/services/seller.service';
import { TITLE } from 'src/app/utils/constants';
import { Article, Sellers } from 'src/app/utils/models';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  // Si estos valores se usan en varios lugares de la aplicación lo mejor es evitar errores de sintaxis.
  public titleList = [
    'Check',
    TITLE.CODE,
    TITLE.DESCRIPTION,
    TITLE.DEPOSIT,
    TITLE.PRICE,
    TITLE.SELLER,
  ];

  
  // Declaramos las propiedades que vamos a necesitar, al usarse en el HTML son públicas.
  public sellersList: Sellers[] = [];
  public articsResponse: Article[] = [];
  public showDeposit = 1;
  public productForm!: FormGroup;
  public secondaryTitle = TITLE.HISTORICAL;
  public isLoading: boolean = true;
  
  // Hardcodeamos los vendedores 
  public vendedores = JSON.stringify({
    vendedores: [
      {
        id: 1,
        descripcion: 'Hernan Garna',
      },
      {
        id: 2,
        descripcion: 'Lucas Lauriente',
      },
      {
        id: 3,
        descripcion: 'Martin Gomez',
      },
      {
        id: 4,
        descripcion: 'Alan Tellerio',
      },
      {
        id: 5,
        descripcion: 'Gonzalo Hernandez',
      },
      {
        id: 6,
        descripcion: 'Ezequiel Martinez',
      },
    ],
  });

  /* Poríamos agregar un historial de pedidos, éstos podrían guardarse en una base de datos para mayor control.
    A demás de mostrar el código también podríamos sumar la cantidad de veces que se pidió cada producto.
  */
  public historical: Article[] = [];

  //Inyectamos las dependencias que necesitamos, en este caso el servicio y el formulario
  constructor(
    private _sellerService: SellerService,
    private formBuilder: FormBuilder
  ) {
    
    this._sellerService.getData().subscribe(
      (response) => {
        this.articsResponse = response;
        this.productForm = this.formBuilder.group({
          items: this.formBuilder.array(
            this.articsResponse.map((art) =>
              this.formBuilder.group({
                checkbox: [false, Validators.required],
                codigo: [art.codigo],
                descripcion: [
                  art.descripcion,
                  Validators.pattern('/^[a-zA-Z0-9]*$/'),
                ], //Permitimos valores alfanuméricos.
                precio: [art.precio, Validators.min(1)], //El valor INGRESADO mímino es 1
                deposito: [art.deposito],
                dropdown: [''],
              })
            )
          ),
        });

      },
      (error) => {
        alert(
          `Ups! Error al intentar traer los artículos, se usarán los guardados: ${error.message}`
        );
        console.log(error);
      },
      () => {
        // Agregamos un timeout para visualizar la espera
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      }
    );
  }

  ngOnInit(): void {
    /*Llamamos a los servicios para incorporar la imformación
     *Cada llamada tiene una respuesta posible exitosa y fallida, por lo que ambas deben estar cubiertas.
     */
    this.fillSellers();
  }

  fillSellers() {
    this.isLoading = true;
    this._sellerService.getSellers().subscribe(
      (response) => {
        // Por el momento esta llamada devuelve error por una sintaxis incorrecta.
        this.sellersList = JSON.parse(response.data);
      },
      (error) => {
        /* Ya que tenemos el json podemos setearlo al haber error.
         * Lo hago de esa manera (llamando de todos modos al servicio) para no perder la posibilidad de usar la llamada exitosa.
         */
        this.sellersList = JSON.parse(this.vendedores).vendedores;
      }, 
      () => {
        this.isLoading = false;
      }
    );
  }

  sumProducts(isCkecked: Article[]) {
    this.isLoading = true;
    this._sellerService.postSumProducts(isCkecked).subscribe(
      (response) => {
        // Formateamos de número a dinero.
        var responseFormat = response.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        alert(
          `Se han agregado ${isCkecked.length} artículos con una suma de ${responseFormat}`
        );
      },
      (error) => {
        alert(`Ups! No es posible agregar los artículos, ${error.message}`);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  get formControls(): FormArray {
    return this.productForm.get('items') as FormArray;
  }

  submitForm() {
    // Validación de selección al menos 1 producto.
    const isCkecked = this.productForm.value.items.filter(
      (item: { checkbox: boolean }) => item.checkbox === true
    );
    if (isCkecked.length <= 0) {
      alert(`Por favor seleccione al menos 1 producto`);
    } else {
      // Este print facilita la visualización.
      console.log(isCkecked);
      this.sumProducts(isCkecked);
      this.historical.push(...isCkecked);
    }
  }
}
