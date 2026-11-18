import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-empty-route',
    template: '',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmptyRouteComponent {}
