import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'samply-dialog-quali',
  templateUrl: './dialog-quali.component.html',
  styleUrls: ['./dialog-quali.component.css']
})
export class DialogQualiComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogQualiComponent> ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
