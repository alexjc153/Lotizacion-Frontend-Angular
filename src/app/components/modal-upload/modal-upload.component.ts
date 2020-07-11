import { Component, OnInit } from '@angular/core';
import { ModalUploadService } from './modal-upload.service';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.css']
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: any;

  constructor(
    // tslint:disable-next-line: variable-name
    public _subirArchivoService: SubirArchivoService,
    // tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imagenTemp = null;
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
  }

  seleccionImagen( archivo: File) {

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      // Swal.fire('Sólo Imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.toastr.error('Sólo se aceptan archivos de imagen', 'Error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  subirImagen(){
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
    .then(resp => {
      this._modalUploadService.notificacion.emit( resp );
      this.toastr.success('Imagen actualizada correctamente', 'Operación Exitosa');
      this.cerrarModal();

    })
    .catch( err => {
      this.toastr.error(err, 'Error');
    });
  }

}
