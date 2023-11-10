import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe, DecimalPipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { ActualizacionMasivaComponent } from './actualizacion-masiva/actualizacion-masiva.component';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { ModalComentarioComponent } from './modal-comentario/modal-comentario.component';
import * as XLSX from 'xlsx';
import { mapearImportLiquidacion } from 'src/app/core/mapper/liquidacion-list.mapper';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { concatMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { FirstCapitalPipe } from 'src/app/core/pipes/first-capital.pipe';
import { FiltroLiqModel, LiquidacionModel } from 'src/app/core/models/liquidacion.models';
import { SaveLiquidacionModel } from 'src/app/core/models/save-liquidacion.models';
import { MantenimientoService } from 'src/app/core/services/mantenimiento.service';
import { ModalLiquidacionComponent } from './modal-liquidacion/modal-liquidacion.component';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    UpperCasePipe,
    FirstCapitalPipe,
    DatePipe,
    DecimalPipe,
  ],
})
export class LiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  liquidacionForm!: FormGroup;

  page = 1;
  totalFacturas: number = 0;
  pageSize = 15;

  constructor(
    private facturacionService: FacturacionService,
    private exportExcellService: ExportExcellService,
    private liquidacionService: LiquidacionService,
    private mantenimientoService: MantenimientoService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.getAllLiquidaciones()
    this.getListGestores();
    this.getistProyectos();
    this.getListEstados();
    this.getAllListaExportVD();
    // this.exportListVD_Fact();
    // console.log('PERIODO_ACTUAL-LIQ',this.modificarMes(0)); //2023-09
  }

  newFilfroForm(){
    this.liquidacionForm = this.fb.group({
      idFactura        : [''],
      gestorNombre     : [''],
      proyecto         : [''],
      tipoLiquidacion  : [''],
      estadoLiquidacion: [''],
      importe          : [''],
      periodo          : [''],
      import           : [''],
      periodoActual    : [true],
    })
  };


  listaLiquidacion: LiquidacionModel[] = []
  getAllLiquidaciones(){
    this.blockUI.start('Cargando lista Liquidaciones...');

    const request: FiltroLiqModel = {...this.liquidacionForm.value}
    // request.periodo = request.periodo? '' : request.periodo + '-' + '01';
    request.periodoActual = request.periodoActual? this.modificarMes(-1): '',

    this.liquidacionService.getAllLiquidaciones(request).subscribe((resp: any) => {
      // console.log('LIST_LIQ =>', resp);
      this.blockUI.stop();

      this.listaLiquidacion = [];
      this.listaLiquidacion = resp.result;
    })
  }

  importacion = 0;
  DATAimport: any[] = [];
  readExcell(e: any){
    console.log('e|==>',e, this.liquidacionForm);
    this.importacion ++
    this.blockUI.start("Espere por favor, estamos Importando la Data... " + this.importacion) ;

    let file = e.target.files[0];
    let fileReader = new FileReader();

    fileReader.readAsBinaryString(file)

    fileReader.onload = e => {
      var wb = XLSX.read(fileReader.result, { type: 'binary', cellDates: true})
      // console.log('****', wb);
      var sheetNames = wb.SheetNames;

      this.DATAimport = XLSX.utils.sheet_to_json(wb.Sheets[sheetNames[0]])
      console.log('DATA_EXCELL', this.DATAimport); // { Gestor:"Cesar Leyva", Importe: 12345, Periodo:Wed Nov 01 2023, Proyecto:"PETO21", Subservicio:"PRUEBA 08-11-2023-IMPORT-EXCELL", Tipo: "ACTA"}

      if (this.validarImportacionExcell()) {
      this.guardarListaimportado();
      }
      this.blockUI.stop();
    }
  }


  guardarListaimportado(){
    this.spinner.show();
    const listaImportado: SaveLiquidacionModel[] = mapearImportLiquidacion(this.DATAimport, this.listaLiquidacion, this.listGestores, this.listProyectos  )

    this.liquidacionService.insertarListadoLiquidacion(listaImportado)
        .pipe(concatMap((resp: any) => { console.log('DATA-IMP-LIQ', resp);// {message: "ok"}

        this.spinner.hide();
        if (resp && resp.message == 'ok') {
          this.getAllLiquidaciones()

          Swal.fire({
            title: 'Importar Liquidación!',
            text : `Se importó con éxito la data`,
            icon : 'success',
            confirmButtonText: 'Ok'
          });
          this.limpiarFiltro();
        }

        return resp && resp.message == 'ok';
      })).subscribe((resp: any) => {
        console.log('DATA_LIQ-SAVE', resp);
     }
   )}

   validarImportacionExcell(): boolean{
    let importacionCorrecta: boolean = true;

    this.DATAimport.map((columna, indice)=> {
      // console.log('FORMATO_ENVIO', this.liquidacionForm.controls['formato_envio'].value);

      console.log('==>',columna, indice, columna.Tipo, columna.Proyecto.length, columna.Proyecto, columna.Gestor, columna.Periodo)

      if (columna.Tipo != 'ACTA'  && columna.Tipo != 'REGULARIZACIÓN' && columna.Tipo != 'PAGO ADELANTADO') {
        importacionCorrecta = false;
        Swal.fire({
          icon: 'error',
          title: 'Sólo se permiten Tipo Liquidación: "ACTA", "REGULARIZACIÓN" o "PAGO ADELANTADO", corregir en',
          text: `La columna: 'Tipo' vs fila: ${(indice+2)}`
        });
      }

    })
    return importacionCorrecta;
  }

   modificarMes(mes: any) {
    var date1 = new Date() //new Date('2023/04/03'); Ejm
    var date = new Date( date1.getFullYear().toString() + '/'+ (date1.getMonth()+1).toString() + '/' + '01');
    // console.log('DATE-2023', date1.getFullYear().toString(), (date1.getMonth()+1).toString()); //2023-9

    /* Javascript recalculará la fecha si el mes es menor de 0 (enero) o mayor de 11 (diciembre) */
    date.setMonth(date.getMonth() + mes);
    // console.log('TOTAL-CORR',this.modificarMes(-1)); //2023-08
    return date.toISOString().substring(0, 7); /* Obtenemos la fecha en formato YYYY-mm */
  }


  eliminarLiquidacion(idLiq: number){
    Swal.fire({
      title:'¿Eliminar Liquidación?',
      text: `¿Estas seguro que deseas eliminar la Liquidación: ${idLiq}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed){
        this.liquidacionService.deleteLiquidacion(idLiq).subscribe(resp => {

          Swal.fire({
            title: 'Eliminar Liquidación',
            text: `${resp.message}, con el ${idLiq}`,
            icon: 'success',
          });
          this.getAllLiquidaciones()
        });
      };
    });
  }

  eliminarLiquidacion_xyzzzzzz(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 122,
      mapValue: {
        p_idFactura: id,
      }
    }];
    Swal.fire({
      title:'¿Eliminar Liquidación?',
      text: `¿Estas seguro que deseas eliminar la Liquidación: ${id}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.value) {
        this.facturacionService.eliminarLiquidacion(parametro[0]).subscribe(resp => {

          this.getAllLiquidaciones()
            Swal.fire({
              title: 'Eliminar Liquidación',
              text: `La Liquidación: ${id}, fue eliminado con éxito`,
              icon: 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }

  // listVD_Fact: any[] = [];
  // exportListVD_Fact(){
  //   let parametro: any[] = [{queryId: 136}];

  //   this.facturacionService.exportListVD_Fact(parametro[0]).subscribe((resp: any) => {
  //           this.listVD_Fact = resp.list;
  //           // console.log('EXPORT-VD_FACT', resp);
  //   });
  // }

  listExportVentaDeclarada: any[] = []
  getAllListaExportVD(){
    this.liquidacionService.getAllListaExportVD().subscribe((resp: any) => {
      console.log('LIST_EXPORT_VD =>', resp);

      this.listExportVentaDeclarada = [];
      this.listExportVentaDeclarada = resp.result;
    })
  }

  listGestores: any[] = [];
  getListGestores(){
    this.mantenimientoService.getAllGestores().subscribe((resp: any) => {
      this.listGestores = resp.result;
      console.log('LIQ_GESTORES', this.listGestores);
    })
  }

  listEstados: any[] = [];
  getListEstados(){
    this.mantenimientoService.getAllEstados().subscribe((resp: any) => {
      this.listEstados = resp.result;
      console.log('LIQ_ESTADOS', this.listEstados);
    })
  }

  listProyectos: any[] = [];
  getistProyectos(){
    this.mantenimientoService.getAllProyectos().subscribe((resp: any) => {
      this.listProyectos = resp.result;
      console.log('LIQ_PROY', this.listProyectos);
    })
  }


  limpiarFiltro() {
    this.liquidacionForm.reset('', {emitEvent: false})
    this.newFilfroForm()

    this.getAllLiquidaciones();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalFacturas) {
      this.liquidacionService.getAllLiquidaciones(offset.toString()).subscribe( (resp: any) => {
            this.listaLiquidacion = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  actualizarLiquidacion(DATA: any) {
    console.log('DATA_LIQUID', DATA);
    this.dialog.open(ModalLiquidacionComponent, { width: '70%', height: '80%', data: DATA })
      .afterClosed().subscribe((resp) => {
        if (resp) {
          this.getAllLiquidaciones()
        }
      });
  }

  crearLiquidacion(){
    this.dialog.open(ModalLiquidacionComponent, {width:'55%'})
      .afterClosed().subscribe(resp => {
      if (resp) {
        this.getAllLiquidaciones()
      }
    })
  }


  duplicarLiquidacion(DATA: any){
    console.log('ENV_DATA', DATA);

    const dialogRef = this.dialog.open(ModalLiquidacionComponent, {width:'55%', data: DATA});
    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.getAllLiquidaciones()
      }
    })
  }

  abrirComentarioRegularizacion(dataComentario: any) {
    console.log('DATA_DETALLE', dataComentario);

    const dialogRef = this.dialog.open(ModalComentarioComponent, { width: '55%',data: dataComentario});
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.getAllLiquidaciones()
      }
    });
  }

  actualizacionMasiva(){
    const dialogRef = this.dialog.open(ActualizacionMasivaComponent, {width:'25%', });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.getAllLiquidaciones()
      }
    })
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaLiquidacion, 'LIQUIDACION_Filtro')
  }

  exportarVD_FACT(){
    this.exportExcellService.exportarExcel(this.listExportVentaDeclarada, 'FACTURACION-VENTA_DECLARADA')
  }
}


