import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from 'src/app/component/spinner/spinner.component';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private countRequest = 0;
    private ngbModalRef!: NgbModalRef;

    constructor(
        private modalService: NgbModal,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.countRequest) {
            this.ngbModalRef = this.modalService.open(SpinnerComponent, { size: 'lg', backdrop: 'static', windowClass: 'modal-spinner' });
            this.ngbModalRef.result.then();
        }
        this.countRequest++;
        return next.handle(request)
            .pipe(
                finalize(() => {
                    this.countRequest--;
                    if (!this.countRequest) {
                        this.ngbModalRef.close();
                    }
                })
            );
    }
}