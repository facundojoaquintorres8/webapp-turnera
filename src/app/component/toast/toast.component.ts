import { Component, OnInit } from '@angular/core';
import { IToast, ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  errorMessage!: string;
  successMessage!: string;
  infoMessage!: string;
  showErrorToast: boolean = false;
  showSuccessToast: boolean = false;
  showInfoToast: boolean = false;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.currentMessage.subscribe(
      (message: IToast) => {
        if (message) {
          this.errorMessage = message.errorMessage ? message.errorMessage : "Hubo un problema al procesar la información. Por favor reintente nuevamente.";
          this.successMessage = message.successMessage ? message.successMessage : "Datos guardados con éxito.";
          this.infoMessage = message.infoMessage ? message.infoMessage : "No se ha guardado información.";
          this.showErrorToast = message.showErrorToast!;
          this.showSuccessToast = message.showSuccessToast!;
          this.showInfoToast = message.showInfoToast!;
        }
      }
    );
  }

}
