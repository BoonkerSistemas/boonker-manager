import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import {MatDialog} from "@angular/material/dialog";
import {DetallesClienteComponent} from "./detalles/detallesCliente.component";
import {ClientService} from "../../../services/client/client.service";


@Component({
  selector: 'app-tthhh',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit{
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  avatar: string = 'default.jpg';
  loading: boolean = true;
  imageUrl: string = "";
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  members: any[];
  auxMembers: any[];
  options = [];
  filteredOptions: Observable<any[]>;
  myControl = new FormControl<string | any>('');
  objectMember = [];
  displayedColumns: string[] = ['id'];

  valueFilterDepart = '';
  valueFilterName = '';

  constructor(private _colaboradoresService: ClientService,  private _matDialog: MatDialog, ) {}

  ngOnInit(): void {

    this._colaboradoresService.findAll().subscribe( async (result: any) => {
      if (result) {
          console.log(result)

        const resultData: [] = result;
        this.members = await Promise.all(
          resultData
            // eslint-disable-next-line max-len
            .map((data: any) => ({
              ...data,


//: { name: 'Otras áreas', code: 'default' },
            }))
            .sort((memberA: any, memberB: any) => {
              console.log(memberA);
              console.log(memberB);

              const nameA = memberA.name.toUpperCase() + ' '+ memberA.name.toUpperCase();
              const nameB = memberB.name.toUpperCase() + ' '+ memberA.name.toUpperCase();
              return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            })
            .sort((memberB: any, memberA: any) => {
              let nameA = ''
              let nameB = ''

                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;

            })
        );
        this.members.forEach((item) => {
          console.log(item);

          this.options.push(item.name.toUpperCase());
          //const person = item.person;
          item.fullName = item.name + ' '+ item.lastName;
        });
        this.options = this.options.filter(
          (item, index) => this.options.indexOf(item) === index
        );
        this.options.sort();

        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value) => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(name as string) : this.options.slice();
          })
        );
        this.auxMembers = this.members;
      } else {
        console.log('no hay empleados');
      }
      this.formatData(this.members);
    });
  }
  _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  formatData(array) {
    this.objectMember = [];
      this.objectMember = array
      return this.objectMember
  }

  selectOption(e: MatAutocompleteSelectedEvent): any {
    const item = e.option.value;
    this.applyFilterSelected(item, 'name');
  }

  applyFilterSelected(value, filter): void {
    this.valueFilterDepart = value;
    const resultFilter = Object.values(this.auxMembers).filter(element =>
      element['departmentName'].toUpperCase().includes(value.toUpperCase())
    );
    if (resultFilter.length > 0) {
      this.objectMember = resultFilter;
    } else {
      if (value.toUpperCase() === 'TODOS') {
        this.objectMember = this.auxMembers;
      } else {
        if (value.length < 1) {
          this.objectMember = this.auxMembers;
        }
        this.objectMember = [];
      }
    }
  }

    addNewProyect(): void {
        const dialogRef = this._matDialog.open(DetallesClienteComponent, {
            autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');

        });
    }


  applyFilter(event: Event, filter, filter2, tag): void {

    const filterValue = ((event.target as HTMLInputElement).value).toUpperCase();
    console.log(filterValue);
    this.valueFilterDepart = filterValue;
    if (filterValue === '') {
      this.applyFilterName(event, '', '', true);
    } else {

      const resultFilter = Object.values(this.members).filter((element) => {
        if (this.valueFilterName === '') {
          console.log('ingrese if');

          return element[filter2.toString()]
            .toUpperCase()
            .includes(filterValue.toUpperCase());
        } else {
          console.log('ingrese else');

           return element['departmentName'].toString()
            .toUpperCase()
            .includes(filterValue) &&
            element['fullName']
              .toUpperCase()
              .includes(this.valueFilterName);
        }
      });

      if (resultFilter.length > 0) {
        this.formatData(resultFilter);
      } else {
        this.objectMember = [];
      }
    }
  }

  applyFilterName(event: Event, filter, filter2, tag): void {
    let filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === '' && tag && this.valueFilterName !== '') {
      filterValue = this.valueFilterName;
    }
    this.valueFilterName = filterValue.toUpperCase();
    if (this.valueFilterDepart !== '') {
      console.log('direfrente de vacio');

      let resultFilter = Object.values(this.members).filter(
        element =>
          element['departmentName']
            .toUpperCase()
            .includes(this.valueFilterDepart.toUpperCase()) &&
          element['fullName'].toUpperCase().includes(filterValue.toUpperCase())
      );

      if (resultFilter.length > 0) {
        this.formatData(resultFilter);
      } else {
        resultFilter = Object.values(this.members).filter(
          element =>
            element['departmentName']
              .toUpperCase()
              .includes(this.valueFilterDepart.toUpperCase()) &&
            element['username']
              .toUpperCase()
              .includes(filterValue.toUpperCase())
        );
        if (resultFilter.length > 0) {
          this.formatData(resultFilter);
        } else {
          resultFilter = Object.values(this.members).filter(
          element =>
            element['departmentName']
              .toUpperCase()
              .includes(this.valueFilterDepart.toUpperCase()) &&
            element['username']
              .toUpperCase()
              .includes(filterValue.toUpperCase())
        );
        if (resultFilter.length > 0) {
          this.formatData(resultFilter);
        } else {
          this.objectMember = [];
        }
        }
      }
    } else {
      if (this.valueFilterDepart === '') {
        console.log('VACIOOO de vacio');
        let resultFilter = Object.values(this.members).filter(element =>
          element['username'].toUpperCase().includes(filterValue.toUpperCase())
        );
        if (resultFilter.length > 0) {
          this.formatData(resultFilter);
        } else {
          resultFilter = Object.values(this.members).filter(element =>
            element['fullName']
              .toUpperCase()
              .includes(filterValue.toUpperCase())
          );
          if (resultFilter.length > 0) {
            this.formatData(resultFilter);
          } else {
            this.objectMember = [];
          }
        }
      } else {
        let resultFilter = Object.values(this.members).filter(
          element =>
            element['departmentName']
              .toUpperCase()
              .includes(this.valueFilterDepart.toUpperCase()) &&
            element['fullName']
              .toUpperCase()
              .includes(filterValue.toUpperCase())
        );

        if (resultFilter.length > 0) {
          this.formatData(resultFilter);
        } else {
          resultFilter = Object.values(this.members).filter(
            element =>
              element['departmentName']
                .toUpperCase()
                .includes(this.valueFilterDepart.toUpperCase()) &&
              element['username']
                .toUpperCase()
                .includes(filterValue.toUpperCase())
          );
          if (resultFilter.length > 0) {
            this.formatData(resultFilter);
          } else {
            this.objectMember = [];
          }
        }
      }
    }
  }



}
