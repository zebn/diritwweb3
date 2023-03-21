import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogData } from 'src/app/profile/profile.component';

declare let window: any;

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;
  public constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) 
  {}

  onNoClick(): void 
  {
    console.log("DATA SAVED: ",this.data)
    this.dialogRef.close();
  }

  public onFileSelected(event: any) 
  {
    var tmppath = URL.createObjectURL(event.target.files[0]);
    this.data.avatar = event.target.files[0];
  }
}
