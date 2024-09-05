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
    'Seleccionar',
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
  public productForm: FormGroup;


  public articulos: Article[] = [
    {
      codigo: 'K1020',
      descripcion: 'Colchon Telgo',
      precio: 10256.12,
      deposito: 1,
    },
    {
      codigo: 'K1022%%',
      descripcion: 'Colchon Seally',
      precio: 18256.12,
      deposito: 4,
    },
    {
      codigo: 'K1024',
      descripcion: 'Sommier Telgo',
      precio: 14256.12,
      deposito: 1,
    },
    {
      codigo: 'K1026',
      descripcion: 'Sommier Seally',
      precio: 13256.12,
      deposito: 1,
    },
    {
      codigo: 'F1026',
      descripcion: 'Almohada Seally',
      precio: 0,
      deposito: 1,
    },
    {
      codigo: 'F1026',
      descripcion: 'Almohada Seally',
      precio: 3250.12,
      deposito: 4,
    },
    {
      codigo: 'K1024',
      descripcion: 'Sommier Telgo',
      precio: 14256.12,
      deposito: 4,
    },
    {
      codigo: 'K1026',
      descripcion: 'Sommier Seally',
      precio: -13256.12,
      deposito: 8,
    },
    {
      codigo: 'K!°1026',
      descripcion: 'Sommier Seally',
      precio: -13256.12,
      deposito: 8,
    },
  ];

  public vendedores = JSON.stringify(
    {
      "vendedores": [
        {
          "id": 1,
          "descripcion": "Hernan Garna"
        },
        {
          "id": 2,
          "descripcion": "Lucas Lauriente"
        },
        {
          "id": 3,
          "descripcion": "Martin Gomez"
        },
        {
          "id": 4,
          "descripcion": "Alan Tellerio"
        },
        {
          "id": 5,
          "descripcion": "Gonzalo Hernandez"
        },
        {
          "id": 6,
          "descripcion": "Ezequiel Martinez"
        }
      ]
    });
    

//Inyectamos las dependencias que necesitamos, en este caso el servicio y el formulario
  constructor(
    private _sellerService: SellerService,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.formBuilder.group({
      items: this.formBuilder.array(
        this.articulos.map((art) =>
          this.formBuilder.group({
            checkbox: [false, Validators.required],
            codigo: [art.codigo],
            descripcion: [art.descripcion, Validators.pattern("/^[a-zA-Z0-9]*$/")], //Permitimos valores alfanuméricos.
            precio: [art.precio, Validators.min(1)], //El valor INGRESADO mímino es 1
            deposito: [art.deposito],
            dropdown: [''],
          })
        )
      ),
    });
  }

  ngOnInit(): void {
    /*Llamamos a los servicios para incorporar la imformación
      *Cada llamada tiene una respuesta posible exitosa y fallida, por lo que ambas deben estar cubiertas. 
    */
    this.fillData();
    this.fillSellers();
  }

  fillData() {
    this._sellerService.getData().subscribe(
      (response) => {
        this.articsResponse = response.data;
      },
      (error) => {
        alert(`Ups! Error al intentar traer los artículos, se usarán los guardados: ${error.message}`);
        this.articsResponse = this.articulos;
        console.log(error);
      }
    );
  }

  fillSellers() {
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
      }
    );
  }

  sumProducts(isCkecked: Article[]) {
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
    }
  }
}
