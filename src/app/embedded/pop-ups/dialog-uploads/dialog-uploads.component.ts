import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'samply-dialog-uploads',
  templateUrl: './dialog-uploads.component.html',
  styleUrls: ['./dialog-uploads.component.css']
})
export class DialogUploadsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogUploadsComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }

}
