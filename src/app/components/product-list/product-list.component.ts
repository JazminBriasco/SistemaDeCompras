import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from 'src/app/services/seller.service';
import { TITLE } from 'src/app/utils/constants';
import { Article } from 'src/app/utils/models';

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
  public sellersList: any;
  public articsResponse :Article[] = [];
  public sellersResponse = [];
  public sumResponse = 0;
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

  public vendedores = [
    { descripcion: 'Colchon Telgo' },
    { descripcion: 'Colchon Seally' },
    { descripcion: 'Colchon Telgo' },
    { descripcion: 'Colchon Seally' },
  ];

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
            code: [art.codigo],
            description: [art.descripcion, Validators.pattern("/^[a-zA-Z0-9]*$/")], //Permitimos valores alfanuméricos.
            price: [art.precio, Validators.min(1)], //El valor INGRESADO mímino es 1
            deposit: [art.deposito],
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
        alert(`Ups! Error al intentar traer los artículos: ${error.message}`);
        console.log(error.message);
      }
    );
  }

  fillSellers() {
    this._sellerService.getSellers().subscribe(
      (response) => {
        this.sellersList = response.data;
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  sumProducts(isCkecked: Article[]) {
    this._sellerService.postSumProducts(isCkecked).subscribe(
      (response) => {
        alert(
          `Se han agregado ${isCkecked.length} artículos con una suma de ${response.data}`
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
      this.sumProducts(isCkecked);
    }
  }
}
