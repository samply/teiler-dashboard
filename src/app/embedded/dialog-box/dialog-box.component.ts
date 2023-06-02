import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: 'samply-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent {
  constructor( public dialogRef: MatDialogRef<DialogBoxComponent>){}

  close() {
    this.dialogRef.close("Thanks for using me!");
  }
}

