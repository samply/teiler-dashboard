import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';

interface Options {
  value: string;
  viewValue: string;
}

export interface UploadsTable {
  uploadid: number;
  startedat: string;
  startedfrom: string;
  status: string;
}

@Component({
  selector: 'uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {
  EmpData: UploadsTable[] = [
    {uploadid: 684, startedat: '27.05.2022 16:07:05', startedfrom: 'admin', status: 'US_CANCELED'},
    {uploadid: 685, startedat: '30.05.2022 16:28:13', startedfrom: 'admin', status: 'US_COMPLETED'},
  ]
  //stepper
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
//select1
  op1: Options[] = [
    {value: $localize`Testlauf`, viewValue: $localize`Testlauf`},
    {value: $localize`Upload`, viewValue: $localize`Upload`},
  ];
  //select2
  op2: Options[] = [
    {value: $localize`komplett`, viewValue: $localize`komplett`},
    {value: $localize`inkrementell`, viewValue: $localize`inkrementell`},
  ];
  //select3
  op3: Options[] = [
    {value: $localize`DKTK: Ja`, viewValue: $localize`DKTK: Ja`},
    {value: $localize`DKTK: Nein`, viewValue: $localize`DKTK: Nein`},
  ];
  optionControl = new FormControl(this.op1[1].value);
  option2Control = new FormControl(this.op2[1].value);
  option3Control = new FormControl(this.op3[1].value);
  form = new FormGroup({
    option: this.optionControl,
    option2: this.option2Control,
    option3: this.option3Control,
  });

  isShowDivIf = true;

  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }

//table
  displayedColumns: string[] = ['uploadid', 'startedat', 'startedfrom', 'status'];
  dataSource = new MatTableDataSource(this.EmpData);

  title = $localize`Uploads`;
  panelOpenState = false;

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,) { }

  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {}



}
