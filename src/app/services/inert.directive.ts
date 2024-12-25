/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInert]', // Ce sélecteur doit correspondre à ce que vous utilisez dans le HTML
})
export class InertDirective {
  @Input('appInert') set appInert(value: boolean) {
    if (value) {
      this.renderer.setAttribute(this.el.nativeElement, 'inert', '');
      this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'inert');
      this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

