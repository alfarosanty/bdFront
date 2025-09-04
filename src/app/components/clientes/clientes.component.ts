import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente, CondicionFiscal } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  idCliente?: number|null = null;
  clienteEditando?: Cliente;

//LISTAS
condicionesFiscales?: CondicionFiscal[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {}

  // FLAGS
showBackDrop = false


  ngOnInit() {
    // Leer idCliente desde la ruta (si existe)
    this.idCliente = +this.route.snapshot.paramMap.get('id')!; // puede ser undefined

    this.clienteService.getCondicionFiscal().subscribe(condiciones => {
      this.condicionesFiscales = condiciones;
      console.log(this.condicionesFiscales);
    });
    

    this.firstFormGroup = this.fb.group({
      razonSocial: ['', Validators.required],
      telefono: ['', Validators.required]
    });
  
    this.secondFormGroup = this.fb.group({
      domicilio: [''],
      localidad: [''],
      provincia: [''],
      cuit: [''],
      transporte: ['']
    });
  
    this.thirdFormGroup = this.fb.group({
      condicionFiscal: ['', Validators.required],
    });

    // Si hay idCliente, cargar datos y setear en el form
    if (this.idCliente) {
      this.clienteService.get(this.idCliente).subscribe(cliente => {
        this.clienteEditando = cliente;
        console.log("cliente cargado:", cliente)

        // Setear valores en el FormGroup
        this.firstFormGroup.patchValue({
          razonSocial: cliente.razonSocial,
          telefono: cliente.telefono,
        });
        
      this.secondFormGroup.patchValue({
        domicilio: cliente.domicilio,
        localidad: cliente.localidad,
        cuit: cliente.cuit,
        transporte: cliente.transporte,
        provincia: cliente.provincia
      })

      this.thirdFormGroup.patchValue({
        condicionFiscal: this.condicionesFiscales?.find(c => c.id === cliente.condicionFiscal?.id)
      });
      
      });
    }

    this.setUppercase(this.firstFormGroup);
    this.setUppercase(this.secondFormGroup);
  }

  private setUppercase(group: FormGroup) {
    Object.keys(group.controls).forEach(key => {
      group.get(key)?.valueChanges.subscribe(value => {
        if (value && typeof value === 'string' && value !== value.toUpperCase()) {
          group.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });
    });
  }
  
  guardarCliente() {
    // Construir objeto Cliente con todos los datos de los 3 steps
    const cliente: Cliente = {
      id: this.idCliente!,
      razonSocial: this.firstFormGroup.value.razonSocial,
      telefono: this.firstFormGroup.value.telefono,
      domicilio: this.secondFormGroup.value.domicilio,
      localidad: this.secondFormGroup.value.localidad,
      cuit: this.secondFormGroup.value.cuit,
      transporte: this.secondFormGroup.value.transporte,
      provincia: this.secondFormGroup.value.provincia,
      condicionFiscal: this.thirdFormGroup.value.condicionFiscal // puede ser código o objeto según como lo tengas
    };
    console.log("Cliente a actualizar:", cliente)
  
    if (this.idCliente) {
      // Edición
      this.clienteService.actualizar(cliente).subscribe(res => {
        console.log('Cliente actualizado', res);
        this.showBackDrop = true; // Se ejecutó correctamente el back

        setTimeout(() => {
          location.reload(); // recarga toda la página
        }, 3000);
      });
    } else {
      // Creación
      this.clienteService.crear(cliente).subscribe(res => {
        console.log('Cliente creado', res);
        this.showBackDrop = true; // Se ejecutó correctamente el back

        setTimeout(() => {
          location.reload(); // recarga toda la página
        }, 3000);
      });
    }
  }
  
}
