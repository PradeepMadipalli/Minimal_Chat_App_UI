import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../model/registration.model';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})

export class PopupComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog, public dialogRef: MatDialogRef<PopupComponent>) {

  }
  showoption: any;
  optionAll: string = "All";
  optionDays: string = "Days";
  optionNo: string = "No";
  numberofDays: any = null;
  showoptionsbool: boolean = false;
  datas: string;
  onOptionsSelected(option: any) {
    // console.log(messageid);
    console.log(option)
    if (option === this.optionDays) {
      this.showoptionsbool = !this.showoptionsbool
      this.numberofDays = this.numberofDays
    }
    else if (option === this.optionAll) {
      if (this.showoptionsbool) {
        this.showoptionsbool = !this.showoptionsbool
      }
      this.numberofDays = "-1"
    } else {
      if (this.showoptionsbool) {
        this.showoptionsbool = !this.showoptionsbool
      }
      this.numberofDays = "0"

    }
  }
  closepop() {
    this.dialogRef.close(this.numberofDays)
  }
}
