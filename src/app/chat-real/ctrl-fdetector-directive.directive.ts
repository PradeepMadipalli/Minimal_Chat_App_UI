import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[ctrlF]'
})
export class CtrlFDetectorDirectiveDirective {

  @Output() ctrlF: EventEmitter<boolean>=new EventEmitter();
    constructor() {
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.getModifierState && event.getModifierState('Control') && event.keyCode===70) {
            this.ctrlF.emit(true);
        }
    }

}
